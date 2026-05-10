import type { Assignment } from "../../../types.js";

export const s2Ch01TypeofNull: Assignment = {
  id: "S2-Ch01-10-typeof-null",
  stage: "S2",
  chapterId: "Ch01",
  sequence: 10,
  title: "typeof null は 'object' (有名な罠)",
  newConcept: "null の typeof 結果は歴史的経緯で 'object' になる",
  estimatedMinutes: 5,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

\`const empty = null;\` を宣言し、 \`typeof empty\` の結果を出力してください。

## 期待する出力

\`\`\`
object
\`\`\`

## ポイント

- \`null\` は「**値が存在しないこと** を明示するための値」 ですが、 \`typeof null\` は歴史的なバグで \`"object"\` を返します。
- これは仕様の有名な不具合として知られています。 「null かどうか」 を判定したいときは \`value === null\` と書きます。
`,
  starterCode: `// 1. const empty = null; を宣言する
// 2. console.log(typeof empty); で型を出力する

`,
  tests: [
    {
      name: "stdout が object になる",
      expectedStdout: "object",
    },
  ],
  hints: [
    "`null` は値そのものですが、 `typeof null` は `\"object\"` を返します。",
    "出力するのは `empty` の中身ではなく `typeof empty` の結果です。",
    "解答例:\n```js\nconst empty = null;\nconsole.log(typeof empty);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "const-declaration",
          name: "empty",
          label: "const empty を宣言する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const empty = null;
console.log(typeof empty);
`,
  badSolutions: [
    {
      code: `console.log("object");
`,
      description: "typeof を使わずに答えを直接出力している",
    },
  ],
  mdnSections: [
    { heading: "null", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/null", pageTitle: "null" },
  ],
};
