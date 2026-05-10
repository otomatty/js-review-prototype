import type { Assignment } from "../../../types.js";

export const s2Ch12InfiniteLoopFix: Assignment = {
  id: "S2-Ch12-06-infinite-loop-fix",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 6,
  title: "while ループの i++ 忘れを直す",
  newConcept: "ループ変数を更新しないと無限ループになる",
  estimatedMinutes: 7,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下の while ループは \`i++\` を **忘れている** ので無限ループになります (このまま実行するとタイムアウト)。 \`i++\` を入れて、 \`1\` から \`3\` まで出力するように直してください。

\`\`\`js
let i = 1;
while (i <= 3) {
  console.log(i);
}
\`\`\`

## 期待する出力

\`\`\`
1
2
3
\`\`\`

## ポイント

- while で **ループ変数を更新しない** と条件が永遠に真のままで無限ループになります。
- 修正は \`console.log(i);\` の **直後** に \`i++;\` を入れるだけです。
`,
  starterCode: `let i = 1;
while (i <= 3) {
  console.log(i);
}
`,
  tests: [
    {
      name: "stdout が 1/2/3 の 3 行になる",
      expectedStdout: "1\n2\n3",
    },
  ],
  hints: [
    "while の中で `i` を更新する文がないことが問題です。",
    "`console.log(i);` の次の行に `i++;` を追加します。",
    "解答例:\n```js\nlet i = 1;\nwhile (i <= 3) {\n  console.log(i);\n  i++;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "WhileStatement", label: "while ループを使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `let i = 1;
while (i <= 3) {
  console.log(i);
  i++;
}
`,
  badSolutions: [
    {
      code: `console.log(1);
console.log(2);
console.log(3);
`,
      description: "while を消して直接出力している (i++ 追加の修正が目的)",
    },
  ],
  mdnSections: [
    { heading: "while", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/while", pageTitle: "while" },
  ],
};
