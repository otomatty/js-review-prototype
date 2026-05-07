/**
 * 編集中の静的解析 (Lint + AST) を debounce 500ms で実行する Hook。
 *
 * - 結果は React state として常時反映され、画面の左ペインに表示される
 * - サーバ通信は一切しない (クライアント完結)
 */

import { useEffect, useState } from "react";
import type {
  ASTResult,
  Assignment,
  LintViolation,
} from "@jsreview/shared/types";
import { analyzeAst } from "@jsreview/shared/grading/ast";

import { lintCode } from "../lib/eslint-runner.js";

const DEBOUNCE_MS = 500;

export function useStaticAnalysis(code: string, assignment: Assignment) {
  const [lint, setLint] = useState<LintViolation[]>([]);
  const [ast, setAst] = useState<ASTResult>({ required: [], forbidden: [] });

  useEffect(() => {
    const timer = setTimeout(() => {
      // Lint (ブラウザ内ESLint)
      const lintResult = lintCode(code, assignment.eslint.rules, {
        ignoredUnusedNames: assignment.entryPoints,
      });
      setLint(lintResult);

      // AST (Babel)
      const astResult = analyzeAst(code, assignment.ast);
      setAst(astResult);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [code, assignment]);

  return { lint, ast };
}
