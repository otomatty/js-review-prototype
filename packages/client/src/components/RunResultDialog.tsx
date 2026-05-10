import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleX,
  Loader2,
} from "lucide-react";
import type {
  ASTResult,
  Assignment,
  LintViolation,
  TestResult,
} from "@jsreview/shared/types";
import { getStaticAnalysisSettings } from "@jsreview/shared/assignment-helpers";

import { cn } from "@/lib/utils";
import type { ExecutionResult } from "../hooks/useGradeRunner";
import {
  describeForbiddenAstPattern,
  describeRequiredAstCheck,
} from "../lib/ast-messages";
import {
  describeLintViolation,
  lintSeverityLabel,
} from "../lib/lint-messages";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Phase = "lint" | "ast" | "tests" | "done";
type SectionStatus =
  | "pending"
  | "evaluating"
  | "success"
  | "failure"
  | "error";

interface RunResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  running: boolean;
  result: ExecutionResult | null;
  assignment: Assignment;
  lint: LintViolation[];
  ast: ASTResult;
  /**
   * 一覧順での次の課題。最終問題なら null。
   * クリア時に「次の問題へ」リンクとして表示する。
   */
  nextAssignment: Assignment | null;
  onGoToNext: () => void;
}

const STEP_DELAY_MS = 380;
const TEST_REVEAL_DELAY_MS = 320;

