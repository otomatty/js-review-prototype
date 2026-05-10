import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const normalizeText: Assignment = {
  id: "normalize-text",
  topicId: "regex",
  title: "テキストを正規化する",
  difficulty: 3,
  description: `## テキストを正規化する

任意の文字列に対して、次の処理を **1関数** \`normalizeText\` で行ってください。

1. **全角英数 (\`Ａ-Ｚ\` / \`ａ-ｚ\` / \`０-９\`) を半角** に変換する
2. **連続する空白文字を 1 個の半角スペース** にまとめる (タブ・改行・全角スペース U+3000 もまとめて空白とみなす)
3. **前後の空白をトリム** する

### 入出力例

\`\`\`js
normalizeText('  Ｈｅｌｌｏ Ｗｏｒｌｄ  ')
// → 'Hello World'

normalizeText('a\\u3000\\u3000b')
// → 'a b'                  (全角スペースも空白として扱う)

normalizeText('a   b\\t\\nc')
// → 'a b c'

normalizeText('Ａ１-Ｂ２')
// → 'A1-B2'

normalizeText('   ')
// → ''

normalizeText('')
// → ''
\`\`\`

### 制約

- 正規表現リテラルを使う (全角→半角の変換と空白まとめの両方)
- \`String.prototype.replace\` と \`String.prototype.trim\` を使う
- \`var\` は使わない
- \`for\` 文と \`while\` 文は使わない
`,
  starterCode: `function normalizeText(input) {
  return input;
}
`,
  solution: `function normalizeText(input) {
  const halfWidth = input.replace(/[\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF10-\\uFF19]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xFEE0),
  );
  return halfWidth.replace(/\\s+/g, ' ').trim();
}
`,
  entryPoints: ["normalizeText"],
  tests: [
    {
      name: "全角英字+前後空白",
      code: "normalizeText('  Ｈｅｌｌｏ Ｗｏｒｌｄ  ') === 'Hello World'",
    },
    {
      name: "全角スペースの連続",
      code: "normalizeText('a\\u3000\\u3000b') === 'a b'",
    },
    {
      name: "タブ・改行を含む空白",
      code: "normalizeText('a   b\\t\\nc') === 'a b c'",
    },
    {
      name: "全角英数の混在",
      code: "normalizeText('Ａ１-Ｂ２') === 'A1-B2'",
    },
    {
      name: "空白のみ",
      code: "normalizeText('   ') === ''",
    },
    {
      name: "空文字",
      code: "normalizeText('') === ''",
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
      { kind: "method", name: "replace", label: "replace を使う" },
      { kind: "method", name: "trim", label: "trim を使う" },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      {
        kind: "node",
        nodeType: "WhileStatement",
        label: "while 文は使わない",
      },
    ],
  },
};
