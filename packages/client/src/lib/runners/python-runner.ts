/**
 * Python 採点ランナ (Pyodide / WebAssembly, ブラウザ完結) (#108)。
 *
 * - Pyodide は dynamic import + memoize で初回のみロード (~10MB 超)。
 *   JS / SQL 学習者には一切影響しない (Python 課題を開かない限り fetch されない)。
 * - 実体の wasm / stdlib は固定バージョンの jsDelivr CDN から取得する (再現性確保)。
 *   CDN URL は npm パッケージの `version` を参照して必ずローダ JS と一致させる。
 * - `RunInput.files` を Pyodide の FS (`/home/pyodide/` 配下) に書き込んでから
 *   `entryFile` を実行する (将来の多ファイル課題でも `import` が解決できる)。
 * - 各テスト毎に fresh な globals dict を渡し、 前のテストの状態が漏れないようにする。
 * - stdout / stderr は `setStdout` / `setStderr` の `batched` フックで捕捉する。
 *
 * TIMEOUT の限界:
 *   `Promise.race` は外側 Promise を解決するだけで、 Python 実行を実際に停止できない。
 *   タイムアウト後の Pyodide はバックグラウンドで動き続け、 後続テスト結果は呼び出し側で破棄される
 *   (ランナー内では「タイムアウト発生後はそれ以降のテストも TIMEOUT 扱いに短絡」 する)。
 *   真の中断には Web Worker 化が必要だが本 issue (#108) の scope 外 (#100 後続で検討)。
 */

import type {
  CodeRunner,
  RunInput,
  RunOutput,
} from "@jsreview/shared/runner/types";
import type {
  FunctionTestCase,
  StdoutTestCase,
  TestCase,
  TestResult,
} from "@jsreview/shared/types";

import { memoizePromiseFactory } from "quickjs-emscripten-core";

const TIMEOUT_MS = 10_000;
const FUNCTION_OK_MARKER = "__JSREVIEW_PY_TEST_OK__";
const FUNCTION_FAIL_MARKER = "__JSREVIEW_PY_TEST_FAIL__";
/** Pyodide が `loadPyodide` 実行時に既定で使う HOME (`env.HOME` 未指定時)。 */
const PY_HOME = "/home/pyodide";

/**
 * `run()` を直列化するためのモジュールスコープロック。
 * Pyodide はシングルトン、 `setStdout` / `setStderr` はインスタンスグローバルなので、
 * 並行 `run()` を許すと stdout 捕捉が混線する (採点と freerun の重なり等)。
 * UI 側は spinner で重なりを抑止しているが、 ランナー実装としても安全側に倒す。
 */
let runLock: Promise<void> = Promise.resolve();

async function withRunLock<T>(fn: () => Promise<T>): Promise<T> {
  const prev = runLock;
  let release!: () => void;
  runLock = new Promise<void>((resolve) => {
    release = resolve;
  });
  try {
    await prev;
    return await fn();
  } finally {
    release();
  }
}

/** 前回 `run()` で FS に書き込んだ仮想ワークスペース相対 path 群。 stale 検出に使う。 */
const writtenPaths = new Set<string>();

interface PyProxyLike {
  destroy(): void;
}

interface PyodideAPI {
  readonly version: string;
  runPython(code: string): unknown;
  runPythonAsync(
    code: string,
    options?: { globals?: PyProxyLike; filename?: string },
  ): Promise<unknown>;
  setStdout(options: { batched?: (s: string) => void }): void;
  setStderr(options: { batched?: (s: string) => void }): void;
  FS: {
    writeFile(
      path: string,
      data: string,
      opts?: { encoding?: string },
    ): void;
    mkdirTree(path: string): void;
    unlink(path: string): void;
  };
}

/**
 * Pyodide ローダの dynamic import + memoize。
 * 1 回目: ~50KB のローダ JS を fetch (vendor-pyodide chunk) → CDN から wasm/stdlib をロード (~10MB)。
 * 2 回目以降: memoize 済 Promise を即返す (再 fetch ゼロ)。
 */
