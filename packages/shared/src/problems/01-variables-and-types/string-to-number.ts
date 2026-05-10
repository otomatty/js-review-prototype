import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const stringToNumber: Assignment = {
  id: "string-to-number",
  topicId: "variables-and-types",
  title: "Number() で文字列を数値に変換する",
  difficulty: 1,
  description: `## Number() で文字列を数値に変換する

\`toNumber\` 関数を実装してください。 引数 \`text\` (文字列) を受け取り、 **\`Number()\` 関数** を使って数値に変換し、 結果を返します。

### 学習ポイント

- 文字列の \`'42'\` と数値の \`42\` は **別の型**。
- \`Number(値)\` は値を **数値型** に変換する組み込み関数。
- 数値に変換できないものを渡すと **\`NaN\`** (Not a Number) が返る。 これも \`typeof\` 上は \`'number'\`。
- 変換失敗時の処理（\`NaN\` を null にするなど）は次の章以降で扱う。 ここでは **そのまま \`Number()\` を呼ぶ** だけでよい。

### 入出力例

\`\`\`js
toNumber('42')      // → 42
toNumber('3.14')    // → 3.14
toNumber('-7')      // → -7
toNumber('0')       // → 0
toNumber('hello')   // → NaN   ← 変換失敗
toNumber('')        // → 0     ← 空文字は 0 になる (JS の仕様)
\`\`\`

### 制約

- 必ず \`Number\` を呼ぶ
- \`var\` は使わない
- 結果は数値型 (\`typeof === 'number'\`) であること
`,
  starterCode: `// 文字列を Number() で数値に変換して返す。
//
// 例:
//   toNumber('42')    → 42
//   toNumber('3.14')  → 3.14
//   toNumber('hello') → NaN
//   toNumber('')      → 0
//
// 仕組みの解説:
//   Number(値) は値を数値に変換する組み込み関数。
//   '42' (文字列) を渡すと 42 (数値) が返る。
//
// TODO: return Number(text); を書く
function toNumber(text) {
  return 0;
}
`,
  solution: `function toNumber(text) {
  return Number(text);
}
`,
  badSolutions: [
    {
      description: "Number() ではなく parseInt を使っている (3.14 が 3 になってしまう)",
      code: `function toNumber(text) {
  return parseInt(text, 10);
}
`,
    },
    {
      description: "+ で暗黙変換しているが Number は呼んでいない (この章では明示的な Number() を学ぶ)",
      code: `function toNumber(text) {
  return +text;
}
`,
    },
  ],
  entryPoints: ["toNumber"],
  tests: [
    { name: "整数文字列", code: "toNumber('42') === 42" },
    { name: "小数文字列", code: "Math.abs(toNumber('3.14') - 3.14) < 1e-9" },
    { name: "負の数", code: "toNumber('-7') === -7" },
    { name: "ゼロ", code: "toNumber('0') === 0" },
    {
      name: "変換失敗は NaN",
      code: "Number.isNaN(toNumber('hello'))",
    },
    { name: "空文字は 0 (JS 仕様)", code: "toNumber('') === 0" },
    {
      name: "戻り値の型は 'number'",
      code: "typeof toNumber('42') === 'number'",
    },
  ],
  eslint: {
    rules: {
      ...COMMON_LINT_RULES,
      // +text や 1*text のような暗黙変換を禁止し、 明示的な Number() を学ばせる
      "no-implicit-coercion": ["error", { number: true, boolean: false, string: false }],
    },
  },
  ast: {
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
  mdnSections: [{ heading: "文字列から数値への変換" }],
};
