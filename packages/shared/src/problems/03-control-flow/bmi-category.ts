import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const bmiCategory: Assignment = {
  id: "bmi-category",
  topicId: "control-flow",
  title: "BMIをカテゴリに分類する",
  difficulty: 2,
  description: `## BMIをカテゴリに分類する

身長 (m) と体重 (kg) を受け取り、BMI のカテゴリ文字列を返す関数 \`bmiCategory\` を実装してください。

BMI = \`weight / (height ** 2)\` を計算し、

| 範囲 | 戻り値 |
|---|---|
| \`bmi < 18.5\` | \`'低体重'\` |
| \`18.5 <= bmi < 25\` | \`'普通体重'\` |
| \`25 <= bmi < 30\` | \`'肥満(1度)'\` |
| \`30 <= bmi\` | \`'肥満(2度以上)'\` |

ただし以下は **\`'不正'\`** を返す（ガード節）:

- \`height\` または \`weight\` が **0 以下**
- どちらかが **数値でない**（\`Number.isFinite\` で false）

### 入出力例

\`\`\`js
bmiCategory(1.7, 50)    // → '低体重'   (bmi ≈ 17.30)
bmiCategory(1.7, 65)    // → '普通体重' (bmi ≈ 22.49)
bmiCategory(1.7, 80)    // → '肥満(1度)' (bmi ≈ 27.68)
bmiCategory(1.7, 90)    // → '肥満(2度以上)' (bmi ≈ 31.14)
bmiCategory(0, 60)      // → '不正'
bmiCategory(1.7, -1)    // → '不正'
bmiCategory('1.7', 60)  // → '不正'
\`\`\`

### 制約

- 入力チェックは関数の冒頭で行い、不正なら早期 \`return\` する
- \`var\` は使わない
`,
  starterCode: `function bmiCategory(height, weight) {
  return '不正';
}
`,
  solution: `function bmiCategory(height, weight) {
  if (!Number.isFinite(height) || !Number.isFinite(weight)) return '不正';
  if (height <= 0 || weight <= 0) return '不正';
  const bmi = weight / (height * height);
  if (bmi < 18.5) return '低体重';
  if (bmi < 25) return '普通体重';
  if (bmi < 30) return '肥満(1度)';
  return '肥満(2度以上)';
}
`,
  entryPoints: ["bmiCategory"],
  tests: [
    {
      name: "低体重",
      code: "bmiCategory(1.7, 50) === '低体重'",
    },
    {
      name: "普通体重",
      code: "bmiCategory(1.7, 65) === '普通体重'",
    },
    {
      name: "肥満1度",
      code: "bmiCategory(1.7, 80) === '肥満(1度)'",
    },
    {
      name: "肥満2度以上",
      code: "bmiCategory(1.7, 90) === '肥満(2度以上)'",
    },
    {
      name: "境界値 18.5",
      code: "bmiCategory(1.0, 18.5) === '普通体重'",
    },
    {
      name: "境界値 25",
      code: "bmiCategory(1.0, 25) === '肥満(1度)'",
    },
    {
      name: "0 以下は不正",
      code: "bmiCategory(0, 60) === '不正' && bmiCategory(1.7, -1) === '不正'",
    },
    {
      name: "型違いは不正",
      code: "bmiCategory('1.7', 60) === '不正'",
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
