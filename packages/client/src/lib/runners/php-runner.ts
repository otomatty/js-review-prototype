/**
 * PHP 採点ランナ (php-wasm / WebAssembly, ブラウザ完結) (#112)。
 *
 * - php-wasm のローダ (PhpWeb.mjs) は固定バージョンの jsDelivr CDN から
 *   dynamic import + キャッシュで初回のみロード (~5MB 超の wasm を伴う)。
 *   JS / SQL / Python 学習者には一切影響しない (PHP 課題を開かない限り fetch されない)。
 * - npm パッケージとして同梱しない理由: `php-wasm` には `main` / `module` / `exports`
 *   が定義されておらず、 Vite の依存解決と相性が悪い。 また issue #112 注意書きが
 *   「CDN URL を固定バージョンで指定」 を推奨しており、 ローダ JS と wasm が
 *   同じ CDN ディレクトリに配置されているのを利用すれば `import.meta.url` 解決で
 *   そのまま wasm まで fetch される。 ハードコードしたバージョン番号がそのまま
 *   再現性 (immutable URL) を担保する。
 * - `RunInput.files` を php-wasm の FS (`/jsreview/` 配下) に書き込んでから
 *   `entryFile` を `require` で実行する (将来の多ファイル課題でも include が解決できる)。
 * - stdout / stderr は PhpWeb の `output` / `error` イベント (line-buffered) で捕捉する。
 *   `php.run()` は完了時に `flush()` を呼ぶので末尾の改行なし部分も拾える。
 *
 * TIMEOUT の限界と回復 (Python ランナと同じ思想):
 *   `Promise.race` は外側 Promise を解決するだけで、 PHP 実行は止められない。
 *   タイムアウト後の PhpWeb はバックグラウンドで動き続け、 そのまま次の `run()` で再利用すると
 *   zombie 実行の stdout が新しい採点に混入してしまう。 そのため timeout 発生時は当該
 *   インスタンスを **broken マーク** し、 次の `getPhpWeb()` で fresh init を走らせる
 *   (CDN は immutable キャッシュなので再 fetch は ms オーダ)。 真の中断には Web Worker 化が
 *   必要だが本 issue (#112) の scope 外。
 */

import type {
  CodeRunner,
  RunInput,
  RunOutput,
} from "@jsreview/shared/runner/types";
import type {
  StdoutTestCase,
  TestResult,
} from "@jsreview/shared/types";

const TIMEOUT_MS = 10_000;
/** PHP 課題の仮想ワークスペース。 entryFile はここに書き込んで `require` で読み込む。 */
const PHP_HOME = "/jsreview";
/**
 * 使用する php-wasm のバージョン。 jsDelivr の immutable キャッシュにより、
 * 同じ URL は永続的に同じ内容を返す (再現性確保)。 ローダ JS は `import.meta.url` で
 * 自分の置かれた CDN ディレクトリを基準に wasm を fetch するため、 ローダさえ
 * 固定バージョンを指せば wasm も自動的に一致する。
 */
const PHP_WASM_VERSION = "0.0.9-alpha-32";
const PHP_WASM_CDN_URL =
  `https://cdn.jsdelivr.net/npm/php-wasm@${PHP_WASM_VERSION}/PhpWeb.mjs`;

/**
 * `run()` を直列化するためのモジュールスコープロック。
 * PhpWeb はシングルトンで、 出力イベント (`output` / `error`) はインスタンスグローバル。
 * 並行 `run()` を許すと stdout 捕捉が混線するため、 ランナ実装としても安全側に倒す。
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

interface PhpEvent {
  detail: string[] | string;
}

type PhpEventListener = (event: PhpEvent) => void;

interface PhpWebInstance {
  addEventListener(type: "output" | "error", listener: PhpEventListener): void;
  removeEventListener(
    type: "output" | "error",
    listener: PhpEventListener,
  ): void;
  run(phpCode: string): Promise<number>;
  flush(): void;
  writeFile(path: string, data: string, opts?: { encoding?: string }): Promise<unknown>;
  mkdir(path: string): Promise<unknown>;
  unlink(path: string): Promise<unknown>;
  analyzePath(path: string): Promise<{ exists: boolean }>;
}

interface PhpWebCtor {
  new (args?: Record<string, unknown>): PhpWebInstance;
}

interface PhpWebHolder {
  loadPromise: Promise<PhpWebInstance>;
  broken: boolean;
}
let phpHolder: PhpWebHolder | null = null;

function getPhpWeb(): Promise<PhpWebInstance> {
  if (!phpHolder || phpHolder.broken) {
    // ロード失敗 (CDN 断・ネットワーク等) の rejected promise を抱え続けると、
    // 以降の PHP 課題が二度と動かなくなる。 失敗を観測したら holder を null に戻し、
    // 次の `getPhpWeb()` で再 fetch できるようにする。
    const loadPromise = loadFreshPhpWeb();
    const guarded = loadPromise.catch((e) => {
      if (phpHolder && phpHolder.loadPromise === guarded) {
        phpHolder = null;
      }
      throw e;
    });
    phpHolder = { loadPromise: guarded, broken: false };
  }
  return phpHolder.loadPromise;
}

/** timeout 発生時に呼ぶ。 zombie 実行を抱えた instance を捨て、 次回 init を予約する。 */
function markPhpBroken(zombieWork: Promise<unknown>): void {
  // zombie はメモリに残るが、 unhandled rejection だけは抑止する (no-op catch)。
  zombieWork.catch(() => {
    /* swallow zombie rejection */
  });
  if (phpHolder) {
    phpHolder.broken = true;
  }
  // 旧 FS 状態 (writeFile 履歴) も無効化。 fresh instance は空 FS で始まる。
  writtenPaths.clear();
}

