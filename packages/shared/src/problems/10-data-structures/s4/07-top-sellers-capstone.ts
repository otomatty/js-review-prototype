import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch10TopSellersCapstone: Assignment = {
  id: "S4-Ch10-07-top-sellers-capstone",
  stage: "S4",
  chapterId: "Ch10",
  sequence: 7,
  title: "[卒業課題] 売上を Map で集計し上位 N 件を返す",
  newConcept: "Map で集計 → entries() を sort → slice、 と段階を踏むパイプライン",
  estimatedMinutes: 35,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

\`{ product: string, quantity: number }\` の売上配列 \`sales\` と **0 以上の整数** \`n\` を受け取り、 以下の手順で上位 \`n\` 件の \`[product, total]\` ペア配列を返す関数 \`topNSellers\` を実装してください (\`n\` は非負前提)。

1. **集計**: \`product\` ごとに \`quantity\` の合計を Map に貯める
2. **配列化**: \`[...map.entries()]\` で \`[key, total]\` のペア配列に変換
3. **ソート**: \`total\` の **降順** に並べ替える (\`sort\`)
4. **切り出し**: 先頭 \`n\` 件を \`slice(0, n)\` で取り出す

\`\`\`js
topNSellers([
  { product: "apple",  quantity: 3 },
  { product: "banana", quantity: 5 },
  { product: "apple",  quantity: 2 },
], 1);
// → [["apple", 5]]   (apple は合計 5、 banana は 5、 同点だが apple が先に登場したので先)

topNSellers([
  { product: "a", quantity: 1 },
  { product: "b", quantity: 10 },
  { product: "a", quantity: 1 },
  { product: "c", quantity: 3 },
], 2);
// → [["b", 10], ["c", 3]]

topNSellers([], 5);   // → []
topNSellers([{ product: "x", quantity: 1 }], 0);   // → []
\`\`\`

## ポイント

- **これは S4 卒業課題のひとつ**。 Map で集計 → 配列化 → ソート → 切り出し の **4 段パイプライン** を組み立てます。
- 同じ合計値の場合は **先に登場した product** を優先します。 Map の挿入順は最初に登場した順なので、 \`Array.sort\` の安定性 (ES2019+) によって自然にそうなります。
- AST で **Map の使用** と **\`sort\` メソッドの使用** を必須にしているので、 配列だけで処理する実装では通りません。
`,
  starterFiles: singleFile(`function topNSellers(sales, n) {
  // Map で集計 → entries() → sort で降順 → slice(0, n)
}
`),
  entryPoints: ["topNSellers"],
  demoCall: `console.log(topNSellers([{ product: "apple", quantity: 3 }, { product: "banana", quantity: 5 }, { product: "apple", quantity: 2 }], 2));`,
  tests: [
    {
      name: "同点は先に登場した product を優先",
      code: `JSON.stringify(topNSellers([
        { product: "apple",  quantity: 3 },
        { product: "banana", quantity: 5 },
        { product: "apple",  quantity: 2 },
      ], 1)) === JSON.stringify([["apple", 5]])`,
    },
    {
      name: "上位 2 件を降順で取り出す",
      code: `JSON.stringify(topNSellers([
        { product: "a", quantity: 1 },
        { product: "b", quantity: 10 },
        { product: "a", quantity: 1 },
        { product: "c", quantity: 3 },
      ], 2)) === JSON.stringify([["b", 10], ["c", 3]])`,
    },
    {
      name: "空配列は空",
      code: `JSON.stringify(topNSellers([], 5)) === JSON.stringify([])`,
    },
    {
      name: "n = 0 は空",
      code: `JSON.stringify(topNSellers([{ product: "x", quantity: 1 }], 0)) === JSON.stringify([])`,
    },
    {
      name: "n が要素数より大きいなら全件返る",
      code: `JSON.stringify(topNSellers([
        { product: "a", quantity: 5 },
        { product: "b", quantity: 3 },
      ], 10)) === JSON.stringify([["a", 5], ["b", 3]])`,
    },
    {
      name: "同じ product の quantity が正しく合計される",
      code: `topNSellers([
        { product: "x", quantity: 2 },
        { product: "x", quantity: 3 },
        { product: "x", quantity: 4 },
      ], 1)[0][1] === 9`,
    },
    {
      name: "戻り値の各要素は [product, total] のペア",
      code: `(() => {
        const r = topNSellers([{ product: "p", quantity: 7 }], 1);
        return Array.isArray(r) && Array.isArray(r[0]) && r[0][0] === "p" && r[0][1] === 7;
      })()`,
    },
  ],
  hints: [
    "1) for で Map に quantity を足し込む 2) [...totals.entries()].sort((a,b) => b[1] - a[1]).slice(0, n)",
    "解答例:\n```js\nfunction topNSellers(sales, n) {\n  const totals = new Map();\n  for (const s of sales) {\n    totals.set(s.product, (totals.get(s.product) ?? 0) + s.quantity);\n  }\n  return [...totals.entries()]\n    .sort((a, b) => b[1] - a[1])\n    .slice(0, n);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で配列を返す" },
        { kind: "node", nodeType: "NewExpression", label: "new Map() を使う" },
        { kind: "method", name: "set", label: "Map#set で集計する" },
        { kind: "method", name: "entries", label: "Map#entries で配列化する" },
        { kind: "method", name: "sort", label: "Array.sort で降順に並べる" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function topNSellers(sales, n) {
  const totals = new Map();
  for (const s of sales) {
    totals.set(s.product, (totals.get(s.product) ?? 0) + s.quantity);
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}
`,
  badSolutions: [
    {
      code: `function topNSellers(sales, n) {
  const arr = sales.map((s) => [s.product, s.quantity]);
  return arr.sort((a, b) => b[1] - a[1]).slice(0, n);
}
`,
      description: "Map で集計しておらず、 同じ product が複数行残る (AST + テスト失敗)",
    },
    {
      code: `function topNSellers(sales, n) {
  const totals = new Map();
  for (const s of sales) {
    totals.set(s.product, (totals.get(s.product) ?? 0) + s.quantity);
  }
  return [...totals.entries()].slice(0, n);
}
`,
      description: "sort をしておらず順序が保証されない (AST + 一部テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Map.prototype.entries",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map/entries",
      pageTitle: "Map.prototype.entries",
    },
    {
      heading: "Array.prototype.sort",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
      pageTitle: "Array.prototype.sort",
    },
  ],
};
