import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch12FixSumRange: Assignment = {
  id: "S3-Ch12-01-fix-sum-range",
  stage: "S3",
  chapterId: "Ch12",
  sequence: 1,
  title: "[デバッグ] sumRange のオフバイワンバグを直す",
  newConcept: "for ループの境界条件 (off-by-one) を見抜いて修正する",
  estimatedMinutes: 10,
  difficulty: 2,
  testKind: "function",
  description: `## やること

下記の \`sumRange\` 関数は \`from\` から \`to\` までの整数の合計を返すはずですが、 **オフバイワン** のバグがあります。 \`to\` 自身が合計に含まれていません。 これを修正してください。

\`\`\`js
sumRange(1, 5);   // → 15  (1+2+3+4+5)
sumRange(0, 10);  // → 55
sumRange(3, 3);   // → 3
\`\`\`

## ヒント

- ループの条件式 \`i < to\` は **to を含まない**。 \`i <= to\` にすると含まれます。
`,
  starterFiles: singleFile(`function sumRange(from, to) {
  let sum = 0;
  for (let i = from; i < to; i++) {
    sum += i;
  }
  return sum;
}
`),
  entryPoints: ["sumRange"],
  demoCall: `console.log(sumRange(1, 5));`,
  tests: [
    { name: "sumRange(1,5) は 15", code: `sumRange(1,5) === 15` },
    { name: "sumRange(0,10) は 55", code: `sumRange(0,10) === 55` },
    { name: "sumRange(3,3) は 3", code: `sumRange(3,3) === 3` },
    { name: "sumRange(-2,2) は 0", code: `sumRange(-2,2) === 0` },
    { name: "sumRange(10,12) は 33", code: `sumRange(10,12) === 33` },
  ],
  hints: [
    "i < to を i <= to に変える。",
    "解答例:\n```js\nfunction sumRange(from, to) {\n  let sum = 0;\n  for (let i = from; i <= to; i++) {\n    sum += i;\n  }\n  return sum;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で合計を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function sumRange(from, to) {
  let sum = 0;
  for (let i = from; i <= to; i++) {
    sum += i;
  }
  return sum;
}
`,
  badSolutions: [
    {
      code: `function sumRange(from, to) {
  let sum = 0;
  for (let i = from; i < to; i++) {
    sum += i;
  }
  return sum;
}
`,
      description: "オフバイワンが直っていない (元のバグそのまま)",
    },
    {
      code: `function sumRange(from, to) {
  return to - from;
}
`,
      description: "合計ではなく差を返している",
    },
  ],
  mdnSections: [
    {
      heading: "for 文",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for",
      pageTitle: "for",
    },
  ],
};
