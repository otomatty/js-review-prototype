import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const isPositiveInteger: Assignment = {
  id: "is-positive-integer",
  topicId: "numbers-math-date",
  title: "正の整数か判定する",
  difficulty: 1,
  description: `## 正の整数か判定する

任意の値を受け取り、それが **1 以上の整数** なら \`true\`、そうでなければ \`false\` を返す関数 \`isPositiveInteger\` を実装してください。

### 入出力例

\`\`\`js
isPositiveInteger(1)        // → true
isPositiveInteger(100)      // → true
isPositiveInteger(0)        // → false
isPositiveInteger(-3)       // → false
isPositiveInteger(3.14)     // → false
isPositiveInteger('5')      // → false  (文字列はダメ)
isPositiveInteger(NaN)      // → false
isPositiveInteger(Infinity) // → false
isPositiveInteger(null)     // → false
isPositiveInteger(true)     // → false
\`\`\`

### 制約

- \`Number.isInteger\` を使う
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
  starterCode: `function isPositiveInteger(value) {
  return false;
}
`,
  solution: `function isPositiveInteger(value) {
  return Number.isInteger(value) && typeof value === 'number' && value >= 1;
}
`,
  entryPoints: ["isPositiveInteger"],
  tests: [
    { name: "1", code: "isPositiveInteger(1) === true" },
    { name: "100", code: "isPositiveInteger(100) === true" },
    { name: "0 は false", code: "isPositiveInteger(0) === false" },
    { name: "負数", code: "isPositiveInteger(-3) === false" },
    { name: "小数", code: "isPositiveInteger(3.14) === false" },
    { name: "文字列", code: "isPositiveInteger('5') === false" },
    { name: "NaN", code: "isPositiveInteger(NaN) === false" },
    {
      name: "Infinity",
      code: "isPositiveInteger(Infinity) === false",
    },
    {
      name: "null / true",
      code: "isPositiveInteger(null) === false && isPositiveInteger(true) === false",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "isInteger", label: "Number.isInteger を使う" },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
