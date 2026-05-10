import type { Assignment } from "../../../types.js";

export const s0Ch00PrintCalc: Assignment = {
  id: "S0-Ch00-04-print-calc",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 4,
  title: "計算結果を出す",
  newConcept: "+ 演算子で足し算した結果を出力する",
  estimatedMinutes: 4,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

\`5 + 10\` を計算した結果を \`console.log\` で出してください。

\`+\` を使った計算は \`console.log\` の中に **直接書く** ことができます。

## 期待する出力

\`\`\`
15
\`\`\`

## ヒント

- 期待値は \`15\` です。
- 答えだけ書くのではなく、 **\`+\` を使って計算式を書く** のが今回のポイントです。 計算式は JavaScript が実行時に \`15\` に変換してくれます。
`,
  scaffolds: {
    L0: "",
    L1: "// 5 + 10 の計算結果を console.log で出力してください\n",
    L2: `// console.log で「5 + 10 の計算結果」を出力してください
// 答え (15) を直接書くのではなく、+ を使って計算式を書くのがポイント
`,
    L3: `console.log(____ + ____);
`,
  },
  tests: [
    {
      name: "stdout が 15 になる",
      expectedStdout: "15",
    },
  ],
  hints: [
    "`console.log` の丸かっこの中には、計算式をそのまま書けます。",
    "`+` は数字を足し算する演算子です。`5 + 10` のように書けます。",
    "`console.log(5 + 10);` と書きます。実行時に JavaScript が `15` を計算してくれます。",
  ],
  solution: `console.log(5 + 10);
`,
};
