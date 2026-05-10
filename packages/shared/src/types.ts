/**
 * 共有型定義。サーバとクライアントの両方で使われる。
 *
 * サーバが import するのはこのファイルのみ。
 * AST解析(grading/ast.ts) と 評価(grading/evaluate.ts) はクライアントのみが使用する。
 */

// ───────────────────────────────────────────────────────────────────
// カリキュラム軸 (Stage x Chapter)
// ───────────────────────────────────────────────────────────────────

export type Stage = "S0" | "S1" | "S2" | "S3" | "S4" | "S5";

export type TestKind = "stdout" | "function";

export type ChapterId =
  | "Ch00"
  | "Ch01"
  | "Ch02"
  | "Ch03"
  | "Ch04"
  | "Ch05"
  | "Ch06"
  | "Ch07"
  | "Ch08"
  | "Ch09"
  | "Ch10"
  | "Ch11"
  | "Ch12"
  | "Ch13"
  | "Ch14"
  | "Ch15"
  | "Ch16";

export interface StageInfo {
  id: Stage;
  label: string;
  shortLabel: string;
  description: string;
  defaultTestKind: TestKind;
  estimatedMinutesRange: readonly [number, number];
  targetProblemCount: readonly [number, number];
}

export interface Chapter {
  id: ChapterId;
  /** 表示順。Ch00 は 0、Ch01 以降は章番号に揃える。 */
  order: number;
  /** UI表示用ラベル (例: "Ch01. 変数") */
  label: string;
  description: string;
  defaultMdnPage: string;
}

/**
 * MDN ガイドの特定セクション (見出し) への参照。
 *
 * 課題が学習対象とする MDN ページ内のサブセクションを指し示すために使う。
 * UI ではトピックの MDN ページリンクの下に「参考」として並べて表示される。
 */
export interface MdnSection {
  /** UI に表示する見出しラベル。例: "変数のスコープ" */
  heading: string;
  /**
   * URL のフラグメント部分 (`#` の後ろ)。
   * 省略時は `heading` をそのまま使う。
   * JA MDN は anchor に日本語見出しをそのまま使うため通常は省略可能。
   * 例: heading="数値と '+' 演算子" のように記号を含む場合のみ
   * `anchor: "数値と_演算子"` を明示する。
   */
  anchor?: string;
  /**
   * 参照先ページの URL 上書き。
   * 省略時は所属トピックの `mdnUrl` を使う。
   * 同じトピック (= 同じ MDN ページ) 内のセクションのみを参照する通常ケースでは省略する。
   */
  pageUrl?: string;
}

// ───────────────────────────────────────────────────────────────────
// 課題定義
// ───────────────────────────────────────────────────────────────────

export type Difficulty = 1 | 2 | 3;

export type ScaffoldLevel = "L0" | "L1" | "L2" | "L3";

export type ScaffoldMap = Record<ScaffoldLevel, string>;

export type LintPreset = "S1" | "S2" | "S3" | "S4" | "S5";

export interface Assignment {
  id: string;
  stage: Stage;
  chapterId: ChapterId;
  /** 章内・ステージ内での表示順。 */
  sequence: number;
  title: string;
  newConcept: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  testKind: TestKind;
  /** 課題説明 (Markdown) */
  description: string;
  /** L0-L3 のスタータコード。UI は既定で L2 を使う。 */
  scaffolds: ScaffoldMap;
  /** function 採点でコードから取り出す関数名・クラス名。 */
  entryPoints?: string[];
  /** テストケース */
  tests: TestCase[];
  /** クライアント側静的解析の枠。プリセットの中身は各 content phase で詰める。 */
  lintPreset?: LintPreset;
  staticAnalysis?: StaticAnalysisConfig;
  hints?: string[];
  commonMistakes?: CommonMistake[];
  isCapstone?: boolean;
  /**
   * 模範解答。
   * 全テストにパスし、AST `required` を全充足、`forbidden` 違反ゼロ、
   * Lint エラーゼロで「全チェック通過 = クリア」に到達できる必要がある
   * (CI の回帰テストで検証)。
   * UI では「解答例を表示」アコーディオンからクリア後に閲覧できる。
   * ただし「常に表示」設定が有効な場合は未クリアでも閲覧できる。
   */
  solution?: string;
  /**
   * 「クリアしてはいけない」ことを担保するための誤実装サンプル (任意)。
   * 何らかのチェック (テスト / Lint / AST) を必ず1つ以上失敗することを CI で検証する。
   */
  badSolutions?: BadSolution[];
  /**
   * この課題が学習対象とする MDN ガイドのセクション (見出し)。
   * UI では課題説明の上部に「参考: §<見出し>」のリンクとして並べて表示する。
   * トピックの `mdnUrl` ページ内のセクションを参照するのが基本だが、
   * `pageUrl` で別ページを指定することもできる。
   */
  mdnSections?: MdnSection[];
}

export interface StaticAnalysisConfig {
  eslint?: { rules: Record<string, ESLintRuleConfig> };
  ast?: ASTRequirement;
}

export interface BadSolution {
  code: string;
  description: string;
}

