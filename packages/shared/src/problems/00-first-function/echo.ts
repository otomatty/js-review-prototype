import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const echo: Assignment = {
  id: "echo",
  topicId: "first-function",
  title: "受け取った値をそのまま返す",
  difficulty: 1,
  description: `## 受け取った値をそのまま返す

\`echo\` 関数を実装してください。 引数 \`value\` を受け取り、 そのまま \`value\` を返します。

### この章で学ぶこと

- **引数 (parameter / argument)**: 関数を呼び出すときに渡す値
- 引数は関数の中では **その名前の変数として使える**

### 入出力例

\`\`\`js
echo('hi')   // → 'hi'
echo(42)     // → 42
echo(true)   // → true
echo(null)   // → null
\`\`\`

### 制約

- 引数を加工せずそのまま返す
- 引数の名前は \`value\` のまま使う
`,
  starterCode: `// echo(value) は受け取った value をそのまま返す関数です。
//
// 例:
//   echo('hi')  → 'hi'
//   echo(42)    → 42
//   echo(true)  → true
//
// 仕組みの解説:
//   function 名前(引数) { return ... } と書くと、
//   呼び出すときに渡した値が「引数」という名前の変数として使える。
//
// return null を return value に書き換えてください。
function echo(value) {
  return null;
}
`,
  solution: `function echo(value) {
  return value;
}
`,
  badSolutions: [
    {
      description: "引数を無視して固定値を返してしまっている",
      code: `function echo(value) {
  return 'hi';
}
`,
    },
  ],
  entryPoints: ["echo"],
  tests: [
    { name: "文字列をそのまま返す", code: "echo('hi') === 'hi'" },
    { name: "数値をそのまま返す", code: "echo(42) === 42" },
    { name: "真偽値をそのまま返す", code: "echo(true) === true" },
    { name: "null をそのまま返す", code: "echo(null) === null" },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    {
      heading: "関数の引数",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions",
      anchor: "関数のパラメーター",
    },
  ],
};
