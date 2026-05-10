import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const safeFetchWithFallback: Assignment = {
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
      code: "safeFetch(() => Promise.resolve('hello'), 'default').then(v => v === 'hello')",
    },
    {
      name: "reject 時は fallback",
      code: "safeFetch(() => Promise.reject(new Error('boom')), 'default').then(v => v === 'default')",
    },
    {
      name: "async 関数を fetchFn に渡す",
      code: "safeFetch(async () => 42, 0).then(v => v === 42)",
    },
    {
      name: "fetchFn が同期 throw でも fallback",
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
};
