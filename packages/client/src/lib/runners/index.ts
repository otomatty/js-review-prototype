/**
 * 言語別ランナの軽量ディスパッチャ (#109 / #100 の暫定実装)。
 *
 * 真の `CodeRunner` インタフェース抽出は #105 で行う。 ここでは `assignment.language` を見て
 * 既存の JS ランナ (Edge function / browser QuickJS) と新規 SQL ランナを振り分けるだけ。
 */

import type {
  Assignment,
  ASTResult,
  EvaluationResult,
  LintViolation,
  RunTestsResponse,
  SqlTestCase,
} from "@jsreview/shared/types";
import {
  getEntryFile,
  getLanguage,
} from "@jsreview/shared/assignment-helpers";
import { evaluate } from "@jsreview/shared/grading/evaluate";

import { runTests } from "../api.js";

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
 * 採点を実行する。 SQL 課題なら sql-runner を、 それ以外は既存の JS パス (api.runTests) を使う。
 * Lint / AST の合算は呼び出し側 (useGradeRunner) で行う。
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
  const code = args.files[entry];

  if (language === "sql") {
    const { runSqlTests } = await import("./sql-runner.js");
    const response = await runSqlTests(
      code,
      args.assignment.tests as SqlTestCase[],
      args.assignment.sqlSeed,
    );
    // SQL 課題では Lint / AST は対象外。 採点は tests のみで判定する。
    const evaluation = evaluate(
      args.assignment.testKind,
      response.results,
      [], // empty lint
      { required: [], forbidden: [] }, // empty AST
    );
    return { response, evaluation };
  }

  // JavaScript 既存パス: ブラウザ QuickJS への runTests 経由。
  const response = await runTests({
    code,
    testKind: args.assignment.testKind,
    tests: args.assignment.tests,
    entryPoints: args.assignment.entryPoints,
  });
  const evaluation = evaluate(
    args.assignment.testKind,
    response.results,
    args.lint,
    args.ast,
  );
  return { response, evaluation };
}
