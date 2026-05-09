/**
 * 問題演習画面。
 *
 * URL `/problems/:assignmentId` に対応し、1 課題の演習に集中するためのページ。
 * 一覧画面 (`/`) と機能を切り分けるため、サイドバー・課題セレクトは持たない。
 *
 * - URL の `assignmentId` が無効なら一覧へリダイレクト
 * - `[` / `]` で前後課題に移動 (`navigate()` で URL ごと切替)
 * - 「一覧へ戻る」ボタンで `/` へ
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { assignments, findAssignment } from "@jsreview/shared/assignments";
import type { Assignment } from "@jsreview/shared/types";

import { cn } from "@/lib/utils";
import { Editor } from "../components/Editor.js";
import { AssignmentView } from "../components/AssignmentView.js";
import { RunResultDialog } from "../components/RunResultDialog.js";

import { useStaticAnalysis } from "../hooks/useStaticAnalysis.js";
import { useGradeRunner } from "../hooks/useGradeRunner.js";
import { useProgress } from "../hooks/useProgress.js";

/**
 * URL から課題を解決し、不正な ID なら一覧へリダイレクトするガード。
 * 解決済みの課題を子コンポーネントへ渡すことで、Hooks の順序条件を
 * 「常に有効な assignment を持つ」に統一できる。
 */
export function PracticePage() {
  const { assignmentId = "" } = useParams<{ assignmentId: string }>();
  const assignment = useMemo(
    () => findAssignment(assignmentId),
    [assignmentId],
  );

  if (!assignment) {
    return <Navigate to="/" replace />;
  }
  return <PracticePageInner assignment={assignment} />;
}

interface InnerProps {
  assignment: Assignment;
}

function PracticePageInner({ assignment }: InnerProps) {
  const navigate = useNavigate();
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  const { code, setCode, cleared, recordResult, clear } = useProgress({
    assignmentId: assignment.id,
    starterCode: assignment.starterCode,
  });

  const { lint, ast } = useStaticAnalysis(code, assignment);
  const { running, result, run, reset } = useGradeRunner();

  // 一覧での順序に従う「次の課題」。最終問題なら null。
  // ダイアログでクリア時に「次の問題へ」リンクを出すために使う。
  const nextAssignment = useMemo(() => {
    const idx = assignments.findIndex((a) => a.id === assignment.id);
    if (idx === -1 || idx >= assignments.length - 1) return null;
    return assignments[idx + 1];
  }, [assignment.id]);

  const handleGoToNext = useCallback(() => {
    if (!nextAssignment) return;
    setResultDialogOpen(false);
    navigate(`/problems/${nextAssignment.id}`);
  }, [navigate, nextAssignment]);

  // 課題切替時、結果表示は無関係になるのでクリア
  useEffect(() => {
    reset();
  }, [assignment.id, reset]);

  // `[` / `]` で前後の課題に移動 (両端は循環)。
  // CodeMirror など編集可能要素にフォーカス中は通常の文字入力を優先する。
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "[" && e.key !== "]") return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        t.closest(
          "input, textarea, select, [contenteditable=''], [contenteditable='true'], .cm-editor",
        )
      ) {
        return;
      }
      const idx = assignments.findIndex((a) => a.id === assignment.id);
      if (idx === -1) return;
      const len = assignments.length;
      const nextIdx =
        e.key === "[" ? (idx - 1 + len) % len : (idx + 1) % len;
      e.preventDefault();
      navigate(`/problems/${assignments[nextIdx].id}`);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [assignment.id, navigate]);

  const handleReset = useCallback(() => {
    const wipeStorage = window.confirm(
      "編集中のコードと保存済みの進捗 (クリア状態を含む) を消去して、初期コードに戻しますか?\n\n" +
        "[OK] 保存も含めてリセット\n" +
        "[キャンセル] このまま編集を続ける",
    );
    if (!wipeStorage) return;
    clear();
    reset();
  }, [clear, reset]);

  const handleRun = useCallback(async () => {
    // await 中に課題が切り替わっても元の課題に紐付ける必要があるため、
    // 評価対象のコードはローカル変数に固定しておく。
    const submittedCode = code;
    reset();
    setResultDialogOpen(true);
    const res = await run({
      code: submittedCode,
      assignment,
      lint,
      ast,
    });
    recordResult(res.evaluation.cleared, submittedCode);
  }, [code, assignment, lint, ast, reset, run, recordResult]);

  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-1 text-[12.5px] font-semibold text-muted-foreground no-underline hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="問題一覧へ戻る"
          >
            ← 問題一覧
          </Link>
          <h1 className="text-base font-semibold">
            JS自動コードレビュー{" "}
            <span className="ml-2 inline-block rounded-[10px] bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              プロトタイプ
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
              cleared
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-border bg-muted text-muted-foreground",
            )}
            title="この課題のクリア状態 (localStorage に保存)"
          >
            {cleared ? "✓ クリア済み" : "未クリア"}
          </span>
          <button
            type="button"
            className="rounded-md border border-border bg-white px-3.5 py-1.5 text-foreground hover:bg-muted"
            onClick={handleReset}
          >
            リセット
          </button>
        </div>
      </header>

      <div className="grid grid-cols-[420px_1fr] overflow-hidden max-md:grid-cols-1 max-md:grid-rows-[auto_1fr]">
        <aside className="flex min-h-0 flex-col overflow-hidden border-r border-border bg-card max-md:max-h-[40vh] max-md:border-b max-md:border-r-0">
          <AssignmentView assignment={assignment} />
        </aside>

        <section className="grid grid-rows-[1fr_auto] overflow-hidden">
          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <Editor
                code={code}
                onChange={setCode}
                eslintRules={assignment.eslint.rules}
                entryPoints={assignment.entryPoints}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border bg-card px-5 py-2.5">
            <button
              type="button"
              className="rounded-md border border-primary bg-primary px-[18px] py-2 font-semibold text-primary-foreground hover:bg-indigo-600 disabled:cursor-not-allowed disabled:border-zinc-400 disabled:bg-zinc-400"
              onClick={handleRun}
              disabled={running}
            >
              {running ? "実行中..." : "▶ 実行"}
            </button>
          </div>

          <RunResultDialog
            open={resultDialogOpen}
            onOpenChange={setResultDialogOpen}
            running={running}
            result={result}
            assignment={assignment}
            lint={lint}
            ast={ast}
            nextAssignment={nextAssignment}
            onGoToNext={handleGoToNext}
          />
        </section>
      </div>
    </div>
  );
}
