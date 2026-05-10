import type { Assignment } from "../../../types.js";

export const s1Ch04NestedAccess: Assignment = {
  id: "S1-Ch04-09-nested-access",
  stage: "S1",
  chapterId: "Ch04",
  sequence: 9,
  title: "配列の中の配列にアクセスする",
  newConcept: "配列の要素が配列のとき、 [i][j] で中の値を取り出す",
  estimatedMinutes: 7,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

\`const matrix = [[1, 2], [3, 4]];\` のような配列を作り、 **真ん中右下** の値 (= \`4\`) を出力してください。

\`matrix[0]\` は \`[1, 2]\`、 \`matrix[1]\` は \`[3, 4]\`。 そこからさらに \`[1]\` を取ると 4。

## 期待する出力

\`\`\`
4
\`\`\`
`,
  scaffolds: {
    L0: "",
    L1: `// matrix の右下 (= 4) を取り出して出力
`,
    L2: `// 1. const matrix = [[1, 2], [3, 4]];
// 2. matrix[1] は [3, 4]、 そこから [1] で 4 を取る
// 3. console.log(matrix[1][1]);

`,
    L3: `const matrix = [[____, ____], [____, ____]];
console.log(matrix[____][____]);
`,
  },
  tests: [
    {
      name: "stdout が 4 になる",
      expectedStdout: "4",
    },
  ],
  hints: [
    "配列の要素が配列のとき、 添字を 2 つ並べて書きます: `matrix[1][1]`。",
    "`matrix[1]` で `[3, 4]` を取り出してから、 `[1]` で 4 を取り出します。",
    "解答例:\n```js\nconst matrix = [[1, 2], [3, 4]];\nconsole.log(matrix[1][1]);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "const-declaration",
          name: "matrix",
          label: "const matrix を宣言する",
        },
      ],
    },
  },
  solution: `const matrix = [[1, 2], [3, 4]];
console.log(matrix[1][1]);
`,
};
