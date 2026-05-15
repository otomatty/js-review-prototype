/**
 * 静的解析 (AST) の言語別ディスパッチャ (#104 / #100)。
 *
 * `analyzeAst(language, code, requirement)` は `Language` を見て JS なら Babel
 * ベースの `analyzeJsAst` を呼び出し、 未対応言語 (Python / SQL / PHP /
 * Vitest / ESLint 教材) は空の `ASTResult` を返す。 空結果は `evaluate()` で
 * 「未適用 = 通過扱い」 になるため、 cleared 判定を阻害しない。
 *
 * 新言語の AST 解析を実装するときは、 この switch にケースを追加すれば良い。
 * 6 言語の `Language` ユニオンに対して `_exhaustive: never` で網羅性を強制。
 */

import type { ASTRequirement, ASTResult, Language } from "../types.js";
import { analyzeJsAst } from "./ast.js";

const EMPTY_AST: ASTResult = { required: [], forbidden: [] };

export function analyzeAst(
  language: Language,
  code: string,
  requirement: ASTRequirement,
): ASTResult {
  switch (language) {
    case "javascript":
      return analyzeJsAst(code, requirement);
    case "python":
    case "sql":
    case "php":
    case "vitest":
    case "eslint":
      return EMPTY_AST;
    default: {
      const _exhaustive: never = language;
      void _exhaustive;
      return EMPTY_AST;
    }
  }
}

export { analyzeJsAst } from "./ast.js";
export { evaluate } from "./evaluate.js";
