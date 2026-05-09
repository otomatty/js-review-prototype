/**
 * 課題ごとの進捗 (編集中コード + クリア状態) を localStorage と同期する Hook。
 *
 * - 課題が切り替わったら storage から読み込み、なければ `starterCode` を返す
 * - `setCode` を呼ぶと debounce してエントリを書き込む (lastCode のみ)
 * - 評価完了時は `recordResult` を呼ぶことで cleared を OR で更新する
 *   (一度クリアした課題は、その後の試行で失敗してもクリア状態を保持)
 * - `clear` でエントリを削除し、`starterCode` に戻す
 */

import { useCallback, useEffect, useRef, useState } from "react";

import {
  deleteEntry,
  loadEntry,
  saveEntry,
  type ProgressEntry,
} from "../lib/progress-store.js";

const SAVE_DEBOUNCE_MS = 400;

interface Args {
  assignmentId: string;
  starterCode: string;
}

interface ProgressApi {
  code: string;
  setCode: (code: string) => void;
  cleared: boolean;
  /**
   * 評価完了直後に呼び出す。`passed === true` の場合に cleared を立てる。
   * 採点対象だった `submittedCode` を `lastCode` として保存する。
   * `submittedCode` は呼び出し側で run() 起動時に固定した値を渡すこと
   * (await 中に課題切替があっても元の課題に紐付くようにするため)。
   */
  recordResult: (passed: boolean, submittedCode: string) => void;
  /** storage の entry を消し、starterCode に戻す。 */
  clear: () => void;
}

export function useProgress({ assignmentId, starterCode }: Args): ProgressApi {
  const [code, setCodeState] = useState<string>(
    () => readInitial(assignmentId, starterCode).code,
  );
  const [cleared, setCleared] = useState<boolean>(
    () => readInitial(assignmentId, starterCode).cleared,
  );

  // 課題切替時、storage から再ロード
  // 切替直後の useState は初回マウントの値しか反映しないため effect で更新する。
  const lastAssignmentRef = useRef<string>(assignmentId);
  useEffect(() => {
    if (lastAssignmentRef.current === assignmentId) return;
    lastAssignmentRef.current = assignmentId;
    const next = readInitial(assignmentId, starterCode);
    setCodeState(next.code);
    setCleared(next.cleared);
  }, [assignmentId, starterCode]);

  // code 変更を debounce して localStorage に保存
  useEffect(() => {
    const timer = setTimeout(() => {
      // starterCode と完全一致なら entry を作らない (新規ノイズを避ける)
      const existing = loadEntry(assignmentId);
      if (!existing && code === starterCode) return;
      const nextCleared = existing?.cleared ?? cleared;
      saveEntry(
        assignmentId,
        {
          cleared: nextCleared,
          lastCode: code,
          lastSubmittedAt: existing?.lastSubmittedAt,
        },
        { previousCleared: existing?.cleared ?? null },
      );
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [code, assignmentId, starterCode, cleared]);

  const setCode = useCallback((next: string) => {
    setCodeState(next);
  }, []);

  const recordResult = useCallback(
    (passed: boolean, submittedCode: string) => {
      const existing = loadEntry(assignmentId);
      const prev = existing?.cleared ?? false;
      // 一度クリア済みなら、その状態を保持する (失敗で取り消さない)。
      const nextCleared = prev || passed;
      const entry: ProgressEntry = {
        cleared: nextCleared,
        lastCode: submittedCode,
        lastSubmittedAt: Date.now(),
      };
      saveEntry(assignmentId, entry, {
        previousCleared: existing?.cleared ?? null,
      });
      // 表示中の課題が切り替わっていれば cleared の state は触らない。
      if (lastAssignmentRef.current === assignmentId) setCleared(nextCleared);
    },
    [assignmentId],
  );

  const clear = useCallback(() => {
    deleteEntry(assignmentId);
    setCodeState(starterCode);
    setCleared(false);
  }, [assignmentId, starterCode]);

  return { code, setCode, cleared, recordResult, clear };
}

function readInitial(
  assignmentId: string,
  starterCode: string,
): { code: string; cleared: boolean } {
  const entry = loadEntry(assignmentId);
  if (!entry) return { code: starterCode, cleared: false };
  return { code: entry.lastCode, cleared: entry.cleared };
}
