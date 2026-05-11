import type { Assignment } from "../../../types.js";

export const s2Ch12OffByOneFor: Assignment = {
  id: "S2-Ch12-01-off-by-one-for",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 1,
  title: "for ループの境界バグを直す",
  newConcept: "i <= arr.length の off-by-one を修正する",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下のコードは配列を全て出力するつもりですが、 **境界条件が間違っていて** 末尾で \`undefined\` が出力されます。 境界を修正してください。

\`\`\`js
const items = ["a", "b", "c"];
for (let i = 0; i <= items.length; i++) {
  console.log(items[i]);
}
\`\`\`

## 期待する出力

\`\`\`
a
b
c
\`\`\`

## ポイント

- 配列の添字は **0 から length - 1** まで。 \`i <= length\` だと最後に存在しない添字 (\`length\`) を読みに行きます。
- 正しくは \`i < items.length\`。
`,
  starterCode: `const items = ["a", "b", "c"];
for (let i = 0; i <= items.length; i++) {
  console.log(items[i]);
}
`,
  tests: [
    {
      name: "stdout が a/b/c の 3 行になる",
      expectedStdout: "a\nb\nc",
    },
  ],
  hints: [
    "ループの **条件式** を見直してください。",
    "`i <= items.length` を `i < items.length` に変更すれば、 存在する添字だけを読みます。",
    "解答例:\n```js\nconst items = [\"a\", \"b\", \"c\"];\nfor (let i = 0; i < items.length; i++) {\n  console.log(items[i]);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ForStatement", label: "for ループを使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const items = ["a", "b", "c"];
for (let i = 0; i < items.length; i++) {
  console.log(items[i]);
}
`,
  badSolutions: [
    {
      code: `console.log("a");
console.log("b");
console.log("c");
`,
      description: "ループを使わず 1 行ずつ出力している (ループのバグ修正の練習)",
    },
  ],
  mdnSections: [
    { heading: "for 文", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for", pageTitle: "for 文" },
  ],
};
