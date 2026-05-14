import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch10Unique: Assignment = {
  id: "S4-Ch10-01-unique",
  stage: "S4",
  chapterId: "Ch10",
  sequence: 1,
  title: "Set で配列から重複を取り除く",
  newConcept: "Set を使って重複を排除する (Ch10 で初登場するデータ構造)",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

数値や文字列の配列 \`arr\` を受け取り、 **重複を取り除いた新しい配列** を返す関数 \`unique\` を実装してください。 順序は **最初に現れた順** を保ってください。

\`\`\`js
unique([1, 2, 2, 3, 1]);            // → [1, 2, 3]
unique(["a", "b", "a", "c", "b"]);  // → ["a", "b", "c"]
unique([]);                          // → []
\`\`\`

## ポイント

- **\`Set\` は重複を許さないコレクション** です。 \`new Set(arr)\` で配列を渡すと重複が自動的に排除されます。
- \`Set\` の反復順序は **要素を追加した順** なので、 「最初に現れた順」 を保ったまま配列に戻せます。
- スプレッド構文 \`[...new Set(arr)]\` で 1 行で書けます。

## ヒント

- AST で **\`new\` 式 (NewExpression)** を必須にしています。 \`new Set(...)\` を使わない \`for\` ループ + \`includes\` のような実装では通りません。
`,
  starterFiles: singleFile(`function unique(arr) {
  // Set を使って重複を取り除いてください
}
`),
  entryPoints: ["unique"],
  demoCall: `console.log(unique([1, 2, 2, 3, 1]));`,
  tests: [
    {
      name: "数値配列の重複が除かれる",
      code: `JSON.stringify(unique([1, 2, 2, 3, 1])) === JSON.stringify([1, 2, 3])`,
    },
    {
      name: "文字列配列の重複が除かれる",
      code: `JSON.stringify(unique(["a", "b", "a", "c", "b"])) === JSON.stringify(["a", "b", "c"])`,
    },
    {
      name: "空配列は空配列",
      code: `JSON.stringify(unique([])) === JSON.stringify([])`,
    },
    {
      name: "重複なしならそのまま",
      code: `JSON.stringify(unique([1, 2, 3])) === JSON.stringify([1, 2, 3])`,
    },
    {
      name: "全て同じ要素なら 1 件になる",
      code: `JSON.stringify(unique([7, 7, 7, 7])) === JSON.stringify([7])`,
    },
    {
      name: "戻り値は配列",
      code: `Array.isArray(unique([1, 2, 3]))`,
    },
  ],
  hints: [
    "new Set(arr) で重複が落ちる。 [...new Set(arr)] で配列に戻せる。",
    "解答例:\n```js\nfunction unique(arr) {\n  return [...new Set(arr)];\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で配列を返す" },
        { kind: "node", nodeType: "NewExpression", label: "new Set(...) を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function unique(arr) {
  return [...new Set(arr)];
}
`,
  badSolutions: [
    {
      code: `function unique(arr) {
  return arr;
}
`,
      description: "重複を取り除いていない (テスト失敗)",
    },
    {
      code: `function unique(arr) {
  const out = [];
  for (const x of arr) {
    if (!out.includes(x)) {
      out.push(x);
    }
  }
  return out;
}
`,
      description: "Set を使わずに includes で実装している (AST required 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "Set",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Set",
      pageTitle: "Set",
    },
  ],
};
