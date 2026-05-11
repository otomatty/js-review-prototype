import type { Assignment } from "../../../types.js";

export const s4Ch12FixFloatEqual: Assignment = {
  id: "S4-Ch12-02-fix-float-equal",
  stage: "S4",
  chapterId: "Ch12",
  sequence: 2,
  title: "[デバッグ] 浮動小数の合計判定 === の罠を直す",
  newConcept: "浮動小数の === は誤差で偽になる。 許容誤差で判定する",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

下記の \`sumEquals\` 関数は **数値配列 \`numbers\` の合計が \`target\` と等しいか** を返すはずですが、 浮動小数の誤差で \`sumEquals([0.1, 0.2], 0.3)\` が \`false\` になってしまいます。 これを修正してください。

\`\`\`js
sumEquals([0.1, 0.2], 0.3);          // → true   (現状は false)
sumEquals([0.1, 0.2, 0.3], 0.6);     // → true   (現状は false)
sumEquals([1, 2, 3], 6);              // → true
sumEquals([0.1, 0.2], 0.4);          // → false
\`\`\`

## ポイント

- JavaScript の数値は **倍精度浮動小数 (IEEE 754)** で、 \`0.1 + 0.2\` は厳密には \`0.30000000000000004\` になる。 \`===\` で比較すると \`0.3\` と一致しない。
- 「ほぼ等しい」 を判定するには **差の絶対値が十分小さい** ことを確かめる:
  \`\`\`js
  Math.abs(sum - target) < 1e-9
  \`\`\`
- 許容誤差 (\`1e-9\` 程度) を **イプシロン** と呼ぶ。 ここでは整数だけのケースも併せて通る安全な値として \`1e-9\` で十分。
- \`==\` に変えても直らない (S4 の lint プリセットでは \`eqeqeq\` で \`==\` 自体がエラー)。 必ず **差の判定** に置き換える。
`,
  starterCode: `function sumEquals(numbers, target) {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return sum === target;
}
`,
  entryPoints: ["sumEquals"],
  demoCall: `console.log(sumEquals([0.1, 0.2], 0.3));`,
  tests: [
    {
      name: "0.1 + 0.2 は 0.3 として一致する",
      code: `sumEquals([0.1, 0.2], 0.3) === true`,
    },
    {
      name: "0.1 + 0.2 + 0.3 は 0.6 として一致する",
      code: `sumEquals([0.1, 0.2, 0.3], 0.6) === true`,
    },
    {
      name: "整数の合計も一致する",
      code: `sumEquals([1, 2, 3], 6) === true`,
    },
    {
      name: "明確に違う値は false",
      code: `sumEquals([0.1, 0.2], 0.4) === false`,
    },
    {
      name: "1.5 + 2.5 は 4 として一致",
      code: `sumEquals([1.5, 2.5], 4) === true`,
    },
    {
      name: "空配列の合計は 0 と一致",
      code: `sumEquals([], 0) === true`,
    },
    {
      name: "0.5 + 0.25 は 0.75 として一致",
      code: `sumEquals([0.5, 0.25], 0.75) === true`,
    },
  ],
  hints: [
    "return 文の `sum === target` を `Math.abs(sum - target) < 1e-9` に置き換える。",
    "解答例:\n```js\nfunction sumEquals(numbers, target) {\n  let sum = 0;\n  for (const n of numbers) sum += n;\n  return Math.abs(sum - target) < 1e-9;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で真偽値を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function sumEquals(numbers, target) {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return Math.abs(sum - target) < 1e-9;
}
`,
  badSolutions: [
    {
      code: `function sumEquals(numbers, target) {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return sum === target;
}
`,
      description: "元のバグのまま (0.1 + 0.2 === 0.3 が false)",
    },
    {
      code: `function sumEquals(numbers, target) {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return Math.abs(sum - target) < 0.5;
}
`,
      description: "許容誤差が大きすぎて 0.3 と 0.4 を区別できない",
    },
    {
      code: `function sumEquals(numbers, target) {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return Math.round(sum) === Math.round(target);
}
`,
      description: "丸めてしまうと 0.3 と 0.4 を区別できない",
    },
  ],
  mdnSections: [
    {
      heading: "Math.abs()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/abs",
      pageTitle: "Math.abs()",
    },
    {
      heading: "Number.EPSILON",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON",
      pageTitle: "Number.EPSILON",
    },
  ],
};
