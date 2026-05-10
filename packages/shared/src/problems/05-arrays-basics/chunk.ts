import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const chunk: Assignment = {
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
};
