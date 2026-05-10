import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const arrowDouble: Assignment = {
  id: "arrow-double",
  topicId: "functions-arrow-this",
  title: "アロー関数で値を2倍にする",
  difficulty: 1,
  description: `## アロー関数で値を2倍にする

数値 \`n\` を受け取り、\`n * 2\` を返す関数 \`double\` を **アロー関数** で実装してください。

### 入出力例

\`\`\`js
double(3)    // → 6
double(0)    // → 0
double(-4)   // → -8
double(0.5)  // → 1
\`\`\`

### 制約

- アロー関数 \`const double = (n) => ...\` または \`const double = n => ...\` で書く
- \`function\` 宣言は禁止
- \`var\` は使わない
`,
  starterCode: `const double = (n) => 0;
`,
  solution: `const double = (n) => n * 2;
`,
  entryPoints: ["double"],
  tests: [
    { name: "3", code: "double(3) === 6" },
    { name: "0", code: "double(0) === 0" },
    { name: "負数", code: "double(-4) === -8" },
    { name: "小数", code: "Math.abs(double(0.5) - 1) < 1e-9" },
  ],
  eslint: {
    rules: {
      ...COMMON_LINT_RULES,
      "prefer-arrow-callback": "error",
    },
  },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ArrowFunctionExpression",
        label: "アロー関数で実装する",
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
