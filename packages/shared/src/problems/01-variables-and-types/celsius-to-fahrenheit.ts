import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const celsiusToFahrenheit: Assignment = {
  id: "celsius-to-fahrenheit",
  topicId: "variables-and-types",
  title: "摂氏を華氏に変換する (中間変数で段階的に)",
  difficulty: 1,
  description: `## 摂氏を華氏に変換する (中間変数で段階的に)

\`toFahrenheit\` 関数を実装してください。 引数 \`celsius\` (摂氏温度) を受け取り、 **華氏温度** を返します。

変換式: \`華氏 = 摂氏 × 1.8 + 32\`

ただし、 1 行で書かずに **「\`scaled\` (スケール後)」「\`fahrenheit\` (最終結果)」 の 2 段階** に分けて const で名前を付けてください。

### 学習ポイント

- 計算は **段階に分けて、 各段階に意味のある名前を付ける** と読みやすい。
- \`const\` は **値そのもの** ではなく **「名前と値の対応」** を変えないだけ。同じ計算でも変数名で意味を伝えられる。

### 入出力例

\`\`\`js
toFahrenheit(0)     // → 32     (氷点)
toFahrenheit(100)   // → 212    (沸点)
toFahrenheit(-40)   // → -40    (摂氏と華氏が一致する点)
toFahrenheit(37)    // → 98.6   (体温)
\`\`\`

### 制約

- \`const scaled = celsius * 1.8;\` と \`const fahrenheit = scaled + 32;\` の **2 段階** に分ける
- \`var\` は使わない
`,
  starterCode: `// 摂氏 (celsius) を華氏 (fahrenheit) に変換して返す。
// 変換式: 華氏 = 摂氏 × 1.8 + 32
//
// 例:
//   toFahrenheit(0)   → 32     (氷点)
//   toFahrenheit(100) → 212    (沸点)
//   toFahrenheit(-40) → -40    (一致する点)
//
// 仕組みの解説:
//   一気に return celsius * 1.8 + 32; と書いてもいいが、
//   ここでは「段階に分けて名前を付ける」 練習をする。
//
// TODO 1: const scaled = celsius * 1.8; を書く
// TODO 2: const fahrenheit = scaled + 32; を書く
// TODO 3: fahrenheit を return する
function toFahrenheit(celsius) {
  return 0;
}
`,
  solution: `function toFahrenheit(celsius) {
  const scaled = celsius * 1.8;
  const fahrenheit = scaled + 32;
  return fahrenheit;
}
`,
  badSolutions: [
    {
      description: "中間変数を使わずに 1 行で書いている (required AST が満たされない)",
      code: `function toFahrenheit(celsius) {
  return celsius * 1.8 + 32;
}
`,
    },
  ],
  entryPoints: ["toFahrenheit"],
  tests: [
    { name: "氷点 (0℃)", code: "toFahrenheit(0) === 32" },
    { name: "沸点 (100℃)", code: "toFahrenheit(100) === 212" },
    { name: "一致点 (-40℃)", code: "toFahrenheit(-40) === -40" },
    {
      name: "体温 (37℃)",
      code: "Math.abs(toFahrenheit(37) - 98.6) < 1e-9",
    },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "VariableDeclaration",
        label: "const で中間変数を宣言する",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    { heading: "宣言と初期化" },
    { heading: "定数" },
  ],
};
