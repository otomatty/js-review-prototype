import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const mapValues: Assignment = {
  id: "map-values",
  topicId: "objects-basics",
  title: "オブジェクトの値だけを変換する",
  difficulty: 2,
  description: `## オブジェクトの値だけを変換する

オブジェクト \`obj\` と変換関数 \`fn\` を受け取り、**キーはそのまま、値のみ \`fn\` で変換**した新しいオブジェクトを返す関数 \`mapValues\` を実装してください。

### 入出力例

\`\`\`js
mapValues({ a: 1, b: 2, c: 3 }, (n) => n * 2)
// → { a: 2, b: 4, c: 6 }

mapValues({ x: 'hi' }, (s) => s.toUpperCase())
// → { x: 'HI' }

mapValues({}, (n) => n)
// → {}
\`\`\`

### 制約

- **\`Object.entries\`** と **\`Object.fromEntries\`** を組み合わせる
- 配列の **\`map\`** で値を変換する
- 元のオブジェクトを変更しない
- \`for\` 文は使わない
- \`var\` は使わない
`,
  starterCode: `function mapValues(obj, fn) {
  return obj;
}
`,
  solution: `function mapValues(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, fn(v)]),
  );
}
`,
  entryPoints: ["mapValues"],
  tests: [
    {
      name: "数値倍",
      code: "JSON.stringify(mapValues({a:1,b:2,c:3}, (n)=>n*2)) === JSON.stringify({a:2,b:4,c:6})",
    },
    {
      name: "文字列変換",
      code: "JSON.stringify(mapValues({x:'hi'}, (s)=>s.toUpperCase())) === JSON.stringify({x:'HI'})",
    },
    {
      name: "空オブジェクト",
      code: "JSON.stringify(mapValues({}, (n)=>n)) === JSON.stringify({})",
    },
    {
      name: "元オブジェクトを変更しない",
      code: "(() => { const o = {a:1}; mapValues(o, (n)=>n*100); return o.a === 1; })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "entries", label: "Object.entries を使う" },
      {
        kind: "method",
        name: "fromEntries",
        label: "Object.fromEntries を使う",
      },
      { kind: "method", name: "map", label: "map を使う" },
    ],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
