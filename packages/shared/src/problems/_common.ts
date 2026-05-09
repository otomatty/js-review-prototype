/**
 * 各トピックファイルで共有するヘルパ。
 */

import type { ESLintRuleConfig } from "../types.js";

/** ほぼ全課題で有効化したい最小限のルール。 */
export const COMMON_LINT_RULES: Record<string, ESLintRuleConfig> = {
  eqeqeq: "error",
  "no-var": "error",
  "prefer-const": "warn",
};
