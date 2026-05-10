import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const digitCount: Assignment = {
  id: "digit-count",
  topicId: "loops",
  title: "while で桁数を数える",
  difficulty: 2,
  description: `## while で桁数を数える

非負整数 \`n\` を受け取り、その10進表記の桁数を返す関数 \`digitCount\` を実装してください。

\`0\` は 1 桁として扱います。負の数や非整数が来たら \`-1\` を返してください。

### 入出力例

\`\`\`js
digitCount(0)        // → 1
digitCount(7)        // → 1
digitCount(42)       // → 2
digitCount(1000)     // → 4
digitCount(123456)   // → 6
digitCount(-5)       // → -1
digitCount(3.14)     // → -1
\`\`\`

### 制約

- **\`while\` ループ**で実装する
- 文字列化（\`String(n).length\`）は禁止 — 算術で割り続ける
- \`var\` は使わない
`,
  starterCode: `function digitCount(n) {
  return -1;
}
`,
  solution: `function digitCount(n) {
  if (!Number.isInteger(n) || n < 0) return -1;
  if (n === 0) return 1;
  let count = 0;
  let x = n;
  while (x > 0) {
    x = Math.floor(x / 10);
    count++;
  }
  return count;
}
`,
  entryPoints: ["digitCount"],
  tests: [
    { name: "0 は 1 桁", code: "digitCount(0) === 1" },
    { name: "7", code: "digitCount(7) === 1" },
    { name: "42", code: "digitCount(42) === 2" },
    { name: "1000", code: "digitCount(1000) === 4" },
    { name: "123456", code: "digitCount(123456) === 6" },
    { name: "負の数は -1", code: "digitCount(-5) === -1" },
    { name: "小数は -1", code: "digitCount(3.14) === -1" },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "WhileStatement",
        label: "while ループを使う",
      },
    ],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
