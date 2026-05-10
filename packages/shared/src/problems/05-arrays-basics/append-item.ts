import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const appendItem: Assignment = {
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
};
