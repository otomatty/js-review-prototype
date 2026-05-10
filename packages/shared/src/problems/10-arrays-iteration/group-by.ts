import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const groupBy: Assignment = {
  id: "group-by",
  topicId: "arrays-iteration",
  title: "reduce でキー別にグループ化する",
  difficulty: 3,
  description: `## reduce でキー別にグループ化する

オブジェクトの配列 \`items\` と、各要素からキー文字列を取り出す関数 \`keyFn\` を受け取り、キーごとに要素をまとめたオブジェクトを返す関数 \`groupBy\` を実装してください。

### 入出力例

\`\`\`js
groupBy(
  [{type:'a',v:1},{type:'b',v:2},{type:'a',v:3}],
  (x) => x.type
)
// → { a: [{type:'a',v:1},{type:'a',v:3}], b: [{type:'b',v:2}] }

groupBy([1,2,3,4], (n) => n % 2 === 0 ? 'even' : 'odd')
// → { odd: [1,3], even: [2,4] }

groupBy([], () => 'x')
// → {}
\`\`\`

### 制約

- **\`reduce\`** を使う
- \`for\` 文は使わない
- \`var\` は使わない
- 元の配列を変更しない
`,
  starterCode: `function groupBy(items, keyFn) {
  return {};
}
`,
  solution: `function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const k = keyFn(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}
`,
  entryPoints: ["groupBy"],
  tests: [
    {
      name: "type で分類",
      code: "JSON.stringify(groupBy([{type:'a',v:1},{type:'b',v:2},{type:'a',v:3}], (x)=>x.type)) === JSON.stringify({a:[{type:'a',v:1},{type:'a',v:3}], b:[{type:'b',v:2}]})",
    },
    {
      name: "even/odd",
      code: "JSON.stringify(groupBy([1,2,3,4], (n)=>n%2===0?'even':'odd')) === JSON.stringify({odd:[1,3], even:[2,4]})",
    },
    {
      name: "空配列",
      code: "JSON.stringify(groupBy([], ()=>'x')) === JSON.stringify({})",
    },
    {
      name: "全て同一キー",
      code: "JSON.stringify(groupBy([1,2,3], ()=>'k')) === JSON.stringify({k:[1,2,3]})",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [{ kind: "method", name: "reduce", label: "reduce を使う" }],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
