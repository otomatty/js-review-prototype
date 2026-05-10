import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const double: Assignment = {
  id: "double",
  topicId: "first-function",
  title: "受け取った数を 2 倍にして返す",
  difficulty: 1,
  description: `## 受け取った数を 2 倍にして返す

\`double\` 関数を実装してください。 引数 \`n\` を受け取り、 その 2 倍の値を返します。

### この章で学ぶこと

- \`*\` 演算子で **掛け算** ができる
- 引数の値は何度でも使える ( \`n + n\` でも \`n * 2\` でも結果は同じ)

### 入出力例

\`\`\`js
double(3)    // → 6
double(0)    // → 0
double(-5)   // → -10
double(2.5)  // → 5
\`\`\`

### 制約

- 関数名は \`double\`、 引数名は \`n\` のまま
`,
  starterCode: `// double(n) は n を 2 倍にして返す関数です。
//
// 例:
//   double(3)   → 6
//   double(0)   → 0
//   double(-5)  → -10
//   double(2.5) → 5
//
// 仕組みの解説:
//   * は掛け算の演算子。
//   n * 2 でも n + n でも同じ結果になる。
//
// return 0 を return n * 2 (または n + n) に書き換えてください。
function double(n) {
  return 0;
}
`,
  solution: `function double(n) {
  return n * 2;
}
`,
  badSolutions: [
    {
      description: "2 倍ではなく 2 を足してしまっている",
      code: `function double(n) {
  return n + 2;
}
`,
    },
  ],
  entryPoints: ["double"],
  tests: [
    { name: "正の数", code: "double(3) === 6" },
    { name: "ゼロ", code: "double(0) === 0" },
    { name: "負の数", code: "double(-5) === -10" },
    { name: "小数", code: "double(2.5) === 5" },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    {
      heading: "算術演算子",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Expressions_and_operators",
      anchor: "算術演算子",
    },
  ],
};
