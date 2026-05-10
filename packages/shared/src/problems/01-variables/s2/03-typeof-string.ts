import type { Assignment } from "../../../types.js";

export const s2Ch01TypeofString: Assignment = {
  id: "S2-Ch01-03-typeof-string",
  stage: "S2",
  chapterId: "Ch01",
  sequence: 3,
  title: "typeof で文字列の型を確認する",
  newConcept: "文字列の型は 'string' という文字列で返る",
  estimatedMinutes: 4,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

\`const name = "Taro";\` を宣言し、 \`typeof name\` の結果を出力してください。

## 期待する出力

\`\`\`
string
\`\`\`

## ポイント

- 文字列の \`typeof\` は \`"string"\` です。
- \`typeof "Taro"\` のように直接値に対しても使えます。
`,
  starterCode: `// 1. const name = "Taro"; を宣言する
// 2. console.log(typeof name); で型を出力する

`,
  tests: [
    {
      name: "stdout が string になる",
      expectedStdout: "string",
    },
  ],
  hints: [
    "値が文字列なら、 `typeof` は `\"string\"` を返します。",
    "`typeof name` の結果を `console.log` に渡します。",
    "解答例:\n```js\nconst name = \"Taro\";\nconsole.log(typeof name);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "const-declaration",
          name: "name",
          label: "const name を宣言する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const name = "Taro";
console.log(typeof name);
`,
  badSolutions: [
    {
      code: `console.log("string");
`,
      description: "typeof を使わずに答えを直接出力している",
    },
  ],
  mdnSections: [
    { heading: "typeof", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof", pageTitle: "typeof" },
  ],
};
