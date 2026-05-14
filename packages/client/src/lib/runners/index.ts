/**
 * 言語別ランナーのディスパッチャ (#105 / #100)。
 *
 * `getRunner(language)` は `CodeRunner` インタフェースを満たす言語別実装を返す。
 * 未実装言語 (Python / PHP / Vitest / ESLint) は placeholder ランナーが
 * 「未実装」 エラーを throw する設計で、 UI 側 (`useGradeRunner`) はそれを
 * `RUNNER_ERROR` メッセージとしてそのまま表示する。
 *
 * `runGrading` は採点呼び出し側 (`useGradeRunner`) 向けの薄いラッパで、
 * ランナーで実行した結果と手元の Lint / AST を合算して `evaluate()` を返す。
 */

import type {
  Assignment,
  ASTResult,
  EvaluationResult,
  Language,
  LintViolation,
  RunTestsResponse,
} from "@jsreview/shared/types";
import type { CodeRunner } from "@jsreview/shared/runner/types";
import {
  getEntryFile,
  getLanguage,
} from "@jsreview/shared/assignment-helpers";
import { evaluate } from "@jsreview/shared/grading/evaluate";

import { jsRunner } from "./js-runner.js";
import { sqlRunner } from "./sql-runner.js";
import { createPlaceholderRunner } from "./placeholder-runner.js";

/** 既存の placeholder インスタンスをキャッシュ (毎回新規生成しないため)。 */
const placeholderCache = new Map<Language, CodeRunner>();

export function getRunner(language: Language): CodeRunner {
  switch (language) {
    case "javascript":
      return jsRunner;
    case "sql":
      return sqlRunner;
    case "python":
    case "php":
    case "vitest":
    case "eslint": {
      const cached = placeholderCache.get(language);
      if (cached) {return cached;}
      const created = createPlaceholderRunner(language);
      placeholderCache.set(language, created);
      return created;
    }
    default: {
      const _exhaustive: never = language;
      void _exhaustive;
      throw new Error(`Unknown language: ${language as string}`);
    }
  }
}

interface RunArgs {
  files: Record<string, string>;
  assignment: Assignment;
  lint: LintViolation[];
  ast: ASTResult;
}

export interface DispatchResult {
  response: RunTestsResponse;
  evaluation: EvaluationResult;
}

/**
 * 採点を実行する。 言語に応じたランナーへ委譲し、 Lint / AST を含めた採点判定を返す。
 *
 * SQL 等の非 JS 課題では Lint / AST は採点対象から外す (UI 側でも空配列を渡してくる)。
 */
export async function runGrading(args: RunArgs): Promise<DispatchResult> {
  const language = getLanguage(args.assignment);
  const entry = getEntryFile(args.assignment);
  // entryFile が files に無いのは課題定義不整合 (entryFile が starterFiles のどの path にも該当しない 等)。
  // 無音で fallback すると採点が空コード扱いで通ってしまうので、 明示的にエラーにする (coderabbit 対応)。
  if (!Object.prototype.hasOwnProperty.call(args.files, entry)) {
    const known = Object.keys(args.files).join(", ");
    throw new Error(
      `entryFile "${entry}" not found in submitted files (known: ${known || "(none)"})`,
    );
  }

  const runner = getRunner(language);
  const response = await runner.run({
    files: args.files,
    entryFile: entry,
    tests: args.assignment.tests,
    testKind: args.assignment.testKind,
    mode: "test",
    entryPoints: args.assignment.entryPoints,
    sqlSeed: args.assignment.sqlSeed,
  });

  if (language === "javascript") {
    const evaluation = evaluate(
      args.assignment.testKind,
      response.results,
      args.lint,
      args.ast,
    );
    return { response, evaluation };
  }

  // 非 JS 課題 (SQL / Python / ...) では Lint / AST は採点対象外。 tests のみで判定する。
  const evaluation = evaluate(
    args.assignment.testKind,
    response.results,
    [],
    { required: [], forbidden: [] },
  );
  return { response, evaluation };
}
