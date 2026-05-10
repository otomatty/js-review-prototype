import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const firstNegativeIndex: Assignment = {
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
  solution: `function firstNegativeIndex(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < 0) return i;
  }
  return -1;
}
`,
  entryPoints: ["firstNegativeIndex"],
  tests: [
    {
      name: "途中に負数",
      code: "firstNegativeIndex([1,2,-3,4,-5]) === 2",
    },
    {
      name: "先頭が負数",
      code: "firstNegativeIndex([-1]) === 0",
    },
    {
      name: "見つからない",
      code: "firstNegativeIndex([1,2,3]) === -1",
    },
    {
      name: "空配列",
      code: "firstNegativeIndex([]) === -1",
    },
    {
      name: "0 と -0 は負ではない",
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
};
