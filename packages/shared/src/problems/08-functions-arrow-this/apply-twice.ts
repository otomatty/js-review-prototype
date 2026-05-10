import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const applyTwice: Assignment = {
  id: "apply-twice",
  topicId: "functions-arrow-this",
  title: "関数を2回適用する高階関数",
  difficulty: 2,
  description: `## 関数を2回適用する高階関数

関数 \`fn\` と値 \`x\` を受け取り、\`fn(fn(x))\` を返す関数 \`applyTwice\` を実装してください。

### 入出力例

\`\`\`js
applyTwice((n) => n + 1, 5)        // → 7
applyTwice((s) => s + '!', 'hi')   // → 'hi!!'
applyTwice((arr) => [...arr, 0], [1, 2])
// → [1, 2, 0, 0]
\`\`\`

### 制約

- **アロー関数** で実装する
- \`function\` 宣言は禁止
- \`var\` は使わない
`,
  starterCode: `const applyTwice = (fn, x) => x;
`,
  solution: `const applyTwice = (fn, x) => fn(fn(x));
`,
  entryPoints: ["applyTwice"],
  tests: [
    {
      name: "数値 +1 を 2 回",
      code: "applyTwice((n) => n + 1, 5) === 7",
    },
    {
      name: "文字列追記",
      code: "applyTwice((s) => s + '!', 'hi') === 'hi!!'",
    },
    {
      name: "配列",
      code: "JSON.stringify(applyTwice((arr) => [...arr, 0], [1,2])) === JSON.stringify([1,2,0,0])",
    },
    {
      name: "恒等関数",
      code: "applyTwice((v) => v, 42) === 42",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ArrowFunctionExpression",
        label: "アロー関数を使う",
      },
    ],
    forbidden: [
      {
        kind: "node",
        nodeType: "FunctionDeclaration",
        label: "function 宣言は使わない",
      },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
