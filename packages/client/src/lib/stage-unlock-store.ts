/**
 * ステージ解禁状態を localStorage に永続化する store。
 *
 * - キー: `jsreview/stages-unlocked`
 * - 値:   `{ v: 1, stages: Stage[] }`
 *
 * S0 だけが初期解禁。 S(n+1) は Sn の `isCapstone: true` の問題が 1 個以上
 * あり、 全て cleared になった時点で解禁される。 一度解禁されたステージは
 * 単調増加 (capstone の cleared が後から外れないのと同様、 unlock は剥奪されない)。
 *
 * `progress-store` の cleared 変化を購読して自動再計算し、 新規解禁が起きた
 * 場合は「直近で解禁したステージ」 として queue に積む。 Dialog 表示側は
 * `peekRecentUnlock()` / `consumeRecentUnlock()` でそれを 1 件ずつ消化する。
 */

import { assignments } from "@jsreview/shared/assignments";
import type { Stage } from "@jsreview/shared/types";

import {
  getClearedSnapshot,
  subscribeProgress,
} from "./progress-store.js";

const STORAGE_KEY = "jsreview/stages-unlocked";
const SCHEMA_VERSION = 1;

export const STAGE_ORDER: readonly Stage[] = [
  "S0",
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
] as const;

/**
 * 初期解禁ステージ。
 *
 * - S0 のみがデフォルトで解禁される。
 * - S0 のチャレンジ問題を全 pass した時点で S1 が解禁され、 以降同様に連鎖する。
 */
const INITIAL_UNLOCKED: readonly Stage[] = ["S0"];

interface StoredShape {
  v: number;
  stages: Stage[];
}

function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") {return null;}
    return window.localStorage;
  } catch {
    return null;
  }
}

function isStage(value: unknown): value is Stage {
  return (
    typeof value === "string" && (STAGE_ORDER as readonly string[]).includes(value)
  );
}

function loadStoredStages(): Stage[] {
  const ls = safeStorage();
  if (!ls) {return [...INITIAL_UNLOCKED];}
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) {return [...INITIAL_UNLOCKED];}
  try {
    const parsed = JSON.parse(raw) as Partial<StoredShape>;
    if (parsed.v !== SCHEMA_VERSION) {return [...INITIAL_UNLOCKED];}
    if (!Array.isArray(parsed.stages)) {return [...INITIAL_UNLOCKED];}
    const stages = parsed.stages.filter(isStage);
    // 必ず初期解禁ステージを含める (storage で消えても自動復活)
    return mergeStages(stages, INITIAL_UNLOCKED);
  } catch {
    return [...INITIAL_UNLOCKED];
  }
}

function persistStages(stages: Stage[]): void {
  const ls = safeStorage();
  if (!ls) {return;}
  const payload: StoredShape = { v: SCHEMA_VERSION, stages };
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 容量超過などは無視 (進捗本体に比べてサイズが極小なので発生しないはず)
  }
}

/** STAGE_ORDER に沿って union を取り、 順序付き Stage[] を返す。 */
function mergeStages(...sources: readonly (readonly Stage[])[]): Stage[] {
  const set = new Set<Stage>();
  for (const src of sources) {
    for (const s of src) {set.add(s);}
  }
  return STAGE_ORDER.filter((s) => set.has(s));
}

function setsEqual<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean {
  if (a.size !== b.size) {return false;}
  for (const v of a) {if (!b.has(v)) {return false;}}
  return true;
}

const capstonesByStage: ReadonlyMap<Stage, readonly string[]> = (() => {
  const map = new Map<Stage, string[]>();
  for (const s of STAGE_ORDER) {map.set(s, []);}
  for (const a of assignments) {
    if (a.isCapstone) {map.get(a.stage)?.push(a.id);}
  }
  return map;
})();

