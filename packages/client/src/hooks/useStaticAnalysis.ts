/**
 * 編集中の静的解析 (Lint + AST) を debounce 500ms で実行する Hook。
 *
 * - 結果は React state として常時反映され、画面の左ペインに表示される
 * - サーバ通信は一切しない (クライアント完結)
 * - JavaScript 以外の課題 (SQL 等) では ESLint / Babel が SQL テキストを構文エラーとして
 *   報告してしまうため、 解析自体をスキップして空の結果を返す (#100 / #109 / codex P2 対応)。
 */

import { useEffect, useState } from "react";
import type {
  ASTResult,
  Assignment,
  LintViolation,
} from "@jsreview/shared/types";
import { analyzeAst } from "@jsreview/shared/grading/ast";
import {
  getLanguage,
  getStaticAnalysisSettings,
} from "@jsreview/shared/assignment-helpers";

import { lintCode } from "../lib/eslint-runner.js";

const DEBOUNCE_MS = 500;
const EMPTY_AST: ASTResult = { required: [], forbidden: [] };

export function useStaticAnalysis(code: string, assignment: Assignment) {
  const [lint, setLint] = useState<LintViolation[]>([]);
  const [ast, setAst] = useState<ASTResult>(EMPTY_AST);

  useEffect(() => {
    // 非 JS 課題では JS 用 ESLint / Babel を回さない (パースエラーが大量に出るため)。
    // 評価ロジック (`runners/index.ts`) も SQL 採点では Lint/AST を採点対象から除外している。
    if (getLanguage(assignment) !== "javascript") {
      setLint([]);
      setAst(EMPTY_AST);
      return;
    }
    const timer = setTimeout(() => {
      const settings = getStaticAnalysisSettings(assignment);
      const lintResult = lintCode(code, settings.eslintRules, {
        ignoredUnusedNames: settings.ignoredUnusedNames,
      });
      setLint(lintResult);

      const astResult = analyzeAst(code, settings.ast);
      setAst(astResult);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [code, assignment]);

  return { lint, ast };
}
