import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const toNumber: Assignment = {
  id: "to-number",
  topicId: "variables-and-types",
  title: "文字列を数値に変換する",
  difficulty: 1,
  description: `## 文字列を数値に変換する

\`asNumber\` 関数を実装してください。 引数 \`s\` (文字列) を受け取り、 \`Number(s)\` で数値に変換した結果を **\`const\` で名前を付けてから** 返します。

### 学習ポイント

- \`Number(値)\` を呼ぶと、 値を **数値型に変換** する。 文字列 \`'42'\` は数値 \`42\` になる。
- 数値化できない文字列 (例: \`'abc'\`) を Number() に渡すと、 結果は **\`NaN\`** ( = Not a Number)。 NaN も typeof 上は \`'number'\`。
- \`'42'\` (文字列) と \`42\` (数値) は **別の型** で、 \`'42' === 42\` は \`false\`。

### 入出力例

\`\`\`js
asNumber('0')      // → 0
asNumber('42')     // → 42
asNumber('-3.14')  // → -3.14
asNumber('abc')    // → NaN
asNumber('')       // → 0   (空文字は 0 になる JS 仕様)
\`\`\`

### 制約

- \`Number\` 関数を使う
- 結果を **\`const\` で名前を付けてから** return する
- \`var\` は使わない
`,
  starterCode: `// 文字列を数値に変換して返す。
//
// 例:
//   asNumber('42')   → 42
//   asNumber('-3.14')→ -3.14
//   asNumber('abc')  → NaN
//
// 仕組みの解説:
//   Number(値) は値を「数値型」 に変換する関数。
//   '42' という文字列を渡すと、 数値の 42 が返る。
//
// TODO 1: const n = Number(s); を書く
// TODO 2: n を return する
function asNumber(s) {
  return 0;
}
`,
  solution: `function asNumber(s) {
  const n = Number(s);
  return n;
}
`,
  badSolutions: [
    {
      description: "Number() を使わずに parseInt や parseFloat を使っている (この章の趣旨に合わない)",
      code: `function asNumber(s) {
  return parseFloat(s);
}
`,
    },
    {
      description: "中間変数を使わず直接 return している (required AST が満たされない)",
      code: `function asNumber(s) {
  return Number(s);
}
`,
    },
  ],
  entryPoints: ["asNumber"],
  tests: [
    { name: "正の整数", code: "asNumber('42') === 42" },
    { name: "ゼロ", code: "asNumber('0') === 0" },
    { name: "負の小数", code: "asNumber('-3.14') === -3.14" },
    {
      name: "abc は NaN になる",
      code: "Number.isNaN(asNumber('abc'))",
    },
    {
      name: "空文字は 0 (JS 仕様)",
      code: "asNumber('') === 0",
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
  mdnSections: [{ heading: "文字列から数値への変換" }],
};
