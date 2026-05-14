import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch14ContainsDigit: Assignment = {
  id: "S3-Ch14-01-contains-digit",
  stage: "S3",
  chapterId: "Ch14",
  sequence: 1,
  title: "数字が含まれているか判定する (test)",
  newConcept: "RegExp.test() で真偽値を得る",
  estimatedMinutes: 8,
  difficulty: 1,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 数字 (\`0-9\`) が **1 文字でも含まれていれば** \`true\`、 そうでなければ \`false\` を返す関数 \`containsDigit\` を実装してください。

\`\`\`js
containsDigit("abc");        // → false
containsDigit("abc123");     // → true
containsDigit("0");          // → true
containsDigit("");           // → false
containsDigit("hello!");     // → false
\`\`\`

## ポイント

- 正規表現リテラル \`/\\\\d/\` で「数字 1 文字」 を表現します。
- \`/\\\\d/.test(s)\` で「含むか」 の真偽が取れます。
`,
  starterFiles: singleFile(`function containsDigit(s) {
  // ここを実装してください (RegExp.test を使う)
}
`),
  entryPoints: ["containsDigit"],
  demoCall: `console.log(containsDigit("abc123"));`,
  tests: [
    { name: 'containsDigit("abc") は false', code: `containsDigit("abc") === false` },
    { name: 'containsDigit("abc123") は true', code: `containsDigit("abc123") === true` },
    { name: 'containsDigit("0") は true', code: `containsDigit("0") === true` },
    { name: 'containsDigit("") は false', code: `containsDigit("") === false` },
    { name: 'containsDigit("hello!") は false', code: `containsDigit("hello!") === false` },
    { name: 'containsDigit("year2024") は true', code: `containsDigit("year2024") === true` },
  ],
  hints: [
    "/\\d/.test(s) で 1 文字でも数字があれば true。",
    "解答例:\n```js\nfunction containsDigit(s) {\n  return /\\d/.test(s);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で真偽値を返す" },
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function containsDigit(s) {
  return /\\d/.test(s);
}
`,
  badSolutions: [
    {
      code: `function containsDigit(s) {
  for (const c of s) {
    if (c >= "0" && c <= "9") return true;
  }
  return false;
}
`,
      description: "正規表現を使っていない (required 違反)",
    },
    {
      code: `function containsDigit(s) {
  return /[a-z]/.test(s);
}
`,
      description: "数字ではなく英字を判定している",
    },
  ],
  mdnSections: [
    {
      heading: "RegExp.prototype.test()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test",
      pageTitle: "RegExp.prototype.test()",
    },
  ],
};
