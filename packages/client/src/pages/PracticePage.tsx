/**
 * 問題演習画面。
 *
 * URL `/problems/:assignmentId` に対応し、1 課題の演習に集中するためのページ。
 * 一覧画面 (`/`) と機能を切り分けるため、サイドバー・課題セレクトは持たない。
 *
 * - URL の `assignmentId` が無効なら一覧へリダイレクト
 * - 課題の所属ステージが未解禁ならステージ詳細画面へリダイレクト
 *   (URL 直アクセスでロック中の課題を開けないようにする)
 * - `[` / `]` で前後課題に移動 (`navigate()` で URL ごと切替)
 * - 「一覧へ戻る」ボタンで `/` へ
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { assignments, findAssignment } from "@jsreview/shared/assignments";
import type { Assignment } from "@jsreview/shared/types";
import { getStaticAnalysisSettings } from "@jsreview/shared/assignment-helpers";
import type { GradingSummary } from "@jsreview/shared/ai/types";

import { cn } from "@/lib/utils";
import { Editor } from "../components/Editor.js";
import { AssignmentView } from "../components/AssignmentView.js";
import { OutputPane } from "../components/OutputPane.js";
import { RunResultDialog } from "../components/RunResultDialog.js";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { AppHeader } from "../components/AppHeader.js";
import { Button } from "../components/ui/button.js";

import { useStaticAnalysis } from "../hooks/useStaticAnalysis.js";
import { useGradeRunner } from "../hooks/useGradeRunner.js";
import { useProgress } from "../hooks/useProgress.js";
import { useStageUnlocks } from "../hooks/useStageUnlocks.js";
import { runFreeRun } from "../lib/api.js";

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
  const unlockedStages = useStageUnlocks();

  if (!assignment) {
    return <Navigate to="/" replace />;
  }
  // ロック中ステージの問題は URL 直アクセスでも開けない。
  // ステージ詳細画面 (LockedNotice 付き) へ誘導する。
  if (!unlockedStages.includes(assignment.stage)) {
    return <Navigate to={`/stages/${assignment.stage}`} replace />;
  }
  return <PracticePageInner assignment={assignment} />;
}

interface InnerProps {
  assignment: Assignment;
}

function PracticePageInner({ assignment }: InnerProps) {
  const navigate = useNavigate();
  /** await 後も「いま画面にいる課題」を判定するため、最新 ID を常に指す。 */
  const activeAssignmentIdRef = useRef(assignment.id);
  useLayoutEffect(() => {
    activeAssignmentIdRef.current = assignment.id;
  }, [assignment.id]);

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [freeRun, setFreeRun] = useState<{
    stdout?: string;
    error?: string;
  } | null>(null);
  const [freeRunPending, setFreeRunPending] = useState(false);

  const { code, setCode, cleared, recordResult, clear } = useProgress({
    assignmentId: assignment.id,
    starterCode: assignment.starterCode,
  });

  const staticAnalysis = useMemo(
    () => getStaticAnalysisSettings(assignment),
    [assignment],
  );
  const { lint, ast } = useStaticAnalysis(code, assignment);
  const { running, result, run, reset } = useGradeRunner();

  // 一覧での順序に従う「次の課題」。最終問題なら null。
  // ダイアログでクリア時に「次の問題へ」リンクを出すために使う。
  const nextAssignment = useMemo(() => {
    const idx = assignments.findIndex((a) => a.id === assignment.id);
    if (idx === -1 || idx >= assignments.length - 1) {return null;}
    return assignments[idx + 1];
  }, [assignment.id]);

  const handleGoToNext = useCallback(() => {
    if (!nextAssignment) {return;}
    setResultDialogOpen(false);
    navigate(`/problems/${nextAssignment.id}`);
  }, [navigate, nextAssignment]);

  // 「AI に質問する」: 採点失敗情報を要約して、チャット画面へ navigation state
  // で渡す。 ChatPage 側で履歴が空ならそれを基に初回投稿を組み立てる。
  const handleAskAi = useCallback(() => {
    if (!result) {return;}
    const summary: GradingSummary = {
      cleared: result.evaluation.cleared,
      lintFailures: result.lintAtRun
        .filter((v) => v.severity === 2)
        .map((v) => ({
          ruleId: v.ruleId,
          line: v.line,
          message: v.message,
        })),
      astFailures: [
        ...result.astAtRun.required
          .filter((r) => !r.found)
          .map((r) => ({
            kind: "required-missing" as const,
            label: r.label,
          })),
        ...result.astAtRun.forbidden.map((f) => ({
          kind: "forbidden-found" as const,
          label: f.label,
          line: f.line,
        })),
      ],
      testFailures: result.testResults
        .filter((t) => !t.passed)
        .map((t) => ({
          name: t.name,
          error: t.error,
          expectedStdout: t.expectedStdout,
          actualStdout: t.stdout,
        })),
    };
    setResultDialogOpen(false);
    navigate(`/problems/${assignment.id}/chat`, {
      state: { userCode: code, gradingSummary: summary },
    });
  }, [result, assignment.id, code, navigate]);

  // 課題切替時、結果表示と自由実行出力をクリア
  useEffect(() => {
    reset();
    setFreeRun(null);
    setFreeRunPending(false);
  }, [assignment.id, reset]);

  // `[` / `]` で前後の課題に移動 (両端は循環)。
  // CodeMirror など編集可能要素にフォーカス中は通常の文字入力を優先する。
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) {return;}
      if (e.key !== "[" && e.key !== "]") {return;}
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
      if (idx === -1) {return;}
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
    if (!wipeStorage) {return;}
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

  // 「実行」 (採点せずコードを動かして stdout を取る)
  // function 採点では assignment.demoCall を末尾に追記し、 entryPoint を呼ばせる。
  const freeRunDisabled =
    assignment.testKind === "function" && !assignment.demoCall;
  const handleFreeRun = useCallback(async () => {
    const submittedCode = code;
    const targetAssignmentId = assignment.id;
    setFreeRunPending(true);
    setFreeRun({ stdout: undefined, error: undefined });
    const codeToRun =
      assignment.testKind === "function" && assignment.demoCall
        ? `${submittedCode}\n\n${assignment.demoCall}\n`
        : submittedCode;
    try {
      const res = await runFreeRun(codeToRun);
      // 実行中に課題が切り替わったら結果を捨てる (古い useCallback の assignment は stale)
      if (activeAssignmentIdRef.current !== targetAssignmentId) {return;}
      setFreeRun({
        stdout: res.stdout ?? "",
        error: res.error,
      });
    } catch (e) {
      if (activeAssignmentIdRef.current !== targetAssignmentId) {return;}
      setFreeRun({
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      if (activeAssignmentIdRef.current === targetAssignmentId) {
        setFreeRunPending(false);
      }
    }
  }, [code, assignment.id, assignment.testKind, assignment.demoCall]);

  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <AppHeader
        backLink={{ to: "/", label: "← 問題一覧", ariaLabel: "問題一覧へ戻る" }}
        right={
          <>
            <span
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[12px] font-semibold max-md:gap-1 max-md:px-2 max-md:py-0.5 max-md:text-[11px]",
                cleared
                  ? "border-success/25 bg-success-bg text-success before:size-1.5 before:rounded-full before:bg-success before:content-[''] dark:border-success/40 dark:bg-success/10"
                  : "border-border bg-card text-muted-foreground",
              )}
              title="この課題のクリア状態 (localStorage に保存)"
            >
              {cleared ? "クリア済み" : "未クリア"}
            </span>
            <button
              type="button"
              className="rounded-md border border-border bg-card px-3.5 py-1.5 font-sans text-[13px] font-medium text-foreground transition-colors hover:border-ink-300 hover:bg-card dark:hover:border-ink-600 max-md:px-2.5 max-md:py-1 max-md:text-[12px]"
              onClick={handleReset}
            >
              リセット
            </button>
            <ThemeToggle />
          </>
        }
      />

      <div className="grid grid-cols-[440px_1fr] overflow-hidden max-md:grid-cols-1 max-md:grid-rows-[auto_1fr]">
        <aside className="flex min-h-0 flex-col overflow-hidden border-r border-border bg-card max-md:max-h-[40vh] max-md:border-b max-md:border-r-0">
          <AssignmentView assignment={assignment} />
        </aside>

        <section className="grid grid-rows-[1fr_auto_auto] overflow-hidden bg-background">
          <div className="flex min-h-0 flex-col overflow-hidden bg-background">
            <div className="flex-1 overflow-auto">
              <Editor
                code={code}
                onChange={setCode}
                eslintRules={staticAnalysis.eslintRules}
                entryPoints={staticAnalysis.ignoredUnusedNames}
              />
            </div>
          </div>
          <OutputPane
            stdout={freeRun?.stdout}
            error={freeRun?.error}
            running={freeRunPending}
            onClear={() => setFreeRun(null)}
          />

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border bg-card px-6 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleFreeRun}
                disabled={freeRunPending || running || freeRunDisabled}
                title={
                  freeRunDisabled
                    ? "function 採点課題: 「採点を実行」 を使ってテストを動かしてください"
                    : undefined
                }
              >
                {freeRunPending
                  ? "実行中..."
                  : assignment.testKind === "function"
                    ? "▶ 関数を試す"
                    : "▶ 実行"}
              </Button>
              <Button
                variant="acial"
                size="lg"
                onClick={handleRun}
                disabled={running}
              >
                {running ? "採点中..." : "✓ 採点を実行"}
              </Button>
            </div>
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
            onAskAi={handleAskAi}
          />
        </section>
      </div>
    </div>
  );
}
