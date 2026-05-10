import type { Assignment } from "../../../types.js";

export const s1Ch12StringVsNumber: Assignment = {
  id: "S1-Ch12-02-string-vs-number",
  stage: "S1",
  chapterId: "Ch12",
  sequence: 2,
  title: "文字列と数値の取り違えを直す",
  newConcept: "文字列同士の + は連結、 数値同士の + は加算。 Number() で文字列を数値にできる",
  estimatedMinutes: 7,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下のコードは \`"3" + 4\` を計算していて、 結果は数学的な \`7\` ではなく **文字列の連結 \`"34"\`** になっています。 \`Number(価格)\` のように \`Number(...)\` で文字列を数値に変換し、 結果が **\`7\`** になるよう直してください。

## 期待する出力

\`\`\`
7
\`\`\`

## ポイント

- JavaScript では \`"3" + 4\` は \`"34"\` (文字列連結)、 \`3 + 4\` は \`7\` (加算) になります。
- 文字列を数値に変えるには \`Number(値)\` を使います。 例: \`Number("3")\` は \`3\`。
`,
  scaffolds: {
    L0: "",
    L1: `// "3" を Number() で数値に変えてから足す
const a = "3";
const b = 4;
console.log(a + b);
`,
    L2: `// バグ: "3" は文字列なので "3" + 4 は "34" になってしまう
// Number(a) で数値に変えてから足し算するように修正

const a = "3";
const b = 4;
console.log(a + b);
`,
    L3: `const a = "3";
const b = 4;
console.log(____(a) + b);
`,
  },
  tests: [
    {
      name: "stdout が 7 になる",
      expectedStdout: "7",
    },
  ],
  hints: [
    "`a` は文字列 `\"3\"`。 `a + b` では文字列連結が起きてしまいます。",
    "`Number(a)` で `\"3\"` を `3` に変換すれば、 加算になります。",
    "解答例:\n```js\nconst a = \"3\";\nconst b = 4;\nconsole.log(Number(a) + b);\n```",
  ],
  solution: `const a = "3";
const b = 4;
console.log(Number(a) + b);
`,
  mdnSections: [
    { heading: "Number()" },
  ],
};
