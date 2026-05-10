import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const circleArea: Assignment = {
  id: "circle-area",
  topicId: "variables-and-types",
  title: "円の面積を const と数値リテラルで求める",
  difficulty: 1,
  description: `## 円の面積を const と数値リテラルで求める

\`circleArea\` 関数を実装してください。 引数 \`radius\` (半径) を受け取り、 **円の面積** ( \`半径 × 半径 × 円周率\` ) を返します。

円周率は **\`PI\`** という名前の \`const\` で宣言し、 \`3.14159\` を使ってください。

### 学習ポイント

- **数値リテラル**: \`3.14159\` のように、 引用符なしで書いた値が「数値」になる。
- \`const PI = 3.14159;\` のように、 **「変わらない定数」 には大文字の名前** を付ける慣習がある。
- 同じ式の中で同じ変数を **複数回使ってよい** ( \`radius * radius * PI\` )。

### 入出力例

\`\`\`js
circleArea(0)    // → 0
circleArea(1)    // → 3.14159
circleArea(2)    // → 12.56636   ( = 4 * 3.14159 )
circleArea(10)   // → 314.159
\`\`\`

### 制約

- \`PI\` は \`const\` で宣言する
- \`var\` は使わない
- 期待値との誤差は浮動小数点演算上 **完全一致** で OK (上の数値はすべて精度内)
`,
  starterCode: `// 半径を受け取って円の面積を返す。
//
// 例:
//   circleArea(1) → 3.14159
//   circleArea(2) → 12.56636
//
// 仕組みの解説:
//   3.14159 のように、 引用符なしで書いた値が「数値リテラル」。
//   const PI = 3.14159;
//   と書くと、 PI という名前で円周率を保持できる。
//
// TODO 1: const PI = 3.14159; を書く
// TODO 2: const area = radius * radius * PI; を書く
// TODO 3: area を return する
function circleArea(radius) {
  return 0;
}
`,
  solution: `function circleArea(radius) {
  const PI = 3.14159;
  const area = radius * radius * PI;
  return area;
}
`,
  badSolutions: [
    {
      description: "PI を const で宣言せず数値リテラルを直接書いている",
      code: `function circleArea(radius) {
  return radius * radius * 3.14159;
}
`,
    },
    {
      description: "var で宣言してしまっている",
      code: `function circleArea(radius) {
  var PI = 3.14159;
  return radius * radius * PI;
}
`,
    },
  ],
  entryPoints: ["circleArea"],
  tests: [
    { name: "半径 0", code: "circleArea(0) === 0" },
    { name: "半径 1", code: "circleArea(1) === 3.14159" },
    {
      name: "半径 2 (係数 4)",
      code: "Math.abs(circleArea(2) - 12.56636) < 1e-9",
    },
    { name: "半径 10", code: "Math.abs(circleArea(10) - 314.159) < 1e-9" },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "VariableDeclaration",
        label: "const で PI などの定数を宣言する",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    { heading: "定数" },
    { heading: "数値リテラル" },
  ],
};
