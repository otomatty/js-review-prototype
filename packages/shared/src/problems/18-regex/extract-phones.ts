import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const extractPhones: Assignment = {
  id: "extract-phones",
  topicId: "regex",
  title: "電話番号を全件抽出する",
  difficulty: 1,
  description: `## 電話番号を全件抽出する

任意の文字列を受け取り、\`123-4567\` のような **「3桁-4桁」形式** の電話番号を **全件** 配列で返す関数 \`extractPhones\` を実装してください。

該当がない場合は空配列 \`[]\` を返します。

### 入出力例

\`\`\`js
extractPhones('連絡先: 090-1234 または 080-5678 まで')
// → ['090-1234', '080-5678']

extractPhones('TEL 090-1234, FAX 03-5678')
// → ['090-1234']   (※ '03-5678' は 2-4 形式なので拾わない)

extractPhones('内線1090-1234 は社内のみ')
// → []             (※ 直前に数字が続くものは拾わない)

extractPhones('電話番号はありません')
// → []

extractPhones('')
// → []
\`\`\`

### 制約

- 正規表現リテラル (\`/.../g\`) を使う
- \`String.prototype.match\` を使う
- マッチがない場合に \`null\` を返さず、必ず配列を返す
- 単語境界 (\`\\b\`) などを使い、長い数字列の途中を拾わないようにする
- \`var\` は使わない
`,
  starterCode: `function extractPhones(text) {
  return [];
}
`,
  solution: `function extractPhones(text) {
  return text.match(/\\b\\d{3}-\\d{4}\\b/g) ?? [];
}
`,
  entryPoints: ["extractPhones"],
  tests: [
    {
      name: "2件抽出",
      code: "JSON.stringify(extractPhones('連絡先: 090-1234 または 080-5678 まで')) === JSON.stringify(['090-1234','080-5678'])",
    },
    {
      name: "桁数違いは無視",
      code: "JSON.stringify(extractPhones('TEL 090-1234, FAX 03-5678')) === JSON.stringify(['090-1234'])",
    },
    {
      name: "長い数字列の途中は拾わない",
      code: "JSON.stringify(extractPhones('内線1090-1234 は社内のみ')) === JSON.stringify([])",
    },
    {
      name: "該当なしは空配列",
      code: "JSON.stringify(extractPhones('電話番号はありません')) === JSON.stringify([])",
    },
    {
      name: "空文字も空配列",
      code: "JSON.stringify(extractPhones('')) === JSON.stringify([])",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "RegExpLiteral",
        label: "正規表現リテラルを使う",
      },
      { kind: "method", name: "match", label: "match を使う" },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
