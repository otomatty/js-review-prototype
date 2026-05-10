import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const daysBetween: Assignment = {
  id: "days-between",
  topicId: "numbers-math-date",
  title: "2つの日付の日数差を求める",
  difficulty: 2,
  description: `## 2つの日付の日数差を求める

\`'YYYY-MM-DD'\` 形式の文字列 \`a\`, \`b\` を受け取り、\`b - a\` を **整数の日数** で返す関数 \`daysBetween\` を実装してください。

- 同じ日なら \`0\`
- \`a\` の方が後の日付なら **負の値**
- パースに失敗する文字列が来たら \`NaN\` を返す

タイムゾーンの影響を受けないよう、UTCで計算してください（\`Date.UTC\` または \`new Date(s + 'T00:00:00Z')\` でOK）。

### 入出力例

\`\`\`js
daysBetween('2024-01-01', '2024-01-02')   // → 1
daysBetween('2024-01-01', '2024-01-01')   // → 0
daysBetween('2024-02-01', '2024-01-01')   // → -31
daysBetween('2024-01-01', '2024-12-31')   // → 365  (うるう年)
daysBetween('not-a-date', '2024-01-01')   // → NaN
\`\`\`

### 制約

- \`Date.UTC\` または \`Date\` を使う
- \`var\` は使わない
- 引数文字列をパースする処理は自前で書かなくてよい（\`Date\` に任せる）
- ただし結果は整数で返す（\`Math.round\` などで整える）
`,
  starterCode: `function daysBetween(a, b) {
  return NaN;
}
`,
  solution: `function daysBetween(a, b) {
  const ta = Date.parse(a + 'T00:00:00Z');
  const tb = Date.parse(b + 'T00:00:00Z');
  if (Number.isNaN(ta) || Number.isNaN(tb)) return NaN;
  return Math.round((tb - ta) / 86400000);
}
`,
  entryPoints: ["daysBetween"],
  tests: [
    {
      name: "1日後",
      code: "daysBetween('2024-01-01', '2024-01-02') === 1",
    },
    {
      name: "同日",
      code: "daysBetween('2024-01-01', '2024-01-01') === 0",
    },
    {
      name: "1ヶ月前 (-31)",
      code: "daysBetween('2024-02-01', '2024-01-01') === -31",
    },
    {
      name: "うるう年 365日",
      code: "daysBetween('2024-01-01', '2024-12-31') === 365",
    },
    {
      name: "不正入力は NaN",
      code: "Number.isNaN(daysBetween('not-a-date', '2024-01-01'))",
    },
    {
      name: "戻り値は整数",
      code: "Number.isInteger(daysBetween('2024-03-01', '2024-04-01'))",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
