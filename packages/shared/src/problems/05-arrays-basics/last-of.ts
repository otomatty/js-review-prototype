import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const lastOf: Assignment = {
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
};
