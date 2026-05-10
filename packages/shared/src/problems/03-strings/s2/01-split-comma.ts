import type { Assignment } from "../../../types.js";

export const s2Ch03SplitComma: Assignment = {
  id: "S2-Ch03-01-split-comma",
  stage: "S2",
  chapterId: "Ch03",
  sequence: 1,
  title: "split で CSV を分割し配列を出力する",
  newConcept: "split は文字列を区切り文字で分けて配列にする",
  estimatedMinutes: 6,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

カンマ区切りの文字列 \`"apple,banana,cherry"\` を \`split(",")\` で分割し、 配列のまま \`console.log\` に渡してください。

## 期待する出力

\`\`\`
["apple","banana","cherry"]
\`\`\`

## ポイント

- \`"a,b,c".split(",")\` → \`["a","b","c"]\`
- 区切り文字を変えれば改行や空白でも分割できます。
`,
  starterCode: `// 1. const csv = "apple,banana,cherry";
// 2. const items = csv.split(",");
// 3. console.log(items);

`,
  tests: [
    {
      name: "stdout が配列表現になる",
      expectedStdout: `["apple","banana","cherry"]`,
    },
  ],
  hints: [
    "`csv.split(\",\")` で配列が返ります。",
    "返り値の配列をそのまま `console.log` に渡します。",
    "解答例:\n```js\nconst csv = \"apple,banana,cherry\";\nconst items = csv.split(\",\");\nconsole.log(items);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "method", name: "split", label: "split を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const csv = "apple,banana,cherry";
const items = csv.split(",");
console.log(items);
`,
  badSolutions: [
    {
      code: `console.log(["apple","banana","cherry"]);
`,
      description: "split を使わず配列を直接書いている",
    },
  ],
  mdnSections: [
    { heading: "String.prototype.split()", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split", pageTitle: "String.prototype.split()" },
  ],
};
