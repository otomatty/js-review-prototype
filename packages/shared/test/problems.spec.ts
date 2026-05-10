/**
 * 評価回帰テスト。
 *
 * 問題定義 (`@jsreview/shared` の Assignment) が以下を満たすかを CI で検証する:
 *
 *  1. ID に重複がない
 *  2. 既定スカフォールド (L2) が AST forbidden パターンを違反していない
 *  3. `solution` が定義されているなら、それは「全チェック通過 (cleared)」になる
 *  4. `badSolutions[*].code` が定義されているなら、何らかのチェックを失敗する (cleared にならない)
 *
 *  3 / 4 の評価は本番 runner と同じ評価式組み立てを使う (`test/runner.ts` 参照)。
 */
import { describe, expect, it } from "bun:test";

import { analyzeAst } from "../src/grading/ast.js";
import {
  getScaffoldCode,
  getStaticAnalysisSettings,
} from "../src/assignment-helpers.js";
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

  it("既定スカフォールド (L2) は AST forbidden パターンを踏んでいない", () => {
    for (const a of assignments) {
      const settings = getStaticAnalysisSettings(a);
      const result = analyzeAst(getScaffoldCode(a), settings.ast);
      expect(
        result.parseError,
        `assignment "${a.id}" L2 scaffold parse error: ${result.parseError ?? ""}`,
      ).toBeUndefined();
      expect(
        result.forbidden.map((v) => v.label),
        `assignment "${a.id}" L2 scaffold forbidden`,
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
    it(`${a.id}: solution は全チェックを通過する`, async () => {
      const report = await gradeCode(a, a.solution!);
      const detail = JSON.stringify(
        {
          id: a.id,
          checks: report.evaluation.checks,
          failedTests: report.failedTests,
          missingRequired: report.missingRequired,
          forbiddenViolations: report.forbiddenViolations,
          lintViolations: report.lintViolations,
          parseError: report.parseError,
        },
        null,
        2,
      );
      expect(
        report.evaluation.cleared,
        `assignment "${a.id}" did not clear:\n${detail}`,
      ).toBe(true);
    });
  }
});

describe("badSolutions", () => {
  const withBad = assignments.flatMap((a) =>
    (a.badSolutions ?? []).map((b, idx) => ({ assignment: a, bad: b, idx })),
  );

  for (const { assignment, bad, idx } of withBad) {
    it(`${assignment.id} bad[${idx}] (${bad.description}) はクリアにならない`, async () => {
      const report = await gradeCode(assignment, bad.code);
      const detail = JSON.stringify(
        {
          id: assignment.id,
          checks: report.evaluation.checks,
          failedTests: report.failedTests,
          missingRequired: report.missingRequired,
          forbiddenViolations: report.forbiddenViolations,
          lintViolations: report.lintViolations,
          parseError: report.parseError,
        },
        null,
        2,
      );
      expect(
        report.evaluation.cleared,
        `assignment "${assignment.id}" bad[${idx}] (${bad.description}) cleared unexpectedly:\n${detail}`,
      ).toBe(false);
    });
  }
});
