/**
 * 編集中の静的解析 (Lint + AST) を debounce 500ms で実行する Hook。
 *
 * - 結果は React state として常時反映され、画面の左ペインに表示される
 * - サーバ通信は一切しない (クライアント完結)
 * - 言語別ディスパッチャ (`getLinter` / `analyzeAst`) を経由するため、
 *   未対応言語 (SQL 等) では自動で空結果を返す。 空結果は `evaluate()` で
 *   「未適用 = 通過扱い」 になり、 cleared を阻害しない (#104 / #100)。
 */

import { useEffect, useState } from "react";
import type {
  ASTResult,
  Assignment,
  LintViolation,
} from "@jsreview/shared/types";
import { analyzeAst } from "@jsreview/shared/grading";
import {
  getLanguage,
  getStaticAnalysisSettings,
} from "@jsreview/shared/assignment-helpers";

import { getLinter } from "../lib/linters/index.js";

const DEBOUNCE_MS = 500;
const EMPTY_AST: ASTResult = { required: [], forbidden: [] };

export function useStaticAnalysis(code: string, assignment: Assignment) {
  const [lint, setLint] = useState<LintViolation[]>([]);
  const [ast, setAst] = useState<ASTResult>(EMPTY_AST);

  useEffect(() => {
    const timer = setTimeout(() => {
      const language = getLanguage(assignment);
      const settings = getStaticAnalysisSettings(assignment);
      const linter = getLinter(language);
      setLint(
        linter(code, settings.eslintRules, {
          ignoredUnusedNames: settings.ignoredUnusedNames,
        }),
      );
      setAst(analyzeAst(language, code, settings.ast));
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [code, assignment]);

  return { lint, ast };
}
