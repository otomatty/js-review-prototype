import type { Assignment } from "../../../types.js";

export const s4Ch14ParseDate: Assignment = {
  id: "S4-Ch14-01-parse-date",
  stage: "S4",
  chapterId: "Ch14",
  sequence: 1,
  title: "YYYY-MM-DD をキャプチャグループで分解する",
  newConcept: "キャプチャグループ `(...)` と `match` で部分文字列を取り出す",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 \`"YYYY-MM-DD"\` 形式 (年 4 桁・月 2 桁・日 2 桁) であれば
\`{ year, month, day }\` の **数値** オブジェクトを返す関数 \`parseDate\` を実装してください。
形式が合わなければ \`null\` を返します (前後の余分な文字も不可)。

\`\`\`js
parseDate("2024-03-15");   // → { year: 2024, month: 3, day: 15 }
parseDate("1999-12-01");   // → { year: 1999, month: 12, day: 1 }
parseDate("2024/03/15");   // → null (区切りが / )
parseDate("24-03-15");     // → null (年が 2 桁)
parseDate(" 2024-03-15");  // → null (前に空白)
parseDate("");             // → null
\`\`\`

## ポイント

- 正規表現の \`(...)\` は **キャプチャグループ**。 マッチした部分を後から取り出せます。
- アンカー \`^\` \`$\` で完全一致を担保した上で、 \`^(\\\\d{4})-(\\\\d{2})-(\\\\d{2})$\` のように 3 つグループを置きます。
- \`s.match(re)\` は配列を返し、 \`[0]\` が全体、 \`[1]\` \`[2]\` \`[3]\` がキャプチャです。 マッチしなかった場合は \`null\`。
- 数値化は \`Number(...)\` で。 \`parseInt\` でも可ですが、 ここでは \`Number\` を推奨します。
`,
  starterCode: `function parseDate(s) {
  // キャプチャグループで YYYY-MM-DD を取り出してください
  // マッチしなければ null を返します
}
`,
  entryPoints: ["parseDate"],
  demoCall: `console.log(parseDate("2024-03-15"));`,
  tests: [
    {
      name: '"2024-03-15" は { year: 2024, month: 3, day: 15 }',
      code: `JSON.stringify(parseDate("2024-03-15")) === JSON.stringify({ year: 2024, month: 3, day: 15 })`,
    },
    {
      name: '"1999-12-01" は { year: 1999, month: 12, day: 1 }',
      code: `JSON.stringify(parseDate("1999-12-01")) === JSON.stringify({ year: 1999, month: 12, day: 1 })`,
    },
    {
      name: '"2024/03/15" は null',
      code: `parseDate("2024/03/15") === null`,
    },
    {
      name: '"24-03-15" は null (年が 2 桁)',
      code: `parseDate("24-03-15") === null`,
    },
    {
      name: '" 2024-03-15" は null (前に空白)',
      code: `parseDate(" 2024-03-15") === null`,
    },
    {
      name: '"" は null',
      code: `parseDate("") === null`,
    },
    {
      name: "戻り値は数値プロパティを持つ",
      code: `(() => {
        const r = parseDate("2024-03-15");
        return typeof r.year === "number" && typeof r.month === "number" && typeof r.day === "number";
      })()`,
    },
  ],
  hints: [
    "/^(\\d{4})-(\\d{2})-(\\d{2})$/ のキャプチャを使い、 match の戻り値から [1] [2] [3] を取り出して Number() で数値化する。",
    "解答例:\n```js\nfunction parseDate(s) {\n  const m = s.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);\n  if (m === null) {\n    return null;\n  }\n  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return でオブジェクトまたは null を返す" },
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
        { kind: "method", name: "match", label: "String#match を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function parseDate(s) {
  const m = s.match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);
  if (m === null) {
    return null;
  }
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}
`,
  badSolutions: [
    {
      code: `function parseDate(s) {
  const parts = s.split("-");
  if (parts.length !== 3) {
    return null;
  }
  return { year: Number(parts[0]), month: Number(parts[1]), day: Number(parts[2]) };
}
`,
      description: "正規表現を使っておらず桁数チェックが甘い (AST required 違反 + テスト失敗)",
    },
    {
      code: `function parseDate(s) {
  const m = s.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
  if (m === null) {
    return null;
  }
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}
`,
      description: "アンカー ^ $ がなく前後の余分な文字を許してしまう (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "グループと後方参照",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences",
      pageTitle: "グループと後方参照",
    },
    {
      heading: "String.prototype.match()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/match",
      pageTitle: "String.prototype.match()",
    },
  ],
};
