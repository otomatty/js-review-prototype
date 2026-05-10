/**
 * 評価回帰テスト用の合算ヘルパ。
 *
 * - クライアント向けの `analyzeAst` / `evaluate` を直接使用 (本番の判定ロジックと同一)
 * - テスト実行は test/runner.ts (Node vm) で代替 (本番は isolated-vm)
 * - Lint は test/lint.ts で同じ `eslint-linter-browserify` を使って計測
 *
 * これにより「solution が全チェック通過するか」「badSolution が必ず1つ以上失敗するか」を、
 * 本番が見るのと同じ test+lint+ast の3軸で全問チェックできる。
 */

import { analyzeAst } from "../src/grading/ast.js";
import { evaluate } from "../src/grading/evaluate.js";
import type { Assignment, EvaluationResult } from "../src/types.js";
import { getStaticAnalysisSettings } from "../src/assignment-helpers.js";

import { lintCode } from "./lint.js";
import { runTests } from "./runner.js";

export interface GradeReport {
  evaluation: EvaluationResult;
  failedTests: { name: string; error?: string }[];
  missingRequired: string[];
  forbiddenViolations: string[];
  lintViolations: { ruleId: string | null; message: string; line: number }[];
  parseError?: string;
}

export async function gradeCode(
  assignment: Assignment,
  code: string,
): Promise<GradeReport> {
  const settings = getStaticAnalysisSettings(assignment);
  const testResults = await runTests(
    code,
    assignment.tests,
    assignment.testKind,
    assignment.entryPoints ?? [],
  );
  const astResult = analyzeAst(code, settings.ast);
  const lintViolations = lintCode(code, settings.eslintRules, {
    ignoredUnusedNames: settings.ignoredUnusedNames,
  });
  const evaluation = evaluate(
    assignment.testKind,
    testResults,
    lintViolations,
    astResult,
  );

  return {
    evaluation,
    failedTests: testResults
      .filter((r) => !r.passed)
      .map((r) => ({ name: r.name, error: r.error })),
    missingRequired: astResult.required
      .filter((r) => !r.found)
      .map((r) => r.label),
    forbiddenViolations: astResult.forbidden.map((v) => v.label),
    lintViolations: lintViolations.map((v) => ({
      ruleId: v.ruleId,
      message: v.rawMessage ?? v.message,
      line: v.line,
    })),
    parseError: astResult.parseError,
  };
}
