import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const tally: Assignment = {
  id: "tally",
  topicId: "collections",
  title: "Map で要素の出現回数を集計する",
  difficulty: 2,
  description: `## Map で要素の出現回数を集計する

配列を受け取り、各要素の出現回数を持つ **\`Map\`** を返す関数 \`tally\` を実装してください。
要素の順序は **最初に出現した順** を維持します。

### 入出力例

\`\`\`js
const m = tally(['a','b','a','c','a','b']);
m instanceof Map     // → true
m.get('a')           // → 3
m.get('b')           // → 2
m.get('c')           // → 1
[...m.keys()]        // → ['a','b','c']

tally([]).size       // → 0
tally([1,1,1]).get(1)  // → 3
\`\`\`

### 制約

- **\`new Map()\`** を使う
- \`for\` または \`for...of\` で要素を処理する
- 戻り値は \`Map\` インスタンス（オブジェクトリテラルではない）
- \`var\` は使わない
`,
  starterCode: `function tally(arr) {
  return new Map();
}
`,
  solution: `function tally(arr) {
  const m = new Map();
  for (const item of arr) {
    m.set(item, (m.get(item) || 0) + 1);
  }
  return m;
}
`,
  entryPoints: ["tally"],
  tests: [
    {
      name: "Map インスタンス",
      code: "tally(['a']) instanceof Map",
    },
    {
      name: "頻度",
      code: "(() => { const m = tally(['a','b','a','c','a','b']); return m.get('a') === 3 && m.get('b') === 2 && m.get('c') === 1; })()",
    },
    {
      name: "順序保持",
      code: "JSON.stringify([...tally(['a','b','a','c']).keys()]) === JSON.stringify(['a','b','c'])",
    },
    {
      name: "空配列",
      code: "tally([]).size === 0",
    },
    {
      name: "数値要素",
      code: "tally([1,1,1]).get(1) === 3",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "NewExpression",
        label: "new Map() を使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
