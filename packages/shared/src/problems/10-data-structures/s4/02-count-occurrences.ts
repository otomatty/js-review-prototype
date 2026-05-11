import type { Assignment } from "../../../types.js";

export const s4Ch10CountOccurrences: Assignment = {
  id: "S4-Ch10-02-count-occurrences",
  stage: "S4",
  chapterId: "Ch10",
  sequence: 2,
  title: "Map で各要素の出現回数を数える",
  newConcept: "Map をカウンタとして使う (key → count パターン)",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

数値や文字列の配列 \`arr\` を受け取り、 **要素 → 出現回数** の対応を持つ \`Map\` を返す関数 \`countOccurrences\` を実装してください。

\`\`\`js
const m = countOccurrences(["a", "b", "a", "c", "a"]);
m.get("a");   // → 3
m.get("b");   // → 1
m.get("c");   // → 1
m.size;       // → 3
\`\`\`

## ポイント

- 戻り値は **\`Map\` のインスタンス** にしてください。 オブジェクトリテラルでは tests に通りません。
- カウンタの初期値は \`map.get(key) ?? 0\` で書くと簡潔です。
- Map は **任意の値 (数値・オブジェクトなど) を key にできる** ため、 オブジェクトリテラルより汎用的です。
`,
  starterCode: `function countOccurrences(arr) {
  // Map を作って、 各要素の出現回数を数えてください
}
`,
  entryPoints: ["countOccurrences"],
  demoCall: `console.log(countOccurrences(["a", "b", "a"]));`,
  tests: [
    {
      name: "戻り値は Map のインスタンス",
      code: `countOccurrences([]) instanceof Map`,
    },
    {
      name: "空配列なら size は 0",
      code: `countOccurrences([]).size === 0`,
    },
    {
      name: "['a','b','a','c','a'] で a は 3 回",
      code: `countOccurrences(["a", "b", "a", "c", "a"]).get("a") === 3`,
    },
    {
      name: "['a','b','a','c','a'] で b は 1 回",
      code: `countOccurrences(["a", "b", "a", "c", "a"]).get("b") === 1`,
    },
    {
      name: "['a','b','a','c','a'] の size は 3",
      code: `countOccurrences(["a", "b", "a", "c", "a"]).size === 3`,
    },
    {
      name: "数値もキーとして扱える",
      code: `countOccurrences([1, 1, 2, 1, 2]).get(1) === 3 && countOccurrences([1, 1, 2, 1, 2]).get(2) === 2`,
    },
    {
      name: "存在しないキーは undefined",
      code: `countOccurrences(["a"]).get("z") === undefined`,
    },
  ],
  hints: [
    "for (const x of arr) { counts.set(x, (counts.get(x) ?? 0) + 1); }",
    "解答例:\n```js\nfunction countOccurrences(arr) {\n  const counts = new Map();\n  for (const item of arr) {\n    counts.set(item, (counts.get(item) ?? 0) + 1);\n  }\n  return counts;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で Map を返す" },
        { kind: "node", nodeType: "NewExpression", label: "new Map() を使う" },
        { kind: "method", name: "set", label: "Map#set で出現回数を更新する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function countOccurrences(arr) {
  const counts = new Map();
  for (const item of arr) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return counts;
}
`,
  badSolutions: [
    {
      code: `function countOccurrences(arr) {
  const counts = {};
  for (const item of arr) {
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}
`,
      description: "Map ではなくオブジェクトリテラルで返している (instanceof Map で失敗)",
    },
    {
      code: `function countOccurrences(arr) {
  const counts = new Map();
  for (const item of arr) {
    counts.set(item, 1);
  }
  return counts;
}
`,
      description: "常に 1 を代入していて、 出現回数を加算していない",
    },
  ],
  mdnSections: [
    {
      heading: "Map",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map",
      pageTitle: "Map",
    },
  ],
};
