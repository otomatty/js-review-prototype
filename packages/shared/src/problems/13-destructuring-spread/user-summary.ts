import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const userSummary: Assignment = {
  id: "user-summary",
  topicId: "destructuring-spread",
  title: "引数を分割代入で受け取る",
  difficulty: 1,
  description: `## 引数を分割代入で受け取る

\`{ name, age, role }\` 形式のオブジェクトを受け取り、\`'{name}({role}) - {age}歳'\` 形式の文字列を返す関数 \`userSummary\` を実装してください。

\`role\` が省略された場合は \`'guest'\` を使ってください。

### 入出力例

\`\`\`js
userSummary({ name: 'Alice', age: 30, role: 'admin' })
// → 'Alice(admin) - 30歳'

userSummary({ name: 'Bob', age: 18 })
// → 'Bob(guest) - 18歳'

userSummary({ name: '太郎', age: 0, role: 'kid' })
// → '太郎(kid) - 0歳'
\`\`\`

### 制約

- **引数で分割代入** する: \`function userSummary({ name, age, role = 'guest' })\`
- **テンプレートリテラル** で結合する
- \`var\` は使わない
`,
  starterCode: `function userSummary(user) {
  return '';
}
`,
  solution: "function userSummary({ name, age, role = 'guest' }) {\n  return `${name}(${role}) - ${age}歳`;\n}\n",
  entryPoints: ["userSummary"],
  tests: [
    {
      name: "通常",
      code: "userSummary({name:'Alice', age:30, role:'admin'}) === 'Alice(admin) - 30歳'",
    },
    {
      name: "role 省略は guest",
      code: "userSummary({name:'Bob', age:18}) === 'Bob(guest) - 18歳'",
    },
    {
      name: "0歳",
      code: "userSummary({name:'太郎', age:0, role:'kid'}) === '太郎(kid) - 0歳'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ObjectPattern",
        label: "オブジェクトの分割代入を使う",
      },
      {
        kind: "node",
        nodeType: "TemplateLiteral",
        label: "テンプレートリテラルを使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
