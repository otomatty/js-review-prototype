import type { Assignment } from "../../../types.js";

export const s4Ch11BubbleSort: Assignment = {
  id: "S4-Ch11-04-bubble-sort",
  stage: "S4",
  chapterId: "Ch11",
  sequence: 4,
  title: "バブルソートを自分で実装する",
  newConcept: "二重 for ループで隣り合う要素を交換して並べ替える基本ソート (O(N^2))",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

数値配列 \`arr\` を受け取り、 **昇順に並べた新しい配列** を返す関数 \`bubbleSort\` を実装してください。 組込みの \`.sort\` を使わず、 **バブルソート** を自分で書きます。 入力配列は破壊しないでください。

\`\`\`js
bubbleSort([3, 1, 2]);        // → [1, 2, 3]
bubbleSort([5, 4, 3, 2, 1]);  // → [1, 2, 3, 4, 5]
bubbleSort([3, 1, 3, 2]);     // → [1, 2, 3, 3]
bubbleSort([1, 2, 3]);        // → [1, 2, 3]  (既にソート済み)
bubbleSort([]);               // → []
\`\`\`

## ポイント

- **バブルソート (bubble sort)** は隣り合う要素を比較して、 順序が逆なら交換 (swap) する。 これを繰り返すと、 1 周ごとに最大値が末尾に 「浮かび上がる」 のでこの名前。
- 計算量は **O(N^2)** (要素数の 2 乗)。 100 要素なら 1 万回程度、 1000 要素なら 100 万回程度。 大きな配列では遅くなる前提のアルゴリズムです (組込み \`sort\` は通常 O(N log N))。
- 学ぶ目的: 「ソートはブラックボックスではない」 ことを体感し、 二重ループでの **添字計算** の練習をする。

## 実装の骨組み

1. \`out = [...arr]\` で **コピー** を作る (入力は破壊しない)
2. 外側のループ \`i = 0 ... out.length - 1\` で 「何周目か」 を回す
3. 内側のループ \`j = 0 ... out.length - 1 - i\` で隣の要素と比較
4. \`out[j] > out[j + 1]\` なら **swap** (\`const tmp = ...\` で値を退避)
5. 全周終わったら \`out\` を返す

## ヒント

- AST で **\`.sort\` を禁止** しています。 自分でループと swap を書いてください。
- swap は 3 つの代入で書けます: \`const tmp = a[j]; a[j] = a[j+1]; a[j+1] = tmp;\`
- 内側ループの上限を \`length - 1 - i\` にすると、 既に確定した末尾を再走査せずに済んで少し速くなります。
`,
  starterCode: `function bubbleSort(arr) {
  // 入力配列を破壊しないようにコピーした配列を作る


  // 二重 for ループで隣同士を比較し、 左 > 右 なら swap する


  // 並べ替え終わった配列を return する
}
`,
  entryPoints: ["bubbleSort"],
  demoCall: `console.log(bubbleSort([3, 1, 2]));`,
  tests: [
    {
      name: "[3, 1, 2] → [1, 2, 3]",
      code: `JSON.stringify(bubbleSort([3, 1, 2])) === JSON.stringify([1, 2, 3])`,
    },
    {
      name: "逆順 [5,4,3,2,1] → [1,2,3,4,5]",
      code: `JSON.stringify(bubbleSort([5, 4, 3, 2, 1])) === JSON.stringify([1, 2, 3, 4, 5])`,
    },
    {
      name: "重複を含む [3,1,3,2] → [1,2,3,3]",
      code: `JSON.stringify(bubbleSort([3, 1, 3, 2])) === JSON.stringify([1, 2, 3, 3])`,
    },
    {
      name: "既にソート済みでもそのまま",
      code: `JSON.stringify(bubbleSort([1, 2, 3])) === JSON.stringify([1, 2, 3])`,
    },
    {
      name: "空配列は空配列",
      code: `JSON.stringify(bubbleSort([])) === JSON.stringify([])`,
    },
    {
      name: "1 要素ならそのまま",
      code: `JSON.stringify(bubbleSort([42])) === JSON.stringify([42])`,
    },
    {
      name: "入力配列を破壊しない",
      code: `(() => {
        const input = [3, 1, 2];
        bubbleSort(input);
        return JSON.stringify(input) === JSON.stringify([3, 1, 2]);
      })()`,
    },
  ],
  hints: [
    "1) const out = [...arr] でコピー。 2) for (let i = 0; i < out.length; i++) の中で for (let j = 0; j < out.length - 1 - i; j++) を回す。 3) out[j] > out[j+1] なら swap。",
    "解答例:\n```js\nfunction bubbleSort(arr) {\n  const out = [...arr];\n  for (let i = 0; i < out.length; i++) {\n    for (let j = 0; j < out.length - 1 - i; j++) {\n      if (out[j] > out[j + 1]) {\n        const tmp = out[j];\n        out[j] = out[j + 1];\n        out[j + 1] = tmp;\n      }\n    }\n  }\n  return out;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return でソート済み配列を返す" },
        { kind: "node", nodeType: "ForStatement", label: "for (let i = 0; ...) でループを回す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "sort", label: "組込みの .sort を使わない (自分で実装する)" },
        { kind: "method", name: "reduce", label: "S4 では reduce を使わない (Ch09 で導入)" },
        { kind: "method", name: "map", label: "S4 では map を使わない (Ch09 で導入)" },
        { kind: "method", name: "filter", label: "S4 では filter を使わない (Ch09 で導入)" },
        { kind: "method", name: "forEach", label: "S4 では forEach を使わない (Ch09 で導入)" },
      ],
    },
  },
  solution: `function bubbleSort(arr) {
  const out = [...arr];
  for (let i = 0; i < out.length; i++) {
    for (let j = 0; j < out.length - 1 - i; j++) {
      if (out[j] > out[j + 1]) {
        const tmp = out[j];
        out[j] = out[j + 1];
        out[j + 1] = tmp;
      }
    }
  }
  return out;
}
`,
  badSolutions: [
    {
      code: `function bubbleSort(arr) {
  return [...arr].sort((a, b) => a - b);
}
`,
      description: "組込みの .sort を使っている (AST forbidden 違反)",
    },
    {
      code: `function bubbleSort(arr) {
  return arr;
}
`,
      description: "そのまま返している (ForStatement 不足 + テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "for",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for",
      pageTitle: "for",
    },
    {
      heading: "スプレッド構文",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
      pageTitle: "スプレッド構文",
    },
  ],
};
