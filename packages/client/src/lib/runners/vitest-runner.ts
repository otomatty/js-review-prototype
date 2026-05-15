/**
 * Vitest mutation testing ランナー (#110)。
 *
 * 「テストを書く側を学ぶ」 タイプの教材を採点する。 学習者は `entryFile` (例: `main.test.js`)
 * に `describe` / `it` / `expect` でテストを書き、 採点では:
 *
 *   1. `referenceImpl + userTest` で全テスト pass することを確認
 *   2. 各 `mutants[i].code + userTest` で 1 件以上 fail することを確認 (mutant kill)
 *
 * の両方を満たした場合のみクリア扱いになる。
 *
 * 実行エンジンは既存の QuickJS Worker (`run-tests-local.ts`) を再利用する。
 * 1 シナリオ = `mode: "freerun"` で 1 回呼び出し、 シムが `console.log` で出した
 * `__JSREVIEW_VITEST_REPORT__:` 行をパースして per-test 結果を取り出す。
 * 各シナリオは fresh な QuickJS context で実行されるため、 mutant 間で状態は分離される。
 *
 * Vitest フルバンドルや `@vitest/runner` は採用していない (bundle 増加を避けるため、 #110 設計判断)。
 * 提供 API は `vitest-shim.ts` を参照。
 */

import type {
  CodeRunner,
  RunInput,
  RunOutput,
} from "@jsreview/shared/runner/types";
import type {
  Mutant,
  MutationConfig,
  TestResult,
} from "@jsreview/shared/types";

import { runTestsLocally } from "../run-tests-local.js";
import {
  buildScenarioCode,
  VITEST_REPORT_PREFIX,
  type VitestTestRecord,
} from "../vitest-shim.js";

interface ScenarioOutcome {
  /** シナリオ内で実行された各 it/test の結果。 */
  tests: VitestTestRecord[];
  /** QuickJS 側のエラー (構文・タイムアウト等)。 取れた場合 tests は空になりやすい。 */
  scenarioError?: string;
  /** ランナー独自の追加 stdout (本来不要な console.log 等)。 デバッグ用に保持。 */
  extraStdout?: string;
}

async function runScenario(
  impl: string,
  userTest: string,
): Promise<ScenarioOutcome> {
  // nonce は呼び出しごとにユニーク。 シムが nonce 入りのレポート行を吐き、
  // ランナーは自分が生成した nonce と一致する行だけを採点に使う (codereview: stdout 偽装対策)。
  const { code, nonce } = buildScenarioCode(impl, userTest);
  const expectedPrefix = `${VITEST_REPORT_PREFIX}${nonce}:`;
  const response = await runTestsLocally({
    code,
    testKind: "stdout",
    tests: [],
    mode: "freerun",
  });
  const single = response.results[0];
  if (!single) {
    return { tests: [], scenarioError: "QuickJS から応答が返りませんでした" };
  }
  const stdout = single.stdout ?? "";
  const lines = stdout.split("\n");
  // nonce で固有化された prefix を持つ行だけを採点対象とする。 学習者が
  // 偽の REPORT 行を console.log で先に出しても nonce が一致しないため無視される。
  // extraLines は末尾から push して、 最後に reverse で元順序に戻す (unshift の O(N^2) を避ける)。
  let reportLine: string | undefined;
  const extraLinesReversed: string[] = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (reportLine === undefined && line.startsWith(expectedPrefix)) {
      reportLine = line;
    } else if (line.length > 0) {
      extraLinesReversed.push(line);
    }
  }
  const extraLines = extraLinesReversed.reverse();

  if (reportLine === undefined) {
    return {
      tests: [],
      scenarioError:
        single.error ??
        "テスト結果のレポート行が見つかりませんでした (シムの注入に失敗した可能性があります)",
      extraStdout: stdout || undefined,
    };
  }

  let parsed: VitestTestRecord[];
  try {
    const json = reportLine.slice(expectedPrefix.length);
    const raw: unknown = JSON.parse(json);
    if (!Array.isArray(raw)) {
      throw new Error("expected array");
    }
    parsed = raw.filter(isVitestTestRecord);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      tests: [],
      scenarioError: `テスト結果のパースに失敗しました: ${msg}`,
      extraStdout: stdout || undefined,
    };
  }

  return {
    tests: parsed,
    scenarioError: single.error,
    extraStdout: extraLines.length > 0 ? extraLines.join("\n") : undefined,
  };
}

