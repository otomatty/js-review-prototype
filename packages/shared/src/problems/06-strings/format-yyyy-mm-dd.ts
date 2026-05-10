import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const formatYyyyMmDd: Assignment = {
  id: "format-yyyy-mm-dd",
  topicId: "strings",
  title: "日付を YYYY-MM-DD で整形する",
  difficulty: 2,
  description: `## 日付を YYYY-MM-DD で整形する

\`{ year, month, day }\` を受け取り、\`'YYYY-MM-DD'\` 形式の文字列を返す関数 \`formatYmd\` を実装してください。

- \`year\` は **4桁ゼロパディング**
- \`month\` / \`day\` は **2桁ゼロパディング**
- \`year\` が負・5桁以上、\`month\` が 1-12 外、\`day\` が 1-31 外ならば \`'invalid'\` を返す

### 入出力例

\`\`\`js
formatYmd({ year: 2024, month: 1,  day: 5  })  // → '2024-01-05'
formatYmd({ year: 2024, month: 12, day: 31 })  // → '2024-12-31'
formatYmd({ year: 9, month: 9, day: 9 })        // → '0009-09-09'
formatYmd({ year: -1, month: 1, day: 1 })       // → 'invalid'
formatYmd({ year: 2024, month: 13, day: 1 })    // → 'invalid'
formatYmd({ year: 2024, month: 2, day: 32 })    // → 'invalid'
\`\`\`

(注: 2月の日数や閏年の厳密判定までは要求しません。 \`day\` が 1〜31 の範囲なら有効とします。)

### 制約

- **テンプレートリテラル** で組み立てる
- ゼロパディングは \`String.prototype.padStart\` を使う
- \`var\` は使わない
`,
  starterCode: `function formatYmd(date) {
  return 'invalid';
}
`,
  solution: "function formatYmd(date) {\n  const { year, month, day } = date;\n  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return 'invalid';\n  if (year < 0 || year > 9999) return 'invalid';\n  if (month < 1 || month > 12) return 'invalid';\n  if (day < 1 || day > 31) return 'invalid';\n  const y = String(year).padStart(4, '0');\n  const m = String(month).padStart(2, '0');\n  const d = String(day).padStart(2, '0');\n  return `${y}-${m}-${d}`;\n}\n",
  entryPoints: ["formatYmd"],
  tests: [
    {
      name: "通常",
      code: "formatYmd({year:2024,month:1,day:5}) === '2024-01-05'",
    },
    {
      name: "境界",
      code: "formatYmd({year:2024,month:12,day:31}) === '2024-12-31'",
    },
    {
      name: "1桁年",
      code: "formatYmd({year:9,month:9,day:9}) === '0009-09-09'",
    },
    {
      name: "負の年",
      code: "formatYmd({year:-1,month:1,day:1}) === 'invalid'",
    },
    {
      name: "範囲外月",
      code: "formatYmd({year:2024,month:13,day:1}) === 'invalid'",
    },
    {
      name: "範囲外日",
      code: "formatYmd({year:2024,month:2,day:32}) === 'invalid'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "TemplateLiteral",
        label: "テンプレートリテラルを使う",
      },
      { kind: "method", name: "padStart", label: "padStart を使う" },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
