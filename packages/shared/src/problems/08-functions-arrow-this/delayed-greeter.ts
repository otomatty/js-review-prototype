import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const delayedGreeter: Assignment = {
  id: "delayed-greeter",
  topicId: "functions-arrow-this",
  title: "後で呼び出す関数を作る",
  difficulty: 2,
  description: `## 後で呼び出す関数を作る

文字列 \`name\` を受け取り、\`'Hello, {name}!'\` を返す **引数なしの関数** を返す高階関数 \`makeGreeter\` を実装してください。

返り値の関数を後から呼び出しても、最初に渡した \`name\` で挨拶を作れる必要があります。

### 入出力例

\`\`\`js
const greetAlice = makeGreeter('Alice');
greetAlice()    // → 'Hello, Alice!'
greetAlice()    // → 'Hello, Alice!'  (何度呼んでも同じ)

const greetBob = makeGreeter('Bob');
greetBob()      // → 'Hello, Bob!'
greetAlice()    // → 'Hello, Alice!'  (Bob を作っても Alice は壊れない)
\`\`\`

### 制約

- **アロー関数** で実装する
- **テンプレートリテラル** で挨拶を組み立てる
- \`function\` 宣言は禁止
- \`var\` は使わない
`,
  starterCode: `const makeGreeter = (name) => () => '';
`,
  solution: "const makeGreeter = (name) => () => `Hello, ${name}!`;\n",
  entryPoints: ["makeGreeter"],
  tests: [
    {
      name: "Alice",
      code: "makeGreeter('Alice')() === 'Hello, Alice!'",
    },
    {
      name: "何度呼んでも同じ",
      code: "(() => { const g = makeGreeter('Alice'); return g() === 'Hello, Alice!' && g() === 'Hello, Alice!'; })()",
    },
    {
      name: "別インスタンスは独立",
      code: "(() => { const a = makeGreeter('Alice'); const b = makeGreeter('Bob'); return a() === 'Hello, Alice!' && b() === 'Hello, Bob!'; })()",
    },
    {
      name: "空文字でも組み立てる",
      code: "makeGreeter('')() === 'Hello, !'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ArrowFunctionExpression",
        label: "アロー関数を使う",
      },
      {
        kind: "node",
        nodeType: "TemplateLiteral",
        label: "テンプレートリテラルを使う",
      },
    ],
    forbidden: [
      {
        kind: "node",
        nodeType: "FunctionDeclaration",
        label: "function 宣言は使わない",
      },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
