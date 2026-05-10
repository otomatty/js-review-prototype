import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const isBlank: Assignment = {
  id: "is-blank",
  topicId: "control-flow",
  title: "空とみなせる値を判定する",
  difficulty: 2,
  description: `## 空とみなせる値を判定する

任意の値を受け取り、「**空**」とみなせる場合に \`true\`、そうでなければ \`false\` を返す関数 \`isBlank\` を実装してください。

「空」の定義:

- \`null\` または \`undefined\`
- 空文字 \`''\` または **空白だけの文字列**（\`'  '\` や \`'\\n\\t'\`）
- 空配列 \`[]\`
- 空オブジェクト \`{}\` （プロパティ 0 個）

「空ではない」例:

- \`0\`, \`false\`, \`NaN\` は **空ではない**（プリミティブとしては値がある）
- \`'  a  '\`（中身がある）
- \`[null]\`（要素 1 個）
- \`{ a: undefined }\`（キーが 1 個）

### 入出力例

\`\`\`js
isBlank(null)        // → true
isBlank(undefined)   // → true
isBlank('')          // → true
isBlank('   ')       // → true
isBlank([])          // → true
isBlank({})          // → true

isBlank(0)           // → false
isBlank(false)       // → false
isBlank(NaN)         // → false
isBlank('a')         // → false
isBlank([null])      // → false
isBlank({a:undefined}) // → false
\`\`\`

### 制約

- \`var\` は使わない
- 真偽値で短絡的に判定（\`!value\`）すると \`0\` や \`false\` を巻き込んで誤検知することに注意
`,
  starterCode: `function isBlank(value) {
  return false;
}
`,
  solution: `function isBlank(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
`,
  badSolutions: [
    {
      description: "!value で短絡判定すると 0 や false を空扱いしてしまう",
      code: `function isBlank(value) {
  if (!value) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
`,
    },
  ],
  entryPoints: ["isBlank"],
  tests: [
    { name: "null", code: "isBlank(null) === true" },
    { name: "undefined", code: "isBlank(undefined) === true" },
    { name: "空文字", code: "isBlank('') === true" },
    { name: "空白のみ", code: "isBlank('   ') === true" },
    {
      name: "改行・タブのみ",
      code: "isBlank('\\n\\t') === true",
    },
    { name: "空配列", code: "isBlank([]) === true" },
    { name: "空オブジェクト", code: "isBlank({}) === true" },
    { name: "0 は false", code: "isBlank(0) === false" },
    { name: "false は false", code: "isBlank(false) === false" },
    { name: "NaN は false", code: "isBlank(NaN) === false" },
    {
      name: "中身ありの配列",
      code: "isBlank([null]) === false",
    },
    {
      name: "キーありのオブジェクト",
      code: "isBlank({a:undefined}) === false",
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
