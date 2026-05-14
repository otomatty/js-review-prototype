import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch14ExtractHashtags: Assignment = {
  id: "S4-Ch14-04-extract-hashtags",
  stage: "S4",
  chapterId: "Ch14",
  sequence: 4,
  title: "matchAll でハッシュタグを全部抜き出す",
  newConcept: "`matchAll` のイテレータをスプレッドし、 キャプチャ部分だけを取り出す",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 含まれる **ハッシュタグ** (\`#\` の直後に続く英数字とアンダースコアの連続)
を、 先頭の \`#\` を除いた文字列の配列として返す関数 \`extractHashtags\` を実装してください。
ハッシュタグが無ければ空配列 \`[]\` を返します。

\`\`\`js
extractHashtags("tweet about #js and #regex");  // → ["js", "regex"]
extractHashtags("no tags here");                // → []
extractHashtags("#a #b #c");                    // → ["a", "b", "c"]
extractHashtags("#tag_1 and #tag_2");           // → ["tag_1", "tag_2"]
extractHashtags("# alone");                     // → []  (# のあとに英数字がない)
extractHashtags("");                            // → []
\`\`\`

## ポイント

- \`String.prototype.matchAll(re)\` は **イテレータ** を返します。 \`[...s.matchAll(re)]\` で配列化できます。
- 各要素は \`match\` と同じ配列で、 \`[0]\` が全体、 \`[1]\` がキャプチャ 1 番目です。
- パターン: \`/#(\\\\w+)/g\` で 「# のあとに英数字 (\`[A-Za-z0-9_]\`) が 1 文字以上」 をキャプチャ。
- \`map((m) => m[1])\` でキャプチャ部分だけを抜き出して配列にします。
`,
  starterFiles: singleFile(`function extractHashtags(s) {
  // matchAll + キャプチャグループで # の後の文字列を集めてください
}
`),
  entryPoints: ["extractHashtags"],
  demoCall: `console.log(extractHashtags("tweet about #js and #regex"));`,
  tests: [
    {
      name: '"tweet about #js and #regex" は ["js","regex"]',
      code: `JSON.stringify(extractHashtags("tweet about #js and #regex")) === JSON.stringify(["js","regex"])`,
    },
    {
      name: '"no tags here" は []',
      code: `(() => { const r = extractHashtags("no tags here"); return Array.isArray(r) && r.length === 0; })()`,
    },
    {
      name: '"#a #b #c" は ["a","b","c"]',
      code: `JSON.stringify(extractHashtags("#a #b #c")) === JSON.stringify(["a","b","c"])`,
    },
    {
      name: '"#tag_1 and #tag_2" は ["tag_1","tag_2"]',
      code: `JSON.stringify(extractHashtags("#tag_1 and #tag_2")) === JSON.stringify(["tag_1","tag_2"])`,
    },
    {
      name: '"# alone" は []',
      code: `(() => { const r = extractHashtags("# alone"); return Array.isArray(r) && r.length === 0; })()`,
    },
    {
      name: '"" は []',
      code: `(() => { const r = extractHashtags(""); return Array.isArray(r) && r.length === 0; })()`,
    },
  ],
  hints: [
    "[...s.matchAll(/#(\\w+)/g)].map((m) => m[1]) でキャプチャだけを集めます。",
    "解答例:\n```js\nfunction extractHashtags(s) {\n  return [...s.matchAll(/#(\\w+)/g)].map((m) => m[1]);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で配列を返す" },
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
        { kind: "method", name: "matchAll", label: "String#matchAll を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function extractHashtags(s) {
  return [...s.matchAll(/#(\\w+)/g)].map((m) => m[1]);
}
`,
  badSolutions: [
    {
      code: `function extractHashtags(s) {
  return s.match(/#\\w+/g) ?? [];
}
`,
      description: "matchAll を使っておらず、 # も結果に含めてしまう (AST required 違反 + テスト失敗)",
    },
    {
      code: `function extractHashtags(s) {
  return [...s.matchAll(/#(\\w+)/g)].map((m) => m[0]);
}
`,
      description: "キャプチャ [1] ではなく [0] を取っているので # が残る (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "String.prototype.matchAll()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll",
      pageTitle: "String.prototype.matchAll()",
    },
    {
      heading: "グループと後方参照",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences",
      pageTitle: "グループと後方参照",
    },
  ],
};
