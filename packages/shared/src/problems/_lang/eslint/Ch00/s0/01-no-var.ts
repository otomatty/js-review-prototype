import type { Assignment } from "../../../../../types.js";

/**
 * ESLint ルール設計 入門課題 (#111)。
 *
 * 学習者は `eslint.config.js` に `no-var` ルールを有効化する。 採点では正解コード
 * (let / const のみ) で違反 0 件、 var を含む各 mutant で `no-var` の違反 1 件以上を確認する。
 */
export const s0EslintCh00NoVar: Assignment = {
  id: "S0-El-Ch00-01-no-var",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 101,
  title: "ESLint: var を禁止するルールを設計する",
  newConcept: "ESLint の rules を有効化してアンチパターンを検出する",
  estimatedMinutes: 6,
  difficulty: 1,
  testKind: "eslint-config",
  language: "eslint",
  entryFile: "eslint.config.js",
  starterFiles: [
    {
      path: "eslint.config.js",
      content: `// var の使用を禁止する ESLint ルールを設定してください。
// module.exports に { rules: { ... } } を export します。

module.exports = {
  rules: {
    // ここにルールを書く
  },
};
`,
    },
  ],
  description: `## やること

ES2015 以降の JavaScript では \`var\` の代わりに \`let\` / \`const\` を使うのが推奨です。
\`eslint.config.js\` に **\`var\` を使っているコードに警告を出すルール** を設定してください。

採点では以下を確認します:

1. **正解コード** (let / const のみ) に対して違反 0 件
2. **各 mutant** (var を含むコード) に対して \`no-var\` の違反が 1 件以上

## 使えるルール

- \`"no-var": "error"\` … \`var\` 宣言を禁止
- 値は \`"off"\` / \`"warn"\` / \`"error"\` または数値 \`0\` / \`1\` / \`2\` を指定できます
`,
  tests: [],
  mutation: {
    referenceImpl: `const greeting = "hello";
let counter = 0;
counter = counter + 1;
console.log(greeting, counter);
`,
    mutants: [
      {
        id: "m1",
        description: "トップレベルで var を使用",
        expectedRuleId: "no-var",
        code: `var greeting = "hello";
let counter = 0;
console.log(greeting, counter);
`,
      },
      {
        id: "m2",
        description: "for ループの初期化で var を使用",
        expectedRuleId: "no-var",
        code: `const items = [1, 2, 3];
for (var i = 0; i < items.length; i++) {
  console.log(items[i]);
}
`,
      },
      {
        id: "m3",
        description: "関数内のローカル変数で var を使用",
        expectedRuleId: "no-var",
        code: `function double(n) {
  var result = n * 2;
  return result;
}
console.log(double(5));
`,
      },
    ],
  },
  hints: [
    "rules に `\"no-var\": \"error\"` を追加するだけでクリアできます。",
    "ESLint の rules オブジェクトのキーはルール名 (文字列)、 値は severity (`\"error\"` / `\"warn\"` / `\"off\"`) または `[severity, options]` の配列です。",
  ],
  solution: `module.exports = {
  rules: {
    "no-var": "error",
  },
};
`,
  mdnSections: [
    {
      heading: "var",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/var",
      pageTitle: "var",
    },
    {
      heading: "let",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let",
      pageTitle: "let",
    },
  ],
};
