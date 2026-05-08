/**
 * 採点回帰テスト。
 *
 * 問題定義 (`@jsreview/shared` の Assignment) が以下を満たすかを CI で検証する:
 *
 *  1. 全 Assignment の `tests` の重み合計が 100 (ScoreWeights.test との関係はない、テスト合計の前提)
 *  2. ID に重複がない (定義モジュール側でも検出されるが念のため)
 *  3. `starterCode` が AST forbidden パターンを違反していない
 *  4. `solution` が定義されているなら、それは満点 (100) を取る
 *  5. `badSolutions[*].code` が定義されているなら、 `expectMaxScore` (デフォルト 99) 以下になる
 *
 * 4 / 5 の評価は本番 runner と同じ評価式組み立てを使う (`test/runner.ts` 参照)。
 */
import { describe, expect, it } from "bun:test";

import { analyzeAst } from "../src/grading/ast.js";
import { assignments } from "../src/problems/index.js";

import { gradeCode } from "./grade.js";

describe("problems metadata", () => {
  it("ID は重複していない", () => {
    const ids = new Set<string>();
    for (const a of assignments) {
      expect(ids.has(a.id)).toBe(false);
      ids.add(a.id);
    }
  });

  it("各 Assignment のテスト weight 合計は 100", () => {
    for (const a of assignments) {
      const total = a.tests.reduce((s, t) => s + t.weight, 0);
      expect(total, `assignment "${a.id}" weight sum`).toBe(100);
    }
  });

  it("starterCode は AST forbidden パターンを踏んでいない", () => {
    for (const a of assignments) {
      const result = analyzeAst(a.starterCode, a.ast);
      expect(
        result.parseError,
        `assignment "${a.id}" starterCode parse error: ${result.parseError ?? ""}`,
      ).toBeUndefined();
      expect(
        result.forbidden.map((v) => v.label),
        `assignment "${a.id}" starterCode forbidden`,
      ).toEqual([]);
    }
  });
});

describe("solutions", () => {
  const withSolution = assignments.filter((a) => a.solution !== undefined);
  const missing = assignments.filter((a) => a.solution === undefined).map((a) => a.id);

  it("全課題に solution が付与されている", () => {
    expect(missing, `solution 未定義の課題: ${missing.join(", ") || "(なし)"}`).toEqual([]);
    expect(withSolution.length).toBe(assignments.length);
  });

  for (const a of withSolution) {
    it(`${a.id}: solution が満点 (100) を取る`, () => {
      const report = gradeCode(a, a.solution!);
      const detail = JSON.stringify(
        {
          id: a.id,
          score: report.score,
          failedTests: report.failedTests,
          missingRequired: report.missingRequired,
          forbiddenViolations: report.forbiddenViolations,
          lintViolations: report.lintViolations,
          parseError: report.parseError,
        },
        null,
        2,
      );
      expect(report.score.total, `assignment "${a.id}" did not score 100:\n${detail}`).toBe(100);
    });
  }
});

describe("badSolutions", () => {
  const withBad = assignments.flatMap((a) =>
    (a.badSolutions ?? []).map((b, idx) => ({ assignment: a, bad: b, idx })),
  );

  for (const { assignment, bad, idx } of withBad) {
    it(`${assignment.id} bad[${idx}] (${bad.description}) は減点される`, () => {
      const report = gradeCode(assignment, bad.code);
      const max = bad.expectMaxScore ?? 99;
      expect(
        report.score.total,
        `assignment "${assignment.id}" bad[${idx}] (${bad.description}) scored ${report.score.total} (expected ≤ ${max})`,
      ).toBeLessThanOrEqual(max);
    });
  }
});
