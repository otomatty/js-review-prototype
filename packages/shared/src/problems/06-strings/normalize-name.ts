import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const normalizeName: Assignment = {
  id: "normalize-name",
  topicId: "strings",
  title: "名前を正規化する",
  difficulty: 1,
  description: `## 名前を正規化する

任意の文字列を受け取り、

1. 前後の空白をトリム
2. **先頭1文字だけを大文字**
3. それ以降は **全て小文字**

した文字列を返す関数 \`normalizeName\` を実装してください。空文字や全空白の場合は \`''\` を返してください。

### 入出力例

\`\`\`js
normalizeName('alice')         // → 'Alice'
normalizeName('  BOB  ')       // → 'Bob'
normalizeName('cArOl')         // → 'Carol'
normalizeName('')              // → ''
normalizeName('   ')           // → ''
normalizeName('A')             // → 'A'
\`\`\`

### 制約

- \`String.prototype.trim\` を使う
- \`String.prototype.toUpperCase\` / \`toLowerCase\` を使う
- \`var\` は使わない
`,
  starterCode: `function normalizeName(input) {
  return '';
}
`,
  solution: `function normalizeName(input) {
  const trimmed = input.trim();
  if (trimmed.length === 0) return '';
  return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
}
`,
  entryPoints: ["normalizeName"],
  tests: [
    { name: "alice → Alice", code: "normalizeName('alice') === 'Alice'" },
    {
      name: "前後トリム",
      code: "normalizeName('  BOB  ') === 'Bob'",
    },
    {
      name: "混在ケース",
      code: "normalizeName('cArOl') === 'Carol'",
    },
    { name: "空文字", code: "normalizeName('') === ''" },
    { name: "空白のみ", code: "normalizeName('   ') === ''" },
    { name: "1文字", code: "normalizeName('A') === 'A'" },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "trim", label: "trim を使う" },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