export interface CommonMistake {
  pattern: string;
  message: string;
}

export type TestCase = StdoutTestCase | FunctionTestCase;

export interface StdoutTestCase {
  name: string;
  /** console.log で捕捉した標準出力。末尾改行は比較時に無視される。 */
  expectedStdout: string;
  code?: never;
}

export interface FunctionTestCase {
  name: string;
  /**
   * 評価対象のテスト式。 isolated-vm 内で、`code` を読み込んだ後に評価される。
   * 例: 'sum([1,2,3]) === 6'
   *
   * 真値であれば PASS、それ以外は FAIL。例外は `error` として返る。
   */
  code: string;
  expectedStdout?: never;
}

export type ESLintRuleConfig =
  | "off"
  | "warn"
  | "error"
  | 0
  | 1
  | 2
  | [string | number, ...unknown[]];

export interface ASTRequirement {
  /** 必ず使ってほしい識別子・呼び出し (例: ['reduce', 'filter']) */
  required?: ASTPattern[];
  /** 使ってほしくない構文 (例: ['ForStatement', 'VarDeclaration']) */
  forbidden?: ASTPattern[];
}

/**
 * AST要件のパターン。
 *
 * - `kind: "method"` … 任意のメソッド呼び出し `x.NAME(...)` (例: `arr.reduce(...)`)
 * - `kind: "node"`   … 特定のNode種別 (`ForStatement`, `WhileStatement`, etc.)
 * - `kind: "var"`    … `var` 宣言
 * - `kind: "loose-eq"` … `==` または `!=`
 * - `kind: "async-fn"` … `async` 関数 (宣言・式・アロー)
 */
export type ASTPattern =
  | { kind: "method"; name: string; label?: string }
  | { kind: "node"; nodeType: ASTNodeType; label?: string }
  | { kind: "var"; label?: string }
  | { kind: "loose-eq"; label?: string }
  | { kind: "async-fn"; label?: string };

export type ASTNodeType =
  // 制御構文・ループ
  | "ForStatement"
  | "ForInStatement"
  | "ForOfStatement"
  | "WhileStatement"
  | "DoWhileStatement"
  | "SwitchStatement"
  | "TryStatement"
  | "ThrowStatement"
  // 宣言
  | "VariableDeclaration"
  | "FunctionDeclaration"
  | "ClassDeclaration"
  | "ClassExpression"
  // class member
  | "ClassPrivateProperty"
  | "PrivateName"
  // 関数式
  | "FunctionExpression"
  | "ArrowFunctionExpression"
  // 式
  | "TemplateLiteral"
  | "ConditionalExpression"
  | "LogicalExpression"
  | "NewExpression"
  | "RegExpLiteral"
  | "AwaitExpression"
  | "MemberExpression"
  // パターン (分割代入・スプレッド・残余)
  | "SpreadElement"
  | "RestElement"
  | "ObjectPattern"
  | "ArrayPattern";

// ───────────────────────────────────────────────────────────────────
// テスト実行 (サーバが返す)
// ───────────────────────────────────────────────────────────────────

export interface RunTestsRequest {
  code: string;
  testKind: TestKind;
  tests: TestCase[];
  entryPoints?: string[];
}

export interface RunTestsResponse {
  durationMs: number;
  results: TestResult[];
}

export interface TestResult {
  name: string;
  passed: boolean;
  stdout?: string;
  expectedStdout?: string;
  /** タイムアウトの場合は 'TIMEOUT'、コンパイルエラーは 'COMPILE_ERROR' */
  error?: string;
}

// ───────────────────────────────────────────────────────────────────
// 静的解析 (クライアントで計算)
// ───────────────────────────────────────────────────────────────────

export interface LintViolation {
  ruleId: string | null;
  severity: 1 | 2;
  /** 日本語化されたメッセージ */
  message: string;
  /** 元の英語メッセージ (フォールバック) */
  rawMessage?: string;
  line: number;
  column: number;
}

export interface ASTResult {
  /** 必須パターンが見つかったかどうか (順序は Assignment.staticAnalysis.ast.required と同じ) */
  required: ASTCheckResult[];
  /** 禁止パターンの違反 (見つかったもののみ) */
  forbidden: ASTViolation[];
  /** AST解析自体が失敗した場合 (パースエラー) */
  parseError?: string;
}

export interface ASTCheckResult {
  pattern: ASTPattern;
  label: string;
  found: boolean;
}

export interface ASTViolation {
  pattern: ASTPattern;
  label: string;
  line: number;
}

// ───────────────────────────────────────────────────────────────────
// 評価結果 (全チェック通過の二値判定)
// ───────────────────────────────────────────────────────────────────

export interface EvaluationResult {
  /** Lint / AST / テストすべてのチェックを通過しているか */
  cleared: boolean;
  /** 各セクションの結果 */
  checks: {
    /** Lint: severity===2 (error) が 0 件なら通過 */
    lintPassed: boolean;
    /** AST: parseError なし & required 全充足 & forbidden 0 件 */
    astPassed: boolean;
    /** Tests: 全テストが passed */
    testsPassed: boolean;
  };
}
