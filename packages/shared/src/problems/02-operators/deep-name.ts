import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const deepName: Assignment = {
  id: "deep-name",
  topicId: "operators",
  title: "optional chaining でネストを掘る",
  difficulty: 2,
  description: `## optional chaining でネストを掘る

ネストしたユーザーオブジェクトから **会社の名前**を返す関数 \`companyName\` を実装してください。
途中のいずれかが \`null\` / \`undefined\` の場合は \`'unknown'\` を返してください。

データ形状: \`{ profile?: { company?: { name?: string } } }\`

### 入出力例

\`\`\`js
companyName({ profile: { company: { name: 'Acme' } } })  // → 'Acme'
companyName({ profile: { company: {} } })                 // → 'unknown'
companyName({ profile: {} })                              // → 'unknown'
companyName({})                                            // → 'unknown'
companyName(null)                                          // → 'unknown'
companyName(undefined)                                     // → 'unknown'
\`\`\`

### 制約

- **optional chaining (\`?.\`)** と **null合体 (\`??\`)** を使う
- \`if\` 文・三項演算子を使わずに 1 行で書ける
- \`var\` は使わない
`,
  starterCode: `function companyName(user) {
  return 'unknown';
}
`,
  solution: `function companyName(user) {
  return user?.profile?.company?.name ?? 'unknown';
}
`,
  entryPoints: ["companyName"],
  tests: [
    {
      name: "正常系",
      code: "companyName({profile:{company:{name:'Acme'}}}) === 'Acme'",
    },
    {
      name: "name 欠落",
      code: "companyName({profile:{company:{}}}) === 'unknown'",
    },
    {
      name: "company 欠落",
      code: "companyName({profile:{}}) === 'unknown'",
    },
    {
      name: "profile 欠落",
      code: "companyName({}) === 'unknown'",
    },
    {
      name: "null",
      code: "companyName(null) === 'unknown'",
    },
    {
      name: "undefined",
      code: "companyName(undefined) === 'unknown'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
