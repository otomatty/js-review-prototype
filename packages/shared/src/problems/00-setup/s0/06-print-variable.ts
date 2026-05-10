import type { Assignment } from "../../../types.js";

export const s0Ch00PrintVariable: Assignment = {
  id: "S0-Ch00-06-print-variable",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 6,
  title: "変数に入れて出す",
  newConcept: "const で変数に値を入れ、変数を console.log に渡す",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

\`const\` を使って **\`message\` という名前の変数** に \`Hello\` という文字列を入れ、 その変数を \`console.log\` で出力してください。

## 期待する出力

\`\`\`
Hello
\`\`\`

## ヒント

- \`const message = "Hello";\` のように書くと、 \`message\` という箱に \`"Hello"\` を入れたことになります。
- そのあと \`console.log(message)\` と書くと、 箱の中身 (= \`"Hello"\`) が出力されます。
- 文字列を **直接** \`console.log\` に渡すのではなく、 一度変数に入れてから渡すのが今回のポイントです。
`,
  scaffolds: {
    L0: "",
    L1: `// const で変数 message を作って "Hello" を入れ、 console.log で出力してください
`,
    L2: `// 1. const で message という変数を作り、"Hello" を入れる
// 2. console.log で message を出力する

`,
    L3: `const message = ____;
console.log(____);
`,
  },
  tests: [
    {
      name: "stdout が Hello になる",
      expectedStdout: "Hello",
    },
  ],
  hints: [
    "`const 変数名 = 値;` の形で変数を作ります。 名前は `message` にしましょう。",
    "`console.log` には、 文字列だけでなく **変数の名前** も渡せます。 渡した変数の中身が出力されます。",
    "解答例:\n```js\nconst message = \"Hello\";\nconsole.log(message);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "VariableDeclaration",
          label: "変数宣言 (const) を使う",
        },
      ],
    },
  },
  solution: `const message = "Hello";
console.log(message);
`,
};
