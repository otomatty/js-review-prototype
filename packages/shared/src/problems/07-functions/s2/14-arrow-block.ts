import type { Assignment } from "../../../types.js";

export const s2Ch07ArrowBlock: Assignment = {
  id: "S2-Ch07-14-arrow-block",
  stage: "S2",
  chapterId: "Ch07",
  sequence: 14,
  title: "アロー関数で本体ブロックを使う",
  newConcept: "アロー関数で { } を使うと明示 return が必要",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "stdout",
  description: `## やること

アロー関数で BMI を計算する関数 \`bmi\` を作ります。 本体は \`{ }\` ブロックを使い、 \`Math.round\` で四捨五入して **明示的に return** してください。

\`\`\`js
const bmi = (heightM, weightKg) => {
  return Math.round(weightKg / (heightM * heightM));
};
\`\`\`

\`bmi(1.7, 65)\` の結果を出力してください。

## 期待する出力

\`\`\`
22
\`\`\`

## ポイント

- アロー関数の本体に \`{ }\` を書くと **明示 return が必要**。
- 短い式なら省略形 \`(a, b) => a + b\` も使えます (Ch07-04 でやった形)。
`,
  starterCode: `// const bmi = (heightM, weightKg) => {
//   return Math.round(weightKg / (heightM * heightM));
// };
// console.log(bmi(1.7, 65));

`,
  tests: [
    {
      name: "stdout が 22 になる",
      expectedStdout: "22",
    },
  ],
  hints: [
    "`const bmi = (heightM, weightKg) => { return ...; };` の形で書きます。",
    "本体で `Math.round(weightKg / (heightM * heightM))` を return します。",
    "解答例:\n```js\nconst bmi = (heightM, weightKg) => {\n  return Math.round(weightKg / (heightM * heightM));\n};\nconsole.log(bmi(1.7, 65));\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ArrowFunctionExpression", label: "アロー関数を使う" },
        { kind: "node", nodeType: "ReturnStatement", label: "明示的な return を使う" },
        { kind: "method", name: "round", label: "Math.round を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const bmi = (heightM, weightKg) => {
  return Math.round(weightKg / (heightM * heightM));
};
console.log(bmi(1.7, 65));
`,
  badSolutions: [
    {
      code: `console.log(22);
`,
      description: "関数を作らず答えを直接書いている",
    },
  ],
  mdnSections: [
    { heading: "アロー関数式", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions", pageTitle: "アロー関数式" },
  ],
};
