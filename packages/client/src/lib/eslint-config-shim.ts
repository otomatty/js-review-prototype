/**
 * ESLint 設定抽出用シム (#111)。
 *
 * 学習者の `eslint.config.js` を QuickJS Worker 内で安全に評価し、 `module.exports` を
 * `__JSREVIEW_ESLINT_CONFIG_REPORT__:<nonce>:<json>` 形式の 1 行で stdout に出すための
 * コードを生成する。 vitest-shim と同じ「QuickJS Worker + nonce 付きレポート行」 パターン。
 *
 * Worker 隔離のメリット (P1 レビュー対応):
 * - `while(true)` 等の無限ループはランナーの 3s 壁時間制限で TIMEOUT 扱いになり UI を凍らせない
 * - ホストの window / fetch / DOM などへのアクセスが完全に断たれる
 * - JSON シリアライズで通信するため、 関数や Symbol を含む config は明示的に reject できる
 */

const ESLINT_CONFIG_REPORT_PREFIX = "__JSREVIEW_ESLINT_CONFIG_REPORT__:";

export { ESLINT_CONFIG_REPORT_PREFIX };

export interface ExtractionPayload {
  ok: boolean;
  /** ok=true のとき。 学習者の module.exports をシリアライズしたもの。 */
  exports?: unknown;
  /** ok=false のとき。 評価時例外 / シリアライズ失敗の人読み文言。 */
  error?: string;
}

/**
 * Math.random ベースの簡易 nonce。 vitest-shim と同じく偽レポート行の混入を防ぐ用途。
 * QuickJS Worker 内で評価される文字列リテラルを構築する側で nonce を埋め込む。
 */
function generateNonce(): string {
  const cryptoApi: { getRandomValues?: (a: Uint8Array) => Uint8Array } | undefined =
    typeof crypto !== "undefined"
      ? (crypto as { getRandomValues?: (a: Uint8Array) => Uint8Array })
      : undefined;
  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    const arr = new Uint8Array(16);
    cryptoApi.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
}

/**
 * QuickJS に渡す抽出スクリプトを生成する。
 *
 * - 学習者コードは内側の IIFE の `module` / `exports` 仮引数として渡され、 IIFE 内の
 *   `let module = ...` 等で再宣言してもアウター scope に漏れない。
 * - 評価前に `console.log` を closure に捕捉してから user code を実行する。 学習者が
 *   `console.log = ...` で上書きしてもレポート行はオリジナル参照を使うので確実に届く。
 */
export function buildEslintConfigExtractionCode(userCode: string): {
  code: string;
  nonce: string;
} {
  const nonce = generateNonce();
  const fullPrefix = `${ESLINT_CONFIG_REPORT_PREFIX}${nonce}:`;
  const escapedPrefix = JSON.stringify(fullPrefix);
  // 学習者コードは内側 IIFE の本体として埋め込む (テンプレートリテラル内の `${...}` は
  // QuickJS で評価される側に渡すため、 本ファイルでは literal string concatenation を使う)。
  const code = `;(function () {
  var __log = console.log;
  var __fullPrefix = ${escapedPrefix};
  var __myModule = { exports: {} };
  var __captureError = null;
  try {
    (function (module, exports) {
${userCode}
    })(__myModule, __myModule.exports);
  } catch (e) {
    __captureError = (e && (e.message || String(e))) || "(unknown error)";
  }
  var __payload;
  if (__captureError !== null) {
    __payload = JSON.stringify({ ok: false, error: __captureError });
  } else {
    try {
      __payload = JSON.stringify({ ok: true, exports: __myModule.exports });
    } catch (e) {
      __payload = JSON.stringify({
        ok: false,
        error: "config が JSON シリアライズ不能 (関数や循環参照を含んでいる可能性)",
      });
    }
  }
  __log(__fullPrefix + __payload);
})();
`;
  return { code, nonce };
}
