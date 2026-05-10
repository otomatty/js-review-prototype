import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const functionExpressionPower: Assignment = {
  id: "function-expression-power",
  topicId: "functions-basics",
  title: "関数式で累乗を計算する",
  difficulty: 2,
  description: `## 関数式で累乗を計算する

\`base\` と非負整数 \`exp\` を受け取り、\`base ** exp\` を返す関数 \`power\` を、**関数式 (\`const power = function(...) { ... }\`)** として実装してください。

\`exp\` が負または整数でない場合は \`NaN\` を返してください。 \`base ** 0 === 1\`（\`0 ** 0\` も 1）。

### 入出力例

\`\`\`js
power(2, 10)    // → 1024
power(3, 0)     // → 1
power(0, 0)     // → 1
power(5, 1)     // → 5
power(2, -1)    // → NaN
power(2, 1.5)   // → NaN
\`\`\`

### 制約

- **関数式** で実装する（\`function\` 宣言は禁止）
- \`Math.pow\` / \`**\` 演算子は禁止 — \`for\` ループまたは再帰で計算する
- \`var\` は使わない
`,
  starterCode: `const power = function(base, exp) {
  return NaN;
};
`,
  solution: `const power = function(base, exp) {
  if (!Number.isInteger(exp) || exp < 0) return NaN;
  let result = 1;
  for (let i = 0; i < exp; i++) {
    result *= base;
  }
  return result;
};
`,
  entryPoints: ["power"],
  tests: [
    { name: "2^10", code: "power(2, 10) === 1024" },
    { name: "3^0 = 1", code: "power(3, 0) === 1" },
    { name: "0^0 = 1", code: "power(0, 0) === 1" },
    { name: "5^1 = 5", code: "power(5, 1) === 5" },
    {
      name: "負の指数は NaN",
      code: "Number.isNaN(power(2, -1))",
    },
    {
      name: "小数の指数は NaN",
      code: "Number.isNaN(power(2, 1.5))",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "FunctionExpression",
        label: "関数式 (const f = function() {...}) を使う",
      },
    ],
    forbidden: [
      {
        kind: "node",
        nodeType: "FunctionDeclaration",
        label: "function 宣言は使わない",
      },
      { kind: "method", name: "pow", label: "Math.pow は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
