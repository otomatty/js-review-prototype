import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const isTypeofNullObject: Assignment = {
  id: "is-typeof-null-object",
  topicId: "variables-and-types",
  title: "typeof null === 'object' であることを確かめる",
  difficulty: 1,
  description: `## typeof null === 'object' であることを確かめる

\`isTypeofNullObject\` 関数を実装してください。 引数なしで呼ばれ、 **\`typeof null\` が文字列 \`'object'\` と厳密等価か** を **真偽値** で返します。

(JavaScript の言語仕様の落とし穴を「自分の手」で確かめる練習)

### 学習ポイント

- **真偽値 (boolean)**: \`true\` / \`false\` の 2 通りしかない型。
- **厳密等価 \`===\`**: 値 **と** 型 が両方一致するときだけ \`true\`。
- **typeof null は 'null' でなく 'object'** という JavaScript の歴史的バグが、 仕様として残っている。 これは将来も変わらない。

### 入出力例

\`\`\`js
isTypeofNullObject() // → true   (typeof null は 'object' なので)
\`\`\`

### 制約

- 戻り値はハードコードしない (\`return true;\` だけは禁止)
- \`typeof null === 'object'\` という式を **そのまま return** する
- \`var\` は使わない
`,
  starterCode: `// typeof null が 'object' であることを真偽値で返す。
//
// 例:
//   isTypeofNullObject() → true
//
// 仕組みの解説:
//   typeof 値 は値の型名を文字列で返す。
//   === は値と型の両方が一致するか調べる「厳密等価」。
//   それらを組み合わせると、 真偽値が返る。
//
// TODO: return typeof null === 'object'; を書く
function isTypeofNullObject() {
  return false;
}
`,
  solution: `function isTypeofNullObject() {
  return typeof null === 'object';
}
`,
  badSolutions: [
    {
      description: "true を直接返してしまっている (検証式を書いていない)",
      code: `function isTypeofNullObject() {
  return true;
}
`,
    },
    {
      description: "== を使ってしまう (eqeqeq に違反)",
      code: `function isTypeofNullObject() {
  return typeof null == 'object';
}
`,
    },
  ],
  entryPoints: ["isTypeofNullObject"],
  tests: [
    { name: "true を返す", code: "isTypeofNullObject() === true" },
    {
      name: "戻り値の型は 'boolean'",
      code: "typeof isTypeofNullObject() === 'boolean'",
    },
  ],
  eslint: {
    rules: {
      ...COMMON_LINT_RULES,
      // ハードコード防止: return true; / return false; を直接禁止
      "no-restricted-syntax": [
        "error",
        {
          selector: "ReturnStatement > Literal[value=true]",
          message:
            "true を直接返さず、 typeof null === 'object' という式を return してください",
        },
        {
          selector: "ReturnStatement > Literal[value=false]",
          message:
            "false を直接返さず、 typeof null === 'object' という式を return してください",
        },
      ],
    },
  },
  ast: {
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
  mdnSections: [{ heading: "データ型" }],
};
