/**
 * 解禁済みステージ集合を返す Hook。
 *
 * `stage-unlock-store` に subscribe して、 capstone クリア時の解禁判定を
 * 自動再計算した結果を反映する。 スナップショットは変更があるまで参照
 * 同値で返すため `useSyncExternalStore` で安全に使える。
 */

import { useSyncExternalStore } from "react";
import type { Stage } from "@jsreview/shared/types";

import {
  getStagesUnlockedSnapshot,
  subscribeStageUnlocks,
} from "../lib/stage-unlock-store.js";

const EMPTY: readonly Stage[] = [];

export function useStageUnlocks(): readonly Stage[] {
  return useSyncExternalStore(
    subscribeStageUnlocks,
    getStagesUnlockedSnapshot,
    () => EMPTY,
  );
}
