import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const intersect: Assignment = {
  id: "intersect",
  topicId: "collections",
  title: "Set で2配列の交差を求める",
  difficulty: 2,
  description: `## Set で2配列の交差を求める

配列 \`a\`、\`b\` を受け取り、両方に含まれる要素 (\`===\` 一致) のみを **重複なし** で並べた配列を返す関数 \`intersect\` を実装してください。
順序は \`a\` における最初の出現順。

### 入出力例

\`\`\`js
intersect([1,2,3,4], [2,4,6])     // → [2, 4]
intersect(['a','b','c'], ['c','d'])  // → ['c']
intersect([1,1,2,2], [2,1])        // → [1, 2]   (重複は除く、a の順序)
intersect([], [1,2])               // → []
intersect([1,2], [3,4])            // → []
\`\`\`

### 制約

- **\`Set\`** を使って高速に判定する（ネストした for ループ禁止）
- \`for\` 文は使わない
- \`var\` は使わない
- 元の配列を変更しない
`,
  starterCode: `function intersect(a, b) {
  return [];
}
`,
  solution: `function intersect(a, b) {
  const setB = new Set(b);
  const seen = new Set();
  const result = [];
  for (const x of a) {
    if (setB.has(x) && !seen.has(x)) {
      result.push(x);
      seen.add(x);
    }
  }
  return result;
}
`,
  entryPoints: ["intersect"],
  tests: [
    {
      name: "数値",
      code: "JSON.stringify(intersect([1,2,3,4],[2,4,6])) === JSON.stringify([2,4])",
    },
    {
      name: "文字列",
      code: "JSON.stringify(intersect(['a','b','c'],['c','d'])) === JSON.stringify(['c'])",
    },
    {
      name: "重複は除く",
      code: "JSON.stringify(intersect([1,1,2,2],[2,1])) === JSON.stringify([1,2])",
    },
    {
      name: "片方空",
      code: "JSON.stringify(intersect([],[1,2])) === JSON.stringify([])",
    },
    {
      name: "交差なし",
      code: "JSON.stringify(intersect([1,2],[3,4])) === JSON.stringify([])",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "NewExpression",
        label: "new Set(...) を使う",
      },
    ],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