/**
 * cleared 集合と現在解禁集合から、 解禁されるべき集合を計算する。
 *
 * - 既に解禁済みの S は降格しない。
 * - 解禁済みステージ Sn について、 capstone が 1 個以上あり全て cleared なら
 *   S(n+1) を解禁する。 capstone が 0 個のステージは「次を解禁しない」 (= 通過
 *   不能) が、 INITIAL_UNLOCKED で初期解禁されているステージは別途確保される。
 */
function recomputeUnlocks(
  cleared: ReadonlySet<string>,
  current: readonly Stage[],
): Stage[] {
  const next = new Set<Stage>(current);
  for (const s of INITIAL_UNLOCKED) {next.add(s);}
  for (let i = 0; i < STAGE_ORDER.length - 1; i++) {
    const s = STAGE_ORDER[i];
    if (!next.has(s)) {continue;}
    const caps = capstonesByStage.get(s) ?? [];
    if (caps.length === 0) {continue;}
    if (caps.every((id) => cleared.has(id))) {
      next.add(STAGE_ORDER[i + 1]);
    }
  }
  return STAGE_ORDER.filter((s) => next.has(s));
}

// ─── 状態と通知 ─────────────────────────────────────────────
type Listener = () => void;
const listeners = new Set<Listener>();
let cachedStages: Stage[] = [];
let cachedSet: ReadonlySet<Stage> = new Set();
let initialized = false;

const recentUnlocks: Stage[] = [];

function emitChange(): void {
  for (const l of listeners) {l();}
}

function setStages(next: Stage[]): boolean {
  const nextSet = new Set(next);
  if (setsEqual(nextSet, cachedSet)) {return false;}
  cachedStages = next;
  cachedSet = nextSet;
  return true;
}

function ensureInitialized(): void {
  if (initialized) {return;}
  initialized = true;
  const stored = loadStoredStages();
  const cleared = getClearedSnapshot();
  const recomputed = recomputeUnlocks(cleared, stored);
  setStages(recomputed);
  if (!arraysEqual(recomputed, stored)) {
    persistStages(recomputed);
  }
}

function arraysEqual(a: readonly Stage[], b: readonly Stage[]): boolean {
  if (a.length !== b.length) {return false;}
  for (let i = 0; i < a.length; i++) {if (a[i] !== b[i]) {return false;}}
  return true;
}

/**
 * progress-store の cleared 変化を購読し、 解禁集合を再計算する。
 * 新規解禁があった場合は recentUnlocks に積み、 listeners に通知する。
 *
 * App ルートで一度だけ呼ぶ。
 */
let started = false;
export function startStageUnlockSync(): void {
  if (started) {return;}
  started = true;
  ensureInitialized();
  subscribeProgress(() => {
    const before = cachedSet;
    const cleared = getClearedSnapshot();
    const next = recomputeUnlocks(cleared, cachedStages);
    if (setStages(next)) {
      // 新規解禁を queue に積む
      for (const s of next) {
        if (!before.has(s)) {recentUnlocks.push(s);}
      }
      persistStages(next);
      emitChange();
    }
  });
}

export function subscribeStageUnlocks(listener: Listener): () => void {
  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** `useSyncExternalStore` の getSnapshot として使う (参照同値)。 */
export function getStagesUnlockedSnapshot(): readonly Stage[] {
  ensureInitialized();
  return cachedStages;
}

/** 解禁判定: stage が現時点で解禁されているか。 */
export function isStageUnlocked(stage: Stage): boolean {
  ensureInitialized();
  return cachedSet.has(stage);
}

/**
 * Dialog 表示側で利用。 直近で解禁したステージを 1 件取り出す。
 * 戻り値が undefined なら未消化の解禁イベントは無い。
 */
export function consumeRecentUnlock(): Stage | undefined {
  return recentUnlocks.shift();
}

/** SSR/テスト用: 内部状態をリセット。 */
export function __resetStageUnlockStoreForTesting(): void {
  initialized = false;
  started = false;
  cachedStages = [];
  cachedSet = new Set();
  recentUnlocks.length = 0;
}
