import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const swap: Assignment = {
  id: "swap",
  topicId: "destructuring-spread",
  title: "配列の分割代入で値を入れ替える",
  difficulty: 1,
  description: `## 配列の分割代入で値を入れ替える

長さ 2 以上の配列を受け取り、\`[1番目の要素, 0番目の要素, ...残り]\` の **新しい配列** を返す関数 \`swap\` を実装してください。
長さが 0 または 1 の場合は元の配列のコピーを返してください。

### 入出力例

\`\`\`js
swap([1, 2, 3, 4])   // → [2, 1, 3, 4]
swap(['a', 'b'])     // → ['b', 'a']
swap([42])           // → [42]
swap([])             // → []
\`\`\`

### 制約

- **配列の分割代入** \`const [a, b, ...rest] = arr\` を使う
- **スプレッド構文** で再構築する
- 元の配列を変更しない
- \`var\` は使わない
`,
  starterCode: `function swap(arr) {
  return arr;
}
`,
  solution: `function swap(arr) {
  if (arr.length < 2) return [...arr];
  const [a, b, ...rest] = arr;
  return [b, a, ...rest];
}
`,
  entryPoints: ["swap"],
  tests: [
    {
      name: "4要素",
      code: "JSON.stringify(swap([1,2,3,4])) === JSON.stringify([2,1,3,4])",
    },
    {
      name: "2要素",
      code: "JSON.stringify(swap(['a','b'])) === JSON.stringify(['b','a'])",
    },
    {
      name: "1要素",
      code: "JSON.stringify(swap([42])) === JSON.stringify([42])",
    },
    {
      name: "空配列",
      code: "JSON.stringify(swap([])) === JSON.stringify([])",
    },
    {
      name: "元配列を変更しない",
      code: "(() => { const a = [1,2,3]; swap(a); return JSON.stringify(a) === JSON.stringify([1,2,3]); })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ArrayPattern",
        label: "配列の分割代入を使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
