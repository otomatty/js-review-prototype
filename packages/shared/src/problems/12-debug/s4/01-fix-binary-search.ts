import type { Assignment } from "../../../types.js";

export const s4Ch12FixBinarySearch: Assignment = {
  id: "S4-Ch12-01-fix-binary-search",
  stage: "S4",
  chapterId: "Ch12",
  sequence: 1,
  title: "[デバッグ] 二分探索のオフバイワンを直す",
  newConcept: "閉区間 [left, right] のループ境界は <= が正しい",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

下記の \`binarySearch\` 関数は **昇順にソート済み** の配列 \`arr\` から \`target\` の **添字** を返すはずですが、 ループの境界条件にオフバイワンのバグがあり、 **末尾の要素や 1 要素配列の値** を取りこぼします。 修正してください (見つからなければ \`-1\` を返す)。

\`\`\`js
binarySearch([1, 3, 5, 7, 9], 9);   // → 4   (現状は -1 を返す)
binarySearch([1, 3, 5, 7, 9], 5);   // → 2
binarySearch([1, 3, 5, 7, 9], 4);   // → -1
binarySearch([42], 42);              // → 0   (現状は -1 を返す)
\`\`\`

## ポイント

- 探索範囲は **\`[left, right]\` の閉区間** で持っているので、 ループ条件は \`left <= right\` が正しい。 \`left < right\` だと **要素数 1 の配列** や **末尾要素を target にしたケース** で打ち切られてしまう。
- 大きい入力 (1 万件) でも末尾要素が見つかるかを最小再現でチェックすると、 境界バグは小さい配列で先に再現できる。
- バグの位置を特定するには \`while\` の中で \`console.log(left, right, mid)\` を出して、 **末尾要素を渡したときに何回ループが回ったか** を確認すると早い。
`,
  starterCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
`,
  entryPoints: ["binarySearch"],
  demoCall: `console.log(binarySearch([1, 3, 5, 7, 9], 9));`,
  tests: [
    { name: "末尾要素も見つける", code: `binarySearch([1, 3, 5, 7, 9], 9) === 4` },
    { name: "中央要素を見つける", code: `binarySearch([1, 3, 5, 7, 9], 5) === 2` },
    { name: "先頭要素を見つける", code: `binarySearch([1, 3, 5, 7, 9], 1) === 0` },
    { name: "存在しない値は -1", code: `binarySearch([1, 3, 5, 7, 9], 4) === -1` },
    { name: "1 要素配列の唯一の値を見つける", code: `binarySearch([42], 42) === 0` },
    { name: "1 要素配列で存在しなければ -1", code: `binarySearch([42], 7) === -1` },
    { name: "空配列は -1", code: `binarySearch([], 1) === -1` },
    {
      name: "10000 要素配列の末尾も見つける",
      code: `(() => { const a = Array.from({ length: 10000 }, (_, i) => i * 2); return binarySearch(a, 19998) === 9999; })()`,
    },
  ],
  hints: [
    "while の条件 `left < right` を `left <= right` に変えるだけで通る。",
    "解答例:\n```js\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で添字または -1 を返す" },
        { kind: "node", nodeType: "WhileStatement", label: "while ループで探索する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
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
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
`,
      description: "元のバグのまま (末尾要素や 1 要素配列を取りこぼす)",
    },
    {
      code: `function binarySearch(arr, target) {
  return arr.indexOf(target);
}
`,
      description: "while を使わず indexOf に頼っている (AST required 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "while",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/while",
      pageTitle: "while",
    },
  ],
};