export function RunResultDialog({
  open,
  onOpenChange,
  running,
  result,
  assignment,
  lint,
  ast,
  nextAssignment,
  onGoToNext,
}: RunResultDialogProps) {
  const [phase, setPhase] = useState<Phase>("lint");
  const [revealedTests, setRevealedTests] = useState(0);

  const displayedLint = result?.lintAtRun ?? lint;
  const displayedAst = result?.astAtRun ?? ast;
  const testResults = result?.testResults ?? [];
  const totalTests = testResults.length;
  const visibleTests = testResults.slice(0, revealedTests);

  useEffect(() => {
    if (!open) {return;}
    setPhase("lint");
    setRevealedTests(0);
  }, [open]);

  useEffect(() => {
    if (!open || phase !== "lint") {return;}
    const timer = window.setTimeout(() => setPhase("ast"), STEP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [open, phase]);

  useEffect(() => {
    if (!open || phase !== "ast") {return;}
    const timer = window.setTimeout(() => setPhase("tests"), STEP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [open, phase]);

  useEffect(() => {
    if (!open || phase !== "tests" || !result) {return;}
    if (revealedTests >= result.testResults.length) {
      const timer = window.setTimeout(() => setPhase("done"), STEP_DELAY_MS);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(
      () => setRevealedTests((count) => count + 1),
      TEST_REVEAL_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [open, phase, result, revealedTests]);

  const lintStatus: SectionStatus =
    phase === "lint"
      ? "evaluating"
      : result?.evaluation.checks.lintPassed
        ? "success"
        : "failure";

  const astStatus: SectionStatus = (() => {
    if (phase === "lint") {return "pending";}
    if (phase === "ast") {return "evaluating";}
    if (displayedAst.parseError) {return "error";}
    return result?.evaluation.checks.astPassed ? "success" : "failure";
  })();

  const testsStatus: SectionStatus = (() => {
    if (phase === "lint" || phase === "ast") {return "pending";}
    if (phase === "tests") {return "evaluating";}
    if (result?.errorMessage) {return "error";}
    if (!result) {return "evaluating";}
    return result.evaluation.checks.testsPassed ? "success" : "failure";
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="run-result-dialog-description">
        <DialogHeader>
          <DialogTitle className="font-jp text-[22px] font-bold tracking-[-0.01em]">
            実行結果
          </DialogTitle>
          <DialogDescription id="run-result-dialog-description">
            Lint・コード構造・テストの 3 つのチェックを順番に評価します。すべて通過するとクリアです。成功した項目は折りたたまれます。
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-13rem)] overflow-y-auto px-6 py-5">
          <ResultBanner
            phase={phase}
            result={result}
            nextAssignment={nextAssignment}
          />
          <div className="overflow-hidden rounded-lg border bg-card">
            <LintRow lint={displayedLint} status={lintStatus} />
            <AstRow
              ast={displayedAst}
              assignment={assignment}
              status={astStatus}
            />
            <TestsRow
              status={testsStatus}
              running={running}
              result={result}
              visibleTests={visibleTests}
              revealedTests={revealedTests}
              totalTests={totalTests}
              isLast
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={running}
          >
            {running ? "実行中..." : "閉じる"}
          </Button>
          {phase === "done" && result?.evaluation.cleared && nextAssignment ? (
            <Button
              onClick={onGoToNext}
              className="gap-2"
              title={`次の問題: ${nextAssignment.title}`}
            >
              次の問題へ
              <ArrowRight className="size-4 shrink-0" />
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResultBanner({
  phase,
  result,
  nextAssignment,
}: {
  phase: Phase;
  result: ExecutionResult | null;
  nextAssignment: Assignment | null;
}) {
  if (phase !== "done" || !result) {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 shrink-0 animate-spin" />
        評価中です...
      </div>
    );
  }

  if (result.evaluation.cleared) {
    return (
      <div className="relative mb-4 flex items-center gap-3 overflow-hidden rounded-xl border border-success/30 bg-success-bg px-4 py-3 text-sm text-success dark:border-success/40 dark:bg-success/10 dark:text-emerald-200">
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] gradient-bg"
          aria-hidden
        />
        <CircleCheck className="size-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <strong className="font-jp text-base font-bold gradient-text">
            クリアしました
          </strong>
          <p className="truncate text-xs text-success/80 dark:text-emerald-300">
            {nextAssignment
              ? `次は「${nextAssignment.title}」に進めます。`
              : "これが最後の問題です。お疲れさまでした！"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <CircleX className="size-5 shrink-0" />
      <div>
        <strong className="font-jp text-base font-bold">未クリア</strong>
        <p className="text-xs text-destructive/80">
          失敗しているチェックを確認して修正しましょう。
        </p>
      </div>
    </div>
  );
}

function LintRow({
  lint,
  status,
}: {
  lint: LintViolation[];
  status: SectionStatus;
}) {
  const errorCount = lint.filter((v) => v.severity === 2).length;
  const warnCount = lint.length - errorCount;

  const meta = (() => {
    if (status === "pending") {return "待機中";}
    if (status === "evaluating") {return "評価中...";}
    if (lint.length === 0) {return "指摘なし";}
    return `エラー ${errorCount} ・ ヒント ${warnCount}`;
  })();

  return (
    <CheckRow
      title="Lint チェック"
      status={status}
      meta={meta}
      isLast={false}
    >
      {status === "evaluating" ? (
        <p className="text-sm text-muted-foreground">
          ESLint で書き方の指摘を確認しています...
        </p>
      ) : lint.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          文法や基本的な書き方の指摘はありません。
        </p>
      ) : (
        <ul className="space-y-3">
          {lint.map((violation, index) => {
            const message = describeLintViolation(violation);
            return (
              <li
                key={`${violation.ruleId ?? "lint"}-${violation.line}-${index}`}
                className="rounded-lg border bg-background p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      violation.severity === 2
                        ? "text-destructive"
                        : "text-warn"
                    }
                    aria-hidden
                  >
                    {violation.severity === 2 ? "✗" : "!"}
                  </span>
                  <strong className="text-sm">{message.title}</strong>
                  <Badge variant="secondary" className="font-medium">
                    {violation.line}行目
                  </Badge>
                  <Badge
                    variant={
                      violation.severity === 2 ? "destructive" : "secondary"
                    }
                  >
                    {lintSeverityLabel(violation.severity)}
                  </Badge>
                </div>
                {message.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {message.description}
                  </p>
                ) : null}
                {message.hint ? (
                  <p className="mt-2 text-sm text-primary">{message.hint}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </CheckRow>
  );
}

function AstRow({
  ast,
  assignment,
  status,
}: {
  ast: ASTResult;
  assignment: Assignment;
  status: SectionStatus;
}) {
  const settings = getStaticAnalysisSettings(assignment);
  const hasForbiddenRules = (settings.ast.forbidden?.length ?? 0) > 0;
  const hasAnyAstRule = ast.required.length > 0 || hasForbiddenRules;
  const requiredPassed = ast.required.filter((check) => check.found).length;

  const meta = (() => {
    if (status === "pending") {return "待機中";}
    if (status === "evaluating") {return "評価中...";}
    if (ast.parseError) {return "構文エラー";}
    return `必須 ${requiredPassed}/${ast.required.length} ・ 違反 ${ast.forbidden.length}`;
  })();

  return (
    <CheckRow
      title="コード構造チェック"
      status={status}
      meta={meta}
      isLast={false}
    >
      {status === "pending" ? (
        <p className="text-sm text-muted-foreground">
          Lint チェックの後に評価します。
        </p>
      ) : status === "evaluating" ? (
        <p className="text-sm text-muted-foreground">
          AST を解析して、必須・禁止の書き方を確認しています...
        </p>
      ) : ast.parseError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <strong className="text-sm text-destructive">
            コードに構文エラーがあります
          </strong>
          <p className="mt-2 text-sm text-muted-foreground">
            まず括弧、カンマ、クォートの閉じ忘れがないか確認しましょう。
          </p>
          <p className="mt-2 font-mono text-xs text-destructive">
            {ast.parseError}
          </p>
        </div>
      ) : !hasAnyAstRule ? (
        <p className="text-sm text-muted-foreground">
          この課題では、コード構造の追加条件はありません。
        </p>
      ) : (
        <>
          {ast.required.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">やること</h4>
              <ul className="space-y-2">
                {ast.required.map((check, index) => {
                  const message = describeRequiredAstCheck(check);
                  return (
                    <li
                      key={`required-${index}`}
                      className="rounded-lg border bg-background p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            check.found ? "text-success" : "text-destructive"
                          }
                          aria-hidden
                        >
                          {check.found ? "✓" : "✗"}
                        </span>
                        <strong className="text-sm">{message.title}</strong>
                      </div>
                      {message.description ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {message.description}
                        </p>
                      ) : null}
                      {message.hint ? (
                        <p className="mt-2 text-sm text-primary">
                          {message.hint}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {hasForbiddenRules ? (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold">避けること</h4>
              {ast.forbidden.length === 0 ? (
                <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  <span className="text-ok">✓</span>{" "}
                  避けたい書き方は見つかりませんでした。
                </div>
              ) : (
                <ul className="space-y-2">
                  {ast.forbidden.map((violation, index) => {
                    const message = describeForbiddenAstPattern(
                      violation.pattern,
                      violation.label,
                    );
                    return (
                      <li
                        key={`forbidden-${violation.line}-${index}`}
                        className="rounded-lg border border-destructive/30 bg-destructive/5 p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-destructive">✗</span>
                          <strong className="text-sm">{message.title}</strong>
                          <Badge variant="secondary">
                            {violation.line}行目
                          </Badge>
                        </div>
                        {message.description ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {message.description}
                          </p>
                        ) : null}
                        {message.hint ? (
                          <p className="mt-2 text-sm text-primary">
                            {message.hint}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : null}
        </>
      )}
    </CheckRow>
  );
}

function TestsRow({
  status,
  running,
  result,
  visibleTests,
  revealedTests,
  totalTests,
  isLast,
}: {
  status: SectionStatus;
  running: boolean;
  result: ExecutionResult | null;
  visibleTests: TestResult[];
  revealedTests: number;
  totalTests: number;
  isLast: boolean;
}) {
  const passedCount = visibleTests.filter((test) => test.passed).length;

  const meta = (() => {
    if (status === "pending") {return "待機中";}
    if (status === "evaluating") {
      if (!result) {return "サーバで実行中...";}
      return `${revealedTests}/${totalTests}件 表示中`;
    }
    if (status === "error") {return "実行に失敗";}
    return `${passedCount}/${totalTests}件 PASS`;
  })();

  return (
    <CheckRow
      title="テスト実行"
      status={status}
      meta={meta}
      isLast={isLast}
    >
      {status === "pending" ? (
        <p className="text-sm text-muted-foreground">
          コード構造の確認が終わってからテストを実行します。
        </p>
      ) : null}

      {status === "evaluating" && (running || !result) ? (
        <p className="text-sm text-muted-foreground">
          サーバの isolated-vm でテストを実行しています...
        </p>
      ) : null}

      {status === "evaluating" && result && totalTests > 0 ? (
        <p className="text-sm text-muted-foreground">
          テスト結果を 1 件ずつ表示しています...
        </p>
      ) : null}

      {result?.errorMessage ? (
        <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {result.errorMessage}
        </p>
      ) : null}

      {visibleTests.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {visibleTests.map((test, index) => {
            // stdout 採点失敗かつエラーが無い場合は「期待値 vs 実際」を上下 2 段で表示する。
            // (TIMEOUT / COMPILE_ERROR / 例外時は従来どおり error メッセージを優先表示)
            const showStdoutDiff =
              !test.passed &&
              !test.error &&
              test.expectedStdout !== undefined;
            return (
              <li
                key={`${test.name}-${index}`}
                className="rounded-lg border bg-background p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      test.passed ? "text-success" : "text-destructive"
                    }
                    aria-hidden
                  >
                    {test.passed ? "✓" : "✗"}
                  </span>
                  <strong className="text-sm">{test.name}</strong>
                  <Badge variant={test.passed ? "default" : "destructive"}>
                    {test.passed ? "PASS" : "FAIL"}
                  </Badge>
                </div>
                {test.error ? (
                  <p className="mt-2 rounded bg-destructive/10 px-2 py-1 font-mono text-xs text-destructive">
                    {test.error}
                  </p>
                ) : null}
                {showStdoutDiff ? (
                  <div className="mt-2 grid gap-2">
                    <div>
                      <div className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        期待される出力
                      </div>
                      <pre className="m-0 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-success-bg px-2 py-1.5 font-mono text-xs text-success dark:bg-success/10">
                        {test.expectedStdout || "(空)"}
                      </pre>
                    </div>
                    <div>
                      <div className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        実際の出力
                      </div>
                      <pre className="m-0 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-destructive/10 px-2 py-1.5 font-mono text-xs text-destructive">
                        {test.stdout && test.stdout.length > 0
                          ? test.stdout
                          : "(出力なし)"}
                      </pre>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </CheckRow>
  );
}

function CheckRow({
  title,
  status,
  meta,
  isLast,
  children,
}: {
  title: string;
  status: SectionStatus;
  meta: string;
  isLast: boolean;
  children: React.ReactNode;
}) {
  const autoOpen = shouldAutoOpen(status);
  const [open, setOpen] = useAutoControlledOpen(status, autoOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "border-b last:border-b-0",
        isLast ? "border-b-0" : undefined,
      )}
    >
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ink-100/50 dark:hover:bg-ink-700/50",
            status === "pending" && "text-muted-foreground",
          )}
        >
          <StatusIcon status={status} />
          <span className="flex-1 truncate font-jp text-sm font-semibold">
            {title}
          </span>
          <span className="font-sans text-xs text-muted-foreground">
            {meta}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t bg-muted/20 px-4 py-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function StatusIcon({ status }: { status: SectionStatus }) {
  switch (status) {
    case "pending":
      return <Circle className="size-5 shrink-0 text-muted-foreground" />;
    case "evaluating":
      return <Loader2 className="size-5 shrink-0 animate-spin text-blue-500" />;
    case "success":
      return <CircleCheck className="size-5 shrink-0 text-success" />;
    case "failure":
      return <CircleX className="size-5 shrink-0 text-destructive" />;
    case "error":
      return <CircleAlert className="size-5 shrink-0 text-destructive" />;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

function shouldAutoOpen(status: SectionStatus): boolean {
  switch (status) {
    case "pending":
      return false;
    case "evaluating":
      return true;
    case "success":
      return false;
    case "failure":
      return true;
    case "error":
      return true;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

/**
 * ステータスに応じた自動開閉と、ユーザーのトグル操作を両立させる。
 * ステータスが変わるたび新しい自動値に追従し、その後のユーザー操作は
 * 次のステータス変化まで尊重する。
 */
function useAutoControlledOpen(
  status: SectionStatus,
  autoOpen: boolean,
): [boolean, (next: boolean) => void] {
  const [open, setOpen] = useState(autoOpen);
  const lastStatus = useRef<SectionStatus>(status);

  useEffect(() => {
    if (lastStatus.current !== status) {
      lastStatus.current = status;
      setOpen(autoOpen);
    }
  }, [status, autoOpen]);

  return [open, setOpen];
}
