import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const unique: Assignment = {
  id: "unique",
  topicId: "collections",
  title: "Set で重複を除去する",
  difficulty: 1,
  description: `## Set で重複を除去する

配列を受け取り、\`===\` で判定した重複を除いた **新しい配列** を返す関数 \`unique\` を実装してください。
**最初に出現した順序を保持**します。

### 入出力例

\`\`\`js
unique([1, 2, 2, 3, 1])         // → [1, 2, 3]
unique(['a', 'b', 'a', 'c'])    // → ['a', 'b', 'c']
unique([])                       // → []
unique([NaN, NaN])               // → [NaN]   (Setでは NaN は等価扱い)
unique([1, '1', 1])              // → [1, '1']  (型が違えば別)
\`\`\`

### 制約

- **\`new Set(...)\`** を使う
- スプレッドまたは \`Array.from\` で配列に戻す
- \`for\` 文は使わない
- \`var\` は使わない
- 元の配列を変更しない
`,
  starterCode: `function unique(arr) {
  return [];
}
`,
  solution: `function unique(arr) {
  return [...new Set(arr)];
}
`,
  entryPoints: ["unique"],
  tests: [
    {
      name: "数値",
      code: "JSON.stringify(unique([1,2,2,3,1])) === JSON.stringify([1,2,3])",
    },
    {
      name: "文字列",
      code: "JSON.stringify(unique(['a','b','a','c'])) === JSON.stringify(['a','b','c'])",
    },
    {
      name: "空配列",
      code: "JSON.stringify(unique([])) === JSON.stringify([])",
    },
    {
      name: "NaN は等価",
      code: "(() => { const r = unique([NaN, NaN]); return r.length === 1 && Number.isNaN(r[0]); })()",
    },
    {
      name: "型違いは別物",
      code: "JSON.stringify(unique([1,'1',1])) === JSON.stringify([1,'1'])",
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
