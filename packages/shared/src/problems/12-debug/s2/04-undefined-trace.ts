import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s2Ch12UndefinedTrace: Assignment = {
  id: "S2-Ch12-04-undefined-trace",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 4,
  title: "未定義変数を typo で起こさないようにする",
  newConcept: "変数名のタイポが undefined や ReferenceError の原因になる",
  estimatedMinutes: 7,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下のコードは「合計を出力する」 つもりですが、 **タイポ** で正しく動きません。 変数名のミスを直してください。

\`\`\`js
const a = 10;
const b = 20;
const totl = a + b;
console.log(total);
\`\`\`

## 期待する出力

\`\`\`
30
\`\`\`

## ポイント

- 宣言した変数名 (\`totl\`) と参照している変数名 (\`total\`) が違うと参照エラーになります。
- 名前の打ち間違いに気付くために **エディタの補完** を頼るのが有効です。
`,
  starterFiles: singleFile(`const a = 10;
const b = 20;
const totl = a + b;
console.log(total);
`),
  tests: [
    {
      name: "stdout が 30 になる",
      expectedStdout: "30",
    },
  ],
  hints: [
    "宣言と参照で **同じ綴り** に揃えます。",
    "今回は `totl` を `total` に修正し、 `console.log(total)` に揃えます (採点条件は const total を必須としているため)。",
    "解答例:\n```js\nconst a = 10;\nconst b = 20;\nconst total = a + b;\nconsole.log(total);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "const-declaration", name: "total", label: "const total を宣言する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const a = 10;
const b = 20;
const total = a + b;
console.log(total);
`,
  badSolutions: [
    {
      code: `console.log(30);
`,
      description: "変数を消して結果を直接書いている (タイポ修正が目的)",
    },
  ],
  mdnSections: [
    { heading: "ReferenceError", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Errors/Not_defined", pageTitle: "ReferenceError: variable is not defined" },
  ],
};
