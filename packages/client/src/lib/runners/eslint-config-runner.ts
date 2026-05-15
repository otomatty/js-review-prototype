/**
 * ESLint 設定採点ランナー (#111)。
 *
 * 「ルールを設計する側を学ぶ」 タイプの教材を採点する。 学習者は `eslint.config.js`
 * に `module.exports = { rules: { ... } }` を書き、 採点では:
 *
 *   1. `referenceImpl` (正解コード) を学習者の rules で lint → 違反 0 件
 *   2. 各 `mutants[i].code` (バグコード片) を学習者の rules で lint → 違反 ≥ 1 件
 *      (`expectedRuleId` 指定時はその ruleId が違反一覧に含まれること)
 *
 * の両方を満たした場合のみクリア扱い。 Vitest 教材 (#110) と並列の枠組み。
 *
 * # 設計トレードオフ: なぜ QuickJS ではなく `new Function`
 *
 * 学習者の `eslint.config.js` は **設定オブジェクトを取り出すだけ** の役目で、 副作用や複雑な
 * ロジックを書く課題ではない (`{ rules: { "no-var": "error" } }` のような短い data export)。
 * しかも提出コードは学習者自身のブラウザでしか実行されない (採点も同じブラウザ内で完結)。
 * このため隔離コストの高い QuickJS Worker は overkill と判断し、 `new Function("module",
 * "exports", code)` で評価する。 失敗は try/catch で reference テストの error に集約する。
 * 将来 plugin 読み込み等を許す場合や、 マルチテナント環境で動かす場合は再検討する。
 *
 * Linter インスタンスと globals は `../eslint-runner.ts` のシングルトンを再利用する。
 */

import type {
  CodeRunner,
  RunInput,
  RunOutput,
} from "@jsreview/shared/runner/types";
import type {
  ESLintRuleConfig,
  Mutant,
  MutationConfig,
  TestResult,
} from "@jsreview/shared/types";

import { GLOBALS, linter } from "../eslint-runner.js";

/** lint 失敗時に stdout に出す違反件数の上限 (見通し優先で頭から N 件)。 */
const MAX_MESSAGES_IN_STDOUT = 5;

interface ExtractedConfig {
  rules: Record<string, ESLintRuleConfig>;
  /** 学習者が languageOptions を上書きした場合に保持 (通常未指定)。 */
  languageOptions?: Record<string, unknown>;
}

interface LintMessage {
  ruleId: string | null;
  severity: 0 | 1 | 2;
  message: string;
  line: number;
  column: number;
}

/**
 * 学習者の `eslint.config.js` ソースを評価して rules を取り出す。
 *
 * 受け付ける export 形式:
 * - `module.exports = { rules: {...} }` (単一 flat-config object)
 * - `module.exports = [{ rules: {...} }, ...]` (flat-config 配列、 後勝ちで merge)
 *
 * 評価に失敗した場合は throw する (呼び出し側で reference テストの failure として表示)。
 */
function extractUserConfig(userCode: string): ExtractedConfig {
  const moduleObj: { exports: unknown } = { exports: {} };
  // 学習者の data export を読み取るための限定的な eval。 セキュリティ考察はファイル冒頭参照。
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function("module", "exports", userCode) as (
    mod: { exports: unknown },
    exp: unknown,
  ) => void;
  fn(moduleObj, moduleObj.exports);
  const exported = moduleObj.exports;
  const entries = Array.isArray(exported) ? exported : [exported];
  const merged: ExtractedConfig = { rules: {} };
  for (const entry of entries) {
    if (entry === null || typeof entry !== "object") {
      continue;
    }
    const e = entry as { rules?: unknown; languageOptions?: unknown };
    if (e.rules && typeof e.rules === "object") {
      Object.assign(merged.rules, e.rules as Record<string, ESLintRuleConfig>);
    }
    if (e.languageOptions && typeof e.languageOptions === "object") {
      merged.languageOptions = {
        ...(merged.languageOptions ?? {}),
        ...(e.languageOptions as Record<string, unknown>),
      };
    }
  }
  return merged;
}

/** 1 シナリオを学習者設定で lint する。 severity 0 (off) は除外し、 warn/error のみ返す。 */
function lintScenario(code: string, config: ExtractedConfig): LintMessage[] {
  let messages: LintMessage[];
  try {
    messages = linter.verify(code, {
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
        globals: GLOBALS,
        ...(config.languageOptions ?? {}),
      },
      rules: config.rules as never,
    });
  } catch {
    // verify 自体が落ちるのは rules 値が不正なケース等 (例: 存在しないオプション形式)。
    // 違反なし扱いにすると mutant が素通りしてしまうので、 合成エラー 1 件を返す。
    return [
      {
        ruleId: null,
        severity: 2,
        message: "ESLint Linter 設定の検証に失敗しました (rules の形式を確認してください)",
        line: 1,
        column: 1,
      },
    ];
  }
  return messages.filter((m) => m.severity >= 1);
}