const getPyodide = memoizePromiseFactory(async (): Promise<PyodideAPI> => {
  const mod = (await import("pyodide")) as unknown as {
    loadPyodide: (opts?: {
      indexURL?: string;
    }) => Promise<PyodideAPI>;
    version: string;
  };
  // CDN URL は npm 側のローダ JS と必ず同じバージョンを指す。
  // バージョン不一致は Pyodide 起動時に "build hash" mismatch エラーで弾かれるため、
  // ハードコード ではなく `mod.version` を参照する。
  const indexURL = `https://cdn.jsdelivr.net/pyodide/v${mod.version}/full/`;
  const pyodide = await mod.loadPyodide({ indexURL });
  // FS のワークスペースディレクトリは HOME 既定 (`/home/pyodide`) があれば不要だが、
  // 将来 HOME を変える可能性に備えて mkdirTree を明示。 既存ディレクトリは no-op。
  pyodide.FS.mkdirTree(PY_HOME);
  // sys.path に HOME を追加し、 後段でユーザー由来モジュールを掃除するための
  // 「初期 sys.modules スナップショット」 と reset 関数を仕込む。
  // - スナップショット (`_jsreview_initial_modules`) は Pyodide 起動直後の標準ライブラリ等を含む。
  // - `_jsreview_reset_modules()` を各テスト前に呼び、 学習者コードが import した
  //   モジュールだけを sys.modules から取り除く (順序依存テストの再現を防ぐ)。
  pyodide.runPython(
    [
      `import sys`,
      `_PY_HOME = ${JSON.stringify(PY_HOME)}`,
      `if _PY_HOME not in sys.path:`,
      `    sys.path.insert(0, _PY_HOME)`,
      `_jsreview_initial_modules = frozenset(sys.modules.keys())`,
      `def _jsreview_reset_modules():`,
      `    for k in [m for m in sys.modules if m not in _jsreview_initial_modules]:`,
      `        del sys.modules[k]`,
    ].join("\n"),
  );
  return pyodide;
});

export const pythonRunner: CodeRunner = {
  language: "python",
  async run(input: RunInput): Promise<RunOutput> {
    // setStdout / setStderr は Pyodide インスタンスに対してグローバルで、 ランナーは
    // シングルトンのため、 複数の `run()` 呼び出しが重なると stdout 捕捉が混線する。
    // モジュールスコープのロックで `run()` 全体を直列化する (UI 側でも spinner で抑止
    // しているが、 ランナー実装としても安全側に倒す)。
    return withRunLock(() => runUnlocked(input));
  },
};

async function runUnlocked(input: RunInput): Promise<RunOutput> {
  const pyodide = await getPyodide();
  const startedAt = performance.now();

  // FS に提出ファイルを書き込む。 前回 `run()` で書き込んだが今回入力に存在しない
  // ファイルは unlink し、 前の課題の `helpers.py` 等が `import` で誤って解決されるのを防ぐ。
  writeFilesToFS(pyodide, input.files);

  if (input.mode === "freerun") {
    const result = await runOne(pyodide, input.files[input.entryFile] ?? "", {
      name: input.entryPoints?.[0] ?? "実行結果",
      kind: "freerun",
    });
    return {
      durationMs: Math.round(performance.now() - startedAt),
      results: [result],
    };
  }

  if (input.testKind === "sql") {
    throw new Error(
      "Python ランナは SQL testKind に対応していません (課題定義の不整合)",
    );
  }

  const code = input.files[input.entryFile] ?? "";
  const results: TestResult[] = [];
  let timedOutAlready = false;
  for (const test of input.tests) {
    if (timedOutAlready) {
      // タイムアウト後は Python 実行が走り続けている可能性があるので後続テストを早期に失敗扱いに。
      results.push({
        name: test.name,
        passed: false,
        error: "TIMEOUT",
      });
      continue;
    }
    const result = await runOne(pyodide, code, {
      name: test.name,
      kind: input.testKind,
      test,
    });
    if (result.error === "TIMEOUT") {
      timedOutAlready = true;
    }
    results.push(result);
  }
  return {
    durationMs: Math.round(performance.now() - startedAt),
    results,
  };
}

interface RunOneOptions {
  name: string;
  kind: "stdout" | "function" | "freerun";
  test?: TestCase;
}

