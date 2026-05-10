/**
 * 評価ロジック (二値クリア判定)。 **クライアント側のみ** で使用される。
 *
 * テスト結果(サーバから返却) + Lint違反(クライアント計算済み) + AST結果(クライアント計算済み)
 * を合算して、「全チェック通過 = クリア」の二値判定を返す。
 *
 * 通過条件:
 * - Lint: severity===2 (error) が 0 件
 * - AST: parseError なし & 必須要件すべて充足 & 禁止違反 0 件
 * - Tests: 全テストが passed
 */

import type {
  ASTResult,
  EvaluationResult,
  LintViolation,
  TestResult,
  TestKind,
} from "../types.js";

export function evaluate(
  testKind: TestKind,
  testResults: TestResult[],
  lintViolations: LintViolation[],
  astResult: ASTResult,
): EvaluationResult {
  const lintPassed = lintViolations.every((v) => v.severity !== 2);

  const astPassed =
    !astResult.parseError &&
    astResult.required.every((r) => r.found) &&
    astResult.forbidden.length === 0;

  const testsPassed = (() => {
    switch (testKind) {
      case "stdout":
      case "function":
        return testResults.length > 0 && testResults.every((t) => t.passed);
      default: {
        const exhaustive: never = testKind;
        return exhaustive;
      }
    }
  })();

  return {
    cleared: lintPassed && astPassed && testsPassed,
    checks: { lintPassed, astPassed, testsPassed },
  };
}
