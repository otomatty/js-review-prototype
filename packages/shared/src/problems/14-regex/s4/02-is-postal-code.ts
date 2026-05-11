import type { Assignment } from "../../../types.js";

export const s4Ch14IsPostalCode: Assignment = {
  id: "S4-Ch14-02-is-postal-code",
  stage: "S4",
  chapterId: "Ch14",
  sequence: 2,
  title: "日本の郵便番号 (123-4567) を検証する",
  newConcept: "量指定子 `{n}` で桁数を固定して入力検証する",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 日本の郵便番号形式 \`"###-####"\` (数字 3 桁 + ハイフン + 数字 4 桁、 前後に余分な文字なし)
であれば \`true\`、 そうでなければ \`false\` を返す関数 \`isPostalCode\` を実装してください。

\`\`\`js
isPostalCode("123-4567");    // → true
isPostalCode("000-0000");    // → true
isPostalCode("1234567");     // → false  (ハイフンなし)
isPostalCode("12-34567");    // → false  (桁数違い)
isPostalCode("123-456");     // → false  (桁数違い)
isPostalCode("abc-defg");    // → false  (数字でない)
isPostalCode(" 123-4567");   // → false  (前に空白)
isPostalCode("");            // → false
\`\`\`

## ポイント

- **量指定子 \`{n}\`** は 「ちょうど n 回」 を表します。 \`\\\\d{3}\` で 「数字を **ちょうど 3 桁**」。
- 完全一致 (前後の空白も許さない) なので \`^\` \`$\` でアンカーを付けます。
- 正規表現の全体像: \`^\\\\d{3}-\\\\d{4}$\`
`,
  starterCode: `function isPostalCode(s) {
  // 正規表現で「数字 3 桁 + ハイフン + 数字 4 桁」を完全一致で判定してください
}
`,
  entryPoints: ["isPostalCode"],
  demoCall: `console.log(isPostalCode("123-4567"));`,
  tests: [
    { name: '"123-4567" は true', code: `isPostalCode("123-4567") === true` },
    { name: '"000-0000" は true', code: `isPostalCode("000-0000") === true` },
    { name: '"1234567" は false (ハイフンなし)', code: `isPostalCode("1234567") === false` },
    { name: '"12-34567" は false (桁数違い)', code: `isPostalCode("12-34567") === false` },
    { name: '"123-456" は false (桁数違い)', code: `isPostalCode("123-456") === false` },
    { name: '"abc-defg" は false', code: `isPostalCode("abc-defg") === false` },
    { name: '" 123-4567" は false (前に空白)', code: `isPostalCode(" 123-4567") === false` },
    { name: '"123-4567 " は false (後ろに空白)', code: `isPostalCode("123-4567 ") === false` },
    { name: '"" は false', code: `isPostalCode("") === false` },
  ],
  hints: [
    "/^\\d{3}-\\d{4}$/.test(s) で完全一致判定。",
    "解答例:\n```js\nfunction isPostalCode(s) {\n  return /^\\d{3}-\\d{4}$/.test(s);\n}\n```",
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
  solution: `function isPostalCode(s) {
  return /^\\d{3}-\\d{4}$/.test(s);
}
`,
  badSolutions: [
    {
      code: `function isPostalCode(s) {
  return /\\d{3}-\\d{4}/.test(s);
}
`,
      description: "アンカーがなく前後の余分な文字を許してしまう (テスト失敗)",
    },
    {
      code: `function isPostalCode(s) {
  const parts = s.split("-");
  return parts.length === 2 && parts[0].length === 3 && parts[1].length === 4;
}
`,
      description: "正規表現を使っておらず数字以外も通る (AST required 違反 + テスト失敗)",
    },
    {
      code: `function isPostalCode(s) {
  return /^\\d+-\\d+$/.test(s);
}
`,
      description: "桁数を固定していない ({n} を使っていない) (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "量指定子",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Quantifiers",
      pageTitle: "量指定子",
    },
  ],
};
