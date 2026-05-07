/**
 * テスト実行ロジック。
 *
 * - 受講者コードを isolated-vm 内で評価 (信頼できないコードのサンドボックス実行)
 * - 各テストケースを並列実行 (Promise.all)
 * - 各テストは1秒のタイムアウト
 *
 * 評価方式:
 *   1. Isolate に context を作る
 *   2. 受講者コードを実行して関数定義を得る (例: function sum(...) {...})
 *   3. テスト式を実行する (例: `sum([1,2,3]) === 6`)
 *   4. テスト式が truthy なら PASS、エラーなら FAIL (errorに格納)
 */

import ivm from "isolated-vm";

import type { TestCase, TestResult } from "./types.js";
import { IsolatePool } from "./isolate-pool.js";

const PER_TEST_TIMEOUT_MS = 1000;

export class TestRunner {
  private readonly pool: IsolatePool;

  constructor(pool: IsolatePool) {
    this.pool = pool;
  }

  async runAll(
    code: string,
    tests: TestCase[],
    entryPoints: string[],
  ): Promise<TestResult[]> {
    return Promise.all(
      tests.map((test) => this.runOne(code, test, entryPoints)),
    );
  }

  private async runOne(
    code: string,
    test: TestCase,
    entryPoints: string[],
  ): Promise<TestResult> {
    const isolate = await this.pool.acquire();
    try {
      const context = await isolate.createContext();

      // entryPoints で指定された関数群を __scope に集める。
      // テスト式は `with(__scope)` 内で評価することで、これらの関数を識別子で直接呼べる。
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

      let script: ivm.Script;
      try {
        script = await isolate.compileScript(source);
      } catch (e) {
        return {
          name: test.name,
          weight: test.weight,
          passed: false,
          error: `COMPILE_ERROR: ${formatErr(e)}`,
        };
      }

      let result: unknown;
      try {
        result = await script.run(context, {
          timeout: PER_TEST_TIMEOUT_MS,
          // 結果値を JS 側に戻すために copy を有効化
          copy: true,
        });
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
    } finally {
      this.pool.release(isolate);
    }
  }
}

function formatErr(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
