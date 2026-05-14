import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s2Ch12ElseIfOrder: Assignment = {
  id: "S2-Ch12-07-else-if-order",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 7,
  title: "else if の順序ミスを直す",
  newConcept: "上の条件が真なら下の else if には流れない",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下のコードは「90 点以上は A、 60 点以上は B、 それ未満は C」 と判定するつもりですが、 **条件の順序が逆** で 90 点でも B が出てしまいます。 順序を直してください。

\`\`\`js
const score = 95;
if (score >= 60) {
  console.log("B");
} else if (score >= 90) {
  console.log("A");
} else {
  console.log("C");
}
\`\`\`

## 期待する出力

\`\`\`
A
\`\`\`

## ポイント

- else if は **上から順** に評価され、 最初に真になるブロックだけが実行されます。
- 大きい範囲の条件 (\`>= 60\`) を先に書くと、 95 点でも先に B にマッチして A の判定に進めません。
- 解決策は「条件をより厳しい順 (大きい順) に並べる」 こと。
`,
  starterFiles: singleFile(`const score = 95;
if (score >= 60) {
  console.log("B");
} else if (score >= 90) {
  console.log("A");
} else {
  console.log("C");
}
`),
  tests: [
    {
      name: "stdout が A になる",
      expectedStdout: "A",
    },
  ],
  hints: [
    "条件を **厳しい順** (90 → 60) に並べ替えます。",
    "`if (score >= 90)` を最初に置きます。",
    "解答例:\n```js\nconst score = 95;\nif (score >= 90) {\n  console.log(\"A\");\n} else if (score >= 60) {\n  console.log(\"B\");\n} else {\n  console.log(\"C\");\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "IfStatement", label: "if 文を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const score = 95;
if (score >= 90) {
  console.log("A");
} else if (score >= 60) {
  console.log("B");
} else {
  console.log("C");
}
`,
  badSolutions: [
    {
      code: `console.log("A");
`,
      description: "if を消して直接出力している (条件順の修正が目的)",
    },
  ],
  mdnSections: [
    { heading: "if...else", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/if...else", pageTitle: "if...else" },
  ],
};
