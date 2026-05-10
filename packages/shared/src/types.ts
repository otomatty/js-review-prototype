/**
 * 共有型定義。サーバとクライアントの両方で使われる。
 *
 * サーバが import するのはこのファイルのみ。
 * AST解析(grading/ast.ts) と 評価(grading/evaluate.ts) はクライアントのみが使用する。
 */

// ───────────────────────────────────────────────────────────────────
// トピック (MDN準拠の章立て)
// ───────────────────────────────────────────────────────────────────

/**
 * トピック (= 章) の識別子。
 *
 * 文字列値 (kebab-case) は安定 ID で、 UI 表示順 / 学習推奨順とは独立。
 * 並び順 (`Topic.order`) や表示ラベル (`Topic.label`) は `problems/index.ts`
 * の `topics` 配列で定義する。
 *
 * 章番号と章名の対応 (2026 年再構築後の初心者推奨順):
 * - 00 はじめての関数             → first-function
 * - 01 変数と型                   → variables-and-types
 * - 02 演算子と比較               → operators
 * - 03 条件分岐                   → control-flow
 * - 04 繰り返し                   → loops
 * - 05 配列の基礎                 → arrays-basics
 * - 06 文字列操作                 → strings
 * - 07 関数の基礎                 → functions-basics
 * - 08 アロー関数と this          → functions-arrow-this
 * - 09 スコープとクロージャ       → scope-closure
 * - 10 配列のイテレーション       → arrays-iteration
 * - 11 数値・Math・Date           → numbers-math-date
 * - 12 オブジェクトの基礎         → objects-basics
 * - 13 分割代入とスプレッド       → destructuring-spread
 * - 14 Map / Set                  → collections
 * - 15 クラスの基礎               → classes-basics
 * - 16 クラスの応用               → classes-advanced
 * - 17 エラー処理                 → error-handling
 * - 18 正規表現                   → regex
 * - 19 非同期処理                 → async
 */
export type TopicId =
  | "first-function"
  | "variables-and-types"
  | "operators"
  | "control-flow"
  | "loops"
  | "arrays-basics"
  | "strings"
  | "functions-basics"
  | "functions-arrow-this"
  | "scope-closure"
  | "arrays-iteration"
  | "numbers-math-date"
  | "objects-basics"
  | "destructuring-spread"
  | "collections"
  | "classes-basics"
  | "classes-advanced"
  | "error-handling"
  | "regex"
  | "async";

export interface Topic {
  id: TopicId;
  /** 表示順 (1始まり) */
  order: number;
  /** UI表示用ラベル (例: "01. 変数と型") */
  label: string;
  /** MDN該当ページ */
  mdnUrl: string;
  /** トピックの1行説明 */
  description?: string;
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

export interface Assignment {
  id: string;
  /** 所属トピック (UIグルーピング用) */
  topicId: TopicId;
  title: string;
  difficulty: 1 | 2 | 3;
  /** 課題説明 (Markdown) */
  description: string;
  /** ユーザーが編集を始めるときの初期コード */
  starterCode: string;
  /** コードから取り出す関数名 (isolated-vm に公開する対象) */
  entryPoints: string[];
  /** テストケース */
  tests: TestCase[];
  /** クライアント側 ESLint ルール */
  eslint: { rules: Record<string, ESLintRuleConfig> };
  /** クライアント側 AST 要件 */
  ast: ASTRequirement;
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

export interface BadSolution {
  code: string;
  description: string;
}

export interface TestCase {
  name: string;
  /**
   * 評価対象のテスト式。 isolated-vm 内で、`code` を読み込んだ後に評価される。
   * 例: 'sum([1,2,3]) === 6'
   *
   * 真値であれば PASS、それ以外は FAIL。例外は `error` として返る。
   */
  code: string;
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
  tests: TestCase[];
  entryPoints: string[];
}

export interface RunTestsResponse {
  durationMs: number;
  results: TestResult[];
}

export interface TestResult {
  name: string;
  passed: boolean;
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
  /** 必須パターンが見つかったかどうか (順序は Assignment.ast.required と同じ) */
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
