import type { Assignment } from "../../../types.js";

export const s3Ch12FixIsEmpty: Assignment = {
  id: "S3-Ch12-02-fix-is-empty",
  stage: "S3",
  chapterId: "Ch12",
  sequence: 2,
  title: "[デバッグ] isEmpty の判定ミスを直す",
  newConcept: "比較条件の向き (> 0 vs === 0) を見直す",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "function",
  description: `## やること

下記の \`isEmpty\` 関数は **空配列なら true、 1 要素以上なら false** を返すはずですが、 比較が逆で **空配列で false / 要素ありで true** になっています。 修正してください。

\`\`\`js
isEmpty([]);          // → true
isEmpty([1, 2]);      // → false
isEmpty([0]);         // → false
\`\`\`

## ヒント

- 「長さが 0 か」 を判定するなら \`arr.length === 0\` を使います。
- \`arr.length\` 単独だと真偽値ではなく数値が返り、 さらに \`> 0\` だと逆の判定になります。
`,
  starterCode: `function isEmpty(arr) {
  return arr.length > 0;
}
`,
  entryPoints: ["isEmpty"],
  demoCall: `console.log(isEmpty([]), isEmpty([1,2]));`,
  tests: [
    { name: "isEmpty([]) は true", code: `isEmpty([]) === true` },
    { name: "isEmpty([1,2]) は false", code: `isEmpty([1,2]) === false` },
    { name: "isEmpty([0]) は false", code: `isEmpty([0]) === false` },
    { name: "isEmpty([1,2,3,4,5]) は false", code: `isEmpty([1,2,3,4,5]) === false` },
  ],
  hints: [
    "arr.length === 0 で空判定。",
    "解答例:\n```js\nfunction isEmpty(arr) {\n  return arr.length === 0;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で真偽値を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function isEmpty(arr) {
  return arr.length === 0;
}
`,
  badSolutions: [
    {
      code: `function isEmpty(arr) {
  return arr.length > 0;
}
`,
      description: "元のバグそのまま (空かどうか逆の判定)",
    },
    {
      code: `function isEmpty(arr) {
  return arr.length !== 0;
}
`,
      description: "逆判定のまま (空のとき false になる)",
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
