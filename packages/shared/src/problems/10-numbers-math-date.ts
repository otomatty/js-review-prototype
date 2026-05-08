import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const numbersMathDate: Assignment[] = [
  // ────────────────────────────────────────────────
  // 10-1: 値を範囲内にクランプ
  // ────────────────────────────────────────────────
  {
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
    entryPoints: ["clamp"],
    tests: [
      { name: "範囲内", weight: 16, code: "clamp(5, 0, 10) === 5" },
      { name: "下限以下", weight: 17, code: "clamp(-3, 0, 10) === 0" },
      { name: "上限以上", weight: 17, code: "clamp(15, 0, 10) === 10" },
      { name: "下限境界", weight: 16, code: "clamp(0, 0, 10) === 0" },
      { name: "上限境界", weight: 17, code: "clamp(10, 0, 10) === 10" },
      {
        name: "小数",
        weight: 17,
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
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 10-2: 整数判定
  // ────────────────────────────────────────────────
  {
    id: "is-positive-integer",
    topicId: "numbers-math-date",
    title: "正の整数か判定する",
    difficulty: 1,
    description: `## 正の整数か判定する

任意の値を受け取り、それが **1 以上の整数** なら \`true\`、そうでなければ \`false\` を返す関数 \`isPositiveInteger\` を実装してください。

### 入出力例

\`\`\`js
isPositiveInteger(1)        // → true
isPositiveInteger(100)      // → true
isPositiveInteger(0)        // → false
isPositiveInteger(-3)       // → false
isPositiveInteger(3.14)     // → false
isPositiveInteger('5')      // → false  (文字列はダメ)
isPositiveInteger(NaN)      // → false
isPositiveInteger(Infinity) // → false
isPositiveInteger(null)     // → false
isPositiveInteger(true)     // → false
\`\`\`

### 制約

- \`Number.isInteger\` を使う
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `function isPositiveInteger(value) {
  return false;
}
`,
    entryPoints: ["isPositiveInteger"],
    tests: [
      { name: "1", weight: 11, code: "isPositiveInteger(1) === true" },
      { name: "100", weight: 11, code: "isPositiveInteger(100) === true" },
      { name: "0 は false", weight: 11, code: "isPositiveInteger(0) === false" },
      { name: "負数", weight: 11, code: "isPositiveInteger(-3) === false" },
      { name: "小数", weight: 11, code: "isPositiveInteger(3.14) === false" },
      { name: "文字列", weight: 11, code: "isPositiveInteger('5') === false" },
      { name: "NaN", weight: 11, code: "isPositiveInteger(NaN) === false" },
      {
        name: "Infinity",
        weight: 11,
        code: "isPositiveInteger(Infinity) === false",
      },
      {
        name: "null / true",
        weight: 12,
        code: "isPositiveInteger(null) === false && isPositiveInteger(true) === false",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "isInteger", label: "Number.isInteger を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 10-3: 端数処理
  // ────────────────────────────────────────────────
  {
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
    entryPoints: ["roundTo"],
    tests: [
      { name: "1.235 → 1.24", weight: 14, code: "roundTo(1.235, 2) === 1.24" },
      {
        name: "3.14159 → 3.14",
        weight: 14,
        code: "roundTo(3.14159, 2) === 3.14",
      },
      {
        name: "3.14159 → 3.1416",
        weight: 14,
        code: "roundTo(3.14159, 4) === 3.1416",
      },
      {
        name: "2.5 → 3",
        weight: 15,
        code: "roundTo(2.5, 0) === 3",
      },
      {
        name: "-2.5 → -2",
        weight: 14,
        code: "roundTo(-2.5, 0) === -2",
      },
      { name: "0桁丸め", weight: 14, code: "roundTo(123.456, 0) === 123" },
      {
        name: "浮動小数の罠",
        weight: 15,
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
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 10-4: 日数差を求める
  // ────────────────────────────────────────────────
  {
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
    entryPoints: ["daysBetween"],
    tests: [
      {
        name: "1日後",
        weight: 18,
        code: "daysBetween('2024-01-01', '2024-01-02') === 1",
      },
      {
        name: "同日",
        weight: 18,
        code: "daysBetween('2024-01-01', '2024-01-01') === 0",
      },
      {
        name: "1ヶ月前 (-31)",
        weight: 18,
        code: "daysBetween('2024-02-01', '2024-01-01') === -31",
      },
      {
        name: "うるう年 365日",
        weight: 18,
        code: "daysBetween('2024-01-01', '2024-12-31') === 365",
      },
      {
        name: "不正入力は NaN",
        weight: 14,
        code: "Number.isNaN(daysBetween('not-a-date', '2024-01-01'))",
      },
      {
        name: "戻り値は整数",
        weight: 14,
        code: "Number.isInteger(daysBetween('2024-03-01', '2024-04-01'))",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
