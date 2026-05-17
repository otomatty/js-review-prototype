/**
 * 言語別ランナーのディスパッチャ (#105 / #100)。
 *
 * `getRunner(language)` は `CodeRunner` インタフェースを満たす言語別実装を返す。
 * 全 6 言語が実装済み: JavaScript (#105) / SQL (#109) / Python (#108) /
 * Vitest (#110) / ESLint (#111) / PHP (#112)。
 *
 * Vitest / ESLint / PHP ランナーは dynamic import で別 chunk 化し、 JS / SQL / Python
 * 学習者の初期ロードに影響しないようにしている (各 issue の受け入れ条件: dynamic import で別 chunk)。
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
import { pythonRunner } from "./python-runner.js";

/**
 * Vitest ランナーを dynamic import で遅延ロードする薄いラッパ (#110)。
 * 採点ボタンを押した瞬間に初めて `vitest-runner.ts` chunk が fetch される。
 * JS / SQL / Python 学習者には影響しない (chunk が読み込まれないため)。
 */
const vitestLazyRunner: CodeRunner = {
  language: "vitest",
  async run(input) {
    const mod = await import("./vitest-runner.js");
    return mod.vitestRunner.run(input);
  },
};

/**
 * ESLint 設定採点ランナーを dynamic import で遅延ロードする (#111)。
 * Vitest と同じく chunk 分離で、 ESLint 教材を選んだ瞬間に初めて fetch される。
 */
const eslintConfigLazyRunner: CodeRunner = {
  language: "eslint",
  async run(input) {
    const mod = await import("./eslint-config-runner.js");
    return mod.eslintConfigRunner.run(input);
  },
};

/**
 * PHP ランナーを dynamic import で遅延ロードする (#112)。
 * `php-runner.ts` 自体は小さいが、 実行時に CDN から php-wasm のローダと wasm
 * (~5MB+) を fetch する。 PHP 課題を開いた瞬間に初めて chunk + CDN ロードが走り、
 * JS / SQL / Python 学習者の初期ロードには影響しない (受け入れ条件)。
 */
const phpLazyRunner: CodeRunner = {
  language: "php",
  async run(input) {
    const mod = await import("./php-runner.js");
    return mod.phpRunner.run(input);
  },
};

export function getRunner(language: Language): CodeRunner {
  switch (language) {
    case "javascript":
      return jsRunner;
    case "sql":
      return sqlRunner;
    case "python":
      return pythonRunner;
    case "vitest":
      return vitestLazyRunner;
    case "eslint":
      return eslintConfigLazyRunner;
    case "php":
      return phpLazyRunner;
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
    mutation: args.assignment.mutation,
  });

  // 非 JS 課題 (SQL / Python / ...) では Lint / AST は採点対象外。 tests のみで判定する。
  const isJs = language === "javascript";
  const evaluation = evaluate(
    args.assignment.testKind,
    response.results,
    isJs ? args.lint : [],
    isJs ? args.ast : { required: [], forbidden: [] },
  );
  return { response, evaluation };
}
