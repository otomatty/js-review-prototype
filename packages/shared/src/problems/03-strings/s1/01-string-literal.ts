import type { Assignment } from "../../../types.js";

export const s1Ch03StringLiteral: Assignment = {
  id: "S1-Ch03-01-string-literal",
  stage: "S1",
  chapterId: "Ch03",
  sequence: 1,
  title: "文字列リテラルを書く",
  newConcept: "文字列はダブルクォートかシングルクォートで囲む",
  estimatedMinutes: 4,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

文字列 \`"こんにちは"\` を出力してください。 文字列は \`"\` (ダブルクォート) か \`'\` (シングルクォート) で囲みます。

## 期待する出力

\`\`\`
こんにちは
\`\`\`
`,
  starterCode: `// console.log("こんにちは"); と書く
// "" または '' で囲むのを忘れない

`,
  tests: [
    {
      name: "stdout が こんにちは になる",
      expectedStdout: "こんにちは",
    },
  ],
  hints: [
    "文字列は **クォートで囲む** 必要があります。",
    "`console.log(\"こんにちは\");` のように書きます。",
    "解答例:\n```js\nconsole.log(\"こんにちは\");\n```",
  ],
  solution: `console.log("こんにちは");
`,
  mdnSections: [
    { heading: "文字列リテラル" },
  ],
};
