import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const typeNameOf: Assignment = {
  id: "type-name-of",
  topicId: "variables-and-types",
  title: "typeof で値の型名 (英語) をそのまま返す",
  difficulty: 1,
  description: `## typeof で値の型名 (英語) をそのまま返す

\`typeNameOf\` 関数を実装してください。 引数 \`value\` を受け取り、 **\`typeof\` 演算子の結果**（英語の文字列）をそのまま返します。

### 学習ポイント

- **\`typeof 値\`** で、 その値の「型」を表す **文字列** が得られる。
- 結果は \`'number'\`, \`'string'\`, \`'boolean'\`, \`'undefined'\`, \`'object'\`, \`'function'\`, \`'symbol'\`, \`'bigint'\` のいずれか。
- ここでは加工せず **そのまま返す** だけ。 日本語に直したり \`null\` の特別扱いをしたりは、 第 3 章 (条件分岐) で学ぶ。

### 入出力例

\`\`\`js
typeNameOf(42)        // → 'number'
typeNameOf('hi')      // → 'string'
typeNameOf(true)      // → 'boolean'
typeNameOf(undefined) // → 'undefined'
typeNameOf(null)      // → 'object'   ← JS の歴史的仕様 (落とし穴)
typeNameOf({})        // → 'object'
typeNameOf(() => 1)   // → 'function'
\`\`\`

### 制約

- \`typeof\` を必ず使う
- \`var\` は使わない
- if 文や三項演算子は使わない (この章では条件分岐は出てこない)
`,
  starterCode: `// 受け取った値の型名 (英語) をそのまま返す。
//
// 例:
//   typeNameOf(42)   → 'number'
//   typeNameOf('hi') → 'string'
//   typeNameOf(null) → 'object'   ← 落とし穴: typeof null は 'object'
//
// 仕組みの解説:
//   typeof 値 と書くと、 値の型を表す英語の文字列が得られる。
//   typeof 42         → 'number'
//   typeof 'hello'    → 'string'
//   typeof undefined  → 'undefined'
//
// TODO: return typeof value; を書く
function typeNameOf(value) {
  return '';
}
`,
  solution: `function typeNameOf(value) {
  return typeof value;
}
`,
  badSolutions: [
    {
      description: "typeof を使わず文字列を直接返してしまっている",
      code: `function typeNameOf(value) {
  return 'number';
}
`,
    },
    {
      description: "value を文字列化しただけで型名にはなっていない",
      code: `function typeNameOf(value) {
  return String(value);
}
`,
    },
  ],
  entryPoints: ["typeNameOf"],
  tests: [
    { name: "数値", code: "typeNameOf(42) === 'number'" },
    { name: "文字列", code: "typeNameOf('hi') === 'string'" },
    { name: "真偽値", code: "typeNameOf(true) === 'boolean'" },
    { name: "undefined", code: "typeNameOf(undefined) === 'undefined'" },
    {
      name: "null は 'object' (落とし穴)",
      code: "typeNameOf(null) === 'object'",
    },
    { name: "オブジェクト", code: "typeNameOf({}) === 'object'" },
    { name: "関数", code: "typeNameOf(() => 1) === 'function'" },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [{ heading: "データ型" }],
};