function formatMessages(messages: LintMessage[]): string {
  if (messages.length === 0) {
    return "(違反なし)";
  }
  const head = messages.slice(0, MAX_MESSAGES_IN_STDOUT).map((m) => {
    const rule = m.ruleId ?? "(syntax)";
    return `${m.line}:${m.column} [${rule}] ${m.message}`;
  });
  const more =
    messages.length > MAX_MESSAGES_IN_STDOUT
      ? `\n... ほか ${messages.length - MAX_MESSAGES_IN_STDOUT} 件`
      : "";
  return head.join("\n") + more;
}

export const eslintConfigRunner: CodeRunner = {
  language: "eslint",
  run(input: RunInput): Promise<RunOutput> {
    const mutation = input.mutation;
    if (!mutation) {
      return Promise.reject(
        new Error(
          "eslint 課題には mutation 設定 (referenceImpl + mutants) が必要です (課題定義不整合)",
        ),
      );
    }
    if (input.testKind !== "eslint-config") {
      return Promise.reject(
        new Error(
          `eslint ランナは testKind: "eslint-config" のみサポートします (got ${input.testKind})`,
        ),
      );
    }
    const userConfigCode = input.files[input.entryFile] ?? "";
    const output =
      input.mode === "freerun"
        ? runFreerun(mutation, userConfigCode)
        : runGrading(mutation, userConfigCode);
    return Promise.resolve(output);
  },
};

function runGrading(
  mutation: MutationConfig,
  userConfigCode: string,
): RunOutput {
  const startedAt = performance.now();
  let config: ExtractedConfig;
  try {
    config = extractUserConfig(userConfigCode);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // 設定評価に失敗 → reference を fail にし、 全 mutant をスキップ。
    return {
      durationMs: Math.round(performance.now() - startedAt),
      results: [
        {
          name: "正解コードで違反 0 件",
          passed: false,
          error: `eslint.config.js の評価に失敗: ${msg}`,
        },
        ...mutation.mutants.map((m) =>
          buildMutantSkipped(m, "設定評価に失敗したためスキップ"),
        ),
      ],
    };
  }

  const refMessages = lintScenario(mutation.referenceImpl, config);
  const referenceResult = buildReferenceResult(refMessages);

  // reference が落ちた場合でも mutant 採点は続行する (Vitest 側と挙動が異なる: ESLint では
  // 学習者がルールを「効かせすぎ」 て正解コードまで違反扱いになっているケースが普通で、
  // どの mutant が撃破できているかの情報を見せた方が学習に有用)。
  const mutantResults = mutation.mutants.map((mutant) => {
    const messages = lintScenario(mutant.code, config);
    return buildMutantResult(mutant, messages);
  });

  return {
    durationMs: Math.round(performance.now() - startedAt),
    results: [referenceResult, ...mutantResults],
  };
}

function runFreerun(
  mutation: MutationConfig,
  userConfigCode: string,
): RunOutput {
  // freerun: 採点ではなく「いま定義した rules で何が出るか確認」 用途。
  // reference と各 mutant をそれぞれ 1 件の情報的 result として出す。
  const startedAt = performance.now();
  let config: ExtractedConfig;
  try {
    config = extractUserConfig(userConfigCode);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      durationMs: Math.round(performance.now() - startedAt),
      results: [
        { name: "eslint.config.js の評価", passed: false, error: msg },
      ],
    };
  }
  const results: TestResult[] = [];
  const refMessages = lintScenario(mutation.referenceImpl, config);
  results.push({
    name: "正解コードでの検査結果",
    passed: refMessages.length === 0,
    stdout: formatMessages(refMessages),
  });
  for (const m of mutation.mutants) {
    const messages = lintScenario(m.code, config);
    results.push({
      name: `mutant ${m.id} (${m.description}) での検査結果`,
      passed: messages.length >= 1,
      stdout: formatMessages(messages),
    });
  }
  return {
    durationMs: Math.round(performance.now() - startedAt),
    results,
  };
}

function buildReferenceResult(messages: LintMessage[]): TestResult {
  const name = "正解コードで違反 0 件";
  if (messages.length === 0) {
    return { name, passed: true };
  }
  return {
    name,
    passed: false,
    stdout: formatMessages(messages),
    error: `正解コードに ${messages.length} 件の違反が出ました (ルールが厳しすぎる可能性があります)`,
  };
}

function buildMutantResult(
  mutant: Mutant,
  messages: LintMessage[],
): TestResult {
  const name = `mutant ${mutant.id} を検出: ${mutant.description}`;
  if (messages.length === 0) {
    return {
      name,
      passed: false,
      error: "違反 0 件でした (このバグを検出するルールを有効にしましょう)",
    };
  }
  if (mutant.expectedRuleId !== undefined) {
    const hit = messages.some((m) => m.ruleId === mutant.expectedRuleId);
    if (!hit) {
      return {
        name,
        passed: false,
        stdout: formatMessages(messages),
        error: `期待ルール "${mutant.expectedRuleId}" の違反が含まれていません (検出されたのは別のルール)`,
      };
    }
  }
  return { name, passed: true, stdout: formatMessages(messages) };
}

function buildMutantSkipped(mutant: Mutant, reason: string): TestResult {
  return {
    name: `mutant ${mutant.id} を検出: ${mutant.description}`,
    passed: false,
    error: reason,
  };
}
