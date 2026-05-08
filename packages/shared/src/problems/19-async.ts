import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const asyncTopic: Assignment[] = [
  // ────────────────────────────────────────────────
  // 19-1: Promise を返す関数 (resolve / reject)
  // ────────────────────────────────────────────────
  {
    id: "promise-double-or-reject",
    topicId: "async",
    title: "値を倍にする Promise (負数は reject)",
    difficulty: 1,
    description: `## 値を倍にする Promise (負数は reject)

数値 \`n\` を受け取り、**Promise を返す** 関数 \`asyncDouble\` を実装してください。

- \`n >= 0\` のとき: \`n * 2\` を **resolve** する
- \`n < 0\` のとき: \`Error\` を **reject** する (メッセージは任意)

### 入出力例

\`\`\`js
asyncDouble(5).then(v => v)         // → 10
asyncDouble(0).then(v => v)         // → 0
asyncDouble(-1).catch(e => e)       // → Error インスタンス
\`\`\`

### 制約

- \`new Promise((resolve, reject) => {...})\` を使う
- 同期で値を返さない (必ず Promise を返す)
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `function asyncDouble(n) {
  return null;
}
`,
    solution: `function asyncDouble(n) {
  return new Promise((resolve, reject) => {
    if (n >= 0) {
      resolve(n * 2);
    } else {
      reject(new Error('negative input'));
    }
  });
}
`,
    badSolutions: [
      {
        description: "Promise を返さず同期で値を返している",
        code: `function asyncDouble(n) {
  if (n >= 0) return n * 2;
  throw new Error('negative input');
}
`,
      },
    ],
    entryPoints: ["asyncDouble"],
    tests: [
      {
        name: "正値で resolve",
        weight: 25,
        code: "asyncDouble(5).then(v => v === 10)",
      },
      {
        name: "0 でも resolve",
        weight: 25,
        code: "asyncDouble(0).then(v => v === 0)",
      },
      {
        name: "負値で reject",
        weight: 25,
        code: "asyncDouble(-3).then(() => false, e => e instanceof Error)",
      },
      {
        name: "戻り値は Promise",
        weight: 25,
        code: "(() => { const r = asyncDouble(1); return r && typeof r.then === 'function'; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "new Promise(...) を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 19-2: then チェーン
  // ────────────────────────────────────────────────
  {
    id: "promise-chain-double",
    topicId: "async",
    title: "Promise を then で 3 段連結する",
    difficulty: 2,
    description: `## Promise を then で 3 段連結する

数値 \`n\` を受け取り、**\`.then\` を 3 回連結** して値を毎回 2 倍にする Promise を返す関数 \`chainDouble\` を実装してください。

つまり \`n\` → \`n*2\` → \`n*4\` → \`n*8\` と段階的に倍化していきます。

### 入出力例

\`\`\`js
chainDouble(1).then(v => v)   // → 8
chainDouble(3).then(v => v)   // → 24
chainDouble(0).then(v => v)   // → 0
\`\`\`

### 制約

- \`Promise.resolve(...)\` を起点に **\`.then\` を 3 回** 連結する
- 各 \`.then\` のコールバックは値を 2 倍にする
- \`async / await\` は使わず、\`.then\` のチェーンで書く
- \`var\` は使わない
`,
    starterCode: `function chainDouble(n) {
  return Promise.resolve(n);
}
`,
    solution: `function chainDouble(n) {
  return Promise.resolve(n)
    .then((v) => v * 2)
    .then((v) => v * 2)
    .then((v) => v * 2);
}
`,
    badSolutions: [
      {
        description: "Promise を返さず同期で値を返している",
        code: `function chainDouble(n) {
  return n * 8;
}
`,
      },
    ],
    entryPoints: ["chainDouble"],
    tests: [
      {
        name: "1 → 8",
        weight: 25,
        code: "chainDouble(1).then(v => v === 8)",
      },
      {
        name: "3 → 24",
        weight: 25,
        code: "chainDouble(3).then(v => v === 24)",
      },
      {
        name: "0 → 0",
        weight: 25,
        code: "chainDouble(0).then(v => v === 0)",
      },
      {
        name: "戻り値は Promise",
        weight: 25,
        code: "(() => { const r = chainDouble(2); return r && typeof r.then === 'function'; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "then", label: ".then チェーンを使う" },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        {
          kind: "node",
          nodeType: "AwaitExpression",
          label: "await は使わない",
        },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 19-3: async/await + try/catch
  // ────────────────────────────────────────────────
  {
    id: "safe-fetch-with-fallback",
    topicId: "async",
    title: "失敗時に既定値を返す async 関数",
    difficulty: 2,
    description: `## 失敗時に既定値を返す async 関数

非同期で値を取得する関数 \`fetchFn\` (引数なしで Promise を返す) と、既定値 \`fallback\` を受け取り、**\`async / await\` と \`try / catch\`** を使って次のように振る舞う関数 \`safeFetch\` を実装してください。

- \`fetchFn()\` が **resolve** したら、その値をそのまま返す
- \`fetchFn()\` が **reject** したら、エラーを吸って \`fallback\` を返す

### 入出力例

\`\`\`js
await safeFetch(() => Promise.resolve('hello'), 'default')
// → 'hello'

await safeFetch(() => Promise.reject(new Error('boom')), 'default')
// → 'default'

await safeFetch(async () => 42, 0)
// → 42
\`\`\`

### 制約

- 関数を **\`async function\`** として宣言する
- \`fetchFn()\` の呼び出しを **\`await\`** する
- **\`try / catch\`** で例外を捕捉し、\`fallback\` を返す
- \`.then\` / \`.catch\` での連結は使わない (try/catch で書く)
- \`var\` は使わない
`,
    starterCode: `async function safeFetch(fetchFn, fallback) {
  return fallback;
}
`,
    solution: `async function safeFetch(fetchFn, fallback) {
  try {
    return await fetchFn();
  } catch (e) {
    return fallback;
  }
}
`,
    badSolutions: [
      {
        description: "try/catch を使わずエラーが伝播してしまう",
        code: `async function safeFetch(fetchFn, fallback) {
  return await fetchFn();
}
`,
      },
    ],
    entryPoints: ["safeFetch"],
    tests: [
      {
        name: "resolve 値をそのまま返す",
        weight: 25,
        code: "safeFetch(() => Promise.resolve('hello'), 'default').then(v => v === 'hello')",
      },
      {
        name: "reject 時は fallback",
        weight: 25,
        code: "safeFetch(() => Promise.reject(new Error('boom')), 'default').then(v => v === 'default')",
      },
      {
        name: "async 関数を fetchFn に渡す",
        weight: 25,
        code: "safeFetch(async () => 42, 0).then(v => v === 42)",
      },
      {
        name: "fetchFn が同期 throw でも fallback",
        weight: 25,
        code: "safeFetch(() => { throw new Error('sync'); }, 'fb').then(v => v === 'fb')",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数を使う" },
        {
          kind: "node",
          nodeType: "AwaitExpression",
          label: "await を使う",
        },
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try / catch を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "method", name: "then", label: ".then は使わない" },
        { kind: "method", name: "catch", label: ".catch は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 19-4: Promise.allSettled で成功/失敗を分離
  // ────────────────────────────────────────────────
  {
    id: "partition-promises",
    topicId: "async",
    title: "Promise の成功と失敗を分離する",
    difficulty: 3,
    description: `## Promise の成功と失敗を分離する

Promise の配列を受け取り、**全ての Promise が決着してから** 成功した値と失敗した理由を別々の配列にまとめて返す関数 \`partitionPromises\` を実装してください。

戻り値は次の形のオブジェクトです (順序は入力配列のまま保つ):

\`\`\`ts
{ fulfilled: any[]; rejected: any[] }
\`\`\`

### 入出力例

\`\`\`js
await partitionPromises([Promise.resolve(1), Promise.resolve(2)])
// → { fulfilled: [1, 2], rejected: [] }

await partitionPromises([
  Promise.resolve('ok'),
  Promise.reject(new Error('boom')),
  Promise.resolve(42),
])
// → { fulfilled: ['ok', 42], rejected: [Error('boom')] }

await partitionPromises([])
// → { fulfilled: [], rejected: [] }
\`\`\`

### 制約

- **\`Promise.allSettled\`** を使う (\`Promise.all\` だと最初の reject で全体が失敗する)
- \`async / await\` を使う (関数本体は \`async function\`)
- \`fulfilled\` には resolve 値、\`rejected\` には \`reason\` を入れる
- 入力が空配列のとき \`{ fulfilled: [], rejected: [] }\` を返す
- \`var\` は使わない
- \`for\` 文は使わない (filter / map で書く)
`,
    starterCode: `async function partitionPromises(promises) {
  return { fulfilled: [], rejected: [] };
}
`,
    solution: `async function partitionPromises(promises) {
  const results = await Promise.allSettled(promises);
  const fulfilled = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
  const rejected = results
    .filter((r) => r.status === 'rejected')
    .map((r) => r.reason);
  return { fulfilled, rejected };
}
`,
    badSolutions: [
      {
        description: "Promise.all を使うと最初の reject で全体が失敗する",
        code: `async function partitionPromises(promises) {
  const fulfilled = await Promise.all(promises);
  return { fulfilled, rejected: [] };
}
`,
      },
    ],
    entryPoints: ["partitionPromises"],
    tests: [
      {
        name: "全て resolve",
        weight: 25,
        code: "partitionPromises([Promise.resolve(1), Promise.resolve(2)]).then(r => JSON.stringify(r.fulfilled) === '[1,2]' && r.rejected.length === 0)",
      },
      {
        name: "成功と失敗の混在",
        weight: 25,
        code: "partitionPromises([Promise.resolve('ok'), Promise.reject(new Error('boom')), Promise.resolve(42)]).then(r => JSON.stringify(r.fulfilled) === JSON.stringify(['ok', 42]) && r.rejected.length === 1 && r.rejected[0] instanceof Error)",
      },
      {
        name: "全て reject でも例外を投げない",
        weight: 25,
        code: "partitionPromises([Promise.reject(new Error('a')), Promise.reject(new Error('b'))]).then(r => r.fulfilled.length === 0 && r.rejected.length === 2)",
      },
      {
        name: "空配列",
        weight: 25,
        code: "partitionPromises([]).then(r => JSON.stringify(r) === JSON.stringify({fulfilled: [], rejected: []}))",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数を使う" },
        {
          kind: "node",
          nodeType: "AwaitExpression",
          label: "await を使う",
        },
        {
          kind: "method",
          name: "allSettled",
          label: "Promise.allSettled を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
