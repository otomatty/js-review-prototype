/**
 * 採点回帰テスト用の合算ヘルパ。
 *
 * - クライアント向けの `analyzeAst` / `calculateScore` を直接使用 (本番のスコアロジックと同一)
 * - テスト実行は test/runner.ts (Node vm) で代替 (本番は isolated-vm)
 * - Lint は test/lint.ts で同じ `eslint-linter-browserify` を使って計測
 *
 * これにより「solution が 100 点を取れるか」「badSolution が 100 点未満になるか」を、
 * 本番が見るのと同じ test+lint+ast の3軸で全問チェックできる。
 */

import { analyzeAst } from "../src/grading/ast.js";
import { calculateScore } from "../src/grading/score.js";
import type { Assignment, ScoreResult } from "../src/types.js";

import { lintCode } from "./lint.js";
import { runTests } from "./runner.js";

export interface GradeReport {
  score: ScoreResult;
  failedTests: { name: string; error?: string }[];
  missingRequired: string[];
  forbiddenViolations: string[];
  lintViolations: { ruleId: string | null; message: string; line: number }[];
  parseError?: string;
}

export function gradeCode(assignment: Assignment, code: string): GradeReport {
  const testResults = runTests(code, assignment.tests, assignment.entryPoints);
  const astResult = analyzeAst(code, assignment.ast);
  const lintViolations = lintCode(code, assignment.eslint.rules, {
    ignoredUnusedNames: assignment.entryPoints,
  });
  const score = calculateScore(
    testResults,
    lintViolations,
    astResult,
    assignment.weights,
  );

  return {
    score,
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
