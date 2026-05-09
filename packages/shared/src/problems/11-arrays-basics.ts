import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const arraysBasics: Assignment[] = [
  // ────────────────────────────────────────────────
  // 11-1: 末尾要素を返す
  // ────────────────────────────────────────────────
  {
    id: "last-of",
    topicId: "arrays-basics",
    title: "配列の末尾要素を返す",
    difficulty: 1,
    description: `## 配列の末尾要素を返す

配列を受け取り、その末尾要素を返す関数 \`lastOf\` を実装してください。
空配列の場合は \`undefined\` を返してください。

### 入出力例

\`\`\`js
lastOf([1, 2, 3])   // → 3
lastOf(['a'])       // → 'a'
lastOf([])          // → undefined
lastOf([null, 0])   // → 0
\`\`\`

### 制約

- **元の配列を変更しない**（\`pop\` は禁止）
- インデックスアクセスまたは \`Array.prototype.at\` を使う
- \`var\` は使わない
`,
    starterCode: `function lastOf(arr) {
  return undefined;
}
`,
    solution: `function lastOf(arr) {
  return arr[arr.length - 1];
}
`,
    entryPoints: ["lastOf"],
    tests: [
      { name: "[1,2,3]", code: "lastOf([1,2,3]) === 3" },
      { name: "['a']", code: "lastOf(['a']) === 'a'" },
      { name: "空配列", code: "lastOf([]) === undefined" },
      { name: "0 を含む", code: "lastOf([null, 0]) === 0" },
      {
        name: "元配列を破壊しない",
        code: "(() => { const a = [1,2,3]; lastOf(a); return a.length === 3 && a[2] === 3; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [
        { kind: "method", name: "pop", label: "pop は使わない (元配列を変更してしまう)" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 11-2: 不変な追加 (immutable push)
  // ────────────────────────────────────────────────
  {
    id: "append-item",
    topicId: "arrays-basics",
    title: "配列の末尾に要素を追加した新しい配列を返す",
    difficulty: 1,
    description: `## 配列の末尾に要素を追加した新しい配列を返す

配列 \`arr\` と要素 \`item\` を受け取り、\`item\` を末尾に追加した **新しい配列** を返す関数 \`appendItem\` を実装してください。
**元の配列を変更してはいけません**。

### 入出力例

\`\`\`js
appendItem([1, 2], 3)        // → [1, 2, 3]
appendItem([], 'a')          // → ['a']
appendItem([1, 2, 3], null)  // → [1, 2, 3, null]
\`\`\`

### 制約

- **\`push\` は禁止**（破壊的メソッド）
- スプレッド構文 \`[...arr, item]\` または \`Array.prototype.concat\` を使う
- \`var\` は使わない
`,
    starterCode: `function appendItem(arr, item) {
  return arr;
}
`,
    solution: `function appendItem(arr, item) {
  return [...arr, item];
}
`,
    entryPoints: ["appendItem"],
    tests: [
      {
        name: "数値追加",
        code: "JSON.stringify(appendItem([1,2], 3)) === JSON.stringify([1,2,3])",
      },
      {
        name: "空配列に追加",
        code: "JSON.stringify(appendItem([], 'a')) === JSON.stringify(['a'])",
      },
      {
        name: "null 追加",
        code: "JSON.stringify(appendItem([1,2,3], null)) === JSON.stringify([1,2,3,null])",
      },
      {
        name: "元配列を変更しない",
        code: "(() => { const a = [1,2]; appendItem(a, 3); return a.length === 2; })()",
      },
      {
        name: "新しい参照を返す",
        code: "(() => { const a = [1,2]; return appendItem(a, 3) !== a; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [
        { kind: "method", name: "push", label: "push は使わない (元配列を変更してしまう)" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 11-3: chunk
  // ────────────────────────────────────────────────
  {
    id: "chunk",
    topicId: "arrays-basics",
    title: "配列を一定サイズに分割する",
    difficulty: 3,
    description: `## 配列を一定サイズに分割する

配列 \`arr\` と正整数 \`size\` を受け取り、 \`size\` 個ずつのサブ配列に分割した二次元配列を返す関数 \`chunk\` を実装してください。

最後のチャンクは \`size\` より小さくなることがあります。
\`size <= 0\` または整数でない場合は \`[]\` を返してください。

### 入出力例

\`\`\`js
chunk([1,2,3,4,5], 2)
// → [[1,2], [3,4], [5]]

chunk([1,2,3,4,5,6], 3)
// → [[1,2,3], [4,5,6]]

chunk(['a','b','c'], 1)
// → [['a'], ['b'], ['c']]

chunk([1,2,3], 5)
// → [[1,2,3]]   (1チャンクに収まる)

chunk([], 2)
// → []

chunk([1,2,3], 0)
// → []
\`\`\`

### 制約

- \`Array.prototype.slice\` を使う
- \`var\` は使わない
- 元の配列を変更しない
- \`for\` ループでも \`while\` ループでもよい
`,
    starterCode: `function chunk(arr, size) {
  return [];
}
`,
    solution: `function chunk(arr, size) {
  if (!Number.isInteger(size) || size <= 0) return [];
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
`,
    entryPoints: ["chunk"],
    tests: [
      {
        name: "5つを2分割",
        code: "JSON.stringify(chunk([1,2,3,4,5], 2)) === JSON.stringify([[1,2],[3,4],[5]])",
      },
      {
        name: "ぴったり分割",
        code: "JSON.stringify(chunk([1,2,3,4,5,6], 3)) === JSON.stringify([[1,2,3],[4,5,6]])",
      },
      {
        name: "size 1",
        code: "JSON.stringify(chunk(['a','b','c'], 1)) === JSON.stringify([['a'],['b'],['c']])",
      },
      {
        name: "size > length",
        code: "JSON.stringify(chunk([1,2,3], 5)) === JSON.stringify([[1,2,3]])",
      },
      {
        name: "空配列",
        code: "JSON.stringify(chunk([], 2)) === JSON.stringify([])",
      },
      {
        name: "size 0",
        code: "JSON.stringify(chunk([1,2,3], 0)) === JSON.stringify([])",
      },
      {
        name: "非整数 size は []",
        code: "JSON.stringify(chunk([1,2,3], 2.5)) === JSON.stringify([])",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [{ kind: "method", name: "slice", label: "slice を使う" }],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
  },

  // ────────────────────────────────────────────────
  // 11-4: 不変なソート
  // ────────────────────────────────────────────────
  {
    id: "sort-asc",
    topicId: "arrays-basics",
    title: "数値配列を昇順ソートした新しい配列を返す",
    difficulty: 2,
    description: `## 数値配列を昇順ソートした新しい配列を返す

数値の配列を受け取り、昇順に並んだ **新しい配列** を返す関数 \`sortAsc\` を実装してください。
**元の配列は変更してはいけません**。

注意: \`Array.prototype.sort\` は破壊的メソッドです。\`[...arr].sort(...)\` のようにコピーしてからソートする必要があります。
さらに、デフォルトの \`sort()\` は **文字列としての比較** をするため、数値ソートでは比較関数を渡す必要があります（\`[10, 2].sort()\` → \`[10, 2]\` のままにならず実は \`[10, 2]\` が "10" < "2" 判定で並び替わるバグの典型）。

### 入出力例

\`\`\`js
sortAsc([3, 1, 4, 1, 5])    // → [1, 1, 3, 4, 5]
sortAsc([10, 2])             // → [2, 10]   (重要: [10, 2] にならない)
sortAsc([-3, 0, 2, -1])     // → [-3, -1, 0, 2]
sortAsc([])                  // → []
sortAsc([0.1, 0.01, 0.2])    // → [0.01, 0.1, 0.2]
\`\`\`

### 制約

- 元の配列を変更しない
- \`Array.prototype.sort\` を比較関数付きで使う
- \`var\` は使わない
`,
    starterCode: `function sortAsc(arr) {
  return arr;
}
`,
    solution: `function sortAsc(arr) {
  return [...arr].sort((a, b) => a - b);
}
`,
    badSolutions: [
      {
        description: "比較関数なしの sort() は文字列順になり [10,2] が並び替わらない",
        code: `function sortAsc(arr) {
  return [...arr].sort();
}
`,
      },
    ],
    entryPoints: ["sortAsc"],
    tests: [
      {
        name: "通常",
        code: "JSON.stringify(sortAsc([3,1,4,1,5])) === JSON.stringify([1,1,3,4,5])",
      },
      {
        name: "10進数バグ回避 [10,2]→[2,10]",
        code: "JSON.stringify(sortAsc([10,2])) === JSON.stringify([2,10])",
      },
      {
        name: "負数混在",
        code: "JSON.stringify(sortAsc([-3,0,2,-1])) === JSON.stringify([-3,-1,0,2])",
      },
      {
        name: "空配列",
        code: "JSON.stringify(sortAsc([])) === JSON.stringify([])",
      },
      {
        name: "小数",
        code: "JSON.stringify(sortAsc([0.1,0.01,0.2])) === JSON.stringify([0.01,0.1,0.2])",
      },
      {
        name: "元配列を変更しない",
        code: "(() => { const a = [3,1,2]; sortAsc(a); return JSON.stringify(a) === JSON.stringify([3,1,2]); })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "sort", label: "sort を使う" },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
  },
];
