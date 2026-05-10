import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const maxOf: Assignment = {
  id: "max-of",
  topicId: "loops",
  title: "for...of で最大値を求める",
  difficulty: 1,
  description: `## for...of で最大値を求める

数値配列を受け取り、その最大値を返す関数 \`maxOf\` を実装してください。空配列の場合は \`null\` を返してください。

### 入出力例

\`\`\`js
maxOf([3, 1, 4, 1, 5, 9, 2, 6])   // → 9
maxOf([-1, -5, -3])               // → -1
maxOf([42])                        // → 42
maxOf([])                          // → null
\`\`\`

### 制約

- **\`for...of\`** で実装する（\`Math.max\` や \`reduce\` は禁止）
- インデックス付き \`for\` 文は使わない
- \`var\` は使わない
`,
  starterCode: `function maxOf(numbers) {
  return null;
}
`,
  solution: `function maxOf(numbers) {
  if (numbers.length === 0) return null;
  let m = numbers[0];
  for (const n of numbers) {
    if (n > m) m = n;
  }
  return m;
}
`,
  entryPoints: ["maxOf"],
  tests: [
    {
      name: "通常",
      code: "maxOf([3,1,4,1,5,9,2,6]) === 9",
    },
    {
      name: "全て負",
      code: "maxOf([-1,-5,-3]) === -1",
    },
    {
      name: "1要素",
      code: "maxOf([42]) === 42",
    },
    {
      name: "空配列は null",
      code: "maxOf([]) === null",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ForOfStatement",
        label: "for...of を使う",
      },
    ],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "method", name: "max", label: "Math.max は使わない" },
      { kind: "method", name: "reduce", label: "reduce は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
