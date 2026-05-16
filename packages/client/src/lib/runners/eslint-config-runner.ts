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
 * # アーキテクチャ: なぜ QuickJS Worker で config を評価するか (#135 P1 レビュー対応)
 *
 * 学習者の `eslint.config.js` は副作用のない data export 専用とはいえ、 学習中に
 * `while(true)` のような無限ループを書くケースは現実的にあり得る。 メインスレッドで
 * `new Function` 同期評価すると UI ごと凍るため、 既存の QuickJS Worker (3s 壁時間制限) を
 * 流用して config 抽出を Worker 内で行う。 抽出済みの config はメインスレッドに JSON
 * シリアライズ済みで返り、 ブラウザ ESLint Linter (`linter.verify`) で reference + mutants
 * を採点する。
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
import {
  buildEslintConfigExtractionCode,
  ESLINT_CONFIG_REPORT_PREFIX,
  type ExtractionPayload,
} from "../eslint-config-shim.js";
import { runTestsLocally } from "../run-tests-local.js";

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
 * 学習者の `eslint.config.js` ソースを QuickJS Worker 内で評価して rules を取り出す。
 *
 * 受け付ける export 形式:
 * - `module.exports = { rules: {...} }` (単一 flat-config object)
 * - `module.exports = [{ rules: {...} }, ...]` (flat-config 配列、 後勝ちで merge)
 *
 * 評価失敗 (例外 / TIMEOUT / レポート行欠落 / JSON 化失敗) は throw する。
 * 呼び出し側で reference テストの failure として表示する。
 */
async function extractUserConfig(userCode: string): Promise<ExtractedConfig> {
  const { code, nonce } = buildEslintConfigExtractionCode(userCode);
  const response = await runTestsLocally({
    code,
    testKind: "stdout",
    tests: [],
    mode: "freerun",
  });
  const single = response.results[0];
  if (!single) {
    throw new Error("QuickJS から応答が返りませんでした");
  }
  // TIMEOUT / COMPILE_ERROR / 未捕捉例外があれば、 学習者コードの不具合として throw する。
  if (single.error) {
    throw new Error(single.error);
  }

  const expectedPrefix = `${ESLINT_CONFIG_REPORT_PREFIX}${nonce}:`;
  const stdout = single.stdout ?? "";
  // nonce 一致行を末尾から探す (偽レポート行が先に出ても本物の方が後出しで勝つ)。
  let reportLine: string | undefined;
  const lines = stdout.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith(expectedPrefix)) {
      reportLine = lines[i];
      break;
    }
  }
  if (reportLine === undefined) {
    throw new Error(
      "config レポート行が見つかりませんでした (シムの注入に失敗した可能性があります)",
    );
  }

  let payload: ExtractionPayload;
  try {
    payload = JSON.parse(reportLine.slice(expectedPrefix.length)) as ExtractionPayload;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`config レポートの JSON パースに失敗しました: ${msg}`);
  }
  if (!payload.ok) {
    throw new Error(payload.error ?? "(unknown error)");
  }

  const exported = payload.exports;
  const entries = Array.isArray(exported) ? exported : [exported];
  const merged: ExtractedConfig = { rules: {} };
  for (const entry of entries) {
    if (entry === null || typeof entry !== "object") {
      continue;
    }
    const e = entry as { rules?: unknown; languageOptions?: unknown };
    // 配列を `Object.assign` するとインデックスをキーにマージしてしまうので、 plain object のみを受ける。
    if (
      e.rules &&
      typeof e.rules === "object" &&
      !Array.isArray(e.rules)
    ) {
      Object.assign(merged.rules, e.rules as Record<string, ESLintRuleConfig>);
    }
    if (
      e.languageOptions &&
      typeof e.languageOptions === "object" &&
      !Array.isArray(e.languageOptions)
    ) {
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
    // 学習者の languageOptions を浅マージで上書きすると、 `globals` を渡された途端に
    // 既定の `console` 等が消えて `no-undef` 誤検出が増え、 採点に通らなくなる
    // (codex P2)。 globals だけは `GLOBALS` + 学習者指定の deep merge にする。
    const userLO = config.languageOptions ?? {};
    const userGlobalsRaw = userLO.globals;
    const userGlobals =
      userGlobalsRaw &&
      typeof userGlobalsRaw === "object" &&
      !Array.isArray(userGlobalsRaw)
        ? (userGlobalsRaw as Record<string, unknown>)
        : undefined;
    messages = linter.verify(code, {
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
        ...userLO,
        globals: { ...GLOBALS, ...(userGlobals ?? {}) } as never,
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
  async run(input: RunInput): Promise<RunOutput> {
    const mutation = input.mutation;
    if (!mutation) {
      throw new Error(
        "eslint 課題には mutation 設定 (referenceImpl + mutants) が必要です (課題定義不整合)",
      );
    }
    if (input.testKind !== "eslint-config") {
      throw new Error(
        `eslint ランナは testKind: "eslint-config" のみサポートします (got ${input.testKind})`,
      );
    }
    const userConfigCode = input.files[input.entryFile] ?? "";
    return input.mode === "freerun"
      ? runFreerun(mutation, userConfigCode)
      : runGrading(mutation, userConfigCode);
  },
};

async function runGrading(
  mutation: MutationConfig,
  userConfigCode: string,
): Promise<RunOutput> {
  const startedAt = performance.now();
  let config: ExtractedConfig;
  try {
    config = await extractUserConfig(userConfigCode);
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

async function runFreerun(
  mutation: MutationConfig,
  userConfigCode: string,
): Promise<RunOutput> {
  // freerun: 採点ではなく「いま定義した rules で何が出るか確認」 用途。
  // freerun のランナー契約は「結果 1 件のみ」 (PracticePage で `response.results[0]` を渡す)
  // のため、 reference + 各 mutant のシナリオ別違反一覧を 1 つの stdout に集約する。
  const startedAt = performance.now();
  let config: ExtractedConfig;
  try {
    config = await extractUserConfig(userConfigCode);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      durationMs: Math.round(performance.now() - startedAt),
      results: [
        { name: "eslint.config.js の評価", passed: false, error: msg },
      ],
    };
  }
  const sections: string[] = [];
  const refMessages = lintScenario(mutation.referenceImpl, config);
  sections.push(`▼ 正解コード\n${formatMessages(refMessages)}`);
  let allOk = refMessages.length === 0;
  for (const m of mutation.mutants) {
    const messages = lintScenario(m.code, config);
    // 採点側 (buildMutantResult) と同じ条件で freerun の pass/fail を判定する。
    // 「違反 ≥ 1 件」 だけでなく expectedRuleId 指定時はその ruleId が含まれていることまで要求。
    const hasViolation = messages.length > 0;
    const expectedHit =
      m.expectedRuleId === undefined ||
      messages.some((msg) => msg.ruleId === m.expectedRuleId);
    if (!hasViolation || !expectedHit) {
      allOk = false;
    }
    sections.push(
      `▼ mutant ${m.id} (${m.description})\n${formatMessages(messages)}`,
    );
  }
  return {
    durationMs: Math.round(performance.now() - startedAt),
    results: [
      {
        name: "ESLint 設定の動作確認",
        passed: allOk,
        stdout: sections.join("\n\n"),
      },
    ],
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
