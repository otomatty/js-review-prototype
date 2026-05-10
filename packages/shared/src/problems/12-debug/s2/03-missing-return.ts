import type { Assignment } from "../../../types.js";

export const s2Ch12MissingReturn: Assignment = {
  id: "S2-Ch12-03-missing-return",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 3,
  title: "関数の return 抜けを直す",
  newConcept: "関数の戻り値がない (undefined) バグ",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下の \`double\` 関数は **return を忘れている** ので、 呼び出すと \`undefined\` を返します。 \`return\` を入れて修正してください。

\`\`\`js
function double(n) {
  n * 2;
}
console.log(double(7));
\`\`\`

## 期待する出力

\`\`\`
14
\`\`\`

## ポイント

- \`n * 2\` は計算するだけで **戻り値にはなりません**。 \`return n * 2;\` と書く必要があります。
- console.log で undefined が出てきたら「return 抜け」 を疑います。
`,
  starterCode: `function double(n) {
  n * 2;
}
console.log(double(7));
`,
  tests: [
    {
      name: "stdout が 14 になる",
      expectedStdout: "14",
    },
  ],
  hints: [
    "関数本体の `n * 2` を `return n * 2;` に変えます。",
    "他は変更不要です。",
    "解答例:\n```js\nfunction double(n) {\n  return n * 2;\n}\nconsole.log(double(7));\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "FunctionDeclaration", label: "function 宣言を使う" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function double(n) {
  return n * 2;
}
console.log(double(7));
`,
  badSolutions: [
    {
      code: `console.log(14);
`,
      description: "関数を消して結果を直接書いている (return 抜けの修正が目的)",
    },
  ],
  mdnSections: [
    { heading: "return", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/return", pageTitle: "return" },
  ],
};
