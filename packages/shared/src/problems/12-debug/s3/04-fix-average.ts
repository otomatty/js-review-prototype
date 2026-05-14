import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch12FixAverage: Assignment = {
  id: "S3-Ch12-04-fix-average",
  stage: "S3",
  chapterId: "Ch12",
  sequence: 4,
  title: "[デバッグ] 平均計算で割り算を忘れているバグを直す",
  newConcept: "戻り値の最終ステップを見落とさない",
  estimatedMinutes: 8,
  difficulty: 1,
  testKind: "function",
  description: `## やること

下記の \`average\` 関数は配列の **平均** を返すはずですが、 合計までしか計算しておらず、 要素数で割っていません。 修正してください。 入力は **必ず 1 要素以上** あるとします。

\`\`\`js
average([1, 2, 3]);    // → 2
average([10, 20]);     // → 15
average([5]);          // → 5
average([1, 2]);       // → 1.5
\`\`\`

## ヒント

- ループの後、 \`sum / arr.length\` を return してください。
`,
  starterFiles: singleFile(`function average(arr) {
  let sum = 0;
  for (const n of arr) {
    sum += n;
  }
  return sum;
}
`),
  entryPoints: ["average"],
  demoCall: `console.log(average([1, 2, 3]));`,
  tests: [
    { name: "average([1,2,3]) は 2", code: `average([1,2,3]) === 2` },
    { name: "average([10,20]) は 15", code: `average([10,20]) === 15` },
    { name: "average([5]) は 5", code: `average([5]) === 5` },
    { name: "average([1,2]) は 1.5", code: `average([1,2]) === 1.5` },
    { name: "average([4,4,4,4]) は 4", code: `average([4,4,4,4]) === 4` },
  ],
  hints: [
    "最後の return を sum / arr.length に変える。",
    "解答例:\n```js\nfunction average(arr) {\n  let sum = 0;\n  for (const n of arr) sum += n;\n  return sum / arr.length;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で平均値を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function average(arr) {
  let sum = 0;
  for (const n of arr) {
    sum += n;
  }
  return sum / arr.length;
}
`,
  badSolutions: [
    {
      code: `function average(arr) {
  let sum = 0;
  for (const n of arr) sum += n;
  return sum;
}
`,
      description: "元のバグのまま (合計を返している)",
    },
    {
      code: `function average(arr) {
  return arr[0];
}
`,
      description: "先頭要素を返している",
    },
  ],
  mdnSections: [
    {
      heading: "Array.prototype.length",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/length",
      pageTitle: "Array.prototype.length",
    },
  ],
};
