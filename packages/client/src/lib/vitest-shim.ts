/**
 * Vitest 風テスト API のシム (#110)。
 *
 * QuickJS ランタイム内に注入される文字列として export する。
 * Vitest / Jest 互換のサブセットを提供し、 学習者は `describe` / `it` / `expect` で
 * テストを書ける。 シムは `__JSREVIEW_VITEST_RESULTS__` (TestRecord[]) に
 * 各 `it` の結果を蓄積し、 ランナー側で `JSON.stringify` してマーカー付きで出力する。
 *
 * 提供 API:
 * - `describe(name, fn)` … その場で fn() を実行する (グルーピングのみ)。
 * - `it(name, fn)` / `test(name, fn)` … fn を try/catch で実行し結果を records へ push。
 * - `expect(actual)`: `.toBe`, `.toEqual`, `.toStrictEqual`, `.toBeTruthy`, `.toBeFalsy`,
 *   `.toBeNull`, `.toBeUndefined`, `.toBeDefined`, `.toBeCloseTo`,
 *   `.toBeGreaterThan/.toBeLessThan/.toBeGreaterThanOrEqual/.toBeLessThanOrEqual`,
 *   `.toContain`, `.toHaveLength`, `.toThrow`, `.not.<同上>`
 *
 * 非対応 (v1):
 * - async テスト (戻り値が Promise の `it`) は明示エラー扱い ("async tests not supported")。
 *   QuickJS の `runFreeRun` がプロミス解決を待たないため、 確定的な結果が得られないため。
 * - `beforeEach` / `afterEach` / モック (`vi.fn()`) / snapshot。 学習目的では未提供。
 */

export interface VitestTestRecord {
  name: string;
  passed: boolean;
  /** fail / async / 内部例外の人読み文言。 passed=true なら省略。 */
  error?: string;
}

/** 結果配列を読み出すための QuickJS グローバル名。 ランナー側で同じ識別子を使う。 */
export const VITEST_RESULTS_GLOBAL = "__JSREVIEW_VITEST_RESULTS__";

/** stdout 経由で結果を取り出すためのマーカー。 ランナー側で同じ識別子を使う。 */
export const VITEST_REPORT_PREFIX = "__JSREVIEW_VITEST_REPORT__:";

/**
 * QuickJS に注入するシム本体。
 *
 * 文字列リテラルとして埋め込むため、 内部から `VITEST_RESULTS_GLOBAL` 等の
 * 外側定数を参照したくても TypeScript の置換が効かない。 同期するために
 * builder 関数で組み立てて、 1 箇所だけで定数を差し込む。
 */
