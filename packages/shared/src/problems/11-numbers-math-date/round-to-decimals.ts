import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const roundToDecimals: Assignment = {
  id: "round-to-decimals",
  topicId: "numbers-math-date",
  title: "小数点以下の桁数で丸める",
  difficulty: 2,
  description: `## 小数点以下の桁数で丸める

数値 \`value\` と非負整数 \`digits\` を受け取り、**小数点以下 \`digits\` 桁で四捨五入**した数値を返す関数 \`roundTo\` を実装してください。

### 入出力例

\`\`\`js
roundTo(1.235, 2)   // → 1.24
roundTo(3.14159, 2) // → 3.14
roundTo(3.14159, 4) // → 3.1416
roundTo(2.5, 0)     // → 3   (.5 は切り上げ)
roundTo(-2.5, 0)    // → -2  (Math.round の仕様: 負数の .5 は 0 方向)
roundTo(123.456, 0) // → 123
roundTo(0.1 + 0.2, 1) // → 0.3
\`\`\`

注意: \`roundTo(1.005, 2)\` のような値は IEEE 754 で \`1.00499...\` として保持されるため、ナイーブな \`Math.round(value * 10**digits) / 10**digits\` は \`1.00\` を返してしまいます。本問では浮動小数点誤差を回避するケース (\`1.235\`) を採用していますが、実務では文字列ベースの丸めや \`toFixed\` の併用が必要になることを覚えておいてください。

### 制約

- \`Math.round\` を使う
- \`var\` は使わない
- \`Number.prototype.toFixed\` で文字列化したものを返すのは禁止（数値で返す）
`,
  starterCode: `function roundTo(value, digits) {
  return value;
}
`,
  solution: `function roundTo(value, digits) {
  const factor = Math.pow(10, digits);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
`,
  entryPoints: ["roundTo"],
  tests: [
    { name: "1.235 → 1.24", code: "roundTo(1.235, 2) === 1.24" },
    {
      name: "3.14159 → 3.14",
      code: "roundTo(3.14159, 2) === 3.14",
    },
    {
      name: "3.14159 → 3.1416",
      code: "roundTo(3.14159, 4) === 3.1416",
    },
    {
      name: "2.5 → 3",
      code: "roundTo(2.5, 0) === 3",
    },
    {
      name: "-2.5 → -2",
      code: "roundTo(-2.5, 0) === -2",
    },
    { name: "0桁丸め", code: "roundTo(123.456, 0) === 123" },
    {
      name: "浮動小数の罠",
      code: "roundTo(0.1 + 0.2, 1) === 0.3",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "round", label: "Math.round を使う" },
    ],
    forbidden: [
      { kind: "method", name: "toFixed", label: "toFixed は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
