import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const maskEmails: Assignment = {
  id: "mask-emails",
  topicId: "regex",
  title: "メールアドレスを伏せ字にする",
  difficulty: 2,
  description: `## メールアドレスを伏せ字にする

任意の文字列に含まれるメールアドレスを、**全て \`[email]\`** に置き換える関数 \`maskEmails\` を実装してください。

メールアドレスは、ここでは「**英数字・\`.\`・\`_\`・\`%\`・\`+\`・\`-\` のいずれか1文字以上 + \`@\` + 英数字・\`.\`・\`-\` のいずれか1文字以上 + \`.\` + 2文字以上の英字**」として扱います。

### 入出力例

\`\`\`js
maskEmails('連絡先は alice@example.com です')
// → '連絡先は [email] です'

maskEmails('a@x.co と b.c+d@sub.example.co.jp の2件')
// → '[email] と [email] の2件'

maskEmails('メールはありません')
// → 'メールはありません'

maskEmails('')
// → ''
\`\`\`

### 制約

- 正規表現リテラル (\`g\` フラグ付き) と \`String.prototype.replace\` を使う
- \`var\` は使わない
- \`for\` 文は使わない
`,
  starterCode: `function maskEmails(text) {
  return text;
}
`,
  solution: `function maskEmails(text) {
  return text.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/g, '[email]');
}
`,
  entryPoints: ["maskEmails"],
  tests: [
    {
      name: "1件置換",
      code: "maskEmails('連絡先は alice@example.com です') === '連絡先は [email] です'",
    },
    {
      name: "2件置換",
      code: "maskEmails('a@x.co と b.c+d@sub.example.co.jp の2件') === '[email] と [email] の2件'",
    },
    {
      name: "メールなし",
      code: "maskEmails('メールはありません') === 'メールはありません'",
    },
    {
      name: "空文字",
      code: "maskEmails('') === ''",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "RegExpLiteral",
        label: "正規表現リテラルを使う",
      },
      { kind: "method", name: "replace", label: "replace を使う" },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
    ],
  },
};
