import type { Assignment } from "../../../types.js";

export const s1Ch12ArrayOffByOne: Assignment = {
  id: "S1-Ch12-07-array-off-by-one",
  stage: "S1",
  chapterId: "Ch12",
  sequence: 7,
  title: "配列の添字を 1 つずらす",
  newConcept: "配列の添字は 0 から数える。 N 番目は arr[N - 1]",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

下のコードは「3 番目の果物」 を出すつもりで \`fruits[3]\` を見ていますが、 配列は **0 から数える** ため \`fruits[3]\` は存在せず \`undefined\` が出てしまいます。

期待される 3 番目の果物 (= \`"ぶどう"\`) が出るように添字を直してください。

## 期待する出力

\`\`\`
ぶどう
\`\`\`

## ポイント

- 配列の最初は **0 番目**。 つまり 「3 番目」 を取り出したいときは \`fruits[2]\` です。
- これは Off-by-One (1 ずれ) と呼ばれる定番のバグです。
`,
  scaffolds: {
    L0: "",
    L1: `// 3 番目を取りたい。 添字を 2 に直す
const fruits = ["りんご", "みかん", "ぶどう"];
console.log(fruits[3]);
`,
    L2: `// バグ: fruits[3] は配列の範囲外で undefined になる
// 3 番目 ("ぶどう") を取り出すには添字を 2 にする

const fruits = ["りんご", "みかん", "ぶどう"];
console.log(fruits[3]);
`,
    L3: `const fruits = ["りんご", "みかん", "ぶどう"];
console.log(fruits[____]);
`,
  },
  tests: [
    {
      name: "stdout が ぶどう になる",
      expectedStdout: "ぶどう",
    },
  ],
  hints: [
    "配列は 0 から数えます。 1 番目は `[0]`、 2 番目は `[1]`、 3 番目は `[2]`。",
    "`fruits[2]` で `\"ぶどう\"` が取り出せます。",
    "解答例:\n```js\nconst fruits = [\"りんご\", \"みかん\", \"ぶどう\"];\nconsole.log(fruits[2]);\n```",
  ],
  solution: `const fruits = ["りんご", "みかん", "ぶどう"];
console.log(fruits[2]);
`,
};
