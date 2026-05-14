import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch14MaskNumbers: Assignment = {
  id: "S3-Ch14-04-mask-numbers",
  stage: "S3",
  chapterId: "Ch14",
  sequence: 4,
  title: "文字列中の数字を全部 # に置換する",
  newConcept: "String.replace と g フラグ付き正規表現で全置換",
  estimatedMinutes: 10,
  difficulty: 2,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 含まれるすべての数字 \`0-9\` を \`"#"\` に置き換えた文字列を返す関数 \`maskNumbers\` を実装してください。

\`\`\`js
maskNumbers("abc123");        // → "abc###"
maskNumbers("phone: 080-1234-5678"); // → "phone: ###-####-####"
maskNumbers("no digits");     // → "no digits"
maskNumbers("0");             // → "#"
\`\`\`

## ポイント

- \`s.replace(/\\d/g, "#")\` で「すべての数字を # に」 置換できます。
- \`g\` フラグが無いと最初の 1 文字しか置換されません。
`,
  starterFiles: singleFile(`function maskNumbers(s) {
  // ここを実装してください
}
`),
  entryPoints: ["maskNumbers"],
  demoCall: `console.log(maskNumbers("phone: 080-1234-5678"));`,
  tests: [
    { name: 'maskNumbers("abc123") は "abc###"', code: `maskNumbers("abc123") === "abc###"` },
    {
      name: 'maskNumbers("phone: 080-1234-5678") は "phone: ###-####-####"',
      code: `maskNumbers("phone: 080-1234-5678") === "phone: ###-####-####"`,
    },
    { name: 'maskNumbers("no digits") は "no digits"', code: `maskNumbers("no digits") === "no digits"` },
    { name: 'maskNumbers("0") は "#"', code: `maskNumbers("0") === "#"` },
    { name: 'maskNumbers("") は ""', code: `maskNumbers("") === ""` },
  ],
  hints: [
    "s.replace(/\\d/g, \"#\");",
    "解答例:\n```js\nfunction maskNumbers(s) {\n  return s.replace(/\\d/g, \"#\");\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で文字列を返す" },
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function maskNumbers(s) {
  return s.replace(/\\d/g, "#");
}
`,
  badSolutions: [
    {
      code: `function maskNumbers(s) {
  return s.replace(/\\d/, "#");
}
`,
      description: "g フラグが無く最初の 1 文字しか置換できない",
    },
    {
      code: `function maskNumbers(s) {
  return s;
}
`,
      description: "置換していない",
    },
  ],
  mdnSections: [
    {
      heading: "String.prototype.replace()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace",
      pageTitle: "String.prototype.replace()",
    },
  ],
};
