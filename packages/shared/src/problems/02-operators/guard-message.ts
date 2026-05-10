import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const guardMessage: Assignment = {
  id: "guard-message",
  topicId: "operators",
  title: "短絡評価で表示文字列を組み立てる",
  difficulty: 2,
  description: `## 短絡評価で表示文字列を組み立てる

\`{ user, count }\` を受け取り、以下を返す関数 \`buildMessage\` を実装してください。

- \`user\` が空文字 / null / undefined → \`'匿名さん'\` と表示
- \`count\` が \`0\` または欠落 → 末尾に \`'(通知なし)'\` を付与
- \`count\` が 1 以上 → 末尾に \`'(N件)'\` を付与

形式: \`"{name}さん {suffix}"\`（半角スペース1つで区切る）

### 入出力例

\`\`\`js
buildMessage({ user: 'Alice', count: 3 })
// → 'Aliceさん (3件)'

buildMessage({ user: 'Bob', count: 0 })
// → 'Bobさん (通知なし)'

buildMessage({ user: '', count: 5 })
// → '匿名さん (5件)'

buildMessage({})
// → '匿名さん (通知なし)'

buildMessage({ user: null, count: undefined })
// → '匿名さん (通知なし)'
\`\`\`

### 制約

- 論理演算子 \`||\` で名前のフォールバックを書く
- \`if\` 文は使わない
- \`var\` は使わない
`,
  starterCode: `function buildMessage(input) {
  return '';
}
`,
  solution: "function buildMessage(input) {\n  const user = (input?.user || '匿名');\n  const count = input?.count;\n  const suffix = count > 0 ? `(${count}件)` : '(通知なし)';\n  return `${user}さん ${suffix}`;\n}\n",
  entryPoints: ["buildMessage"],
  tests: [
    {
      name: "Alice / 3",
      code: "buildMessage({user:'Alice', count:3}) === 'Aliceさん (3件)'",
    },
    {
      name: "Bob / 0",
      code: "buildMessage({user:'Bob', count:0}) === 'Bobさん (通知なし)'",
    },
    {
      name: "空名前",
      code: "buildMessage({user:'', count:5}) === '匿名さん (5件)'",
    },
    {
      name: "プロパティなし",
      code: "buildMessage({}) === '匿名さん (通知なし)'",
    },
    {
      name: "null / undefined",
      code: "buildMessage({user:null, count:undefined}) === '匿名さん (通知なし)'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "LogicalExpression",
        label: "論理演算子 (|| / && / ??) を使う",
      },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
