/**
 * 各トピックファイルで共有するヘルパ。
 */

import type { ESLintRuleConfig, ScoreWeights } from "../types.js";

/** ほぼ全課題で有効化したい最小限のルール。 */
export const COMMON_LINT_RULES: Record<string, ESLintRuleConfig> = {
  eqeqeq: "error",
  "no-var": "error",
  "prefer-const": "warn",
};

/** 標準スコア配分 (test 70 / lint 15 / ast 15)。 */
export const DEFAULT_WEIGHTS: ScoreWeights = { test: 70, lint: 15, ast: 15 };
