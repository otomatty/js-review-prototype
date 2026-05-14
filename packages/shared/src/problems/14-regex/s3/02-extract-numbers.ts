import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch14ExtractNumbers: Assignment = {
  id: "S3-Ch14-02-extract-numbers",
  stage: "S3",
  chapterId: "Ch14",
  sequence: 2,
  title: "文字列から数字の連続を全部抜き出す (match)",
  newConcept: "g フラグ付き正規表現と String.match",
  estimatedMinutes: 12,
  difficulty: 2,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 数字の **連続** をすべて抜き出した文字列配列を返す関数 \`extractNumbers\` を実装してください。 数字が無ければ空配列 \`[]\` を返します。

\`\`\`js
extractNumbers("abc123def45");   // → ["123", "45"]
extractNumbers("no digits");     // → []
extractNumbers("42");            // → ["42"]
extractNumbers("a1b2c3");        // → ["1", "2", "3"]
\`\`\`

## ポイント

- \`/\\\\d+/g\` で「1 文字以上の数字の連続」 を **すべて** マッチします。
- \`s.match(/\\\\d+/g)\` は配列または \`null\` を返すので、 null のときは空配列にします。
`,
  starterFiles: singleFile(`function extractNumbers(s) {
  // ここを実装してください (match を使う)
}
`),
  entryPoints: ["extractNumbers"],
  demoCall: `console.log(extractNumbers("abc123def45"));`,
  tests: [
    {
      name: 'extractNumbers("abc123def45") は ["123","45"]',
      code: `JSON.stringify(extractNumbers("abc123def45")) === '["123","45"]'`,
    },
    {
      name: 'extractNumbers("no digits") は []',
      code: `(() => { const r = extractNumbers("no digits"); return Array.isArray(r) && r.length === 0; })()`,
    },
    {
      name: 'extractNumbers("42") は ["42"]',
      code: `JSON.stringify(extractNumbers("42")) === '["42"]'`,
    },
    {
      name: 'extractNumbers("a1b2c3") は ["1","2","3"]',
      code: `JSON.stringify(extractNumbers("a1b2c3")) === '["1","2","3"]'`,
    },
    {
      name: 'extractNumbers("") は []',
      code: `(() => { const r = extractNumbers(""); return Array.isArray(r) && r.length === 0; })()`,
    },
  ],
  hints: [
    "s.match(/\\d+/g) ?? [] で null フォールバック。",
    "解答例:\n```js\nfunction extractNumbers(s) {\n  return s.match(/\\d+/g) ?? [];\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で配列を返す" },
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function extractNumbers(s) {
  return s.match(/\\d+/g) ?? [];
}
`,
  badSolutions: [
    {
      code: `function extractNumbers(s) {
  return s.match(/\\d/g) ?? [];
}
`,
      description: "+ を付けておらず数字を 1 文字ずつ切ってしまう",
    },
    {
      code: `function extractNumbers(s) {
  return s.match(/\\d+/) ?? [];
}
`,
      description: "g フラグが無く最初の 1 グループしか取れない",
    },
  ],
  mdnSections: [
    {
      heading: "String.prototype.match()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/match",
      pageTitle: "String.prototype.match()",
    },
  ],
};
