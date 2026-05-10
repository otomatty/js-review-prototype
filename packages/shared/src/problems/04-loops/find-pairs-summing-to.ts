import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const findPairsSummingTo: Assignment = {
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
// → [[0,2], [3,4]]   (5+1=6, 6+0=6)

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
  solution: `function findPairsSummingTo(numbers, target) {
  const pairs = [];
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}
`,
  badSolutions: [
    {
      description: "j を i から開始して i===j のペア (自己ペア) を含めてしまう",
      code: `function findPairsSummingTo(numbers, target) {
  const pairs = [];
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}
`,
    },
  ],
  entryPoints: ["findPairsSummingTo"],
  tests: [
    {
      name: "通常",
      code: "JSON.stringify(findPairsSummingTo([1,2,3,4], 5)) === JSON.stringify([[0,3],[1,2]])",
    },
    {
      name: "重複要素を持つ",
      code: "JSON.stringify(findPairsSummingTo([1,1,1], 2)) === JSON.stringify([[0,1],[0,2],[1,2]])",
    },
    {
      name: "負数混在",
      code: "JSON.stringify(findPairsSummingTo([5,-1,1,6,0], 6)) === JSON.stringify([[0,2],[3,4]])",
    },
    {
      name: "空配列",
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
};
