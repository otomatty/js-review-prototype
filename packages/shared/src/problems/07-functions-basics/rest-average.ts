import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const restAverage: Assignment = {
  id: "rest-average",
  topicId: "functions-basics",
  title: "残余引数で平均を計算する",
  difficulty: 1,
  description: `## 残余引数で平均を計算する

任意個数の数値を可変長引数で受け取り、その算術平均を返す関数 \`average\` を実装してください。
**引数が 0 個**の場合は \`0\` を返してください。

### 入出力例

\`\`\`js
average(1, 2, 3)        // → 2
average(10)             // → 10
average()               // → 0
average(1.5, 2.5)       // → 2
average(-1, 1)          // → 0
\`\`\`

### 制約

- **残余引数 (\`...args\`)** を使って引数を配列で受け取る
- \`var\` は使わない
- 配列やオブジェクトを引数として渡す形にしない（あくまで可変長個別引数）
`,
  starterCode: `function average() {
  return 0;
}
`,
  solution: `function average(...args) {
  if (args.length === 0) return 0;
  const total = args.reduce((a, b) => a + b, 0);
  return total / args.length;
}
`,
  entryPoints: ["average"],
  tests: [
    { name: "3 引数", code: "average(1,2,3) === 2" },
    { name: "1 引数", code: "average(10) === 10" },
    { name: "0 引数", code: "average() === 0" },
    {
      name: "小数",
      code: "Math.abs(average(1.5, 2.5) - 2) < 1e-9",
    },
    { name: "符号混在", code: "average(-1, 1) === 0" },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "RestElement",
        label: "残余引数 (...args) を使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
