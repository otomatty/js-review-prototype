import type { Assignment } from "../../../types.js";

export const s4Ch10MostFrequent: Assignment = {
  id: "S4-Ch10-05-most-frequent",
  stage: "S4",
  chapterId: "Ch10",
  sequence: 5,
  title: "Map で最頻出の要素を見つける",
  newConcept: "Map を 1 度走査するだけで「最大値とそのキー」 を更新するパターン",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

配列 \`arr\` を受け取り、 **最も出現回数が多い要素** を返す関数 \`mostFrequent\` を実装してください。

- 同じ出現回数の要素が複数あるときは、 **先にその回数に達した方** を返してください。
- 空配列の場合は \`null\` を返してください。

\`\`\`js
mostFrequent(["a", "b", "a", "c", "a", "b"]);   // → "a"   (a が 3 回)
mostFrequent([1, 2, 2, 3, 3]);                   // → 2     (2 と 3 が同点、 先に 2 回に達した 2)
mostFrequent(["x"]);                              // → "x"
mostFrequent([]);                                 // → null
\`\`\`

## ポイント

- Map に出現回数を貯めながら、 同時に **「現状の最大」 を更新** すれば 1 周で終わります。
- 「先にその回数に達した方を残す」 ためには **\`>\` で更新し \`>=\` では更新しない** のがコツです。
`,
  starterCode: `function mostFrequent(arr) {
  // Map に出現回数を貯めつつ、 現状の最頻出を更新してください
  // 空配列なら null を返す
}
`,
  entryPoints: ["mostFrequent"],
  demoCall: `console.log(mostFrequent(["a", "b", "a", "c", "a", "b"]));`,
  tests: [
    {
      name: "明確な最頻要素を返す",
      code: `mostFrequent(["a", "b", "a", "c", "a", "b"]) === "a"`,
    },
    {
      name: "同点は先に到達した方を返す",
      code: `mostFrequent([1, 2, 2, 3, 3]) === 2`,
    },
    {
      name: "単一要素",
      code: `mostFrequent(["x"]) === "x"`,
    },
    {
      name: "空配列は null",
      code: `mostFrequent([]) === null`,
    },
    {
      name: "全て同じ要素",
      code: `mostFrequent([7, 7, 7]) === 7`,
    },
    {
      name: "全て異なる要素なら最初のものが返る",
      code: `mostFrequent([5, 4, 3, 2, 1]) === 5`,
    },
  ],
  hints: [
    "for ループの中で counts.set した直後に if (c > bestCount) で best を更新する。",
    "解答例:\n```js\nfunction mostFrequent(arr) {\n  const counts = new Map();\n  let best = null;\n  let bestCount = 0;\n  for (const x of arr) {\n    const c = (counts.get(x) ?? 0) + 1;\n    counts.set(x, c);\n    if (c > bestCount) {\n      bestCount = c;\n      best = x;\n    }\n  }\n  return best;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で結果を返す" },
        { kind: "node", nodeType: "NewExpression", label: "new Map() を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function mostFrequent(arr) {
  const counts = new Map();
  let best = null;
  let bestCount = 0;
  for (const x of arr) {
    const c = (counts.get(x) ?? 0) + 1;
    counts.set(x, c);
    if (c > bestCount) {
      bestCount = c;
      best = x;
    }
  }
  return best;
}
`,
  badSolutions: [
    {
      code: `function mostFrequent(arr) {
  return arr[0] ?? null;
}
`,
      description: "常に先頭要素を返している (テスト失敗)",
    },
    {
      code: `function mostFrequent(arr) {
  if (arr.length === 0) return null;
  let best = arr[0];
  let bestCount = 0;
  for (const x of arr) {
    let c = 0;
    for (const y of arr) {
      if (y === x) c += 1;
    }
    if (c > bestCount) {
      bestCount = c;
      best = x;
    }
  }
  return best;
}
`,
      description: "Map を使わず二重ループで実装している (AST required 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "Map.prototype.get",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map/get",
      pageTitle: "Map.prototype.get",
    },
  ],
};
