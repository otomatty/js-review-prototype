import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const adults: Assignment = {
  id: "adults",
  topicId: "arrays-iteration",
  title: "成人のフィルタ",
  difficulty: 2,
  description: `## 成人だけを抽出

ユーザー配列 \`users\` (\`{name: string, age: number}\` の配列) を受け取り、 \`age\` が **18歳以上** の人だけを抽出した配列を返す関数 \`adults\` を実装してください。

### 入出力例

\`\`\`js
adults([
  { name: 'Alice', age: 17 },
  { name: 'Bob', age: 18 },
  { name: 'Carol', age: 30 },
])
// → [{ name: 'Bob', age: 18 }, { name: 'Carol', age: 30 }]
\`\`\`

### 制約

- \`filter\` を使うこと
- \`for\` 文は使わないこと
`,
  starterCode: `function adults(users) {
  // ここに実装してください
  return [];
}
`,
  solution: `function adults(users) {
  return users.filter((u) => u.age >= 18);
}
`,
  entryPoints: ["adults"],
  tests: [
    {
      name: "全員大人",
      code: `JSON.stringify(adults([{name:'A',age:20},{name:'B',age:30}])) === JSON.stringify([{name:'A',age:20},{name:'B',age:30}])`,
    },
    {
      name: "全員子ども",
      code: `JSON.stringify(adults([{name:'A',age:5},{name:'B',age:17}])) === JSON.stringify([])`,
    },
    {
      name: "境界値 18 を含む",
      code: `JSON.stringify(adults([{name:'A',age:17},{name:'B',age:18}])) === JSON.stringify([{name:'B',age:18}])`,
    },
    {
      name: "空配列",
      code: `JSON.stringify(adults([])) === JSON.stringify([])`,
    },
  ],
  eslint: {
    rules: {
      ...COMMON_LINT_RULES,
      "no-unused-vars": "warn",
    },
  },
  ast: {
    required: [{ kind: "method", name: "filter", label: "filter を使うこと" }],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
    ],
  },
};
