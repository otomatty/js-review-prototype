import type { Assignment } from "../../../types.js";

export const s1Ch12TypoMethod: Assignment = {
  id: "S1-Ch12-03-typo-method",
  stage: "S1",
  chapterId: "Ch12",
  sequence: 3,
  title: "メソッド名のタイポを直す",
  newConcept: "メソッド名の綴り間違いはエラーになる。 エラーメッセージから直す",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

下のコードは \`tolwerCase\` という **存在しないメソッド** を呼んでいて、 実行時にエラーになります。 正しい綴りの \`toLowerCase\` に直してください。

## 期待する出力

\`\`\`
hello
\`\`\`

## ポイント

- メソッド名の綴り間違いは実行時 (= コードを動かしたとき) にエラーになります。 「\`...is not a function\`」 のようなエラーが出たら、 まず綴りを疑います。
- JavaScript のメソッド名は **大文字小文字を区別** します。
`,
  starterCode: `// バグ: tolwerCase というメソッドは存在しない (TypeError になる)
// 正しい綴り toLowerCase に直す

console.log("HELLO".tolwerCase());
`,
  tests: [
    {
      name: "stdout が hello になる",
      expectedStdout: "hello",
    },
  ],
  hints: [
    "`tolwerCase` は綴りが間違っています。 正しいのは `toLowerCase`。",
    "メソッド名は **大文字小文字を区別** します。 `Lower` の **L** は大文字、 他は小文字です。",
    "解答例:\n```js\nconsole.log(\"HELLO\".toLowerCase());\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "method", name: "toLowerCase", label: "toLowerCase を呼ぶ" },
      ],
    },
  },
  solution: `console.log("HELLO".toLowerCase());
`,
  mdnSections: [
    { heading: "TypeError: ... is not a function" },
  ],
};