async function loadFreshPhpWeb(): Promise<PhpWebInstance> {
  // `@vite-ignore` は remote URL の dynamic import を Vite の静的解析から外すための
  // 標準コメント (Vite docs: Dynamic Import Variables)。 これがないと build 時に
  // 解決不能な URL として警告 / fail する。
  const mod = (await import(/* @vite-ignore */ PHP_WASM_CDN_URL)) as {
    PhpWeb: PhpWebCtor;
  };
  const php = new mod.PhpWeb();
  // PhpWeb の binary 初期化は constructor で開始されているので、 1 回 no-op run を
  // 走らせて完了を待つ。 これ以降の `run()` は wasm 起動を待たずに即実行できる。
  await php.run("<?php\n");
  // FS のワークスペースディレクトリを 1 回だけ作る。 既存ディレクトリは php-wasm 側で
  // エラーを返すので analyzePath で先に判定する。
  const exists = await php.analyzePath(PHP_HOME);
  if (!exists.exists) {
    await php.mkdir(PHP_HOME);
  }
  return php;
}

export const phpRunner: CodeRunner = {
  language: "php",
  async run(input: RunInput): Promise<RunOutput> {
    return withRunLock(() => runUnlocked(input));
  },
};

async function runUnlocked(input: RunInput): Promise<RunOutput> {
  const php = await getPhpWeb();
  const startedAt = performance.now();

  if (input.mode === "freerun") {
    await writeFilesToFS(php, input.files);
    const result = await runOne(php, input.entryFile, {
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
      "PHP ランナは SQL テストに対応していません (課題定義の不整合)",
    );
  }
  if (input.testKind === "mutation") {
    throw new Error(
      "PHP ランナは mutation テストに対応していません (課題定義の不整合)",
    );
  }
  if (input.testKind === "eslint-config") {
    throw new Error(
      "PHP ランナは eslint-config テストに対応していません (課題定義の不整合)",
    );
  }
  if (input.testKind === "function") {
    // function 採点 (式が真値かを評価) は本 issue (#112) では scope 外。
    // サンプル課題はすべて stdout 比較で書く方針 (issue 受け入れ条件)。
    throw new Error(
      "PHP ランナは function テストに対応していません (本 issue では stdout のみ)",
    );
  }

  const results: TestResult[] = [];
  let timedOutAlready = false;
  for (const test of input.tests) {
    if (timedOutAlready) {
      // タイムアウト後は PHP 実行が走り続けている可能性があるので後続を早期失敗扱いに。
      results.push({
        name: test.name,
        passed: false,
        error: "TIMEOUT",
      });
      continue;
    }
    // テスト毎に提出ファイルを書き戻すことで、 学習者コードが starterFiles の path に
    // 書き込んだ副作用を次テスト前に元へ戻す。
    await writeFilesToFS(php, input.files);
    const result = await runOne(php, input.entryFile, {
      name: test.name,
      kind: "stdout",
      expectedStdout: (test as StdoutTestCase).expectedStdout,
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
  kind: "stdout" | "freerun";
  expectedStdout?: string;
}

async function runOne(
  php: PhpWebInstance,
  entryFile: string,
  opts: RunOneOptions,
): Promise<TestResult> {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  const onOutput: PhpEventListener = (e) => stdoutChunks.push(extractDetail(e));
  const onError: PhpEventListener = (e) => stderrChunks.push(extractDetail(e));
  php.addEventListener("output", onOutput);
  php.addEventListener("error", onError);
  try {
    // `php.run()` は `?>${code}` を内部で連結するので、 ユーザコードの先頭で
    // `<?php` から始められる前提を保つ。 採点では学習者ファイルを require して、
    // `__FILE__` 等が正しく解決されるようにする。
    const entryPath = absFsPath(entryFile);
    // require 対象のシングルクォート文字列なので、 単純なエスケープで安全に
    // 文字列リテラル化できる (path は writtenPaths 由来で英数 / `/` / `.` のみ)。
    const escapedPath = entryPath.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    const wrapper = `<?php require '${escapedPath}';`;
    const work = php.run(wrapper);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        work,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new PhpTimeoutError()), TIMEOUT_MS);
        }),
      ]);
    } catch (e) {
      if (isTimeout(e)) {
        // PHP 実行は止められないので、 instance ごと捨てて次回 fresh init。
        // zombie の late rejection は markPhpBroken 内の no-op catch で吸収する。
        markPhpBroken(work);
        return { name: opts.name, passed: false, error: "TIMEOUT" };
      }
      return {
        name: opts.name,
        passed: false,
        stdout: stdoutChunks.join(""),
        error: `RUNNER_ERROR: ${formatErr(e, stderrChunks.join(""))}`,
      };
    } finally {
      if (timer !== undefined) {clearTimeout(timer);}
    }

    const stdout = stdoutChunks.join("");
    const stderr = stderrChunks.join("");
    if (opts.kind === "freerun") {
      // PHP の警告は stderr に出るが、 学習者には stdout 側にまとめて見せた方が分かりやすい。
      // 末尾に区切って付けることで通常出力との混同を避ける。
      const combined = stderr.trim().length > 0
        ? `${stdout}\n[stderr]\n${stderr}`
        : stdout;
      return { name: opts.name, passed: true, stdout: combined };
    }
    // stdout testKind
    const expected = opts.expectedStdout ?? "";
    const passed = normalizeStdout(stdout) === normalizeStdout(expected);
    return {
      name: opts.name,
      passed,
      stdout,
      expectedStdout: expected,
    };
  } finally {
    php.removeEventListener("output", onOutput);
    php.removeEventListener("error", onError);
  }
}