function isVitestTestRecord(v: unknown): v is VitestTestRecord {
  if (typeof v !== "object" || v === null) {return false;}
  const r = v as Record<string, unknown>;
  return typeof r.name === "string" && typeof r.passed === "boolean";
}

/** 1 シナリオの per-test 結果を画面表示用の文字列に整形する。 */
function formatScenarioStdout(tests: VitestTestRecord[]): string {
  if (tests.length === 0) {return "(テストが 1 件も検出されませんでした)";}
  return tests
    .map((t) => {
      const mark = t.passed ? "✓" : "✗";
      const err = t.error ? `  — ${t.error}` : "";
      return `${mark} ${t.name}${err}`;
    })
    .join("\n");
}

export const vitestRunner: CodeRunner = {
  language: "vitest",
  async run(input: RunInput): Promise<RunOutput> {
    const mutation = input.mutation;
    if (!mutation) {
      // 課題定義不整合: `language: "vitest"` かつ `testKind: "mutation"` なら mutation 必須。
      // ここで明示的に throw すると useGradeRunner 側で RUNNER_ERROR として UI に出る。
      throw new Error(
        "vitest 課題には mutation 設定 (referenceImpl + mutants) が必要です (課題定義不整合)",
      );
    }
    if (input.testKind !== "mutation") {
      throw new Error(
        `vitest ランナは testKind: "mutation" のみサポートします (got ${input.testKind})`,
      );
    }

    const userTest = input.files[input.entryFile] ?? "";

    if (input.mode === "freerun") {
      // freerun: 採点ではなく「いまの状態でテストを 1 回流す」 用途。
      // reference 実装に対してユーザテストを実行し、 per-test 結果を stdout として返す。
      return runFreerun(mutation, userTest);
    }

    return runGrading(mutation, userTest);
  },
};

async function runFreerun(
  mutation: MutationConfig,
  userTest: string,
): Promise<RunOutput> {
  const startedAt = performance.now();
  const outcome = await runScenario(mutation.referenceImpl, userTest);
  const durationMs = Math.round(performance.now() - startedAt);
  // grading と同じく、 scenarioError が立っていれば tests がパース済みでも失敗扱いにする
  // (codereview: 偽レポート + throw / 例外発生時にも UI に正しく失敗を伝えるため)。
  if (outcome.scenarioError) {
    return {
      durationMs,
      results: [
        {
          name: "正解実装でテストを実行",
          passed: false,
          stdout:
            outcome.tests.length > 0
              ? formatScenarioStdout(outcome.tests)
              : outcome.extraStdout,
          error: outcome.scenarioError,
        },
      ],
    };
  }
  const passedAll = outcome.tests.every((t) => t.passed);
  return {
    durationMs,
    results: [
      {
        name: "正解実装でテストを実行",
        passed: passedAll,
        stdout: formatScenarioStdout(outcome.tests),
      },
    ],
  };
}

