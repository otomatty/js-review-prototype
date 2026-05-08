/**
 * 全課題のベストスコアを `assignmentId -> score` のマップで返す Hook。
 *
 * `progress-store` の subscribe を使い、saveEntry / deleteEntry / 別タブの
 * storage イベントに追従して再描画する。スナップショットは変更があるまで
 * 同じ Map インスタンスを返すため `useSyncExternalStore` で安全に使える。
 */

import { useSyncExternalStore } from "react";

import {
  getBestScoresSnapshot,
  subscribeProgress,
} from "../lib/progress-store.js";

const EMPTY: Map<string, number> = new Map();

export function useAllBestScores(): Map<string, number> {
  return useSyncExternalStore(
    subscribeProgress,
    getBestScoresSnapshot,
    () => EMPTY,
  );
}
