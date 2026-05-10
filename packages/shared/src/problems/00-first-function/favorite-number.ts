import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const favoriteNumber: Assignment = {
  id: "favorite-number",
  topicId: "first-function",
  title: "数値を返す関数を書く",
  difficulty: 1,
  description: `## 数値を返す関数を書く

\`favoriteNumber\` という関数を実装してください。 何の引数も受け取らず、 数値 \`42\` を返します。

### この章で学ぶこと

- **数値 (number)**: \`'\` で囲まずにそのまま書く
- 文字列の \`'42'\` と数値の \`42\` は **別物** (型が違う)

### 入出力例

\`\`\`js
favoriteNumber() // → 42
\`\`\`

### 制約

- 戻り値は **数値の \`42\`** （文字列の \`'42'\` ではない）
`,
  starterCode: `// favoriteNumber() を呼び出すと 数値の 42 を返す関数を作ります。
//
// 例:
//   favoriteNumber() → 42
//
// 仕組みの解説:
//   '42' (引用符で囲む) は 文字列
//   42  (引用符なし)   は 数値
//   2 つは型が違うので、 厳密等価 === では一致しない。
//
// return 0 の 0 を 42 に書き換えてください。
function favoriteNumber() {
  return 0;
}
`,
  solution: `function favoriteNumber() {
  return 42;
}
`,
  badSolutions: [
    {
      description: "数値ではなく文字列 '42' を返している",
      code: `function favoriteNumber() {
  return '42';
}
`,
    },
  ],
  entryPoints: ["favoriteNumber"],
  tests: [
    {
      name: "数値 42 を返す",
      code: "favoriteNumber() === 42",
    },
    {
      name: "戻り値の型が 'number' である",
      code: "typeof favoriteNumber() === 'number'",
    },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    {
      heading: "Number 型",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures",
      anchor: "Number_型",
    },
  ],
};
