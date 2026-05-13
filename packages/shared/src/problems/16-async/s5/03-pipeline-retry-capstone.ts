import type { Assignment } from "../../../types.js";

export const s5Ch16PipelineRetryCapstone: Assignment = {
  id: "S5-Ch16-03-pipeline-retry-capstone",
  stage: "S5",
  chapterId: "Ch16",
  sequence: 3,
  title: "[卒業課題] リトライ付き非同期パイプラインを組む",
  newConcept:
    "依存チェーンとリトライを組み合わせる: 各ステップを N 回までリトライしながら値を次のステップに伝播し、 失敗位置を含む結果オブジェクトを返す",
  estimatedMinutes: 80,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

初期値 \`input\`、 ステップ関数の配列 \`steps\` (各要素は \`async (value) => nextValue\`)、 各ステップの最大試行回数 \`maxAttemptsPerStep\` を受け取り、 次の規則で結果を返す async 関数 \`runPipeline\` を実装してください。

- ステップを **配列の先頭から順** に実行する
- 各ステップで前ステップの解決値を引数として渡す (依存チェーン)
- 各ステップは **\`maxAttemptsPerStep\` 回まで** リトライする (rejection するたびに同じ value で再試行)
- 全てのステップが成功したら \`{ ok: true, value: 最終値 }\` を返す
- どこかのステップが \`maxAttemptsPerStep\` 回連続で reject したら、 \`{ ok: false, failedAt: ステップの index, reason: 最後の reject 理由 }\` を返す (throw はしない)

\`\`\`js
const result = await runPipeline(
  1,
  [
    async (v) => v + 10,                        // 1 + 10 = 11
    async (v) => v * 2,                         // 11 * 2 = 22
    async (v) => v - 5,                         // 22 - 5 = 17
  ],
  3,
);
// → { ok: true, value: 17 }

let tries = 0;
await runPipeline(
  "x",
  [
    async (v) => v + "-a",                                 // 成功
    async (v) => { tries++; if (tries < 3) throw "bad"; return v + "-b"; },  // 3 回目で成功
  ],
  3,
);
// → { ok: true, value: "x-a-b" }、 ステップ 2 の factory は 3 回呼ばれる

await runPipeline(
  0,
  [async (v) => v + 1, async () => Promise.reject("nope")],
  2,
);
// → { ok: false, failedAt: 1, reason: "nope" }
\`\`\`

## ポイント

- これは **S5 卒業課題のひとつ**。 S5 で見てきた 2 つのパターンを 1 本に組み立てます:
  - **依存チェーン** (Problem 1) — 前の解決値を次のステップに渡す
  - **リトライ** (Problem 2) — 各ステップは N 回まで再試行できる
- 関数が長くなりがちなので、 **リトライ部分を内部ヘルパ async 関数** に切り出して書くと S5 の lint 制約 (\`complexity ≤ 5\`、 \`max-depth ≤ 3\`) に余裕で収まります (解答例参照)。
- 「全失敗時に throw する」 のではなく **\`{ ok: false, failedAt, reason }\` を resolve で返す** のがこの関数の役目。 呼び出し側は \`await\` 1 回で成功 / 失敗を分岐できます。
- ステップが reject したら、 **次のステップは呼び出さない**。 失敗した時点で打ち切ります。

## ヒント

- AST で **async 関数** / **AwaitExpression** / **TryStatement** / **ReturnStatement** を必須にしています。 **\`.then\`** と **\`.catch\`** は forbidden、 **\`Promise.all\`** も依存チェーンには合わないので forbidden です。
- 外側ループは \`for (let i = 0; i < steps.length; i++)\`、 内側ループはステップごとのリトライ。 内側を **ヘルパ関数** に切り出すと両方が浅く保てます。
- \`failedAt\` は **ステップの 0 始まり index**。 reason は **最後の reject 理由** (それまでの失敗は捨ててよい)。
`,
  starterCode: `// async function を使い、 各ステップを maxAttemptsPerStep 回までリトライしながら
// 順番に await し、 成功時は { ok: true, value } を、 失敗時は { ok: false, failedAt, reason } を返す
function runPipeline(input, steps, maxAttemptsPerStep) {
  // ここに実装する
  // ヒント: リトライ部分は内部の async 関数に切り出すと書きやすい
}
`,
  entryPoints: ["runPipeline"],
  demoCall: `(async () => {
  const r = await runPipeline(1, [async (v) => v + 10, async (v) => v * 2], 3);
  console.log(JSON.stringify(r));
})();`,
  tests: [
    {
      name: "全ステップ初回成功で { ok: true, value: 最終値 }",
      code: `(async () => {
        const r = await runPipeline(1, [
          async (v) => v + 10,
          async (v) => v * 2,
          async (v) => v - 5,
        ], 3);
        return r.ok === true && r.value === 17;
      })()`,
    },
    {
      name: "各ステップは前ステップの解決値を引数として受け取る",
      code: `(async () => {
        const received = [];
        await runPipeline("x", [
          async (v) => { received.push(v); return v + "-a"; },
          async (v) => { received.push(v); return v + "-b"; },
          async (v) => { received.push(v); return v + "-c"; },
        ], 2);
        return JSON.stringify(received) === JSON.stringify(["x", "x-a", "x-a-b"]);
      })()`,
    },
    {
      name: "途中ステップが 2 回失敗して 3 回目で成功するケース (リトライが動く)",
      code: `(async () => {
        let tries = 0;
        const r = await runPipeline("x", [
          async (v) => v + "-a",
          async (v) => { tries++; if (tries < 3) { throw "bad-" + tries; } return v + "-b"; },
          async (v) => v + "-c",
        ], 3);
        return r.ok === true && r.value === "x-a-b-c" && tries === 3;
      })()`,
    },
    {
      name: "あるステップで全試行失敗すると { ok: false, failedAt, reason }",
      code: `(async () => {
        const r = await runPipeline(0, [
          async (v) => v + 1,
          async () => Promise.reject("nope"),
          async (v) => v * 10,
        ], 2);
        return r.ok === false && r.failedAt === 1 && r.reason === "nope";
      })()`,
    },
    {
      name: "失敗したステップの次のステップは呼ばれない",
      code: `(async () => {
        let thirdCalled = false;
        await runPipeline(0, [
          async (v) => v + 1,
          async () => Promise.reject("x"),
          async (v) => { thirdCalled = true; return v; },
        ], 2);
        return thirdCalled === false;
      })()`,
    },
    {
      name: "失敗時の reason は最後の reject 理由 (それまでの失敗は捨てる)",
      code: `(async () => {
        let n = 0;
        const r = await runPipeline(0, [
          async () => { n++; return Promise.reject("reason-" + n); },
        ], 4);
        return r.ok === false && r.failedAt === 0 && r.reason === "reason-4" && n === 4;
      })()`,
    },
    {
      name: "steps が空なら何も呼ばずに { ok: true, value: input }",
      code: `(async () => {
        const r = await runPipeline(42, [], 3);
        return r.ok === true && r.value === 42;
      })()`,
    },
    {
      name: "maxAttemptsPerStep = 1 で 1 回目に失敗すると即 failedAt が返る",
      code: `(async () => {
        let calls = 0;
        const r = await runPipeline("x", [
          async () => { calls++; return Promise.reject("once"); },
        ], 1);
        return r.ok === false && r.failedAt === 0 && r.reason === "once" && calls === 1;
      })()`,
    },
    {
      name: "value が 0 / null でも falsy 扱いされず次ステップに渡る",
      code: `(async () => {
        const r = await runPipeline(5, [
          async () => 0,
          async (v) => v === 0 ? null : "wrong",
          async (v) => v === null ? "ok" : "wrong-" + String(v),
        ], 2);
        return r.ok === true && r.value === "ok";
      })()`,
    },
    {
      name: "戻り値は Promise",
      code: `runPipeline(0, [], 1) instanceof Promise`,
    },
  ],
  hints: [
    "内部に async function attemptStep(step, value, maxAttempts) { ... } を切り出すと、 main 側は for ループで attemptStep を await するだけで済みます。",
    "attemptStep の戻り値は { ok: true, value } または { ok: false, reason } の形にしておくと、 main 側でそのまま分岐できます。",
    `解答例:
\`\`\`js
async function runPipeline(input, steps, maxAttemptsPerStep) {
  async function attemptStep(step, value) {
    let lastError;
    for (let i = 0; i < maxAttemptsPerStep; i++) {
      try {
        return { ok: true, value: await step(value) };
      } catch (e) {
        lastError = e;
      }
    }
    return { ok: false, reason: lastError };
  }

  let value = input;
  for (let i = 0; i < steps.length; i++) {
    const r = await attemptStep(steps[i], value);
    if (!r.ok) {
      return { ok: false, failedAt: i, reason: r.reason };
    }
    value = r.value;
  }
  return { ok: true, value };
}
\`\`\``,
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数で書く" },
        {
          kind: "node",
          nodeType: "AwaitExpression",
          label: "await でステップの解決値を取り出す",
        },
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try / catch でステップの reject を受け止めてリトライする",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "return で { ok, value } / { ok: false, failedAt, reason } を返す",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        {
          kind: "method",
          name: "then",
          label: ".then ではなく await を使う",
        },
        {
          kind: "method",
          name: "catch",
          label: ".catch(...) ではなく try / catch を使う",
        },
        {
          kind: "method",
          name: "all",
          label:
            "ステップは前の結果を必要とする依存チェーンなので Promise.all で並列化できない",
        },
      ],
    },
  },
  solution: `async function runPipeline(input, steps, maxAttemptsPerStep) {
  async function attemptStep(step, value) {
    let lastError;
    for (let i = 0; i < maxAttemptsPerStep; i++) {
      try {
        return { ok: true, value: await step(value) };
      } catch (e) {
        lastError = e;
      }
    }
    return { ok: false, reason: lastError };
  }

  let value = input;
  for (let i = 0; i < steps.length; i++) {
    const r = await attemptStep(steps[i], value);
    if (!r.ok) {
      return { ok: false, failedAt: i, reason: r.reason };
    }
    value = r.value;
  }
  return { ok: true, value };
}
`,
  badSolutions: [
    {
      code: `async function runPipeline(input, steps, maxAttemptsPerStep) {
  const values = await Promise.all(steps.map((step) => step(input)));
  return { ok: true, value: values[values.length - 1] };
}
`,
      description:
        "Promise.all で並列化しているので step 同士の依存関係 (前の結果を次に渡す) が壊れている (AST forbidden 違反 + 「各ステップは前ステップの解決値を受け取る」 テスト失敗)",
    },
    {
      code: `async function runPipeline(input, steps, maxAttemptsPerStep) {
  let value = input;
  for (let i = 0; i < steps.length; i++) {
    try {
      value = await steps[i](value);
    } catch (e) {
      throw e;
    }
  }
  return { ok: true, value };
}
`,
      description:
        "失敗時に throw してしまっており、 { ok: false, failedAt, reason } の形で resolve していない (失敗時テスト失敗)",
    },
    {
      code: `async function runPipeline(input, steps, maxAttemptsPerStep) {
  let value = input;
  for (let i = 0; i < steps.length; i++) {
    let lastError;
    let succeeded = false;
    try {
      value = await steps[i](value);
      succeeded = true;
    } catch (e) {
      lastError = e;
    }
    if (!succeeded) {
      return { ok: false, failedAt: i, reason: lastError };
    }
  }
  return { ok: true, value };
}
`,
      description:
        "リトライしておらず 1 回試行で次に進んでいる (「2 回失敗して 3 回目に成功」 テスト失敗)",
    },
    {
      code: `async function runPipeline(input, steps, maxAttemptsPerStep) {
  async function attemptStep(step, value) {
    let lastError;
    for (let i = 0; i < maxAttemptsPerStep; i++) {
      try {
        return { ok: true, value: await step(value) };
      } catch (e) {
        lastError = e;
      }
    }
    return { ok: false, reason: lastError };
  }

  let value = input;
  for (let i = 0; i < steps.length; i++) {
    const r = await attemptStep(steps[i], value);
    if (!r.ok) {
      return { ok: false, failedAt: i, reason: r.reason };
    }
    value = r.value;
  }
  return { ok: true, value: input };
}
`,
      description:
        "最終的に value ではなく input をそのまま返している (「全ステップ初回成功で最終値」 テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "async function",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function",
      pageTitle: "async function",
    },
    {
      heading: "await",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await",
      pageTitle: "await",
    },
    {
      heading: "try...catch",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
    {
      heading: "Promise を使う",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises",
      pageTitle: "Promise を使う",
    },
  ],
};
