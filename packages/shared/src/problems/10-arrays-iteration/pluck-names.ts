import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const pluckNames: Assignment = {
  id: "pluck-names",
  topicId: "arrays-iteration",
  title: "オブジェクト配列から name を取り出す",
  difficulty: 1,
  description: `## オブジェクト配列から name を取り出す

\`{ name: string, ... }\` の配列を受け取り、名前だけを並べた配列を返す関数 \`pluckNames\` を実装してください。

### 入出力例

\`\`\`js
pluckNames([{name:'A'},{name:'B'},{name:'C'}])
// → ['A','B','C']

pluckNames([{name:'X', age:1}])
// → ['X']

pluckNames([])
// → []
\`\`\`

### 制約

- **\`map\`** を使う
- \`for\` 文は使わない
- \`var\` は使わない
`,
  starterCode: `function pluckNames(items) {
  return [];
}
`,
  solution: `function pluckNames(items) {
  return items.map((x) => x.name);
}
`,
  entryPoints: ["pluckNames"],
  tests: [
    {
      name: "3要素",
      code: "JSON.stringify(pluckNames([{name:'A'},{name:'B'},{name:'C'}])) === JSON.stringify(['A','B','C'])",
    },
    {
      name: "他プロパティを無視",
      code: "JSON.stringify(pluckNames([{name:'X', age:1}])) === JSON.stringify(['X'])",
    },
    {
      name: "空配列",
      code: "JSON.stringify(pluckNames([])) === JSON.stringify([])",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [{ kind: "method", name: "map", label: "map を使う" }],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
