import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const describeType: Assignment = {
  id: "describe-type",
  topicId: "control-flow",
  title: "if-else で値の種類を答える",
  difficulty: 1,
  description: `## if-else で値の種類を答える

任意の値 \`value\` を受け取り、その種類を表す日本語文字列を返す関数 \`describeType\` を実装してください。

| 入力 | 戻り値 |
|---|---|
| 数値（\`NaN\` を含む） | \`"数値"\` |
| 文字列 | \`"文字列"\` |
| 真偽値 (\`true\` / \`false\`) | \`"真偽値"\` |
| \`null\` / \`undefined\` | \`"なし"\` |
| それ以外（オブジェクト・配列・関数 など） | \`"その他"\` |

### 学習ポイント

- **if 文** で複数の条件を順に判定する基本パターン。
- 早期 return ( \`if (条件) return ...;\` ) を並べると、 入れ子が深くならずに読みやすい。
- \`typeof value\` は値の種類を文字列で返します（\`'number'\`, \`'string'\`, \`'boolean'\`, \`'undefined'\`, \`'object'\`, \`'function'\`, \`'symbol'\`, \`'bigint'\`）。
- **重要な落とし穴: \`typeof null\` は \`'null'\` ではなく \`'object'\` を返します**。 そのため \`null\` は \`typeof\` より先に \`value === null\` で判定するのが定石です。

### 入出力例

\`\`\`js
describeType(42)         // → '数値'
describeType(NaN)        // → '数値'   (NaN も typeof 上は 'number')
describeType('hi')       // → '文字列'
describeType(true)       // → '真偽値'
describeType(null)       // → 'なし'
describeType(undefined)  // → 'なし'
describeType([1, 2])     // → 'その他'
describeType({})         // → 'その他'
describeType(() => 1)    // → 'その他'
\`\`\`

### 制約

- if 文を使って分岐する
- \`==\` / \`!=\` は使わない（厳密比較 \`===\` を使う）
- \`var\` は使わない
`,
  starterCode: `// 値の種類 (型) を表す日本語文字列を返す。
//
// | 入力                              | 戻り値    |
// |-----------------------------------|-----------|
// | 数値 (NaN を含む)                  | "数値"     |
// | 文字列                             | "文字列"   |
// | 真偽値 (true / false)              | "真偽値"   |
// | null / undefined                  | "なし"     |
// | それ以外 (オブジェクト・配列・関数)  | "その他"   |
//
// 重要な落とし穴:
//   typeof null は 'null' ではなく 'object' を返す (JavaScript の仕様)。
//   そのため、null は typeof より先に value === null で判定するのが定石。
function describeType(value) {
  // TODO 1: value === null なら 'なし' を返す
  // TODO 2: typeof value で 'number' / 'string' / 'boolean' / 'undefined' を分類する
  //         ('number' → '数値', 'string' → '文字列', ...)
  // TODO 3: 上記のいずれにも該当しなければ 'その他'
  return 'その他';
}
`,
  solution: `function describeType(value) {
  if (value === null) return 'なし';
  const t = typeof value;
  if (t === 'number') return '数値';
  if (t === 'string') return '文字列';
  if (t === 'boolean') return '真偽値';
  if (t === 'undefined') return 'なし';
  return 'その他';
}
`,
  badSolutions: [
    {
      description: "null を先にチェックしておらず、'その他' になってしまう",
      code: `function describeType(value) {
  const t = typeof value;
  if (t === 'number') return '数値';
  if (t === 'string') return '文字列';
  if (t === 'boolean') return '真偽値';
  if (t === 'undefined') return 'なし';
  return 'その他';
}
`,
    },
    {
      description: "== を使ってしまう (eqeqeq に違反)",
      code: `function describeType(value) {
  if (value == null) return 'なし';
  const t = typeof value;
  if (t == 'number') return '数値';
  if (t == 'string') return '文字列';
  if (t == 'boolean') return '真偽値';
  return 'その他';
}
`,
    },
  ],
  entryPoints: ["describeType"],
  tests: [
    { name: "数値", code: "describeType(42) === '数値'" },
    { name: "NaN も数値", code: "describeType(NaN) === '数値'" },
    { name: "文字列", code: "describeType('hi') === '文字列'" },
    { name: "真偽値", code: "describeType(true) === '真偽値'" },
    { name: "null は 'なし'", code: "describeType(null) === 'なし'" },
    {
      name: "undefined は 'なし'",
      code: "describeType(undefined) === 'なし'",
    },
    {
      name: "配列は 'その他'",
      code: "describeType([1, 2]) === 'その他'",
    },
    {
      name: "オブジェクトは 'その他'",
      code: "describeType({}) === 'その他'",
    },
    {
      name: "関数は 'その他'",
      code: "describeType(() => 1) === 'その他'",
    },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    forbidden: [
      { kind: "loose-eq", label: "== / != は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
  mdnSections: [
    {
      heading: "if...else 文",
    },
    {
      heading: "データ型",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types",
    },
  ],
};
