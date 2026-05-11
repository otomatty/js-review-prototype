import type { Assignment } from "../../../types.js";

export const s4Ch11SumNestedCapstone: Assignment = {
  id: "S4-Ch11-07-sum-nested-capstone",
  stage: "S4",
  chapterId: "Ch11",
  sequence: 7,
  title: "[卒業課題] 再帰でネスト配列の合計を求める (簡単な DFS)",
  newConcept: "Array.isArray で分岐しつつ、 ネストした配列を再帰で潜って合計する — 木構造を辿る DFS の入口",
  estimatedMinutes: 40,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

任意の深さでネストした配列 \`arr\` を受け取り、 中に含まれる **すべての数値の合計** を返す関数 \`sumNested\` を **再帰** で実装してください。 配列の要素は **数値か、 さらに別の配列** のどちらかです (混在もあり)。

\`\`\`js
sumNested([1, 2, 3]);                 // → 6
sumNested([1, [2, [3, [4]]]]);        // → 10
sumNested([[1, 2], [3, 4], [5]]);     // → 15
sumNested([]);                        // → 0
sumNested([[], [[]], [[[]]]]);        // → 0  (空のネストばかり)
sumNested([10]);                      // → 10
sumNested([1, [2, 3], 4, [[5, 6]]]);  // → 21
\`\`\`

## ポイント

- これは **S4 卒業課題のひとつ**。 「データに 1 段の構造しかない」 という前提を捨てて、 **構造そのものを辿る** 練習です。 これは 「木 (tree) を **深さ優先探索 (DFS) する**」 ことの最も単純な形でもあります。
- 各要素について **\`Array.isArray(item)\` で分岐** します:
  - 配列なら → \`sumNested(item)\` を **再帰呼び出し** して合計を取る
  - そうでなければ (数値) → そのまま足し込む
- AST で **\`Array.isArray\` の利用と \`function\` 宣言** を必須にしています。 また、 抜け道として **\`.flat\` / \`.flatMap\` / \`.reduce\` / \`.map\` / \`.forEach\` / \`.filter\` を禁止** しています (\`reduce\` / \`map\` / \`forEach\` / \`filter\` は S4 では未導入かつ高階関数による回避を防ぐため)。
- 「平坦化してから合計」 ではなく、 **構造のまま潜る** 書き方を覚えることが目的です (本物の DFS では木が無限に深かったり、 平坦化前に枝の値で判断したいことが普通にあります)。

## 実装の骨組み

1. \`total = 0\` を用意
2. \`for (const item of arr)\` で各要素を見る
3. \`Array.isArray(item)\` なら \`total += sumNested(item)\`
4. そうでなければ \`total += item\`
5. ループを抜けたら \`return total\`

## ヒント

- ベースケースは 「\`arr\` が空配列 \`[]\` のとき」 で、 \`for\` ループが回らずに \`return 0\` になるので、 **自然と** 終了します。 明示的に \`if (arr.length === 0)\` と書く必要はありません。
- 再帰呼び出しの結果は **数値が返る** ので、 そのまま \`total\` に足せばよいです。
`,
  starterCode: `function sumNested(arr) {
  // for (const item of arr) { Array.isArray(item) なら sumNested(item) を足す }
}
`,
  entryPoints: ["sumNested"],
  demoCall: `console.log(sumNested([1, [2, [3, [4]]]]));`,
  tests: [
    {
      name: "ネストなし [1,2,3] は 6",
      code: `sumNested([1, 2, 3]) === 6`,
    },
    {
      name: "深いネスト [1,[2,[3,[4]]]] は 10",
      code: `sumNested([1, [2, [3, [4]]]]) === 10`,
    },
    {
      name: "横並びのネスト [[1,2],[3,4],[5]] は 15",
      code: `sumNested([[1, 2], [3, 4], [5]]) === 15`,
    },
    {
      name: "空配列は 0",
      code: `sumNested([]) === 0`,
    },
    {
      name: "空のネストばかりでも 0",
      code: `sumNested([[], [[]], [[[]]]]) === 0`,
    },
    {
      name: "数値と配列が混在 [1,[2,3],4,[[5,6]]] は 21",
      code: `sumNested([1, [2, 3], 4, [[5, 6]]]) === 21`,
    },
    {
      name: "負の数を含む [-1, [2, [-3]]] は -2",
      code: `sumNested([-1, [2, [-3]]]) === -2`,
    },
  ],
  hints: [
    "1) let total = 0; 2) for (const item of arr) で各要素を見る。 3) Array.isArray(item) なら total += sumNested(item)、 そうでなければ total += item。 4) return total。",
    "解答例:\n```js\nfunction sumNested(arr) {\n  let total = 0;\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      total += sumNested(item);\n    } else {\n      total += item;\n    }\n  }\n  return total;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で合計を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "function sumNested を宣言する" },
        { kind: "method", name: "isArray", label: "Array.isArray で配列かどうかを判定する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "flat", label: "Array.flat を使わない (平坦化ではなく再帰で書く)" },
        { kind: "method", name: "flatMap", label: "Array.flatMap を使わない (平坦化ではなく再帰で書く)" },
        { kind: "method", name: "reduce", label: "S4 では reduce を使わない (Ch09 で導入)" },
        { kind: "method", name: "map", label: "S4 では map を使わない (Ch09 で導入)" },
        { kind: "method", name: "forEach", label: "S4 では forEach を使わない (Ch09 で導入)" },
        { kind: "method", name: "filter", label: "S4 では filter を使わない (Ch09 で導入)" },
      ],
    },
  },
  solution: `function sumNested(arr) {
  let total = 0;
  for (const item of arr) {
    if (Array.isArray(item)) {
      total += sumNested(item);
    } else {
      total += item;
    }
  }
  return total;
}
`,
  badSolutions: [
    {
      code: `function sumNested(arr) {
  return arr.flat(Infinity).reduce((a, b) => a + b, 0);
}
`,
      description: "flat と reduce で平坦化しており、 再帰になっていない (AST forbidden 違反)",
    },
    {
      code: `function sumNested(arr) {
  let total = 0;
  for (const item of arr) {
    total += item;
  }
  return total;
}
`,
      description: "Array.isArray で分岐せず、 ネストを潜っていない (required 不足 + ネストありテスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Array.isArray",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray",
      pageTitle: "Array.isArray",
    },
    {
      heading: "function 宣言",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/function",
      pageTitle: "function 宣言",
    },
  ],
};
