import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const safeDivide: Assignment = {
  id: "safe-divide",
  topicId: "error-handling",
  title: "0除算をエラーにする",
  difficulty: 1,
  description: `## 0除算をエラーにする

数値 \`a\` と \`b\` を受け取り \`a / b\` を返す関数 \`safeDivide\` を実装してください。
ただし \`b === 0\` の場合は **\`Error\`** を \`throw\` してください（メッセージは任意）。

### 入出力例

\`\`\`js
safeDivide(10, 2)    // → 5
safeDivide(7, 0)     // → throw Error
safeDivide(0, 5)     // → 0
safeDivide(-10, 4)   // → -2.5
\`\`\`

### 制約

- \`b === 0\` のとき必ず **\`throw\`** する（戻り値で表現しない）
- \`Error\` インスタンスを投げる（\`throw 'msg'\` のような文字列ではダメ）
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
  starterCode: `function safeDivide(a, b) {
  return a / b;
}
`,
  solution: `function safeDivide(a, b) {
  if (b === 0) throw new Error('division by zero');
  return a / b;
}
`,
  badSolutions: [
    {
      description: "throw を string で行うと Error インスタンスにならない",
      code: `function safeDivide(a, b) {
  if (b === 0) throw 'division by zero';
  return a / b;
}
`,
    },
  ],
  entryPoints: ["safeDivide"],
  tests: [
    { name: "10/2", code: "safeDivide(10, 2) === 5" },
    { name: "0/5", code: "safeDivide(0, 5) === 0" },
    {
      name: "-10/4",
      code: "Math.abs(safeDivide(-10, 4) - (-2.5)) < 1e-9",
    },
    {
      name: "0除算で throw",
      code: "(() => { try { safeDivide(7, 0); return false; } catch(e) { return e instanceof Error; } })()",
    },
    {
      name: "throw されたものが Error インスタンス",
      code: "(() => { try { safeDivide(1, 0); return false; } catch(e) { return e instanceof Error && typeof e.message === 'string'; } })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ThrowStatement",
        label: "throw 文を使う",
      },
      {
        kind: "node",
        nodeType: "NewExpression",
        label: "new Error(...) を使う",
      },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
