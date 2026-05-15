/**
 * Lint の言語別ディスパッチャ (#104 / #100)。
 *
 * `getLinter(language)` は `Linter` 関数を返すファクトリ。 JS なら
 * `eslint-linter-browserify` ベースの実装、 未対応言語 (Python / SQL / PHP /
 * Vitest / ESLint 教材) は空配列を返す no-op を返す。 空配列は `evaluate()` で
 * 「未適用 = 通過扱い」 になるため、 cleared 判定を阻害しない。
 *
 * 新言語の Lint を実装するときは、 この switch にケースを追加すれば良い。
 * 6 言語の `Language` ユニオンに対して `_exhaustive: never` で網羅性を強制。
 */

import type {
  ESLintRuleConfig,
  Language,
  LintViolation,
} from "@jsreview/shared/types";

import { lintCode, type LintCodeOptions } from "../eslint-runner.js";

export type Linter = (
  code: string,
  rules: Record<string, ESLintRuleConfig>,
  options?: LintCodeOptions,
) => LintViolation[];

const NOOP_LINTER: Linter = () => [];

export function getLinter(language: Language): Linter {
  switch (language) {
    case "javascript":
      return lintCode;
    case "python":
    case "sql":
    case "php":
    case "vitest":
    case "eslint":
      return NOOP_LINTER;
    default: {
      const _exhaustive: never = language;
      void _exhaustive;
      return NOOP_LINTER;
    }
  }
}
