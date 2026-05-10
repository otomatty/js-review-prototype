/**
 * 評価回帰テスト専用の軽量 runner。
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

import type { TestCase, TestKind, TestResult } from "../src/types.js";
import { isThenable, withWallTimeout } from "../src/util/timeout.js";

const PER_TEST_TIMEOUT_MS = 1000;
const PER_TEST_WALL_TIMEOUT_MS = 3000;

export async function runTests(
  code: string,
  tests: TestCase[],
  testKind: TestKind,
  entryPoints: string[],
): Promise<TestResult[]> {
  return Promise.all(
    tests.map((test) => runOne(code, test, testKind, entryPoints)),
  );
}

async function runOne(
  code: string,
  test: TestCase,
  testKind: TestKind,
  entryPoints: string[],
): Promise<TestResult> {
  if (testKind === "stdout") {
    if (!("expectedStdout" in test)) {
      return {
        name: test.name,
        passed: false,
        error: "INVALID_TEST_CASE: stdout tests require expectedStdout",
      };
    }
    return runStdoutTest(code, test.name, test.expectedStdout);
  }

  if (!("code" in test)) {
    return {
      name: test.name,
      passed: false,
      error: "INVALID_TEST_CASE: function tests require code",
    };
  }

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
        passed: false,
        error,
      };
    }
  }

  return {
    name: test.name,
    passed: Boolean(result),
  };
}

function runStdoutTest(
  code: string,
  name: string,
  expectedStdout: string,
): TestResult {
  const stdout: string[] = [];
  const context = vm.createContext({
    console: {
      log: (...args: unknown[]) => {
        stdout.push(args.map(formatConsoleArg).join(" "));
      },
    },
  });

  let script: vm.Script;
  try {
    script = new vm.Script(code);
  } catch (e) {
    return {
      name,
      passed: false,
      expectedStdout,
      error: `COMPILE_ERROR: ${formatErr(e)}`,
    };
  }

  try {
    script.runInContext(context, { timeout: PER_TEST_TIMEOUT_MS });
  } catch (e) {
    const msg = formatErr(e);
    return {
      name,
      passed: false,
      stdout: normalizeStdout(stdout.join("\n")),
      expectedStdout: normalizeStdout(expectedStdout),
      error: msg.includes("Script execution timed out") ? "TIMEOUT" : msg,
    };
  }

  const actual = normalizeStdout(stdout.join("\n"));
  const expected = normalizeStdout(expectedStdout);
  return {
    name,
    passed: actual === expected,
    stdout: actual,
    expectedStdout: expected,
  };
}

function formatConsoleArg(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value) ?? Object.prototype.toString.call(value);
    } catch {
      return Object.prototype.toString.call(value);
    }
  }
  if (typeof value === "function") {
    return `[function ${value.name || "anonymous"}]`;
  }
  if (typeof value === "string") {
    return value;
  }
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  ) {
    return String(value);
  }
  return "undefined";
}

function normalizeStdout(output: string): string {
  return output.replace(/\r\n/g, "\n").replace(/\n+$/g, "");
}

function formatErr(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  if (typeof e === "object" && e !== null) {
    return JSON.stringify(e) ?? Object.prototype.toString.call(e);
  }
  return String(e);
}
