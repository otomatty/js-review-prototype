import type { Assignment } from "../../../types.js";

export const s2Ch01TypeofArray: Assignment = {
  id: "S2-Ch01-08-typeof-array",
  stage: "S2",
  chapterId: "Ch01",
  sequence: 8,
  title: "typeof で配列は 'object' になる",
  newConcept: "配列も object 扱いで、 typeof では区別できない",
  estimatedMinutes: 5,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

配列に対して \`typeof\` を使うと \`"object"\` が返ります。 これを確かめてください。

\`\`\`js
const nums = [1, 2, 3];
\`\`\`

\`typeof nums\` の結果を出力します。

## 期待する出力

\`\`\`
object
\`\`\`

## ポイント

- JavaScript では配列は内部的に **オブジェクト** の一種なので、 \`typeof\` では \`"object"\` としか分かりません。
- 「配列かどうか」 を判定したいときは \`Array.isArray(...)\` を使います (Ch04 で学習)。
`,
  starterCode: `// 1. const nums = [1, 2, 3]; を宣言する
// 2. console.log(typeof nums); で型を出力する

`,
  tests: [
    {
      name: "stdout が object になる",
      expectedStdout: "object",
    },
  ],
  hints: [
    "`typeof 配列` は **`\"object\"`** と返ります。 ここが JavaScript の有名な落とし穴の一つです。",
    "出力するのは `nums` の中身ではなく `typeof nums` の結果です。",
    "解答例:\n```js\nconst nums = [1, 2, 3];\nconsole.log(typeof nums);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "const-declaration",
          name: "nums",
          label: "const nums を宣言する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const nums = [1, 2, 3];
console.log(typeof nums);
`,
  badSolutions: [
    {
      code: `console.log("object");
`,
      description: "typeof を使わずに答えを直接出力している",
    },
  ],
  mdnSections: [
    { heading: "typeof", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof", pageTitle: "typeof" },
  ],
};
