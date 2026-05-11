import type { Assignment } from "../../../types.js";

export const s4Ch11LinearSearch: Assignment = {
  id: "S4-Ch11-01-linear-search",
  stage: "S4",
  chapterId: "Ch11",
  sequence: 1,
  title: "線形探索で値の添字を返す",
  newConcept: "for ループで配列を先頭から走査し、 一致した添字を返す素朴な探索 (O(N))",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

配列 \`arr\` と探したい値 \`target\` を受け取り、 \`target\` が **最初に現れる添字** を返す関数 \`linearSearch\` を実装してください。 見つからなければ \`-1\` を返します。

\`\`\`js
linearSearch([10, 20, 30], 20);     // → 1
linearSearch([1, 2, 3], 99);        // → -1
linearSearch(["a", "b", "c"], "a"); // → 0
linearSearch([5, 3, 5, 7], 5);      // → 0  (重複時は最初の位置)
linearSearch([], 5);                // → -1
\`\`\`

## ポイント

- これは **線形探索 (linear search)** と呼ばれる最も基本的な探索アルゴリズムです。 添字 \`0\` から順に \`arr[i] === target\` を確かめていきます。
- 計算量は **O(N)** (要素数に比例)。 N が小さければ十分速く、 ソートも不要なので使い回しが効きます。
- AST で **\`Array.prototype.indexOf\` / \`findIndex\` / \`includes\`** を禁止しているので、 「組込みメソッド一発」 では通りません。 \`for\` ループで添字 \`i\` を回し、 自分で一致判定する練習です。

## ヒント

- 等値判定は **\`===\`** を使ってください (\`==\` ではない)。
- 一致したら **その場で \`return i\`** すれば、 残りはスキャンしません (早期 return)。
- ループを最後まで抜けたら 「見つからなかった」 ので \`-1\` を返します。
`,
  starterCode: `function linearSearch(arr, target) {
  // for (let i = 0; i < arr.length; i++) で 1 つずつ確かめる
}
`,
  entryPoints: ["linearSearch"],
  demoCall: `console.log(linearSearch([10, 20, 30], 20));`,
  tests: [
    {
      name: "真ん中の要素を見つける",
      code: `linearSearch([10, 20, 30], 20) === 1`,
    },
    {
      name: "見つからなければ -1",
      code: `linearSearch([1, 2, 3], 99) === -1`,
    },
    {
      name: "先頭の要素 (添字 0)",
      code: `linearSearch(["a", "b", "c"], "a") === 0`,
    },
    {
      name: "末尾の要素",
      code: `linearSearch([1, 2, 3], 3) === 2`,
    },
    {
      name: "重複時は最初の位置を返す",
      code: `linearSearch([5, 3, 5, 7], 5) === 0`,
    },
    {
      name: "空配列は -1",
      code: `linearSearch([], 5) === -1`,
    },
    {
      name: "文字列でも動く",
      code: `linearSearch(["apple", "banana", "cherry"], "cherry") === 2`,
    },
  ],
  hints: [
    "for (let i = 0; i < arr.length; i++) で添字を回し、 arr[i] === target なら return i する。 ループを抜けたら return -1。",
    "解答例:\n```js\nfunction linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) {\n      return i;\n    }\n  }\n  return -1;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で添字または -1 を返す" },
        { kind: "node", nodeType: "ForStatement", label: "for (let i = 0; ...) で添字を回す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "indexOf", label: "Array.indexOf を使わない (自分で実装する)" },
        { kind: "method", name: "findIndex", label: "Array.findIndex を使わない (自分で実装する)" },
        { kind: "method", name: "includes", label: "Array.includes を使わない (自分で実装する)" },
        { kind: "method", name: "find", label: "Array.find を使わない (自分で実装する)" },
        { kind: "method", name: "forEach", label: "S4 では forEach を使わない (Ch09 で導入)" },
      ],
    },
  },
  solution: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}
`,
  badSolutions: [
    {
      code: `function linearSearch(arr, target) {
  return arr.indexOf(target);
}
`,
      description: "Array.indexOf を使っている (AST forbidden 違反)",
    },
    {
      code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return 0;
}
`,
      description: "見つからない場合に -1 ではなく 0 を返している (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Array.prototype.indexOf",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf",
      pageTitle: "Array.prototype.indexOf",
    },
  ],
};
