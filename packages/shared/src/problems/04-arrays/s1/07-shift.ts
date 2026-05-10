import type { Assignment } from "../../../types.js";

export const s1Ch04Shift: Assignment = {
  id: "S1-Ch04-07-shift",
  stage: "S1",
  chapterId: "Ch04",
  sequence: 7,
  title: "shift で先頭の要素を取り除く",
  newConcept: "配列.shift() で先頭の要素を取り除く",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

\`[10, 20, 30]\` を \`nums\` に入れ、 \`shift()\` で **先頭の要素を取り除いて** から \`nums\` を出力してください。

## 期待する出力

\`\`\`
[20,30]
\`\`\`

## ポイント

- \`shift()\` は **先頭** の要素を取り除きます。 pop の逆 (末尾ではなく先頭)。
`,
  scaffolds: {
    L0: "",
    L1: `// nums = [10, 20, 30] の先頭を shift してから出力
`,
    L2: `// 1. const nums = [10, 20, 30];
// 2. nums.shift();
// 3. console.log(nums);

`,
    L3: `const nums = [____, ____, ____];
nums.shift();
console.log(nums);
`,
  },
  tests: [
    {
      name: "stdout が [20,30] になる",
      expectedStdout: "[20,30]",
    },
  ],
  hints: [
    "先頭を取り除くのは `nums.shift()`。",
    "pop が末尾、 shift が先頭、 と覚えます。",
    "解答例:\n```js\nconst nums = [10, 20, 30];\nnums.shift();\nconsole.log(nums);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "method", name: "shift", label: "shift を呼ぶ" },
      ],
    },
  },
  solution: `const nums = [10, 20, 30];
nums.shift();
console.log(nums);
`,
};
