import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const returnHello: Assignment = {
  id: "return-hello",
  topicId: "first-function",
  title: "文字列を返す関数を書く",
  difficulty: 1,
  description: `## 文字列を返す関数を書く

\`hello\` という関数を実装してください。 何の引数も受け取らず、 文字列 \`'Hello, World!'\` を返します。

### この章で学ぶこと

- **関数 (function)**: 「入力を受け取り、 何かを返す」 ひとかたまりの処理に名前をつけたもの
- **return 文**: 関数の処理結果を「呼び出し元に返す」ための命令
- **文字列 (string)**: \`'\` または \`"\` で囲まれた文字の並び

### 入出力例

\`\`\`js
hello() // → 'Hello, World!'
\`\`\`

### 制約

- 戻り値の文字列は **半角の \`Hello, World!\`** ちょうど（前後に空白を入れない）
- 関数名は \`hello\` のまま変更しない
`,
  starterCode: `// hello() を呼び出すと 'Hello, World!' という文字列を返す関数を作ります。
//
// 例:
//   hello() → 'Hello, World!'
//
// 仕組みの解説:
//   function 名前() { ... } で「関数」を作る
//   return 値;          で「呼び出し元に値を返す」
//
// 下の return '' の '' を 'Hello, World!' に書き換えてください。
function hello() {
  return '';
}
`,
  solution: `function hello() {
  return 'Hello, World!';
}
`,
  badSolutions: [
    {
      description: "余計な空白が入っていて文字列が一致しない",
      code: `function hello() {
  return ' Hello, World! ';
}
`,
    },
    {
      description: "console.log で出力するだけで return していない (戻り値が undefined)",
      code: `function hello() {
  console.log('Hello, World!');
}
`,
    },
  ],
  entryPoints: ["hello"],
  tests: [
    {
      name: "文字列 'Hello, World!' を返す",
      code: "hello() === 'Hello, World!'",
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
      heading: "関数の宣言",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions",
      anchor: "関数の定義",
    },
  ],
};
