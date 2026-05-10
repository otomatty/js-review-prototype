import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const signOf: Assignment = {
  id: "sign-of",
  topicId: "operators",
  title: "三項演算子で符号を返す",
  difficulty: 1,
  description: `## 三項演算子で符号を返す

数値 \`n\` を受け取り、

- \`n > 0\` なら \`1\`
- \`n < 0\` なら \`-1\`
- それ以外（\`0\` または \`-0\`）なら \`0\`

を返す関数 \`signOf\` を実装してください。

### 入出力例

\`\`\`js
signOf(7)    // → 1
signOf(-3)   // → -1
signOf(0)    // → 0
signOf(-0)   // → 0
\`\`\`

### 制約

- \`if\` 文を**使わない**（**三項演算子**で表現する）
- \`Math.sign\` を使ってもよいが、その場合も三項演算子の練習として **\`if\` を避ける**
`,
  starterCode: `function signOf(n) {
  return 0;
}
`,
  solution: `function signOf(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}
`,
  badSolutions: [
    {
      description: "if 文を使ってしまい三項演算子の必須要件を満たさない",
      code: `function signOf(n) {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}
`,
    },
  ],
  entryPoints: ["signOf"],
  tests: [
    { name: "正の数", code: "signOf(7) === 1" },
    { name: "負の数", code: "signOf(-3) === -1" },
    { name: "0", code: "signOf(0) === 0" },
    { name: "-0", code: "signOf(-0) === 0" },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ConditionalExpression",
        label: "三項演算子 (?:) を使う",
      },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