async function runOne(
  pyodide: PyodideAPI,
  learnerCode: string,
  opts: RunOneOptions,
): Promise<TestResult> {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  pyodide.setStdout({ batched: (s) => stdoutChunks.push(s) });
  pyodide.setStderr({ batched: (s) => stderrChunks.push(s) });

  // 前のテスト / 前の `run()` で学習者コードが import したモジュールを sys.modules から
  // 取り除き、 import が毎回 fresh に解決されるようにする (順序依存の擬陽性/陰性を防ぐ)。
  // 標準ライブラリの初期キャッシュは残るので、 import 自体のコストは ほぼゼロ。
  pyodide.runPython("_jsreview_reset_modules()");

  // テスト毎に fresh な globals dict を渡し、 前のテストで定義した変数/関数を引きずらない。
  const globals = pyodide.runPython("dict()") as PyProxyLike;
  try {
    const source =
      opts.kind === "function" && opts.test
        ? buildFunctionSource(learnerCode, opts.test as FunctionTestCase)
        : learnerCode;
    try {
      await Promise.race([
        pyodide.runPythonAsync(source, {
          globals,
          filename: "main.py",
        }),
        timeoutReject(TIMEOUT_MS),
      ]);
    } catch (e) {
      if (isTimeout(e)) {
        return { name: opts.name, passed: false, error: "TIMEOUT" };
      }
      // Python 例外も Traceback を含めて RUNNER_ERROR としてそのまま見せる。
      return {
        name: opts.name,
        passed: false,
        stdout: stdoutChunks.join(""),
        error: `RUNNER_ERROR: ${formatErr(e, stderrChunks.join(""))}`,
      };
    }

    const stdout = stripFunctionMarkers(stdoutChunks.join(""));
    if (opts.kind === "freerun") {
      return { name: opts.name, passed: true, stdout };
    }
    if (opts.kind === "function") {
      const raw = stdoutChunks.join("");
      const passed =
        raw.includes(FUNCTION_OK_MARKER) && !raw.includes(FUNCTION_FAIL_MARKER);
      return { name: opts.name, passed, stdout };
    }
    // stdout testKind
    const expected = (opts.test as StdoutTestCase).expectedStdout;
    return {
      name: opts.name,
      passed: normalizeStdout(stdout) === normalizeStdout(expected),
      stdout,
      expectedStdout: expected,
    };
  } finally {
    globals.destroy();
  }
}

function buildFunctionSource(
  learnerCode: string,
  test: FunctionTestCase,
): string {
  // 学習者コードの末尾に評価式を追記。 Python 式 (例: `double(3) == 6`) を真偽値として
  // 評価し、 マーカ文字列を print して runner 側で判定する。 例外はそのまま伝播させ、
  // RUNNER_ERROR として失敗扱いになる。
  return (
    `${learnerCode}\n\n` +
    `__jsreview_result = bool(${test.code})\n` +
    `print(${JSON.stringify(FUNCTION_OK_MARKER)} if __jsreview_result else ${JSON.stringify(FUNCTION_FAIL_MARKER)})\n`
  );
}

function stripFunctionMarkers(stdout: string): string {
  // 末尾改行付きの方を先に消し、 残りの bare マーカも除去する。
  // 動的 RegExp を避けることで静的解析 (ast-grep の regexp-from-variable) も静かになる。
  return stdout
    .replaceAll(`${FUNCTION_OK_MARKER}\n`, "")
    .replaceAll(FUNCTION_OK_MARKER, "")
    .replaceAll(`${FUNCTION_FAIL_MARKER}\n`, "")
    .replaceAll(FUNCTION_FAIL_MARKER, "");
}

function normalizeStdout(s: string): string {
  // 末尾改行と末尾空白は無視する (JS / SQL ランナと同じ感覚で比較できるように)。
  return s.replace(/\s+$/g, "");
}

function writeFilesToFS(
  pyodide: PyodideAPI,
  files: Record<string, string>,
): void {
  // 前回 `run()` で書いたファイルのうち、 今回入力に存在しないものを unlink する。
  // 別課題に切り替えたとき・テストケース間で starterFiles が変わったときに、
  // 前の課題の補助ファイルが残って `import` で誤解決されるのを防ぐ。
  // (注: sys.modules の import キャッシュは別問題で、 多ファイル Python 課題が
  //  本格化したら別途対応が必要。 単一 main.py の現サンプルでは影響しない。)
  for (const stale of writtenPaths) {
    if (!(stale in files)) {
      try {
        pyodide.FS.unlink(absFsPath(stale));
      } catch {
        // 既に存在しない / 権限エラー等は無視 (Pyodide 側で先に消えているケース)。
      }
    }
  }
  writtenPaths.clear();
  for (const [path, content] of Object.entries(files)) {
    const abs = absFsPath(path);
    // 多階層パス (例: "pkg/utils.py") に備え、 親ディレクトリを先に作る。
    // 既存ディレクトリは Pyodide 側で no-op。
    const slash = abs.lastIndexOf("/");
    if (slash > 0) {
      pyodide.FS.mkdirTree(abs.slice(0, slash));
    }
    pyodide.FS.writeFile(abs, content, { encoding: "utf8" });
    writtenPaths.add(path);
  }
}

function absFsPath(path: string): string {
  return path.startsWith("/") ? path : `${PY_HOME}/${path}`;
}

class PythonTimeoutError extends Error {
  constructor() {
    super("Python execution exceeded TIMEOUT_MS");
    this.name = "PythonTimeoutError";
  }
}

function timeoutReject(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new PythonTimeoutError()), ms);
  });
}

function isTimeout(e: unknown): boolean {
  return e instanceof PythonTimeoutError;
}

function formatErr(e: unknown, stderr: string): string {
  if (e instanceof Error) {
    return e.message || stderr || String(e);
  }
  return stderr || String(e);
}
