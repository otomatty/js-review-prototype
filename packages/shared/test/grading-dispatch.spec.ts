/**
 * 静的解析ディスパッチャ (`grading/index.ts`) の単体テスト (#104)。
 *
 *  1. JS は従来通り Babel で解析される (var を禁止すれば違反になる)
 *  2. 非 JS (例: SQL) は SQL テキストを Babel に流さず、 空結果を返す
 *  3. 空結果は `evaluate()` で `astPassed=true` になり、 cleared を阻害しない
 */
import { describe, expect, it } from "bun:test";

import { analyzeAst } from "../src/grading/index.js";
import { evaluate } from "../src/grading/evaluate.js";

describe("analyzeAst dispatcher (#104)", () => {
  it("JS: var 宣言が forbidden に登録されていれば違反として検出される", () => {
    const result = analyzeAst("javascript", "var x = 1;", {
      forbidden: [{ kind: "var" }],
    });
    expect(result.parseError).toBeUndefined();
    expect(result.forbidden.length).toBe(1);
    expect(result.forbidden[0].label).toBe("var 宣言");
  });

  it("JS: required が満たされていれば found=true", () => {
    const result = analyzeAst("javascript", "for (let i = 0; i < 3; i++) {}", {
      required: [{ kind: "node", nodeType: "ForStatement" }],
    });
    expect(result.required[0].found).toBe(true);
  });

  it("SQL: SQL テキストでもパースエラーにならず空結果を返す", () => {
    const result = analyzeAst(
      "sql",
      "SELECT id, name FROM users WHERE active = 1;",
      { forbidden: [{ kind: "var" }], required: [{ kind: "console-log" }] },
    );
    expect(result.parseError).toBeUndefined();
    expect(result.required).toEqual([]);
    expect(result.forbidden).toEqual([]);
  });

  it("Python / PHP / Vitest / ESLint: いずれも空結果を返す", () => {
    for (const language of ["python", "php", "vitest", "eslint"] as const) {
      const result = analyzeAst(language, "anything-goes", {
        forbidden: [{ kind: "var" }],
      });
      expect(result.required).toEqual([]);
      expect(result.forbidden).toEqual([]);
      expect(result.parseError).toBeUndefined();
    }
  });

  it("空結果は evaluate() で astPassed=true となり cleared を阻害しない", () => {
    const sqlResult = analyzeAst("sql", "SELECT 1;", {
      forbidden: [{ kind: "var" }],
    });
    const evaluation = evaluate(
      "sql",
      [{ name: "test", passed: true }],
      [],
      sqlResult,
    );
    expect(evaluation.checks.astPassed).toBe(true);
    expect(evaluation.checks.lintPassed).toBe(true);
    expect(evaluation.cleared).toBe(true);
  });
});
