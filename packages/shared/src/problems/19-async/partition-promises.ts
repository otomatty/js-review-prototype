import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const partitionPromises: Assignment = {
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
      code: "partitionPromises([Promise.resolve(1), Promise.resolve(2)]).then(r => JSON.stringify(r.fulfilled) === '[1,2]' && r.rejected.length === 0)",
    },
    {
      name: "成功と失敗の混在",
      code: "partitionPromises([Promise.resolve('ok'), Promise.reject(new Error('boom')), Promise.resolve(42)]).then(r => JSON.stringify(r.fulfilled) === JSON.stringify(['ok', 42]) && r.rejected.length === 1 && r.rejected[0] instanceof Error)",
    },
    {
      name: "全て reject でも例外を投げない",
      code: "partitionPromises([Promise.reject(new Error('a')), Promise.reject(new Error('b'))]).then(r => r.fulfilled.length === 0 && r.rejected.length === 2)",
    },
    {
      name: "空配列",
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
      {
        kind: "node",
        nodeType: "ForOfStatement",
        label: "for...of 文は使わない",
      },
      {
        kind: "node",
        nodeType: "ForInStatement",
        label: "for...in 文は使わない",
      },
    ],
  },
};
