import type { Assignment } from "../../../types.js";

export const s1Ch12LogIntermediate: Assignment = {
  id: "S1-Ch12-01-log-intermediate",
  stage: "S1",
  chapterId: "Ch12",
  sequence: 1,
  title: "console.log で中間値を確認する",
  newConcept: "計算の途中で console.log を入れて値を確かめる",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

下のコードは \`x + y\` の最終結果しか出力しません。 途中の \`x\` の値を **計算結果の前** に確認できるよう、 \`console.log(x);\` を 1 行追加してください。

最終的に **2 行** 出力されるようにします。

## 期待する出力

\`\`\`
12
20
\`\`\`

## ポイント

- バグを探すときは「期待した値と違う場所はどこか」 を切り分ける必要があります。 \`console.log\` を要所要所に入れると、 中間値が見えて切り分けに役立ちます。
`,
  starterCode: `// 最終結果を出している行の手前に、 中間値 (足し算する前の値) を確認するための
// console.log を 1 行追加する

const x = 12;
const y = 8;
console.log(x + y);
`,
  tests: [
    {
      name: "stdout が 12 と 20 の 2 行になる",
      expectedStdout: "12\n20",
    },
  ],
  hints: [
    "中間値を見たい位置に `console.log(変数名);` を 1 行追加します。",
    "今回は `x` の値を確認したいので、 `console.log(x + y);` の **前** に `console.log(x);` を入れます。",
    "解答例:\n```js\nconst x = 12;\nconst y = 8;\nconsole.log(x);\nconsole.log(x + y);\n```",
  ],
  solution: `const x = 12;
const y = 8;
console.log(x);
console.log(x + y);
`,
};
