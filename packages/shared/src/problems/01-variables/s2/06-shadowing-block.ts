import type { Assignment } from "../../../types.js";

export const s2Ch01ShadowingBlock: Assignment = {
  id: "S2-Ch01-06-shadowing-block",
  stage: "S2",
  chapterId: "Ch01",
  sequence: 6,
  title: "シャドーイングで内側だけ値を変える",
  newConcept: "内側ブロックの const で外側を覆い隠す",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

外側に \`const price = 100;\` を宣言し、 ブロックの中で別の \`const price = 200;\` を宣言します。 次の順で 2 行出力してください。

1. ブロックの中: \`200\`
2. ブロックの外: \`100\`

## 期待する出力

\`\`\`
200
100
\`\`\`

## ポイント

- 内側ブロックで同じ名前を再宣言することを **シャドーイング** と呼びます。
- 内側の \`price\` がブロック内だけで有効になり、 外側の \`price\` は **書き換わりません**。
`,
  starterCode: `// 1. const price = 100;
// 2. { const price = 200; console.log(price); }
// 3. console.log(price);

`,
  tests: [
    {
      name: "stdout が 200→100 の 2 行になる",
      expectedStdout: "200\n100",
    },
  ],
  hints: [
    "ブロックは `{` と `}` で囲むだけで作れます。",
    "内側の `const price = 200;` は **新しい変数** であり、 外側の `price` を書き換えるわけではありません。",
    "解答例:\n```js\nconst price = 100;\n{\n  const price = 200;\n  console.log(price);\n}\nconsole.log(price);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "const-declaration",
          name: "price",
          label: "const price を宣言する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const price = 100;
{
  const price = 200;
  console.log(price);
}
console.log(price);
`,
  badSolutions: [
    {
      code: `console.log(200);
console.log(100);
`,
      description: "変数を使わずに数値を直接出力している",
    },
    {
      code: `let price = 100;
price = 200;
console.log(price);
price = 100;
console.log(price);
`,
      description: "シャドーイングではなく再代入で値を変えてしまっている",
    },
  ],
  mdnSections: [
    { heading: "ブロック文", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/block", pageTitle: "ブロック文" },
  ],
};
