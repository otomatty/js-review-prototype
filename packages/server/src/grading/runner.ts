/**
 * テスト実行ロジック。
 *
 * - function 採点: 受講者コードを実行後、テスト式を truthy 判定する
 * - stdout 採点: console.log をフックし、標準出力を期待値と比較する
 */

import ivm from "isolated-vm";
import { withWallTimeout } from "@jsreview/shared/util/timeout";

import type { TestCase, TestKind, TestResult } from "../types.js";
import { IsolatePool } from "../isolate-pool.js";

const PER_TEST_TIMEOUT_MS = 1000;
/** Promise チェーンを許容する全体タイムアウト。 */
const PER_TEST_WALL_TIMEOUT_MS = 3000;

interface RunOptions {
  testKind: TestKind;
  entryPoints?: string[];
}

export class TestRunner {
  private readonly pool: IsolatePool;

  constructor(pool: IsolatePool) {
    this.pool = pool;
  }

  async runAll(
    code: string,
    tests: TestCase[],
    options: RunOptions,
  ): Promise<TestResult[]> {
    return Promise.all(tests.map((test) => this.runOne(code, test, options)));
  }

  private async runOne(
    code: string,
    test: TestCase,
    options: RunOptions,
  ): Promise<TestResult> {
    switch (options.testKind) {
      case "stdout":
        return this.runStdoutTest(code, test);
      case "function":
        return this.runFunctionTest(code, test, options.entryPoints ?? []);
      default: {
        const exhaustive: never = options.testKind;
        return exhaustive;
      }
    }
  }

  private async runStdoutTest(
    code: string,
    test: TestCase,
  ): Promise<TestResult> {
    if (test.expectedStdout === undefined) {
      return {
        name: test.name,
        passed: false,
        error: "INVALID_TEST_CASE: stdout tests require expectedStdout",
      };
    }
    const expectedStdout = test.expectedStdout;

    const isolate = await this.pool.acquire();
    const stdout: string[] = [];
    try {
      const context = await isolate.createContext();
      await context.global.set(
        "__jsreview_log__",
        new ivm.Reference((line: string) => {
          stdout.push(line);
        }),
      );

      let script: ivm.Script;
      try {
        script = await isolate.compileScript(`${consoleHookSource()}\n${code}`);
      } catch (e) {
        return {
          name: test.name,
          passed: false,
          expectedStdout,
          error: `COMPILE_ERROR: ${formatErr(e)}`,
        };
      }

      try {
        await withWallTimeout(
          script.run(context, {
            timeout: PER_TEST_TIMEOUT_MS,
            promise: true,
          }),
          PER_TEST_WALL_TIMEOUT_MS,
        );
      } catch (e) {
        const msg = formatErr(e);
        return {
          name: test.name,
          passed: false,
          stdout: normalizeStdout(stdout.join("\n")),
          expectedStdout: normalizeStdout(expectedStdout),
          error:
            msg.includes("Script execution timed out") || msg === "TIMEOUT"
              ? "TIMEOUT"
              : msg,
        };
      }

      const actual = normalizeStdout(stdout.join("\n"));
      const expected = normalizeStdout(expectedStdout);
      return {
        name: test.name,
        passed: actual === expected,
        stdout: actual,
        expectedStdout: expected,
      };
    } finally {
      this.pool.release(isolate);
    }
  }

  private async runFunctionTest(
    code: string,
    test: TestCase,
    entryPoints: string[],
  ): Promise<TestResult> {
    if (!("code" in test)) {
      return {
        name: test.name,
        passed: false,
        error: "INVALID_TEST_CASE: function tests require code",
      };
    }

    const isolate = await this.pool.acquire();
    try {
      const context = await isolate.createContext();

      // entryPoints で指定された関数群を __jsreview_scope__ に集める。
      // テスト式は `with(__jsreview_scope__)` 内で評価することで、これらの関数を識別子で直接呼べる。
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

      let script: ivm.Script;
      try {
        script = await isolate.compileScript(source);
      } catch (e) {
        return {
          name: test.name,
          passed: false,
          error: `COMPILE_ERROR: ${formatErr(e)}`,
        };
      }

      let result: unknown;
      try {
        result = await withWallTimeout(
          script.run(context, {
            // 同期実行のタイムアウト (Promise の解決時間は含まない)
            timeout: PER_TEST_TIMEOUT_MS,
            // 結果値を JS 側に戻すために copy を有効化
            copy: true,
            // テスト式が Promise を返した場合、isolate 内で解決してから値を返す
            promise: true,
          }),
          PER_TEST_WALL_TIMEOUT_MS,
        );
      } catch (e) {
        const msg = formatErr(e);
        const error =
          msg.includes("Script execution timed out") || msg === "TIMEOUT"
            ? "TIMEOUT"
            : msg;
        return {
          name: test.name,
          passed: false,
          error,
        };
      }

      return {
        name: test.name,
        passed: Boolean(result),
      };
    } finally {
      this.pool.release(isolate);
    }
  }
}

function consoleHookSource(): string {
  return `
    function __jsreview_format_console_arg__(value) {
      if (value === undefined) return "undefined";
      if (value === null) return "null";
      if (typeof value === "object") {
        try {
          return JSON.stringify(value);
        } catch (_e) {
          return String(value);
        }
      }
      return String(value);
    }

    globalThis.console = {
      log: function (...args) {
        const line = args.map(__jsreview_format_console_arg__).join(" ");
        __jsreview_log__.applyIgnored(undefined, [line], {
          arguments: { copy: true }
        });
      }
    };
  `;
}

function normalizeStdout(output: string): string {
  return output.replace(/\r\n/g, "\n").replace(/\n+$/g, "");
}

function formatErr(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