function extractDetail(event: PhpEvent): string {
  const detail = event.detail;
  if (Array.isArray(detail)) {
    // OutputBuffer は `detail: [decodedString]` 形式 (要素 1 個) で発火する。
    return detail.join("");
  }
  return String(detail ?? "");
}

function normalizeStdout(s: string): string {
  // JS / Python ランナと同じ正規化: CRLF を LF に揃え、 末尾の連続改行のみ除去する。
  return s.replace(/\r\n/g, "\n").replace(/\n+$/g, "");
}

async function writeFilesToFS(
  php: PhpWebInstance,
  files: Record<string, string>,
): Promise<void> {
  // 前回 `run()` で書いたファイルのうち、 今回入力に存在しないものを unlink する。
  // 別課題に切り替えたとき・テストケース間で starterFiles が変わったときに、
  // 前の課題の補助ファイルが残るのを防ぐ。
  for (const stale of writtenPaths) {
    if (!(stale in files)) {
      try {
        await php.unlink(absFsPath(stale));
      } catch {
        // 既に存在しない / 権限エラー等は無視 (php-wasm 側で先に消えているケース)。
      }
    }
  }
  writtenPaths.clear();
  for (const [path, content] of Object.entries(files)) {
    const abs = absFsPath(path);
    // 多階層パス (例: "lib/util.php") に備え、 親ディレクトリを先に作る。
    // analyzePath で存在確認してから mkdir することで、 既存ディレクトリへの
    // 二度書きを避ける。
    const slash = abs.lastIndexOf("/");
    if (slash > 0) {
      await ensureDir(php, abs.slice(0, slash));
    }
    await php.writeFile(abs, content, { encoding: "utf8" });
    writtenPaths.add(path);
  }
}

async function ensureDir(php: PhpWebInstance, dir: string): Promise<void> {
  // 親→子の順に深く mkdir していく。 各階層が既にあれば no-op。
  // ルート ("/") は php-wasm 側で常に存在するのでスキップする。
  const segments = dir.split("/").filter((s) => s.length > 0);
  let cur = "";
  for (const seg of segments) {
    cur += `/${seg}`;
    const probe = await php.analyzePath(cur);
    if (!probe.exists) {
      await php.mkdir(cur);
    }
  }
}

function absFsPath(path: string): string {
  return path.startsWith("/") ? path : `${PHP_HOME}/${path}`;
}

class PhpTimeoutError extends Error {
  constructor() {
    super("PHP execution exceeded TIMEOUT_MS");
    this.name = "PhpTimeoutError";
  }
}

function isTimeout(e: unknown): boolean {
  return e instanceof PhpTimeoutError;
}

function formatErr(e: unknown, stderr: string): string {
  const msg = e instanceof Error ? e.message : String(e);
  const tail = stderr.trim();
  if (msg && tail) {return `${msg}\n${tail}`;}
  return msg || tail || String(e);
}
