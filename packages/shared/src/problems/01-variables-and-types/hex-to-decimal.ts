import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const hexToDecimal: Assignment = {
  id: "hex-to-decimal",
  topicId: "variables-and-types",
  title: "16 進数文字列を 10 進数に変換する",
  difficulty: 1,
  description: `## 16 進数文字列を 10 進数に変換する

\`hexToDecimal\` 関数を実装してください。 引数 \`hex\` (16 進数の文字列、 例: \`'FF'\` や \`'1a'\`) を受け取り、 対応する **10 進数の数値** を返します。

### 学習ポイント

- **整数リテラル** には 10 進以外の表記もある:
  - \`0xFF\` → 255 (16 進)
  - \`0b101\` → 5 (2 進)
  - \`0o17\` → 15 (8 進)
- 文字列を解釈して整数化する **\`parseInt(文字列, 基数)\`** は、 基数を指定する第 2 引数を **必ず** 渡す習慣を付ける。
  - \`parseInt('FF', 16)\` → 255 (16 進として解釈)
  - 基数省略は環境依存挙動になるので **エラー扱い** ( \`radix\` lint ルール) にしている。

### 入出力例

\`\`\`js
hexToDecimal('0')    // → 0
hexToDecimal('A')    // → 10
hexToDecimal('FF')   // → 255
hexToDecimal('1a')   // → 26    (大文字小文字どちらでも OK)
hexToDecimal('100')  // → 256
\`\`\`

### 制約

- \`parseInt(hex, 16)\` を使う
- \`var\` は使わない
- \`#FF0000\` のような **接頭辞付きの色コード** は範囲外 (この問題では純粋な 16 進文字列のみ)。 接頭辞付きは第 6 章 (文字列) で扱う。
`,
  starterCode: `// 16 進数の文字列を 10 進数の数値に変換して返す。
//
// 例:
//   hexToDecimal('FF') → 255
//   hexToDecimal('A')  → 10
//   hexToDecimal('1a') → 26
//
// 仕組みの解説:
//   parseInt(文字列, 基数) は文字列を整数として解釈する。
//   基数を 16 にすると 16 進として解釈する。
//   parseInt('FF', 16)  → 255
//   parseInt('1a', 16)  → 26
//
//   基数を省略するのは危険なので、 必ず 16 を明示する (radix ルール)。
//
// TODO: return parseInt(hex, 16); を書く
function hexToDecimal(hex) {
  return 0;
}
`,
  solution: `function hexToDecimal(hex) {
  return parseInt(hex, 16);
}
`,
  badSolutions: [
    {
      description: "基数を省略している (radix ルールに違反)",
      code: `function hexToDecimal(hex) {
  return parseInt(hex);
}
`,
    },
    {
      description: "Number() を使うと '1a' が NaN になってしまう",
      code: `function hexToDecimal(hex) {
  return Number(hex);
}
`,
    },
  ],
  entryPoints: ["hexToDecimal"],
  tests: [
    { name: "ゼロ", code: "hexToDecimal('0') === 0" },
    { name: "1 桁の英字", code: "hexToDecimal('A') === 10" },
    { name: "2 桁の最大値", code: "hexToDecimal('FF') === 255" },
    { name: "小文字も OK", code: "hexToDecimal('1a') === 26" },
    { name: "3 桁", code: "hexToDecimal('100') === 256" },
  ],
  eslint: {
    rules: {
      ...COMMON_LINT_RULES,
      radix: "error",
    },
  },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    { heading: "整数リテラル" },
    { heading: "文字列から数値への変換" },
  ],
};
