/**
 * 共有型定義。サーバとクライアントの両方で使われる。
 *
 * サーバが import するのはこのファイルのみ。
 * AST解析(grading/ast.ts) と スコア集計(grading/score.ts) はクライアントのみが使用する。
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
  | "classes-advanced";

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
  /** スコアの重み (合計100が基本) */
  weights: ScoreWeights;
  /**
   * 模範解答 (CIの採点回帰テストでのみ使用)。
   * 全テストにパスし、AST `required` を全充足、`forbidden` 違反ゼロで
   * 100点満点が取れる必要がある。
   * クライアントには配信しない (UI 側からは参照しない)。
   */
  solution?: string;
  /**
   * 採点で 100 点に届かないべき誤実装サンプル (任意)。
   * `expectMaxScore` を指定するとその値以下で合格扱い (デフォルトは 99)。
   */
  badSolutions?: BadSolution[];
}

export interface BadSolution {
  code: string;
  description: string;
  /** スコアの上限 (これ以下なら合格扱い)。省略時は 99。 */
  expectMaxScore?: number;
}

export interface TestCase {
  name: string;
  weight: number;
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
 */
export type ASTPattern =
  | { kind: "method"; name: string; label?: string }
  | { kind: "node"; nodeType: ASTNodeType; label?: string }
  | { kind: "var"; label?: string }
  | { kind: "loose-eq"; label?: string };

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
  // パターン (分割代入・スプレッド・残余)
  | "SpreadElement"
  | "RestElement"
  | "ObjectPattern"
  | "ArrayPattern";

export interface ScoreWeights {
  test: number;
  lint: number;
  ast: number;
}

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
  weight: number;
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
// 集計結果
// ───────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  test: number;
  lint: number;
  ast: number;
}

export interface ScoreResult {
  total: number;
  breakdown: ScoreBreakdown;
  details: {
    test: { passedWeight: number; totalWeight: number; weight: number };
    lint: { violations: number; weight: number };
    ast: { requiredOk: boolean; forbiddenViolations: number; weight: number };
  };
}
