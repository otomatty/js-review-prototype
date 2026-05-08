/**
 * 課題ごとの進捗 (編集中コード + ベストスコア) を localStorage と同期する Hook。
 *
 * - 課題が切り替わったら storage から読み込み、なければ `starterCode` を返す
 * - `setCode` を呼ぶと debounce してエントリを書き込む (lastCode のみ)
 * - 採点完了時は `recordScore` を呼ぶことで bestScore を max で更新する
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
  bestScore: number | null;
  /**
   * 採点直後に呼び出す。前回より高ければ best score を更新し、
   * 採点対象だった `submittedCode` を `lastCode` として保存する。
   * `submittedCode` は呼び出し側で run() 起動時に固定した値を渡すこと
   * (await 中に課題切替があっても元の課題に紐付くようにするため)。
   */
  recordScore: (score: number, submittedCode: string) => void;
  /** storage の entry を消し、starterCode に戻す。 */
  clear: () => void;
}

export function useProgress({ assignmentId, starterCode }: Args): ProgressApi {
  const [code, setCodeState] = useState<string>(
    () => readInitial(assignmentId, starterCode).code,
  );
  const [bestScore, setBestScore] = useState<number | null>(
    () => readInitial(assignmentId, starterCode).bestScore,
  );

  // 課題切替時、storage から再ロード
  // 切替直後の useState は初回マウントの値しか反映しないため effect で更新する。
  const lastAssignmentRef = useRef<string>(assignmentId);
  useEffect(() => {
    if (lastAssignmentRef.current === assignmentId) return;
    lastAssignmentRef.current = assignmentId;
    const next = readInitial(assignmentId, starterCode);
    setCodeState(next.code);
    setBestScore(next.bestScore);
  }, [assignmentId, starterCode]);

  // code 変更を debounce して localStorage に保存
  useEffect(() => {
    const timer = setTimeout(() => {
      // starterCode と完全一致なら entry を作らない (新規ノイズを避ける)
      const existing = loadEntry(assignmentId);
      if (!existing && code === starterCode) return;
      const nextBest = existing?.bestScore ?? bestScore ?? 0;
      saveEntry(
        assignmentId,
        {
          bestScore: nextBest,
          lastCode: code,
          lastSubmittedAt: existing?.lastSubmittedAt,
        },
        // bestScore は通常タイピングでは変わらない。前回値を渡すことで
        // saveEntry 内の差分判定で `loadEntry` が再走するのを避ける。
        { previousBestScore: existing?.bestScore ?? null },
      );
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [code, assignmentId, starterCode, bestScore]);

  const setCode = useCallback((next: string) => {
    setCodeState(next);
  }, []);

  const recordScore = useCallback(
    (score: number, submittedCode: string) => {
      const existing = loadEntry(assignmentId);
      const prev = existing?.bestScore ?? 0;
      const nextBest = Math.max(prev, score);
      // submittedCode は採点対象として run() に渡された固定値。
      // await 中に課題が切り替わっても、エディタの「現在値」ではなく
      // 採点が走った時点のコードを保存する。
      const entry: ProgressEntry = {
        bestScore: nextBest,
        lastCode: submittedCode,
        lastSubmittedAt: Date.now(),
      };
      saveEntry(assignmentId, entry, {
        previousBestScore: existing?.bestScore ?? null,
      });
      // 表示中の課題が切り替わっていれば bestScore の state は触らない。
      if (lastAssignmentRef.current === assignmentId) setBestScore(nextBest);
    },
    [assignmentId],
  );

  const clear = useCallback(() => {
    deleteEntry(assignmentId);
    setCodeState(starterCode);
    setBestScore(null);
  }, [assignmentId, starterCode]);

  return { code, setCode, bestScore, recordScore, clear };
}

function readInitial(
  assignmentId: string,
  starterCode: string,
): { code: string; bestScore: number | null } {
  const entry = loadEntry(assignmentId);
  if (!entry) return { code: starterCode, bestScore: null };
  return {
    code: entry.lastCode,
    bestScore: entry.bestScore > 0 ? entry.bestScore : null,
  };
}
