import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s5Ch10CategoryTreeAggregate: Assignment = {
  id: "S5-Ch10-02-category-tree-aggregate",
  stage: "S5",
  chapterId: "Ch10",
  sequence: 2,
  title: "再帰でカテゴリツリーの商品数を Map に集計する",
  newConcept:
    "ツリー状のデータを 再帰関数 で DFS 走査し、 各ノードの 「自分 + 子孫」 の累計を Map<string, number> に集約する",
  estimatedMinutes: 55,
  difficulty: 2,
  testKind: "function",
  description: `## やること

カテゴリツリーの根ノード \`rootCategory\` を受け取り、 各カテゴリ名 → **そのカテゴリの直下 + 全ての子孫の products を合計した件数** を持つ \`Map<string, number>\` を返す関数 \`aggregateProductsByCategory\` を実装してください。

ノードの形:

\`\`\`ts
type Category = {
  name: string;        // カテゴリ名 (ツリー内でユニークと仮定)
  products: string[];  // このカテゴリ「直下」 の商品名
  children: Category[]; // 子カテゴリ (再帰)
};
\`\`\`

例:

\`\`\`js
const root = {
  name: "All",
  products: [],
  children: [
    {
      name: "Books",
      products: ["b1", "b2"],
      children: [
        { name: "Fiction",    products: ["f1"], children: [] },
        { name: "NonFiction", products: [],     children: [
          { name: "Science",  products: ["s1", "s2"], children: [] },
        ] },
      ],
    },
    {
      name: "Electronics",
      products: ["e1"],
      children: [],
    },
  ],
};

const totals = aggregateProductsByCategory(root);

totals.get("Science")     // → 2
totals.get("NonFiction")  // → 2  (自身は 0、 Science の 2 を含める)
totals.get("Fiction")     // → 1
totals.get("Books")       // → 5  (b1, b2 + Fiction 1 + NonFiction 2)
totals.get("Electronics") // → 1
totals.get("All")         // → 6
totals.size               // → 6
\`\`\`

## ポイント

- **再帰でツリーを DFS 走査** する書き方を身に付けるのが S5 の中心テーマです。 「自分の \`products.length\` + 子供たちの再帰呼び出し結果の合計」 という形が定型。
- 戻り値の型として **Map を選びます**。 動的に増える文字列キーの集合を扱うときに \`new Map()\` + \`map.set(name, count)\` で組み立てるのが Map の最も基本的な使い方です。 (Object でも動きますが、 Map で 「キー追加 = set」 という API を体で覚えるのが目的)
- 推奨フロー:
  1. \`const totals = new Map()\` を 1 つだけ用意する
  2. 内側に再帰用ヘルパー \`function visit(node)\` を定義する
  3. \`visit(node)\` の中で:
     - \`let count = node.products.length\` から始める
     - \`for (const child of node.children)\` で各子について \`count += visit(child)\` する
     - \`totals.set(node.name, count)\` で記録する
     - \`return count\` する
  4. 最後に \`visit(rootCategory)\` を呼び、 \`return totals\`
- AST で **\`new Map()\` / \`Map#set\` / \`for...of\` / \`return\` の使用** を必須にしています。 配列だけで書くアプローチや、 再帰せずに 1 階層だけ数える実装は通りません。
`,
  starterFiles: singleFile(`function aggregateProductsByCategory(rootCategory) {
  // 集計用に new Map() を用意する


  // 内側に function visit(node) を定義し、 自分の products + 各子の visit 結果を合計する


  // 子は for...of で children を走査して再帰的に visit を呼ぶ


  // 各 node について totals.set(node.name, count) してから return count する


  // ルートに対して visit を呼んだら、 totals を return する
}
`),
  entryPoints: ["aggregateProductsByCategory"],
  demoCall: `(() => {
  const root = { name: "All", products: [], children: [
    { name: "Books", products: ["b1", "b2"], children: [
      { name: "Fiction", products: ["f1"], children: [] },
    ] },
    { name: "Electronics", products: ["e1"], children: [] },
  ] };
  const totals = aggregateProductsByCategory(root);
  console.log([...totals.entries()]);
})()`,
  tests: [
    {
      name: "戻り値は Map のインスタンス",
      code: `aggregateProductsByCategory({ name: "x", products: [], children: [] }) instanceof Map`,
    },
    {
      name: "葉ノード単体 (products 3 件) は count 3、 size 1",
      code: `(() => {
        const r = aggregateProductsByCategory({ name: "leaf", products: ["a", "b", "c"], children: [] });
        return r.get("leaf") === 3 && r.size === 1;
      })()`,
    },
    {
      name: "products が空の単一ノードは count 0",
      code: `aggregateProductsByCategory({ name: "empty", products: [], children: [] }).get("empty") === 0`,
    },
    {
      name: "深さ 2 の親は 自分 + 子の products を合計",
      code: `(() => {
        const r = aggregateProductsByCategory({
          name: "root",
          products: ["r1", "r2"],
          children: [{ name: "child", products: ["c1", "c2", "c3"], children: [] }],
        });
        return r.get("root") === 5 && r.get("child") === 3;
      })()`,
    },
    {
      name: "深さ 3 の孫の数も親まで伝播する",
      code: `(() => {
        const r = aggregateProductsByCategory({
          name: "root",
          products: [],
          children: [{
            name: "mid",
            products: [],
            children: [{ name: "leaf", products: ["x", "y"], children: [] }],
          }],
        });
        return r.get("root") === 2 && r.get("mid") === 2 && r.get("leaf") === 2;
      })()`,
    },
    {
      name: "親が複数の子をまたいで合計する",
      code: `(() => {
        const r = aggregateProductsByCategory({
          name: "root",
          products: [],
          children: [
            { name: "a", products: ["a1"], children: [] },
            { name: "b", products: ["b1", "b2"], children: [] },
            { name: "c", products: [], children: [{ name: "c1", products: ["x", "y", "z"], children: [] }] },
          ],
        });
        return r.get("a") === 1 && r.get("b") === 2 && r.get("c1") === 3 && r.get("c") === 3 && r.get("root") === 6;
      })()`,
    },
    {
      name: "ツリー内の全カテゴリが Map に登場する (size がノード数と一致)",
      code: `(() => {
        const r = aggregateProductsByCategory({
          name: "root",
          products: [],
          children: [
            { name: "a", products: [], children: [
              { name: "aa", products: [], children: [] },
              { name: "ab", products: [], children: [] },
            ] },
            { name: "b", products: [], children: [] },
          ],
        });
        return r.size === 5;
      })()`,
    },
    {
      name: "問題文の例 (Books / Fiction / NonFiction / Science / Electronics / All) を正しく集計",
      code: `(() => {
        const r = aggregateProductsByCategory({
          name: "All",
          products: [],
          children: [
            { name: "Books", products: ["b1", "b2"], children: [
              { name: "Fiction", products: ["f1"], children: [] },
              { name: "NonFiction", products: [], children: [
                { name: "Science", products: ["s1", "s2"], children: [] },
              ] },
            ] },
            { name: "Electronics", products: ["e1"], children: [] },
          ],
        });
        return r.get("Science") === 2
          && r.get("NonFiction") === 2
          && r.get("Fiction") === 1
          && r.get("Books") === 5
          && r.get("Electronics") === 1
          && r.get("All") === 6
          && r.size === 6;
      })()`,
    },
    {
      name: "深さ 5 のチェーンでも一番上まで合計が伝わる",
      code: `(() => {
        const root = { name: "n1", products: ["p1"], children: [
          { name: "n2", products: ["p2"], children: [
            { name: "n3", products: ["p3"], children: [
              { name: "n4", products: ["p4"], children: [
                { name: "n5", products: ["p5"], children: [] },
              ] },
            ] },
          ] },
        ] };
        const r = aggregateProductsByCategory(root);
        return r.get("n1") === 5 && r.get("n2") === 4 && r.get("n3") === 3 && r.get("n4") === 2 && r.get("n5") === 1;
      })()`,
    },
    {
      name: "兄弟ノードどうしの数は混ざらない (左の枝が右に漏れない)",
      code: `(() => {
        const r = aggregateProductsByCategory({
          name: "root",
          products: [],
          children: [
            { name: "left",  products: ["L1", "L2", "L3"], children: [] },
            { name: "right", products: ["R1"], children: [] },
          ],
        });
        return r.get("left") === 3 && r.get("right") === 1 && r.get("root") === 4;
      })()`,
    },
    {
      name: "完全に空のツリー (root だけ + products も子もなし) は size 1, count 0",
      code: `(() => {
        const r = aggregateProductsByCategory({ name: "only", products: [], children: [] });
        return r.size === 1 && r.get("only") === 0;
      })()`,
    },
  ],
  hints: [
    "外側の関数の中に 再帰用のヘルパー function visit(node) を定義します。 ヘルパーは 「このノードの累計件数」 を return することで、 親側で合計に組み入れられるようにします。",
    "ヘルパーの中身: let count = node.products.length; → for (const child of node.children) { count += visit(child); } → totals.set(node.name, count); → return count; という 4 段の流れです。 totals は外側で 1 つだけ作っておきます。",
    "解答例:\n```js\nfunction aggregateProductsByCategory(rootCategory) {\n  const totals = new Map();\n  function visit(node) {\n    let count = node.products.length;\n    for (const child of node.children) {\n      count += visit(child);\n    }\n    totals.set(node.name, count);\n    return count;\n  }\n  visit(rootCategory);\n  return totals;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "NewExpression", label: "new Map() を使う" },
        { kind: "method", name: "set", label: "Map#set でカテゴリ名と累計を登録する" },
        { kind: "node", nodeType: "ForOfStatement", label: "for...of で children を走査する" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で集計結果を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function aggregateProductsByCategory(rootCategory) {
  const totals = new Map();
  function visit(node) {
    let count = node.products.length;
    for (const child of node.children) {
      count += visit(child);
    }
    totals.set(node.name, count);
    return count;
  }
  visit(rootCategory);
  return totals;
}
`,
  badSolutions: [
    {
      code: `function aggregateProductsByCategory(rootCategory) {
  const totals = new Map();
  function visit(node) {
    totals.set(node.name, node.products.length);
    for (const child of node.children) {
      visit(child);
    }
  }
  visit(rootCategory);
  return totals;
}
`,
      description: "各ノードに 「直下の products 件数だけ」 を入れており、 子孫の合計が親に伝播していない (深さ 2 以上のテスト失敗)",
    },
    {
      code: `function aggregateProductsByCategory(rootCategory) {
  const totals = {};
  function visit(node) {
    let count = node.products.length;
    for (const child of node.children) {
      count += visit(child);
    }
    totals[node.name] = count;
    return count;
  }
  visit(rootCategory);
  return totals;
}
`,
      description: "Map ではなく Object を返している (AST required 違反 + Map インスタンスのテスト失敗)",
    },
    {
      code: `function aggregateProductsByCategory(rootCategory) {
  const totals = new Map();
  let count = rootCategory.products.length;
  for (const child of rootCategory.children) {
    count += child.products.length;
  }
  totals.set(rootCategory.name, count);
  return totals;
}
`,
      description: "再帰せず 1 階層しか降りていないため、 孫以下の products が数えられず Map に登場もしない (深いツリーのテスト失敗)",
    },
    {
      code: `function aggregateProductsByCategory(rootCategory) {
  const totals = new Map();
  function visit(node) {
    let count = node.products.length;
    for (const child of node.children) {
      visit(child);
    }
    totals.set(node.name, count);
    return count;
  }
  visit(rootCategory);
  return totals;
}
`,
      description: "子の visit 結果を count に足し込んでおらず、 親には 「自分の直下 products 件数」 しか入らない (深さ 2 以上のテスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Map",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map",
      pageTitle: "Map",
    },
    {
      heading: "Map.prototype.set()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map/set",
      pageTitle: "Map.prototype.set()",
    },
    {
      heading: "for...of",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...of",
      pageTitle: "for...of",
    },
    {
      heading: "再帰 (Glossary)",
      pageUrl: "https://developer.mozilla.org/ja/docs/Glossary/Recursion",
      pageTitle: "再帰",
    },
  ],
};
