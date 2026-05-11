import type { Assignment } from "../../../types.js";

export const s2Ch12LooseEqBug: Assignment = {
  id: "S2-Ch12-05-loose-eq-bug",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 5,
  title: "== を === に直して型の罠を避ける",
  newConcept: "== は型変換するので意図しない一致になる",
  estimatedMinutes: 7,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下のコードは「\`a\` と \`b\` が同じ値か」 を判定するつもりですが、 \`==\` を使っているせいで **型が違っても同じ扱い** になっています。 \`===\` に変更して、 期待通りに \`"異なる"\` を出力させてください。

\`\`\`js
const a = 0;
const b = "0";
if (a == b) {
  console.log("同じ");
} else {
  console.log("異なる");
}
\`\`\`

## 期待する出力

\`\`\`
異なる
\`\`\`

## ポイント

- \`==\` は型変換をして比較するので、 \`0 == "0"\` は \`true\` になります。
- \`===\` は型もチェックします。 \`0 === "0"\` は \`false\`。
- S2 の lint プリセットでは \`==\` がエラーになります (\`eqeqeq\`)。
`,
  starterCode: `const a = 0;
const b = "0";
if (a == b) {
  console.log("同じ");
} else {
  console.log("異なる");
}
`,
  tests: [
    {
      name: "stdout が 異なる になる",
      expectedStdout: "異なる",
    },
  ],
  hints: [
    "`==` を `===` に変えるだけで、 型までチェックされるようになります。",
    "条件式の `a == b` を `a === b` に修正します。",
    "解答例:\n```js\nconst a = 0;\nconst b = \"0\";\nif (a === b) {\n  console.log(\"同じ\");\n} else {\n  console.log(\"異なる\");\n}\n```",
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
  solution: `const a = 0;
const b = "0";
if (a === b) {
  console.log("同じ");
} else {
  console.log("異なる");
}
`,
  badSolutions: [
    {
      code: `console.log("異なる");
`,
      description: "if を消して直接出力している (== → === の修正が目的)",
    },
  ],
  mdnSections: [
    { heading: "厳密等価 (===)", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Strict_equality", pageTitle: "厳密等価 (===)" },
  ],
};
