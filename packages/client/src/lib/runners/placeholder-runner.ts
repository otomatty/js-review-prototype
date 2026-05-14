/**
 * 未実装言語向けの placeholder ランナー (#105 / #100)。
 *
 * `getRunner("python")` 等が呼ばれたときに「未実装」 を明示的に伝える役割。
 * これは仕様上の挙動で、 各言語の実装は roadmap (#100) の後続 issue で追加する:
 *
 * - `"python"` (#108) … Pyodide ベース
 * - `"vitest"` (#110) … mutation testing 採点エンジン
 * - `"eslint"` (#111) … ルール設計 mutation 採点
 * - `"php"`   (#112) … php-wasm ベース
 *
 * 採点時は `useGradeRunner` が `RUNNER_ERROR: ...` 文言として UI に流す。
 */

import type {
  CodeRunner,
  RunInput,
  RunOutput,
} from "@jsreview/shared/runner/types";
import type { Language } from "@jsreview/shared/types";

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: "JavaScript",
  sql: "SQL",
  python: "Python",
  php: "PHP",
  vitest: "Vitest 教材",
  eslint: "ESLint 教材",
};

export function createPlaceholderRunner(language: Language): CodeRunner {
  return {
    language,
    run(_input: RunInput): Promise<RunOutput> {
      return Promise.reject(
        new Error(
          `${LANGUAGE_LABELS[language]} ランナーは未実装です (roadmap #100 で対応予定)`,
        ),
      );
    },
  };
}
