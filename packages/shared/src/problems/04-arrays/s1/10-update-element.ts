import type { Assignment } from "../../../types.js";

export const s1Ch04UpdateElement: Assignment = {
  id: "S1-Ch04-10-update-element",
  stage: "S1",
  chapterId: "Ch04",
  sequence: 10,
  title: "添字に代入して要素を上書きする",
  newConcept: "配列[i] = 値 で i 番目の要素を書き換える",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

\`["A", "B", "C"]\` を \`letters\` に入れ、 **1 番目の要素** (= \`"B"\`) を \`"X"\` に書き換えてから配列を出力してください。

## 期待する出力

\`\`\`
["A","X","C"]
\`\`\`

## ポイント

- \`letters[1] = "X";\` のように添字に代入することで、 その位置の値を上書きできます。
- const で宣言した配列の **中身は書き換え可能** です (再代入と中身の変更は別物)。
`,
  scaffolds: {
    L0: "",
    L1: `// letters[1] を "X" に書き換えてから出力
`,
    L2: `// 1. const letters = ["A", "B", "C"];
// 2. letters[1] = "X";
// 3. console.log(letters);

`,
    L3: `const letters = [____, ____, ____];
letters[____] = ____;
console.log(letters);
`,
  },
  tests: [
    {
      name: "stdout が [\"A\",\"X\",\"C\"] になる",
      expectedStdout: '["A","X","C"]',
    },
  ],
  hints: [
    "添字に直接代入できます: `letters[1] = \"X\";`。",
    "`const` でも配列の中身は書き換え可能です (= 再代入とは別)。",
    "解答例:\n```js\nconst letters = [\"A\", \"B\", \"C\"];\nletters[1] = \"X\";\nconsole.log(letters);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "const-declaration",
          name: "letters",
          label: "const letters を宣言する",
        },
      ],
    },
  },
  solution: `const letters = ["A", "B", "C"];
letters[1] = "X";
console.log(letters);
`,
};
