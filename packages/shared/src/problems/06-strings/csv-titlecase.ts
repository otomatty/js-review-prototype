import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const csvTitlecase: Assignment = {
  id: "csv-titlecase",
  topicId: "strings",
  title: "CSV をタイトルケースで返す",
  difficulty: 2,
  description: `## CSVをタイトルケースで返す

カンマ区切りの単語列（前後・要素間に空白あり）を受け取り、各単語を **タイトルケース** にして \`', '\` で連結した文字列を返す関数 \`titleCsv\` を実装してください。

タイトルケース: 先頭が大文字・他は小文字（例: \`'apple'\` → \`'Apple'\`）。

### 入出力例

\`\`\`js
titleCsv('apple,banana, CHERRY ')
// → 'Apple, Banana, Cherry'

titleCsv('  alice  ,  BOB  ')
// → 'Alice, Bob'

titleCsv('')
// → ''

titleCsv('one')
// → 'One'

titleCsv('a, , b')
// → 'A, , B'   (空要素はそのまま空のまま)
\`\`\`

### 制約

- **\`split\`** と **\`join\`** を使う
- 配列に対して **\`map\`** で変換する
- \`var\` は使わない
- \`for\` 文は使わない
`,
  starterCode: `function titleCsv(input) {
  return '';
}
`,
  solution: `function titleCsv(input) {
  if (input === '') return '';
  return input
    .split(',')
    .map((s) => {
      const t = s.trim();
      if (t.length === 0) return '';
      return t[0].toUpperCase() + t.slice(1).toLowerCase();
    })
    .join(', ');
}
`,
  entryPoints: ["titleCsv"],
  tests: [
    {
      name: "通常",
      code: "titleCsv('apple,banana, CHERRY ') === 'Apple, Banana, Cherry'",
    },
    {
      name: "空白多め",
      code: "titleCsv('  alice  ,  BOB  ') === 'Alice, Bob'",
    },
    { name: "空文字", code: "titleCsv('') === ''" },
    { name: "1要素", code: "titleCsv('one') === 'One'" },
    {
      name: "空要素を含む",
      code: "titleCsv('a, , b') === 'A, , B'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "split", label: "split を使う" },
      { kind: "method", name: "join", label: "join を使う" },
      { kind: "method", name: "map", label: "map を使う" },
    ],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
