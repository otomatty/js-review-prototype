import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch12FixCapitalize: Assignment = {
  id: "S3-Ch12-03-fix-capitalize",
  stage: "S3",
  chapterId: "Ch12",
  sequence: 3,
  title: "[デバッグ] capitalize で残り部分の処理漏れを直す",
  newConcept: "メソッドチェーンの抜けに気づく",
  estimatedMinutes: 10,
  difficulty: 2,
  testKind: "function",
  description: `## やること

下記の \`capitalize\` 関数は 「先頭を大文字にして残りを小文字にする」 はずですが、 残りを **小文字化していない** ため \`"WORLD"\` を渡すと \`"WORLD"\` のままになります。 修正してください。

\`\`\`js
capitalize("hello");  // → "Hello"
capitalize("WORLD");  // → "World"
capitalize("a");      // → "A"
capitalize("");       // → ""
\`\`\`

## ヒント

- 残りの部分 \`s.slice(1)\` に **\`.toLowerCase()\`** を付ければ OK。
`,
  starterFiles: singleFile(`function capitalize(s) {
  if (s.length === 0) return "";
  return s[0].toUpperCase() + s.slice(1);
}
`),
  entryPoints: ["capitalize"],
  demoCall: `console.log(capitalize("WORLD"));`,
  tests: [
    { name: 'capitalize("hello") は "Hello"', code: `capitalize("hello") === "Hello"` },
    { name: 'capitalize("WORLD") は "World"', code: `capitalize("WORLD") === "World"` },
    { name: 'capitalize("a") は "A"', code: `capitalize("a") === "A"` },
    { name: 'capitalize("") は ""', code: `capitalize("") === ""` },
    { name: 'capitalize("JavaScript") は "Javascript"', code: `capitalize("JavaScript") === "Javascript"` },
  ],
  hints: [
    "s.slice(1).toLowerCase() に変える。",
    "解答例:\n```js\nfunction capitalize(s) {\n  if (s.length === 0) return \"\";\n  return s[0].toUpperCase() + s.slice(1).toLowerCase();\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で文字列を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function capitalize(s) {
  if (s.length === 0) {
    return "";
  }
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}
`,
  badSolutions: [
    {
      code: `function capitalize(s) {
  if (s.length === 0) return "";
  return s[0].toUpperCase() + s.slice(1);
}
`,
      description: "元のバグのまま (残りを小文字化していない)",
    },
    {
      code: `function capitalize(s) {
  return s.toUpperCase();
}
`,
      description: "全部大文字化している",
    },
  ],
  mdnSections: [
    {
      heading: "String.prototype.toLowerCase()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase",
      pageTitle: "String.prototype.toLowerCase()",
    },
  ],
};
