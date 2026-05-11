import type { Assignment } from "../../../types.js";

export const s2Ch12ConditionFlipped: Assignment = {
  id: "S2-Ch12-02-condition-flipped",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 2,
  title: "> と < の取り違えを直す",
  newConcept: "比較演算子の向きを正しく読み直す",
  estimatedMinutes: 6,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

下のコードは「合格点 (60 点以上) なら 合格、 そうでなければ 不合格」 と出力するつもりですが、 **比較演算子の向きが逆** で結果が反転しています。 修正してください。

\`\`\`js
const score = 75;
if (score < 60) {
  console.log("合格");
} else {
  console.log("不合格");
}
\`\`\`

## 期待する出力

\`\`\`
合格
\`\`\`

## ポイント

- 「60 点以上で合格」 は \`score >= 60\` です。
- 比較演算子の **向きが逆** だと意味が反対になります。
`,
  starterCode: `const score = 75;
if (score < 60) {
  console.log("合格");
} else {
  console.log("不合格");
}
`,
  tests: [
    {
      name: "stdout が 合格 になる",
      expectedStdout: "合格",
    },
  ],
  hints: [
    "条件式 `score < 60` の **向き** を見直します。",
    "「60 点以上で合格」 なら `score >= 60`。",
    "解答例:\n```js\nconst score = 75;\nif (score >= 60) {\n  console.log(\"合格\");\n} else {\n  console.log(\"不合格\");\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "IfStatement", label: "if 文を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `const score = 75;
if (score >= 60) {
  console.log("合格");
} else {
  console.log("不合格");
}
`,
  badSolutions: [
    {
      code: `console.log("合格");
`,
      description: "if を消して直接出力している (条件の修正が目的)",
    },
  ],
  mdnSections: [
    { heading: "比較演算子", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators#%E6%AF%94%E8%BC%83%E6%BC%94%E7%AE%97%E5%AD%90", pageTitle: "比較演算子" },
  ],
};
