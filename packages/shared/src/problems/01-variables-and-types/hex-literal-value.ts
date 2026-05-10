import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const hexLiteralValue: Assignment = {
  id: "hex-literal-value",
  topicId: "variables-and-types",
  title: "16 進数リテラル 0xFF の値を返す",
  difficulty: 1,
  description: `## 16 進数リテラル 0xFF の値を返す

\`hexFf\` 関数を実装してください。 引数なしで呼ばれ、 **\`0xFF\` という 16 進数リテラル** を **\`const\` に入れてから** その値を返します。

### 学習ポイント

- 数値リテラルには **基数を変えて書く方法** がある:
  - **10 進数**: \`255\`
  - **16 進数**: \`0xFF\` (\`0x\` で始める。 \`0xff\` も同じ。 \`A〜F\` / \`a〜f\` で 10〜15)
  - **2 進数**: \`0b11111111\`
  - **8 進数**: \`0o377\`
- これらは **書き方が違うだけ** で、 すべて同じ値 (= 数値の 255) を表す。
- \`const value = 0xFF;\` と書いても、 \`const value = 255;\` と書いても、 \`value\` は同じ数値。

### 入出力例

\`\`\`js
hexFf() // → 255
\`\`\`

### 制約

- ソースコード上で **必ず \`0xFF\` (または \`0xff\`) と 16 進数リテラルで書く** (= \`255\` を直接書かない)
- \`const\` に入れてから return する
- \`var\` は使わない
`,
  starterCode: `// 16 進数リテラル 0xFF を const に入れて、 その値を返す。
//
// 例:
//   hexFf() → 255   (0xFF は 10 進数の 255 と同じ)
//
// 仕組みの解説:
//   JavaScript は 16 進数を 0x... という形式で書ける:
//     0xFF = 255
//     0x10 = 16
//     0xA  = 10
//   これは「書き方の違い」 だけで、 中身は普通の数値。
//
// TODO 1: const value = 0xFF; を書く
// TODO 2: value を return する
function hexFf() {
  return 0;
}
`,
  solution: `function hexFf() {
  const value = 0xFF;
  return value;
}
`,
  badSolutions: [
    {
      description: "10 進数で 255 と書いてしまっている (16 進リテラルの練習になっていない)",
      code: `function hexFf() {
  const value = 255;
  return value;
}
`,
    },
    {
      description: "中間変数を使わず直接 return している (required AST が満たされない)",
      code: `function hexFf() {
  return 0xFF;
}
`,
    },
  ],
  entryPoints: ["hexFf"],
  tests: [
    { name: "戻り値は 255", code: "hexFf() === 255" },
    {
      name: "戻り値の型は 'number'",
      code: "typeof hexFf() === 'number'",
    },
  ],
  eslint: {
    rules: {
      ...COMMON_LINT_RULES,
      // 10 進リテラル 255 を直接書くのを禁止 (16 進形式 0xFF を強制)
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[raw='255']",
          message:
            "10 進数の 255 ではなく、 16 進数リテラル 0xFF (または 0xff) で書いてください",
        },
      ],
    },
  },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "VariableDeclaration",
        label: "const で値に名前を付ける",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    { heading: "数値リテラル" },
    { heading: "整数リテラル" },
  ],
};