async function runGrading(
  mutation: MutationConfig,
  userTest: string,
): Promise<RunOutput> {
  const startedAt = performance.now();

  const refOutcome = await runScenario(mutation.referenceImpl, userTest);
  const referenceResult = buildReferenceResult(refOutcome);

  // reference 自体に COMPILE_ERROR / TIMEOUT / 例外が出た場合、 同じエラーは全 mutant でも
  // 発生する想定なので mutant シナリオはスキップして時間節約する。
  // scenarioError があれば最終結果は不合格になるため tests がパース済みでもスキップして問題ない
  // (coderabbit: 一貫性のため scenarioError の有無だけで判定する)。
  if (refOutcome.scenarioError) {
    const skipped: TestResult[] = mutation.mutants.map((m) =>
      buildMutantSkipped(m, "reference 実装の評価に失敗したためスキップ"),
    );
    return {
      durationMs: Math.round(performance.now() - startedAt),
      results: [referenceResult, ...skipped],
    };
  }

  const mutantResults: TestResult[] = [];
  for (const mutant of mutation.mutants) {
    const outcome = await runScenario(mutant.code, userTest);
    mutantResults.push(buildMutantResult(mutant, outcome));
  }
  return {
    durationMs: Math.round(performance.now() - startedAt),
    results: [referenceResult, ...mutantResults],
  };
}

function buildReferenceResult(outcome: ScenarioOutcome): TestResult {
  const name = "正解実装でユーザのテストがすべて PASS する";
  // QuickJS 側で何らかのエラー (TIMEOUT / COMPILE_ERROR / 未捕捉例外) が出ていれば、
  // 既にパース済みの tests レコードがあっても信頼してはいけない (#134 codex P1)。
  // 学習者が偽の `__JSREVIEW_VITEST_REPORT__:` 行を console.log で出した直後に
  // throw すると、 シムの本来のレポート行が出る前にスクリプトが止まり、 偽レコードが
  // scenarioError と共存してしまうため。 安全側に倒して常に fail 扱いにする。
  if (outcome.scenarioError) {
    return {
      name,
      passed: false,
      stdout:
        outcome.tests.length > 0
          ? formatScenarioStdout(outcome.tests)
          : outcome.extraStdout,
      error: outcome.scenarioError,
    };
  }
  if (outcome.tests.length === 0) {
    return {
      name,
      passed: false,
      stdout: outcome.extraStdout,
      error:
        "テストが 1 件も検出されませんでした (`it(...)` でテストを書きましたか?)",
    };
  }
  const allPass = outcome.tests.every((t) => t.passed);
  const failingNames = outcome.tests
    .filter((t) => !t.passed)
    .map((t) => t.name)
    .join(", ");
  return {
    name,
    passed: allPass,
    stdout: formatScenarioStdout(outcome.tests),
    error: allPass ? undefined : `失敗したテスト: ${failingNames}`,
  };
}

function buildMutantResult(
  mutant: Mutant,
  outcome: ScenarioOutcome,
): TestResult {
  const name = `mutant ${mutant.id} を撃破: ${mutant.description}`;
  // mutant 実装に構文エラー / 例外 / TIMEOUT が出るのは reference シナリオでは出なかった
  // = 学習者のテストが mutant 実装に対して実際に問題を引き起こした、 と解釈する。
  // パース済みの tests レコードがあっても scenarioError が立っていれば信頼せず、
  // 一律 「撃破」 扱いにする (#134 codex P1: 偽レコード + throw による不正クリア対策)。
  if (outcome.scenarioError) {
    return {
      name,
      passed: true,
      stdout: `mutant 実装で例外が発生したため撃破扱いとしました\n${outcome.scenarioError}`,
    };
  }
  // テストが 1 件も収集されない (= it が呼ばれていない) ケースは reference 側で既に弾く想定。
  // ここで保険として撃破扱いにしない (mutant を素通りさせないため)。
  if (outcome.tests.length === 0) {
    return {
      name,
      passed: false,
      stdout: outcome.extraStdout,
      error: "テストが 1 件も実行されませんでした",
    };
  }
  const killed = outcome.tests.some((t) => !t.passed);
  return {
    name,
    passed: killed,
    stdout: formatScenarioStdout(outcome.tests),
    error: killed
      ? undefined
      : "全テストが PASS してしまいました (mutant を検出できていません — 期待値や境界値を追加しましょう)",
  };
}

function buildMutantSkipped(mutant: Mutant, reason: string): TestResult {
  return {
    name: `mutant ${mutant.id} を撃破: ${mutant.description}`,
    passed: false,
    error: reason,
  };
}
