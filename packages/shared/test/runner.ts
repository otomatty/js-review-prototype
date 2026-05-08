/**
 * 採点回帰テスト専用の軽量 runner。
 *
 * サーバ本番の runner (`packages/server/src/runner.ts`) は isolated-vm を使うが、
 * ネイティブビルドが重く、CI では Node の `vm` モジュールで十分。
 * 評価式の組み立て方 (entryPoints を `__scope` に集めて `with` で参照可能にする) は
 * 本番 runner と同じシェイプを保つことで、テストカバレッジが本番挙動を反映する。
 */

import vm from "node:vm";

import type { TestCase, TestResult } from "../src/types.js";

const PER_TEST_TIMEOUT_MS = 1000;

export function runTests(
  code: string,
  tests: TestCase[],
  entryPoints: string[],
): TestResult[] {
  return tests.map((test) => runOne(code, test, entryPoints));
}

function runOne(
  code: string,
  test: TestCase,
  entryPoints: string[],
): TestResult {
  const exposeStmts = entryPoints
    .map((n) => `try { __scope.${n} = ${n}; } catch (_e) {}`)
    .join("\n");

  const source = `
${code}
var __scope = {};
${exposeStmts}
(function (__s) {
  with (__s) {
    return (${test.code});
  }
})(__scope);
`;

  let script: vm.Script;
  try {
    script = new vm.Script(source);
  } catch (e) {
    return {
      name: test.name,
      weight: test.weight,
      passed: false,
      error: `COMPILE_ERROR: ${formatErr(e)}`,
    };
  }

  const context = vm.createContext({});
  let result: unknown;
  try {
    result = script.runInContext(context, { timeout: PER_TEST_TIMEOUT_MS });
  } catch (e) {
    const msg = formatErr(e);
    const error = msg.includes("Script execution timed out") ? "TIMEOUT" : msg;
    return {
      name: test.name,
      weight: test.weight,
      passed: false,
      error,
    };
  }

  return {
    name: test.name,
    weight: test.weight,
    passed: Boolean(result),
  };
}

function formatErr(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
