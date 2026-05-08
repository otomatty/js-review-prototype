import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const loops: Assignment[] = [
  // ────────────────────────────────────────────────
  // 4-1: for...of で和を取る
  // ────────────────────────────────────────────────
  {
    id: "max-of",
    topicId: "loops",
    title: "for...of で最大値を求める",
    difficulty: 1,
    description: `## for...of で最大値を求める

数値配列を受け取り、その最大値を返す関数 \`maxOf\` を実装してください。空配列の場合は \`null\` を返してください。

### 入出力例

\`\`\`js
maxOf([3, 1, 4, 1, 5, 9, 2, 6])   // → 9
maxOf([-1, -5, -3])               // → -1
maxOf([42])                        // → 42
maxOf([])                          // → null
\`\`\`

### 制約

- **\`for...of\`** で実装する（\`Math.max\` や \`reduce\` は禁止）
- インデックス付き \`for\` 文は使わない
- \`var\` は使わない
`,
    starterCode: `function maxOf(numbers) {
  return null;
}
`,
    entryPoints: ["maxOf"],
    tests: [
      {
        name: "通常",
        weight: 25,
        code: "maxOf([3,1,4,1,5,9,2,6]) === 9",
      },
      {
        name: "全て負",
        weight: 25,
        code: "maxOf([-1,-5,-3]) === -1",
      },
      {
        name: "1要素",
        weight: 25,
        code: "maxOf([42]) === 42",
      },
      {
        name: "空配列は null",
        weight: 25,
        code: "maxOf([]) === null",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ForOfStatement",
          label: "for...of を使う",
        },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "method", name: "max", label: "Math.max は使わない" },
        { kind: "method", name: "reduce", label: "reduce は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 4-2: while で桁数を数える
  // ────────────────────────────────────────────────
  {
    id: "digit-count",
    topicId: "loops",
    title: "while で桁数を数える",
    difficulty: 2,
    description: `## while で桁数を数える

非負整数 \`n\` を受け取り、その10進表記の桁数を返す関数 \`digitCount\` を実装してください。

\`0\` は 1 桁として扱います。負の数や非整数が来たら \`-1\` を返してください。

### 入出力例

\`\`\`js
digitCount(0)        // → 1
digitCount(7)        // → 1
digitCount(42)       // → 2
digitCount(1000)     // → 4
digitCount(123456)   // → 6
digitCount(-5)       // → -1
digitCount(3.14)     // → -1
\`\`\`

### 制約

- **\`while\` ループ**で実装する
- 文字列化（\`String(n).length\`）は禁止 — 算術で割り続ける
- \`var\` は使わない
`,
    starterCode: `function digitCount(n) {
  return -1;
}
`,
    entryPoints: ["digitCount"],
    tests: [
      { name: "0 は 1 桁", weight: 14, code: "digitCount(0) === 1" },
      { name: "7", weight: 14, code: "digitCount(7) === 1" },
      { name: "42", weight: 14, code: "digitCount(42) === 2" },
      { name: "1000", weight: 14, code: "digitCount(1000) === 4" },
      { name: "123456", weight: 14, code: "digitCount(123456) === 6" },
      { name: "負の数は -1", weight: 15, code: "digitCount(-5) === -1" },
      { name: "小数は -1", weight: 15, code: "digitCount(3.14) === -1" },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "WhileStatement",
          label: "while ループを使う",
        },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 4-3: break / continue
  // ────────────────────────────────────────────────
  {
    id: "first-negative-index",
    topicId: "loops",
    title: "最初の負数のインデックスを返す",
    difficulty: 1,
    description: `## 最初の負数のインデックスを返す

数値配列を受け取り、最初に **負の数**（\`< 0\`）が現れたインデックスを返す関数 \`firstNegativeIndex\` を実装してください。
見つからなかった場合は \`-1\` を返してください。

### 入出力例

\`\`\`js
firstNegativeIndex([1, 2, -3, 4, -5])  // → 2
firstNegativeIndex([-1])                // → 0
firstNegativeIndex([1, 2, 3])           // → -1
firstNegativeIndex([])                  // → -1
firstNegativeIndex([0, -0, -1])         // → 2 (0 や -0 は負ではない)
\`\`\`

### 制約

- **\`for\` 文または \`for...of\`** + **\`break\`** で実装する
- \`Array.prototype.findIndex\` / \`indexOf\` は禁止
- \`var\` は使わない
`,
    starterCode: `function firstNegativeIndex(numbers) {
  return -1;
}
`,
    entryPoints: ["firstNegativeIndex"],
    tests: [
      {
        name: "途中に負数",
        weight: 20,
        code: "firstNegativeIndex([1,2,-3,4,-5]) === 2",
      },
      {
        name: "先頭が負数",
        weight: 20,
        code: "firstNegativeIndex([-1]) === 0",
      },
      {
        name: "見つからない",
        weight: 20,
        code: "firstNegativeIndex([1,2,3]) === -1",
      },
      {
        name: "空配列",
        weight: 20,
        code: "firstNegativeIndex([]) === -1",
      },
      {
        name: "0 と -0 は負ではない",
        weight: 20,
        code: "firstNegativeIndex([0,-0,-1]) === 2",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [
        {
          kind: "method",
          name: "findIndex",
          label: "findIndex は使わない",
        },
        { kind: "method", name: "indexOf", label: "indexOf は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 4-4: ネストしたループで重複ペア抽出
  // ────────────────────────────────────────────────
  {
    id: "find-pairs-summing-to",
    topicId: "loops",
    title: "和が指定値になるペアを全て返す",
    difficulty: 3,
    description: `## 和が指定値になるペアを全て返す

整数配列 \`numbers\` と目標値 \`target\` を受け取り、\`numbers[i] + numbers[j] === target\` (ただし \`i < j\`) を満たす **インデックスのペア** を全て返す関数 \`findPairsSummingTo\` を実装してください。

戻り値の形式: \`Array<[i, j]>\`（昇順 \`i < j\`、ペアそのものは登場順）。

### 入出力例

\`\`\`js
findPairsSummingTo([1, 2, 3, 4], 5)
// → [[0,3], [1,2]]   (1+4=5, 2+3=5)

findPairsSummingTo([1, 1, 1], 2)
// → [[0,1], [0,2], [1,2]]

findPairsSummingTo([5, -1, 1, 6, 0], 6)
// → [[0,4], [2,3]]   (5+0=6, 1+5=6 → ただし[0,4]は5+0)

findPairsSummingTo([], 0)
// → []
\`\`\`

### 制約

- **for ループのネスト** で実装する
- \`Array.prototype.filter\` / \`map\` 等の高階関数は使わない
- \`var\` は使わない
- 元の配列を変更しない
`,
    starterCode: `function findPairsSummingTo(numbers, target) {
  return [];
}
`,
    entryPoints: ["findPairsSummingTo"],
    tests: [
      {
        name: "通常",
        weight: 25,
        code: "JSON.stringify(findPairsSummingTo([1,2,3,4], 5)) === JSON.stringify([[0,3],[1,2]])",
      },
      {
        name: "重複要素を持つ",
        weight: 25,
        code: "JSON.stringify(findPairsSummingTo([1,1,1], 2)) === JSON.stringify([[0,1],[0,2],[1,2]])",
      },
      {
        name: "負数混在",
        weight: 25,
        code: "JSON.stringify(findPairsSummingTo([5,-1,1,6,0], 6)) === JSON.stringify([[0,4],[2,3]])",
      },
      {
        name: "空配列",
        weight: 25,
        code: "JSON.stringify(findPairsSummingTo([], 0)) === JSON.stringify([])",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ForStatement",
          label: "for 文を使う (ネストする)",
        },
      ],
      forbidden: [
        { kind: "method", name: "filter", label: "filter は使わない" },
        { kind: "method", name: "map", label: "map は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
