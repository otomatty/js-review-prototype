import type { Assignment } from "../../../types.js";

export const s1Ch12TypoVariable: Assignment = {
  id: "S1-Ch12-05-typo-variable",
  stage: "S1",
  chapterId: "Ch12",
  sequence: 5,
  title: "変数名のタイポを直す",
  newConcept: "変数名の綴り間違いは ReferenceError になる。 宣言と参照で名前を一致させる",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

下のコードは \`user\` を宣言しているのに、 出力時に \`usre\` (= 綴り違い) を使っているため **エラー** になります。 \`usre\` を \`user\` に直してください。

## 期待する出力

\`\`\`
Taro
\`\`\`

## ポイント

- 宣言していない変数を使うと \`ReferenceError: usre is not defined\` のようなエラーが出ます。
- まず宣言した名前と参照名が **完全に一致** しているかを確認するのがデバッグの第一歩。
`,
  starterCode: `// バグ: 下の console.log は宣言していない名前を参照して ReferenceError になる
// 宣言した変数と綴りを一致させて直す

const user = "Taro";
console.log(usre);
`,
  tests: [
    {
      name: "stdout が Taro になる",
      expectedStdout: "Taro",
    },
  ],
  hints: [
    "宣言は `const user = \"Taro\";`、 でも参照は `usre` になっています。",
    "綴りを `user` に揃えれば動きます。",
    "解答例:\n```js\nconst user = \"Taro\";\nconsole.log(user);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "console-log",
          argument: { kind: "identifier", name: "user" },
          label: "user 変数を console.log に渡す",
        },
      ],
    },
  },
  solution: `const user = "Taro";
console.log(user);
`,
};
