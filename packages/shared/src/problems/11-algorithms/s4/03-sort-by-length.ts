import type { Assignment } from "../../../types.js";

export const s4Ch11SortByLength: Assignment = {
  id: "S4-Ch11-03-sort-by-length",
  stage: "S4",
  chapterId: "Ch11",
  sequence: 3,
  title: "Array.sort の比較関数で文字列を長さ順に並べる",
  newConcept: "`Array.prototype.sort` に比較関数 `(a, b) => a.length - b.length` を渡して並べ替える",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

文字列の配列 \`words\` を受け取り、 **長さの昇順に並べた新しい配列** を返す関数 \`sortByLength\` を実装してください。 同じ長さの単語は **元の登場順** を保ちます (安定ソート)。 **入力配列を破壊してはいけません**。

\`\`\`js
sortByLength(["ccc", "a", "bb"]);          // → ["a", "bb", "ccc"]
sortByLength(["ab", "cd", "ef"]);          // → ["ab", "cd", "ef"]  (同じ長さは元の順)
sortByLength(["apple", "kiwi", "banana"]); // → ["kiwi", "apple", "banana"]
sortByLength([]);                          // → []
\`\`\`

## ポイント

- \`Array.prototype.sort\` には **比較関数** \`(a, b) => ...\` を渡せます。 返り値が
  - **負** なら \`a\` を前に
  - **正** なら \`b\` を前に
  - \`0\` なら順序を変えない (安定ソート、 ES2019+)
  というルールです。
- 長さで並べたいなら \`(a, b) => a.length - b.length\` (引き算で正負が決まる)。
- **\`.sort\` は配列を破壊** します。 入力を守りたいときは \`[...words].sort(...)\` や \`words.slice().sort(...)\` のように **コピーしてから** ソートしてください。

## ヒント

- 文字列の比較関数の戻り値は 「\`a\` が前なら負、 \`b\` が前なら正」 と覚えると間違えにくいです。
- 計算量はおおむね \`O(N log N)\` (組込み \`sort\` の典型値)。
`,
  starterCode: `function sortByLength(words) {
  // [...words].sort((a, b) => a.length - b.length) で並べ替える
}
`,
  entryPoints: ["sortByLength"],
  demoCall: `console.log(sortByLength(["ccc", "a", "bb"]));`,
  tests: [
    {
      name: "長さの昇順で並ぶ",
      code: `JSON.stringify(sortByLength(["ccc", "a", "bb"])) === JSON.stringify(["a", "bb", "ccc"])`,
    },
    {
      name: "同じ長さは元の順序を保つ (安定)",
      code: `JSON.stringify(sortByLength(["ab", "cd", "ef"])) === JSON.stringify(["ab", "cd", "ef"])`,
    },
    {
      name: "実例: kiwi / apple / banana",
      code: `JSON.stringify(sortByLength(["apple", "kiwi", "banana"])) === JSON.stringify(["kiwi", "apple", "banana"])`,
    },
    {
      name: "空配列は空配列",
      code: `JSON.stringify(sortByLength([])) === JSON.stringify([])`,
    },
    {
      name: "1 要素ならそのまま",
      code: `JSON.stringify(sortByLength(["hello"])) === JSON.stringify(["hello"])`,
    },
    {
      name: "入力配列を破壊しない",
      code: `(() => {
        const input = ["cc", "a", "bbb"];
        sortByLength(input);
        return JSON.stringify(input) === JSON.stringify(["cc", "a", "bbb"]);
      })()`,
    },
  ],
  hints: [
    "[...words].sort((a, b) => a.length - b.length) で、 コピーしてから比較関数つき sort を呼ぶ。",
    "解答例:\n```js\nfunction sortByLength(words) {\n  return [...words].sort((a, b) => a.length - b.length);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で並べ替えた配列を返す" },
        { kind: "method", name: "sort", label: "Array.prototype.sort に比較関数を渡す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function sortByLength(words) {
  return [...words].sort((a, b) => a.length - b.length);
}
`,
  badSolutions: [
    {
      code: `function sortByLength(words) {
  words.sort((a, b) => a.length - b.length);
  return words;
}
`,
      description: "コピーせず入力配列を破壊している (入力を破壊しないテストに失敗)",
    },
    {
      code: `function sortByLength(words) {
  return [...words].sort();
}
`,
      description: "比較関数を渡しておらず辞書順で並んでしまう (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Array.prototype.sort",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
      pageTitle: "Array.prototype.sort",
    },
    {
      heading: "スプレッド構文",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
      pageTitle: "スプレッド構文",
    },
  ],
};
