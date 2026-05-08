/**
 * 採点回帰テスト専用の軽量 runner。
 *
 * サーバ本番の runner (`packages/server/src/runner.ts`) は isolated-vm を使うが、
 * ネイティブビルドが重く、CI では Node の `vm` モジュールで十分。
 * 評価式の組み立て方 (entryPoints を `__jsreview_scope__` に集めて `with` で参照可能にする) は
 * 本番 runner と同じシェイプを保つことで、テストカバレッジが本番挙動を反映する。
 *
 * 非同期対応: テスト式が Promise を返した場合は await して resolve 値を判定する。
 * Promise チェーンが解決しないケースに備えて、全体タイムアウトを設けている。
 */

import vm from "node:vm";

import type { TestCase, TestResult } from "../src/types.js";
import { isThenable, withWallTimeout } from "../src/util/timeout.js";

const PER_TEST_TIMEOUT_MS = 1000;
const PER_TEST_WALL_TIMEOUT_MS = 3000;

export async function runTests(
  code: string,
  tests: TestCase[],
  entryPoints: string[],
): Promise<TestResult[]> {
  return Promise.all(tests.map((test) => runOne(code, test, entryPoints)));
}

async function runOne(
  code: string,
  test: TestCase,
  entryPoints: string[],
): Promise<TestResult> {
  const exposeStmts = entryPoints
    .map((n) => `try { __jsreview_scope__.${n} = ${n}; } catch (_e) {}`)
    .join("\n");

  const source = `
${code}
var __jsreview_scope__ = {};
${exposeStmts}
(function (__s) {
  with (__s) {
    return (${test.code});
  }
})(__jsreview_scope__);
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

  if (isThenable(result)) {
    try {
      result = await withWallTimeout(
        Promise.resolve(result),
        PER_TEST_WALL_TIMEOUT_MS,
      );
    } catch (e) {
      const msg = formatErr(e);
      const error = msg === "TIMEOUT" ? "TIMEOUT" : msg;
      return {
        name: test.name,
        weight: test.weight,
        passed: false,
        error,
      };
    }
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
