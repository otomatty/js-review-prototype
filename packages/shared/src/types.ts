/**
 * 共有型定義。サーバとクライアントの両方で使われる。
 *
 * サーバが import するのはこのファイルのみ。
 * AST解析(grading/ast.ts) と 評価(grading/evaluate.ts) はクライアントのみが使用する。
 */

// ───────────────────────────────────────────────────────────────────
// トピック (MDN準拠の章立て)
// ───────────────────────────────────────────────────────────────────

export type TopicId =
  | "variables-and-types"
  | "operators"
  | "control-flow"
  | "loops"
  | "functions-basics"
  | "functions-arrow-this"
  | "scope-closure"
  | "error-handling"
  | "strings"
  | "numbers-math-date"
  | "arrays-basics"
  | "arrays-iteration"
  | "destructuring-spread"
  | "objects-basics"
  | "collections"
  | "classes-basics"
  | "classes-advanced"
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
