/**
 * ステージクリア演出 (StageClearPage) を「初回のみ」 表示するための
 * フラグを localStorage に永続化する store。
 *
 * - キー: `jsreview/stages-clear-shown`
 * - 値:   `{ v: 1, stages: Stage[] }`
 *
 * `stage-unlock-store` ほどの再描画通知は不要で、 PracticePage / StageClearPage
 * から同期的に read / write するだけの薄いユーティリティ。
 */

import type { Stage } from "@jsreview/shared/types";

import { STAGE_ORDER } from "./stage-unlock-store.js";

const STORAGE_KEY = "jsreview/stages-clear-shown";
const SCHEMA_VERSION = 1;

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

function loadShownStages(): Set<Stage> {
  const ls = safeStorage();
  if (!ls) {return new Set();}
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) {return new Set();}
  try {
    const parsed = JSON.parse(raw) as Partial<StoredShape>;
    if (parsed.v !== SCHEMA_VERSION) {return new Set();}
    if (!Array.isArray(parsed.stages)) {return new Set();}
    return new Set(parsed.stages.filter(isStage));
  } catch {
    return new Set();
  }
}

function persistShownStages(stages: Set<Stage>): void {
  const ls = safeStorage();
  if (!ls) {return;}
  const payload: StoredShape = {
    v: SCHEMA_VERSION,
    stages: STAGE_ORDER.filter((s) => stages.has(s)),
  };
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 容量超過は無視 (ペイロード極小)
  }
}

export function hasShownClearPage(stage: Stage): boolean {
  return loadShownStages().has(stage);
}

export function markClearPageShown(stage: Stage): void {
  const stages = loadShownStages();
  if (stages.has(stage)) {return;}
  stages.add(stage);
  persistShownStages(stages);
}

/** SSR/テスト用: 内部状態をリセット。 */
export function __resetStageClearStoreForTesting(): void {
  const ls = safeStorage();
  if (!ls) {return;}
  ls.removeItem(STORAGE_KEY);
}
