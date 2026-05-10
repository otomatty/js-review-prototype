import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const sum: Assignment = {
  id: "sum",
  topicId: "arrays-iteration",
  title: "配列の合計",
  difficulty: 1,
  description: `## 配列の合計

数値の配列を受け取り、その合計を返す関数 \`sum\` を実装してください。

### 入出力例

\`\`\`js
sum([1, 2, 3])      // → 6
sum([])             // → 0
sum([-1, -2, 3])    // → 0
sum([0.5, 1.5])     // → 2
\`\`\`

### 制約

- \`reduce\` を使うこと
- \`for\` 文や \`var\` は使わないこと
`,
  starterCode: `function sum(numbers) {
  // ここに実装してください
  return 0;
}
`,
  solution: `function sum(numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
`,
  entryPoints: ["sum"],
  tests: [
    { name: "正の整数 [1,2,3] → 6", code: "sum([1,2,3]) === 6" },
    { name: "空配列 [] → 0", code: "sum([]) === 0" },
    {
      name: "負の数を含む [-1,-2,3] → 0",
      code: "sum([-1,-2,3]) === 0",
    },
    {
      name: "小数 [0.5,1.5] → 2",
      code: "Math.abs(sum([0.5,1.5]) - 2) < 1e-9",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "reduce", label: "reduce を使うこと" },
    ],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
