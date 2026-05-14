import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch10Intersection: Assignment = {
  id: "S4-Ch10-04-intersection",
  stage: "S4",
  chapterId: "Ch10",
  sequence: 4,
  title: "Set で 2 つの配列の共通要素を求める",
  newConcept: "Set.has は O(1) なので、 配列同士の照合を高速化できる",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

2 つの配列 \`a\`, \`b\` を受け取り、 **両方に含まれる要素** を \`a\` の出現順で、 **重複なし** で並べた配列を返す関数 \`intersection\` を実装してください。

\`\`\`js
intersection([1, 2, 3, 4], [2, 4, 6]);         // → [2, 4]
intersection(["a", "b", "a", "c"], ["c", "a"]); // → ["a", "c"]
intersection([1, 2, 3], [4, 5, 6]);             // → []
intersection([], [1, 2]);                        // → []
\`\`\`

## ポイント

- ナイーブに \`a.filter(x => b.includes(x))\` と書くと \`O(a.length * b.length)\` になります。
- **\`b\` を Set にする** ことで \`has\` を \`O(1)\` にでき、 全体が \`O(a.length + b.length)\` になります。
- 同時に重複を除くため、 既に追加した要素を覚えておく Set も用意します。
`,
  starterFiles: singleFile(`function intersection(a, b) {
  // b を Set にして、 a を走査しながら共通要素を集めてください
}
`),
  entryPoints: ["intersection"],
  demoCall: `console.log(intersection([1, 2, 3, 4], [2, 4, 6]));`,
  tests: [
    {
      name: "数値配列の共通部分",
      code: `JSON.stringify(intersection([1, 2, 3, 4], [2, 4, 6])) === JSON.stringify([2, 4])`,
    },
    {
      name: "a 側の重複は 1 度だけ出る",
      code: `JSON.stringify(intersection(["a", "b", "a", "c"], ["c", "a"])) === JSON.stringify(["a", "c"])`,
    },
    {
      name: "共通要素がなければ空配列",
      code: `JSON.stringify(intersection([1, 2, 3], [4, 5, 6])) === JSON.stringify([])`,
    },
    {
      name: "片方が空なら空配列",
      code: `JSON.stringify(intersection([], [1, 2])) === JSON.stringify([])`,
    },
    {
      name: "順序は a の出現順",
      code: `JSON.stringify(intersection([3, 1, 2], [1, 2, 3])) === JSON.stringify([3, 1, 2])`,
    },
    {
      name: "戻り値は配列",
      code: `Array.isArray(intersection([1], [1]))`,
    },
  ],
  hints: [
    "const bSet = new Set(b); で b 側を Set 化。 const seen = new Set(); で重複排除。",
    "解答例:\n```js\nfunction intersection(a, b) {\n  const bSet = new Set(b);\n  const seen = new Set();\n  const result = [];\n  for (const x of a) {\n    if (bSet.has(x) && !seen.has(x)) {\n      result.push(x);\n      seen.add(x);\n    }\n  }\n  return result;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で配列を返す" },
        { kind: "node", nodeType: "NewExpression", label: "new Set(...) を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function intersection(a, b) {
  const bSet = new Set(b);
  const seen = new Set();
  const result = [];
  for (const x of a) {
    if (bSet.has(x) && !seen.has(x)) {
      result.push(x);
      seen.add(x);
    }
  }
  return result;
}
`,
  badSolutions: [
    {
      code: `function intersection(a, b) {
  const result = [];
  for (const x of a) {
    if (b.includes(x)) {
      result.push(x);
    }
  }
  return result;
}
`,
      description: "Set を使っておらず、 a 側の重複も除いていない (AST + テスト失敗)",
    },
    {
      code: `function intersection(a, b) {
  return [...new Set(a)];
}
`,
      description: "b との共通判定をしておらず、 a を重複排除しているだけ",
    },
  ],
  mdnSections: [
    {
      heading: "Set.prototype.has",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Set/has",
      pageTitle: "Set.prototype.has",
    },
  ],
};
