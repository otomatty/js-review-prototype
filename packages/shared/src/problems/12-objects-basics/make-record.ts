import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const makeRecord: Assignment = {
  id: "make-record",
  topicId: "objects-basics",
  title: "shorthand と computed key で1件分のレコードを作る",
  difficulty: 1,
  description: `## shorthand と computed key で1件分のレコードを作る

\`key\`、\`value\`、\`tag\` を受け取り、

\`\`\`js
{ [key]: value, tag, createdAt: 'now' }
\`\`\`

形式のオブジェクトを返す関数 \`makeRecord\` を実装してください。

注意:

- \`createdAt\` は固定で文字列 \`'now'\`
- \`tag\` は **shorthand** で書く
- 1番目のキーは **computed property name (\`[key]\`)** で書く

### 入出力例

\`\`\`js
makeRecord('id', 1, 'a')
// → { id: 1, tag: 'a', createdAt: 'now' }

makeRecord('name', 'Alice', 'admin')
// → { name: 'Alice', tag: 'admin', createdAt: 'now' }
\`\`\`

### 制約

- shorthand プロパティを使う（\`{ tag: tag }\` ではなく \`{ tag }\`）
- computed property name を使う
- \`var\` は使わない
`,
  starterCode: `function makeRecord(key, value, tag) {
  return {};
}
`,
  solution: `function makeRecord(key, value, tag) {
  return { [key]: value, tag, createdAt: 'now' };
}
`,
  entryPoints: ["makeRecord"],
  tests: [
    {
      name: "id, 1, a",
      code: "JSON.stringify(makeRecord('id', 1, 'a')) === JSON.stringify({id:1, tag:'a', createdAt:'now'})",
    },
    {
      name: "name, Alice, admin",
      code: "JSON.stringify(makeRecord('name', 'Alice', 'admin')) === JSON.stringify({name:'Alice', tag:'admin', createdAt:'now'})",
    },
    {
      name: "数値キー風な文字列",
      code: "JSON.stringify(makeRecord('123', null, '')) === JSON.stringify({'123':null, tag:'', createdAt:'now'})",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
