import type { Assignment } from "../../../types.js";

export const s4Ch11BinarySearch: Assignment = {
  id: "S4-Ch11-02-binary-search",
  stage: "S4",
  chapterId: "Ch11",
  sequence: 2,
  title: "二分探索でソート済み配列を探す",
  newConcept: "ソート済みの前提を使って探索範囲を半分ずつ狭める二分探索 (O(log N))",
  estimatedMinutes: 35,
  difficulty: 2,
  testKind: "function",
  description: `## やること

**昇順にソート済みの数値配列** \`sortedArr\` と探したい値 \`target\` を受け取り、 \`target\` の添字を返す関数 \`binarySearch\` を実装してください。 見つからなければ \`-1\` を返します。

\`\`\`js
binarySearch([1, 3, 5, 7, 9], 5);   // → 2
binarySearch([1, 3, 5, 7, 9], 1);   // → 0
binarySearch([1, 3, 5, 7, 9], 9);   // → 4
binarySearch([1, 3, 5, 7, 9], 4);   // → -1  (存在しない)
binarySearch([], 5);                // → -1
\`\`\`

## ポイント

- **二分探索 (binary search)** は配列がソート済みであることを前提に、 探索範囲を **毎回半分にする** アルゴリズムです。 計算量は **O(log N)**。
- 要素数が 100 万でも 20 回程度の比較で済むので、 線形探索 (O(N)) より圧倒的に速くなります。
- 手順:
  1. \`left = 0\`、 \`right = sortedArr.length - 1\` で探索範囲を初期化
  2. \`while (left <= right)\` の中で、 真ん中の添字 \`mid = Math.floor((left + right) / 2)\` を取る
  3. \`sortedArr[mid] === target\` なら \`return mid\`
  4. \`sortedArr[mid] < target\` なら 「右半分にある」 → \`left = mid + 1\`
  5. それ以外 (\`> target\`) なら 「左半分にある」 → \`right = mid - 1\`
  6. ループを抜けたら見つからなかったので \`-1\`
- AST で **\`while\` を必須**、 **\`indexOf\` / \`includes\` / \`find\` / \`findIndex\`** を禁止しています。 「組込み一発」 を避けて、 自分で範囲を縮めるロジックを書く練習です。

## ヒント

- 真ん中を整数にするために **\`Math.floor((left + right) / 2)\`** を使ってください。
- 範囲が反転 (\`left > right\`) したらループは終わります。 そのときは見つからなかったということ。
`,
  starterCode: `function binarySearch(sortedArr, target) {
  // left / right を動かして探索範囲を半分にしていく
}
`,
  entryPoints: ["binarySearch"],
  demoCall: `console.log(binarySearch([1, 3, 5, 7, 9], 5));`,
  tests: [
    {
      name: "真ん中の値を見つける",
      code: `binarySearch([1, 3, 5, 7, 9], 5) === 2`,
    },
    {
      name: "先頭の値を見つける",
      code: `binarySearch([1, 3, 5, 7, 9], 1) === 0`,
    },
    {
      name: "末尾の値を見つける",
      code: `binarySearch([1, 3, 5, 7, 9], 9) === 4`,
    },
    {
      name: "存在しない値は -1",
      code: `binarySearch([1, 3, 5, 7, 9], 4) === -1`,
    },
    {
      name: "空配列は -1",
      code: `binarySearch([], 5) === -1`,
    },
    {
      name: "要素 1 個で一致",
      code: `binarySearch([42], 42) === 0`,
    },
    {
      name: "要素 1 個で不一致",
      code: `binarySearch([42], 7) === -1`,
    },
    {
      name: "大きな配列でも O(log N) で見つかる",
      code: `(() => {
        const arr = Array.from({ length: 100 }, (_, i) => i * 2);
        return binarySearch(arr, 50) === 25 && binarySearch(arr, 51) === -1;
      })()`,
    },
  ],
  hints: [
    "1) left=0, right=arr.length-1 で初期化。 2) while (left <= right) { mid=Math.floor((left+right)/2); ... }。 3) 一致なら return mid、 小さければ left=mid+1、 大きければ right=mid-1。",
    "解答例:\n```js\nfunction binarySearch(sortedArr, target) {\n  let left = 0;\n  let right = sortedArr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (sortedArr[mid] === target) {\n      return mid;\n    }\n    if (sortedArr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return -1;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で添字または -1 を返す" },
        { kind: "node", nodeType: "WhileStatement", label: "while (left <= right) で探索範囲を狭める" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "indexOf", label: "Array.indexOf を使わない (二分探索を自分で書く)" },
        { kind: "method", name: "includes", label: "Array.includes を使わない (二分探索を自分で書く)" },
        { kind: "method", name: "find", label: "Array.find を使わない (二分探索を自分で書く)" },
        { kind: "method", name: "findIndex", label: "Array.findIndex を使わない (二分探索を自分で書く)" },
      ],
    },
  },
  solution: `function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] === target) {
      return mid;
    }
    if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
`,
  badSolutions: [
    {
      code: `function binarySearch(sortedArr, target) {
  return sortedArr.indexOf(target);
}
`,
      description: "Array.indexOf を使い、 while も書いていない (AST forbidden + required 不足)",
    },
    {
      code: `function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] === target) {
      return mid;
    }
    if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
`,
      description: "条件が left < right になっており、 末尾要素のケースを取りこぼす (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Math.floor",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/floor",
      pageTitle: "Math.floor",
    },
    {
      heading: "while",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/while",
      pageTitle: "while",
    },
  ],
};
