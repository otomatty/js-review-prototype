/**
 * スコア集計。 **クライアント側のみ** で使用される。
 *
 * テスト結果(サーバから返却) + Lint違反(クライアント計算済み) + AST結果(クライアント計算済み)
 * を合算して、100点満点で評価する。
 */

import type {
  ASTResult,
  LintViolation,
  ScoreResult,
  ScoreWeights,
  TestResult,
} from "../types.js";

export function calculateScore(
  testResults: TestResult[],
  lintViolations: LintViolation[],
  astResult: ASTResult,
  weights: ScoreWeights,
): ScoreResult {
  // ─── Test: 重み付き合格率 ───────────────────────────────────
  const passedWeight = testResults
    .filter((t) => t.passed)
    .reduce((s, t) => s + t.weight, 0);
  const totalWeight = testResults.reduce((s, t) => s + t.weight, 0);
  const testScore =
    totalWeight > 0 ? (passedWeight / totalWeight) * weights.test : 0;

  // ─── Lint: 違反1件につき2点減点 (下限0) ──────────────────
  const lintScore = Math.max(0, weights.lint - lintViolations.length * 2);

  // ─── AST: 必須/禁止それぞれ半分の配点 ──────────────────────
  const requiredOk =
    astResult.required.length === 0 || astResult.required.every((r) => r.found);
  const forbiddenOk = astResult.forbidden.length === 0;

  const astHalf = weights.ast / 2;
  // 必須要件がない課題は requiredScore は満点扱い
  const requiredScore =
    astResult.required.length === 0 ? astHalf : requiredOk ? astHalf : 0;
  // 禁止要件がない課題は forbiddenScore は満点扱い
  const forbiddenScore = forbiddenOk ? astHalf : 0;

  const astScore = requiredScore + forbiddenScore;

  const total = Math.round(testScore + lintScore + astScore);

  return {
    total,
    breakdown: {
      test: round1(testScore),
      lint: round1(lintScore),
      ast: round1(astScore),
    },
    details: {
      test: { passedWeight, totalWeight, weight: weights.test },
      lint: { violations: lintViolations.length, weight: weights.lint },
      ast: {
        requiredOk,
        forbiddenViolations: astResult.forbidden.length,
        weight: weights.ast,
      },
    },
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
