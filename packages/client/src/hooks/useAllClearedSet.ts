/**
 * 全課題のクリア状態を `Set<assignmentId>` で返す Hook。
 *
 * `progress-store` の subscribe を使い、saveEntry / deleteEntry / 別タブの
 * storage イベントに追従して再描画する。スナップショットは変更があるまで
 * 同じ Set インスタンスを返すため `useSyncExternalStore` で安全に使える。
 */

import { useSyncExternalStore } from "react";

import {
  getClearedSnapshot,
  subscribeProgress,
} from "../lib/progress-store.js";

const EMPTY: Set<string> = new Set();

export function useAllClearedSet(): Set<string> {
  return useSyncExternalStore(
    subscribeProgress,
    getClearedSnapshot,
    () => EMPTY,
  );
}
