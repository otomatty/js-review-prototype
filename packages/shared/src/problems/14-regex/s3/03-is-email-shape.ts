import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch14IsEmailShape: Assignment = {
  id: "S3-Ch14-03-is-email-shape",
  stage: "S3",
  chapterId: "Ch14",
  sequence: 3,
  title: "メールアドレスのおおまかな形か判定する",
  newConcept: "アンカー (^ $) と量指定子 (+) を組み合わせる",
  estimatedMinutes: 12,
  difficulty: 2,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 「**文字 + @ + 文字 + . + 文字**」 という形 (RFC 準拠ではない簡易判定) かどうかを返す関数 \`isEmailShape\` を実装してください。 完全一致 (前後に余分な文字がない) を求めます。

\`\`\`js
isEmailShape("a@b.c");                  // → true
isEmailShape("alice@example.com");      // → true
isEmailShape("no-at-mark");             // → false
isEmailShape("a@b");                    // → false  (ドットなし)
isEmailShape("@b.c");                   // → false  (前が空)
isEmailShape(" a@b.c");                 // → false  (空白)
\`\`\`

## ポイント

- 正規表現は **\`^\` で先頭、 \`$\` で末尾** を表す (完全一致のために必要)。
- 「@ 以外の文字 1 文字以上」 は \`[^@\\\\s]+\` で書けます (\`@\` と空白を除外)。
- 構成: \`^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$\`
`,
  starterFiles: singleFile(`function isEmailShape(s) {
  // ここを実装してください
}
`),
  entryPoints: ["isEmailShape"],
  demoCall: `console.log(isEmailShape("alice@example.com"));`,
  tests: [
    { name: 'isEmailShape("a@b.c") は true', code: `isEmailShape("a@b.c") === true` },
    { name: 'isEmailShape("alice@example.com") は true', code: `isEmailShape("alice@example.com") === true` },
    { name: 'isEmailShape("no-at-mark") は false', code: `isEmailShape("no-at-mark") === false` },
    { name: 'isEmailShape("a@b") は false', code: `isEmailShape("a@b") === false` },
    { name: 'isEmailShape("@b.c") は false', code: `isEmailShape("@b.c") === false` },
    { name: 'isEmailShape(" a@b.c") は false', code: `isEmailShape(" a@b.c") === false` },
    { name: 'isEmailShape("") は false', code: `isEmailShape("") === false` },
  ],
  hints: [
    "/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(s);",
    "解答例:\n```js\nfunction isEmailShape(s) {\n  return /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(s);\n}\n```",
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
  solution: `function isEmailShape(s) {
  return /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(s);
}
`,
  badSolutions: [
    {
      code: `function isEmailShape(s) {
  return s.includes("@");
}
`,
      description: "@ を含むだけで true にしている (ドットや前後を見ていない)",
    },
    {
      code: `function isEmailShape(s) {
  return /[^@\\s]+@[^@\\s]+\\.[^@\\s]+/.test(s);
}
`,
      description: "アンカー (^ $) がなく、 前後に空白などがあっても通る",
    },
  ],
  mdnSections: [
    {
      heading: "アサーション (^ $)",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Assertions",
      pageTitle: "アサーション",
    },
  ],
};
