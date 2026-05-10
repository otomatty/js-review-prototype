import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const sortAsc: Assignment = {
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
};
