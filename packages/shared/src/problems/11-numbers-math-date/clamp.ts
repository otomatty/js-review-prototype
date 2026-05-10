import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const clamp: Assignment = {
  id: "clamp",
  topicId: "numbers-math-date",
  title: "値を範囲内にクランプする",
  difficulty: 1,
  description: `## 値を範囲内にクランプする

数値 \`value\`、\`min\`、\`max\` を受け取り、

- \`value < min\` なら \`min\`
- \`value > max\` なら \`max\`
- それ以外ならそのまま \`value\`

を返す関数 \`clamp\` を実装してください。

### 入出力例

\`\`\`js
clamp(5,  0, 10)    // → 5
clamp(-3, 0, 10)    // → 0
clamp(15, 0, 10)    // → 10
clamp(0,  0, 10)    // → 0   (境界)
clamp(10, 0, 10)    // → 10  (境界)
clamp(7.5, 0, 10)   // → 7.5
\`\`\`

### 制約

- \`Math.min\` と \`Math.max\` を使う（1行で書ける）
- \`if\` 文は使わない
- \`var\` は使わない
`,
  starterCode: `function clamp(value, min, max) {
  return value;
}
`,
  solution: `function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
`,
  entryPoints: ["clamp"],
  tests: [
    { name: "範囲内", code: "clamp(5, 0, 10) === 5" },
    { name: "下限以下", code: "clamp(-3, 0, 10) === 0" },
    { name: "上限以上", code: "clamp(15, 0, 10) === 10" },
    { name: "下限境界", code: "clamp(0, 0, 10) === 0" },
    { name: "上限境界", code: "clamp(10, 0, 10) === 10" },
    {
      name: "小数",
      code: "Math.abs(clamp(7.5, 0, 10) - 7.5) < 1e-9",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "min", label: "Math.min を使う" },
      { kind: "method", name: "max", label: "Math.max を使う" },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