function buildVitestShim(): string {
  return `
;(function () {
  if (globalThis.${VITEST_RESULTS_GLOBAL}) { return; }
  const records = [];
  globalThis.${VITEST_RESULTS_GLOBAL} = records;

  globalThis.describe = function (name, fn) {
    if (typeof fn !== "function") {
      records.push({ name: String(name), passed: false, error: "describe: callback is not a function" });
      return;
    }
    try {
      fn();
    } catch (e) {
      records.push({ name: String(name) + " (describe)", passed: false, error: errMsg(e) });
    }
  };

  function runIt(name, fn) {
    const label = String(name);
    if (typeof fn !== "function") {
      records.push({ name: label, passed: false, error: "it: callback is not a function" });
      return;
    }
    try {
      const out = fn();
      if (out && typeof out.then === "function") {
        // QuickJS の runFreeRun はトップレベル await や Promise の解決を待たないため、
        // async テストの結果は確定的に取れない。 v1 では明示エラー扱い。
        records.push({ name: label, passed: false, error: "async tests are not supported in this runner" });
        return;
      }
      records.push({ name: label, passed: true });
    } catch (e) {
      records.push({ name: label, passed: false, error: errMsg(e) });
    }
  }
  globalThis.it = runIt;
  globalThis.test = runIt;

  function errMsg(e) {
    if (e && typeof e === "object" && "message" in e) { return String(e.message); }
    return String(e);
  }

  function fmt(v) {
    if (v === undefined) { return "undefined"; }
    if (v === null) { return "null"; }
    if (typeof v === "function") { return "[Function " + (v.name || "anonymous") + "]"; }
    if (typeof v === "string") { return JSON.stringify(v); }
    if (typeof v === "object") {
      try { return JSON.stringify(v); } catch (_) { return String(v); }
    }
    return String(v);
  }

  function deepEqual(a, b) {
    if (Object.is(a, b)) { return true; }
    if (typeof a !== typeof b) { return false; }
    if (a === null || b === null) { return a === b; }
    if (typeof a !== "object") { return false; }
    if (Array.isArray(a) !== Array.isArray(b)) { return false; }
    if (Array.isArray(a)) {
      if (a.length !== b.length) { return false; }
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) { return false; }
      }
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) { return false; }
    for (const k of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) { return false; }
      if (!deepEqual(a[k], b[k])) { return false; }
    }
    return true;
  }

  function buildMatchers(actual, negate) {
    function assert(cond, msg) {
      const ok = negate ? !cond : cond;
      if (!ok) { throw new Error((negate ? "not." : "") + msg); }
    }
    const m = {
      toBe: function (expected) {
        assert(Object.is(actual, expected), "toBe: expected " + fmt(expected) + " but got " + fmt(actual));
      },
      toEqual: function (expected) {
        assert(deepEqual(actual, expected), "toEqual: expected " + fmt(expected) + " but got " + fmt(actual));
      },
      toStrictEqual: function (expected) {
        assert(deepEqual(actual, expected), "toStrictEqual: expected " + fmt(expected) + " but got " + fmt(actual));
      },
      toBeTruthy: function () {
        assert(Boolean(actual), "toBeTruthy: got " + fmt(actual));
      },
      toBeFalsy: function () {
        assert(!actual, "toBeFalsy: got " + fmt(actual));
      },
      toBeNull: function () {
        assert(actual === null, "toBeNull: got " + fmt(actual));
      },
      toBeUndefined: function () {
        assert(actual === undefined, "toBeUndefined: got " + fmt(actual));
      },
      toBeDefined: function () {
        assert(actual !== undefined, "toBeDefined: got undefined");
      },
      toBeNaN: function () {
        assert(typeof actual === "number" && actual !== actual, "toBeNaN: got " + fmt(actual));
      },
      toBeCloseTo: function (expected, decimals) {
        const d = decimals == null ? 2 : decimals;
        const ok = typeof actual === "number" && typeof expected === "number" &&
          Math.abs(actual - expected) < Math.pow(10, -d) / 2;
        assert(ok, "toBeCloseTo: expected close to " + fmt(expected) + " but got " + fmt(actual));
      },
      toBeGreaterThan: function (n) {
        assert(actual > n, "toBeGreaterThan: expected > " + fmt(n) + " but got " + fmt(actual));
      },
      toBeLessThan: function (n) {
        assert(actual < n, "toBeLessThan: expected < " + fmt(n) + " but got " + fmt(actual));
      },
      toBeGreaterThanOrEqual: function (n) {
        assert(actual >= n, "toBeGreaterThanOrEqual: expected >= " + fmt(n) + " but got " + fmt(actual));
      },
      toBeLessThanOrEqual: function (n) {
        assert(actual <= n, "toBeLessThanOrEqual: expected <= " + fmt(n) + " but got " + fmt(actual));
      },
      toContain: function (v) {
        let ok = false;
        if (typeof actual === "string") { ok = actual.indexOf(String(v)) >= 0; }
        else if (Array.isArray(actual)) {
          for (let i = 0; i < actual.length; i++) {
            if (Object.is(actual[i], v) || deepEqual(actual[i], v)) { ok = true; break; }
          }
        }
        assert(ok, "toContain: expected " + fmt(actual) + " to contain " + fmt(v));
      },
      toHaveLength: function (n) {
        const got = actual == null ? undefined : actual.length;
        assert(got === n, "toHaveLength: expected length " + fmt(n) + " but got " + fmt(got));
      },
      toThrow: function (matcher) {
        if (typeof actual !== "function") {
          // toThrow は actual 側が関数でないと比較不能。 .not でも同じく無効。
          throw new Error("toThrow: actual must be a function");
        }
        let threw = false; let err;
        try { actual(); } catch (e) { threw = true; err = e; }
        let matched = threw;
        if (threw && matcher !== undefined) {
          const msg = (err && err.message !== undefined) ? String(err.message) : String(err);
          if (typeof matcher === "string") { matched = msg.indexOf(matcher) >= 0; }
          else if (matcher instanceof RegExp) { matched = matcher.test(msg); }
          else { matched = false; }
        }
        assert(matched, matcher === undefined
          ? "toThrow: expected function to throw"
          : "toThrow: expected error matching " + fmt(matcher));
      },
    };
    return m;
  }

  globalThis.expect = function (actual) {
    const matchers = buildMatchers(actual, false);
    matchers.not = buildMatchers(actual, true);
    return matchers;
  };
})();
`;
}

export const VITEST_SHIM_SOURCE = buildVitestShim();

/**
 * シナリオごとの実行スクリプトを組み立てる (#110)。
 *
 * `${VITEST_SHIM_SOURCE}` でシムを注入 → 実装本体 (reference または mutant) →
 * 学習者のテストファイル → 末尾でレポート行を `console.log` する形。
 * QuickJS 側の `console.log` はワーカーが捕捉した stdout に流すため、
 * vitest ランナー側で `VITEST_REPORT_PREFIX` を含む行をパースすれば結果が取れる。
 */
export function buildScenarioCode(impl: string, userTest: string): string {
  // テスト末尾で結果を 1 行 JSON として出す。 マーカー付きで他の console.log と区別する。
  const reportLine = `console.log(${JSON.stringify(VITEST_REPORT_PREFIX)} + JSON.stringify(${VITEST_RESULTS_GLOBAL}));`;
  return `${VITEST_SHIM_SOURCE}\n${impl}\n${userTest}\n${reportLine}\n`;
}
