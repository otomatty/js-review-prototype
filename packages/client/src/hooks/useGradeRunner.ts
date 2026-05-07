/**
 * 「実行」ボタン押下時にサーバへテスト実行を依頼し、
 * 返ってきた結果と手元の Lint/AST 結果を合算するための Hook。
 */

import { useCallback, useState } from "react";
import { calculateScore } from "@jsreview/shared/grading/score";
import type {
  ASTResult,
  Assignment,
  LintViolation,
  ScoreResult,
  TestResult,
} from "@jsreview/shared/types";

import { runTests } from "../lib/api.js";

export interface ExecutionResult {
  testResults: TestResult[];
  serverDurationMs: number;
  totalDurationMs: number;
  score: ScoreResult;
  /** 実行時のスナップショット (画面の lint 状態と独立に表示するため) */
  lintAtRun: LintViolation[];
  astAtRun: ASTResult;
  errorMessage?: string;
}

interface RunArgs {
  code: string;
  assignment: Assignment;
  lint: LintViolation[];
  ast: ASTResult;
}

export function useGradeRunner() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const reset = useCallback(() => setResult(null), []);

  const run = useCallback(async (args: RunArgs) => {
    setRunning(true);
    const startedAt = performance.now();

    try {
      const data = await runTests({
        code: args.code,
        tests: args.assignment.tests,
        entryPoints: args.assignment.entryPoints,
      });

      const score = calculateScore(
        data.results,
        args.lint,
        args.ast,
        args.assignment.weights,
      );

      setResult({
        testResults: data.results,
        serverDurationMs: data.durationMs,
        totalDurationMs: Math.round(performance.now() - startedAt),
        score,
        lintAtRun: args.lint,
        astAtRun: args.ast,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // テストはすべて失敗として表示。スコアは Lint/AST のみで計算。
      const failedResults: TestResult[] = args.assignment.tests.map((t) => ({
        name: t.name,
        weight: t.weight,
        passed: false,
        error: `SERVER_ERROR: ${msg}`,
      }));
      const score = calculateScore(
        failedResults,
        args.lint,
        args.ast,
        args.assignment.weights,
      );
      setResult({
        testResults: failedResults,
        serverDurationMs: 0,
        totalDurationMs: Math.round(performance.now() - startedAt),
        score,
        lintAtRun: args.lint,
        astAtRun: args.ast,
        errorMessage: msg,
      });
    } finally {
      setRunning(false);
    }
  }, []);

  return { running, result, run, reset };
}
