import type { Assignment } from "../../../types.js";

export const s1Ch12PrecedenceBug: Assignment = {
  id: "S1-Ch12-04-precedence-bug",
  stage: "S1",
  chapterId: "Ch12",
  sequence: 4,
  title: "演算子の優先順位を直す",
  newConcept: "* は + より先に計算される。 順序を変えるには ( ) で囲む",
  estimatedMinutes: 5,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

下のコードは「2 と 3 を足してから 4 を掛ける」 つもりですが、 \`2 + 3 * 4\` と書いてあるため **掛け算が先** に計算されてしまい、 結果が \`14\` になっています。

期待する結果は **\`20\`** です。 括弧 \`( )\` を追加して、 足し算が先に計算されるように直してください。

## 期待する出力

\`\`\`
20
\`\`\`

## ポイント

- \`*\` と \`/\` は \`+\` と \`-\` より **先に** 計算されます (= 優先順位が高い)。
- 順序を変えたいときは **括弧** で先にしたい部分を囲みます。
`,
  scaffolds: {
    L0: "",
    L1: `// 2 + 3 を先に計算したい。 括弧で囲む
console.log(2 + 3 * 4);
`,
    L2: `// バグ: * が + より先に計算されるため 2 + 3 * 4 = 2 + 12 = 14 になる
// (2 + 3) * 4 になるよう括弧を追加する

console.log(2 + 3 * 4);
`,
    L3: `console.log((____ + ____) * ____);
`,
  },
  tests: [
    {
      name: "stdout が 20 になる",
      expectedStdout: "20",
    },
  ],
  hints: [
    "数学と同じく、 掛け算は足し算より先に計算されます。",
    "`(2 + 3)` のように括弧で囲むと、 そこが先に計算されます。",
    "解答例:\n```js\nconsole.log((2 + 3) * 4);\n```",
  ],
  solution: `console.log((2 + 3) * 4);
`,
};
