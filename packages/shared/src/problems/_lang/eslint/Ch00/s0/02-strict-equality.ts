import type { Assignment } from "../../../../../types.js";

/**
 * ESLint ルール設計 第 2 問 (#111)。
 *
 * 複数ルール (`eqeqeq` + `no-var`) を組み合わせる課題。 mutant ごとに `expectedRuleId` を
 * 指定してあるので、 学習者が片方のルールしか有効化していないと特定 mutant で失敗する。
 */
export const s0EslintCh00StrictEquality: Assignment = {
  id: "S0-El-Ch00-02-strict-equality",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 102,
  title: "ESLint: == と var を同時に禁止する",
  newConcept: "複数ルールを組み合わせて複数種類のバグを検出する",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "eslint-config",
  language: "eslint",
  entryFile: "eslint.config.js",
  starterFiles: [
    {
      path: "eslint.config.js",
      content: `// 緩い比較 (== / !=) と var の使用を両方禁止するルールを設定してください。

module.exports = {
  rules: {
    // ここに 2 つのルールを書く
  },
};
`,
    },
  ],
  description: `## やること

JavaScript には型変換を伴う \`==\` (緩い比較) と、 型変換なしの \`===\` (厳密比較) があります。
\`==\` はバグの温床になりやすいので、 ルールで \`===\` / \`!==\` を強制しましょう。
さらに前問同様 \`var\` も禁止します。

採点では以下を確認します:

1. **正解コード** (\`===\` / let / const のみ) に対して違反 0 件
2. **緩い比較を含む mutant** に対して \`eqeqeq\` の違反が出ること
3. **var を含む mutant** に対して \`no-var\` の違反が出ること

## 使えるルール

- \`"eqeqeq": "error"\` … \`==\` / \`!=\` を禁止し \`===\` / \`!==\` を強制
- \`"no-var": "error"\` … \`var\` 宣言を禁止
`,
  tests: [],
  mutation: {
    referenceImpl: `const x = 5;
const y = "5";
if (x === Number(y)) {
  console.log("equal");
}
let count = 0;
count = count + 1;
console.log(count);
`,
    mutants: [
      {
        id: "m1",
        description: "== で比較している",
        expectedRuleId: "eqeqeq",
        code: `const x = 5;
const y = "5";
if (x == y) {
  console.log("equal");
}
`,
      },
      {
        id: "m2",
        description: "!= で比較している",
        expectedRuleId: "eqeqeq",
        code: `const a = null;
if (a != undefined) {
  console.log("present");
}
`,
      },
      {
        id: "m3",
        description: "var を使用している",
        expectedRuleId: "no-var",
        code: `var count = 0;
count = count + 1;
console.log(count);
`,
      },
      {
        id: "m4",
        description: "== と var を両方使用しているが eqeqeq で検出する",
        expectedRuleId: "eqeqeq",
        code: `var flag = 0;
if (flag == false) {
  console.log("falsy");
}
`,
      },
    ],
  },
  hints: [
    "rules オブジェクトに `\"no-var\"` と `\"eqeqeq\"` の 2 件を入れます。",
    "`expectedRuleId` は「この mutant ではこのルールが反応すべき」 と採点側が想定しているルール名です。 2 つを両方有効化すれば全 mutant 撃破できます。",
  ],
  solution: `module.exports = {
  rules: {
    "no-var": "error",
    "eqeqeq": "error",
  },
};
`,
  mdnSections: [
    {
      heading: "等価性の比較と同一性",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness",
      pageTitle: "等価性の比較と同一性",
    },
  ],
};
