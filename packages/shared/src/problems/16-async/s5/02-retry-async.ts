import type { Assignment } from "../../../types.js";

export const s5Ch16RetryAsync: Assignment = {
  id: "S5-Ch16-02-retry-async",
  stage: "S5",
  chapterId: "Ch16",
  sequence: 2,
  title: "Promise を最大 N 回までリトライする",
  newConcept:
    "async / await + try / catch をループに乗せ、 Promise が reject したら毎回 factory を再呼び出ししてリトライする",
  estimatedMinutes: 55,
  difficulty: 2,
  testKind: "function",
  description: `## やること

引数なしで Promise を返す **ファクトリ関数** \`factory\` と **最大試行回数** \`maxAttempts\` (\`1\` 以上の整数) を受け取り、 次の規則で値を返す async 関数 \`retryAsync\` を実装してください。

- \`factory()\` を **最大 \`maxAttempts\` 回** 呼び出す
- いずれかの試行で **resolve した値** が得られたら、 その値をそのまま返す (残りの試行はしない)
- \`maxAttempts\` 回 すべて reject したら、 **最後の reject 理由をそのまま throw する** (= 返した Promise が reject する)

\`\`\`js
let count = 0;
await retryAsync(() => {
  count++;
  return count < 3 ? Promise.reject("fail-" + count) : Promise.resolve(count);
}, 5);
// → 3 (3 回目で成功)

await retryAsync(() => Promise.resolve(42), 3);
// → 42 (1 回目で成功すれば残りは呼ばれない)

await retryAsync(() => Promise.reject("nope"), 3);
// → Promise が reject する (理由は "nope")
\`\`\`

## ポイント

- 同期版のリトライ (Ch13-S4-03) と違って、 **factory が Promise を返す** ので await して値を取り出します。
- \`try { return await factory(); } catch (e) { /* 次の試行へ */ }\` を **ループの中** に書くのが定番。 成功したら \`return\` で即抜けます。
- 全失敗時は \`return fallback;\` ではなく **最後の reject 理由をそのまま \`throw\`** します。 呼び出し側で \`.catch\` / \`try / catch\` が書けるようにするためです。
- factory は **毎回呼び直す** (一度作った Promise を保持して await し直しても、 解決済みの結果しか得られないので意味がありません)。

## ヒント

- AST で **async 関数** / **AwaitExpression** / **TryStatement** を必須にしています。 **\`.catch(...)\` メソッド** と **\`.then(...)\`** は forbidden です。
- catch ブロックで受け取った例外を \`lastError\` のような変数に覚えておき、 ループを抜けた後に \`throw lastError;\` します。
`,
  starterCode: `// async function を使い、 factory() を最大 maxAttempts 回まで await する
// 成功時はその値を return、 全失敗時は最後の reject 理由を throw
function retryAsync(factory, maxAttempts) {
  // ここに実装する
}
`,
  entryPoints: ["retryAsync"],
  demoCall: `(async () => {
  let count = 0;
  const v = await retryAsync(() => {
    count++;
    return count < 3 ? Promise.reject("fail-" + count) : Promise.resolve(count);
  }, 5);
  console.log(v);
})();`,
  tests: [
    {
      name: "1 回目で成功すれば即その値を返す",
      code: `(async () => {
        let calls = 0;
        const v = await retryAsync(() => { calls++; return Promise.resolve(42); }, 5);
        return v === 42 && calls === 1;
      })()`,
    },
    {
      name: "3 回目で成功 (factory は 3 回呼ばれる)",
      code: `(async () => {
        let calls = 0;
        const v = await retryAsync(() => {
          calls++;
          return calls < 3 ? Promise.reject("fail-" + calls) : Promise.resolve("ok");
        }, 5);
        return v === "ok" && calls === 3;
      })()`,
    },
    {
      name: "全失敗時は最後の reject 理由が throw される",
      code: `(async () => {
        let calls = 0;
        try {
          await retryAsync(() => {
            calls++;
            return Promise.reject("reason-" + calls);
          }, 3);
          return false;
        } catch (e) {
          return e === "reason-3" && calls === 3;
        }
      })()`,
    },
    {
      name: "Error オブジェクトでの reject もそのまま throw される (参照一致)",
      code: `(async () => {
        const errs = [new Error("a"), new Error("b")];
        let calls = 0;
        try {
          await retryAsync(() => { const e = errs[calls]; calls++; return Promise.reject(e); }, 2);
          return false;
        } catch (e) {
          return e === errs[1];
        }
      })()`,
    },
    {
      name: "maxAttempts = 1 で失敗すれば 1 回試行して reject",
      code: `(async () => {
        let calls = 0;
        try {
          await retryAsync(() => { calls++; return Promise.reject("once"); }, 1);
          return false;
        } catch (e) {
          return e === "once" && calls === 1;
        }
      })()`,
    },
    {
      name: "maxAttempts = 1 で成功すれば 1 回で値が返る",
      code: `(async () => {
        let calls = 0;
        const v = await retryAsync(() => { calls++; return Promise.resolve(7); }, 1);
        return v === 7 && calls === 1;
      })()`,
    },
    {
      name: "成功後は factory が呼ばれない (試行回数は成功時点で止まる)",
      code: `(async () => {
        let calls = 0;
        await retryAsync(() => {
          calls++;
          return calls < 2 ? Promise.reject("x") : Promise.resolve("ok");
        }, 100);
        return calls === 2;
      })()`,
    },
    {
      name: "resolve(0) / resolve(null) も値として扱われる (falsy で再試行しない)",
      code: `(async () => {
        let calls = 0;
        const v = await retryAsync(() => { calls++; return Promise.resolve(0); }, 3);
        return v === 0 && calls === 1;
      })()`,
    },
    {
      name: "戻り値は Promise",
      code: `retryAsync(() => Promise.resolve(1), 1) instanceof Promise`,
    },
  ],
  hints: [
    "let lastError; for (let i = 0; i < maxAttempts; i++) { try { return await factory(); } catch (e) { lastError = e; } } throw lastError;",
    "解答例:\n```js\nasync function retryAsync(factory, maxAttempts) {\n  let lastError;\n  for (let i = 0; i < maxAttempts; i++) {\n    try {\n      return await factory();\n    } catch (e) {\n      lastError = e;\n    }\n  }\n  throw lastError;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数で書く" },
        {
          kind: "node",
          nodeType: "AwaitExpression",
          label: "await で factory の Promise を解決する",
        },
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try / catch で reject を受け止める",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        {
          kind: "method",
          name: "catch",
          label: ".catch(...) ではなく try / catch を使う",
        },
        {
          kind: "method",
          name: "then",
          label: ".then ではなく await を使う",
        },
      ],
    },
  },
  solution: `async function retryAsync(factory, maxAttempts) {
  let lastError;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await factory();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
`,
  badSolutions: [
    {
      code: `function retryAsync(factory, maxAttempts) {
  let p = factory();
  for (let i = 1; i < maxAttempts; i++) {
    p = p.catch(() => factory());
  }
  return p;
}
`,
      description:
        ".catch / .then ベースで書いている (AST forbidden 違反 + async-fn / AwaitExpression / TryStatement の required 違反)",
    },
    {
      code: `async function retryAsync(factory, maxAttempts) {
  let lastError;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await factory();
    } catch (e) {
      lastError = e;
    }
  }
  return lastError;
}
`,
      description:
        "全失敗時に最後の理由を throw せず return しているので、 呼び出し側の try / catch で受けられない (「全失敗時は throw」 テスト失敗)",
    },
    {
      code: `async function retryAsync(factory, maxAttempts) {
  try {
    return await factory();
  } catch (e) {
    throw e;
  }
}
`,
      description:
        "1 回しか試行しておらず、 maxAttempts 回リトライしていない (call 回数のテスト失敗)",
    },
    {
      code: `async function retryAsync(factory, maxAttempts) {
  const p = factory();
  let lastError;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await p;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
`,
      description:
        "factory を 1 度しか呼んでおらず、 同じ Promise を await し直しているだけなので毎回同じ結果になる (「3 回目で成功」 テスト失敗 / 呼び出し回数も合わない)",
    },
  ],
  mdnSections: [
    {
      heading: "try...catch",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
    {
      heading: "async function",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function",
      pageTitle: "async function",
    },
    {
      heading: "Promise を使う",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises",
      pageTitle: "Promise を使う",
    },
  ],
};
