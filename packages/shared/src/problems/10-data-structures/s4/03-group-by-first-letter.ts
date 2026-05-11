import type { Assignment } from "../../../types.js";

export const s4Ch10GroupByFirstLetter: Assignment = {
  id: "S4-Ch10-03-group-by-first-letter",
  stage: "S4",
  chapterId: "Ch10",
  sequence: 3,
  title: "Map で文字列を先頭文字でグルーピング",
  newConcept: "Map に「キーがなければ空配列を入れる」 初期化パターン",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

文字列の配列 \`words\` を受け取り、 **先頭文字 (小文字に揃える)** をキー、 そのキーで始まる単語の配列を値とした \`Map\` を返す関数 \`groupByFirstLetter\` を実装してください。

\`\`\`js
const m = groupByFirstLetter(["apple", "Banana", "ant", "avocado", "berry"]);
m.get("a");   // → ["apple", "ant", "avocado"]
m.get("b");   // → ["Banana", "berry"]
m.size;       // → 2
\`\`\`

## ポイント

- **キーは小文字に揃える** (\`word[0].toLowerCase()\`) こと。 値の単語自体はそのまま入れます。
- 「キーが未登録なら空配列をセットしてから push する」 のが典型パターンです:
  - \`if (!map.has(key)) map.set(key, []);\`
  - \`map.get(key).push(word);\`
- 配列の **出現順** はそのまま保ってください (Map の挿入順は維持されます)。
`,
  starterCode: `function groupByFirstLetter(words) {
  // 先頭文字 (小文字化) をキーとして Map にグルーピングしてください
}
`,
  entryPoints: ["groupByFirstLetter"],
  demoCall: `console.log(groupByFirstLetter(["apple", "ant", "berry"]));`,
  tests: [
    {
      name: "戻り値は Map のインスタンス",
      code: `groupByFirstLetter([]) instanceof Map`,
    },
    {
      name: "空配列なら size は 0",
      code: `groupByFirstLetter([]).size === 0`,
    },
    {
      name: "先頭文字でグループ化される (a グループ)",
      code: `JSON.stringify(groupByFirstLetter(["apple", "Banana", "ant", "avocado", "berry"]).get("a")) === JSON.stringify(["apple", "ant", "avocado"])`,
    },
    {
      name: "先頭文字でグループ化される (b グループ、 大小文字混在)",
      code: `JSON.stringify(groupByFirstLetter(["apple", "Banana", "ant", "avocado", "berry"]).get("b")) === JSON.stringify(["Banana", "berry"])`,
    },
    {
      name: "size はキーの数と一致",
      code: `groupByFirstLetter(["apple", "Banana", "ant", "avocado", "berry"]).size === 2`,
    },
    {
      name: "1 件しかないグループも作られる",
      code: `JSON.stringify(groupByFirstLetter(["zoo"]).get("z")) === JSON.stringify(["zoo"])`,
    },
  ],
  hints: [
    "for ループで 1 件ずつ map に push する。 if (!map.has(key)) map.set(key, []); で初期化。",
    "解答例:\n```js\nfunction groupByFirstLetter(words) {\n  const groups = new Map();\n  for (const w of words) {\n    const key = w[0].toLowerCase();\n    if (!groups.has(key)) {\n      groups.set(key, []);\n    }\n    groups.get(key).push(w);\n  }\n  return groups;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で Map を返す" },
        { kind: "node", nodeType: "NewExpression", label: "new Map() を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function groupByFirstLetter(words) {
  const groups = new Map();
  for (const w of words) {
    const key = w[0].toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(w);
  }
  return groups;
}
`,
  badSolutions: [
    {
      code: `function groupByFirstLetter(words) {
  const groups = {};
  for (const w of words) {
    const key = w[0].toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(w);
  }
  return groups;
}
`,
      description: "Map ではなくオブジェクトで返している (instanceof Map で失敗)",
    },
    {
      code: `function groupByFirstLetter(words) {
  const groups = new Map();
  for (const w of words) {
    groups.set(w[0], [w]);
  }
  return groups;
}
`,
      description: "毎回上書きしていて配列に追加していない & 小文字化していない",
    },
  ],
  mdnSections: [
    {
      heading: "Map.prototype.set",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map/set",
      pageTitle: "Map.prototype.set",
    },
  ],
};
