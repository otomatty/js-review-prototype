import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch10FirstNonRepeating: Assignment = {
  id: "S4-Ch10-06-first-non-repeating",
  stage: "S4",
  chapterId: "Ch10",
  sequence: 6,
  title: "Map で最初の「1 回しか出ない要素」 を探す",
  newConcept: "Map で前計算 → 2 周目で順序を保ったまま条件を満たす要素を探す",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

配列 \`arr\` を受け取り、 **配列の中で 1 回しか出てこない要素のうち最初に現れるもの** を返す関数 \`firstNonRepeating\` を実装してください。 そのような要素がなければ \`null\` を返してください。

\`\`\`js
firstNonRepeating(["a", "b", "a", "c", "b"]);   // → "c"
firstNonRepeating([1, 1, 2, 3, 2]);              // → 3
firstNonRepeating([1, 1, 2, 2]);                  // → null
firstNonRepeating([]);                            // → null
\`\`\`

## ポイント

- 1 周目で **各要素の出現回数を Map に貯めて** から、
- 2 周目で **元の配列を順に走査** し、 出現回数が 1 の要素を最初に見つけたら返します。
- この「前計算 → 線形走査」 は頻出パターンです。
`,
  starterFiles: singleFile(`function firstNonRepeating(arr) {
  // 1 周目: Map に出現回数を貯める
  // 2 周目: 出現回数が 1 の要素を最初に見つけたら返す
}
`),
  entryPoints: ["firstNonRepeating"],
  demoCall: `console.log(firstNonRepeating(["a", "b", "a", "c", "b"]));`,
  tests: [
    {
      name: "文字列配列の例",
      code: `firstNonRepeating(["a", "b", "a", "c", "b"]) === "c"`,
    },
    {
      name: "数値配列の例",
      code: `firstNonRepeating([1, 1, 2, 3, 2]) === 3`,
    },
    {
      name: "全て重複している場合は null",
      code: `firstNonRepeating([1, 1, 2, 2]) === null`,
    },
    {
      name: "空配列は null",
      code: `firstNonRepeating([]) === null`,
    },
    {
      name: "全て一意ならば最初の要素",
      code: `firstNonRepeating([10, 20, 30]) === 10`,
    },
    {
      name: "最後の要素が唯一の一意要素",
      code: `firstNonRepeating(["x", "y", "x", "y", "z"]) === "z"`,
    },
  ],
  hints: [
    "Map を 1 周目で構築し、 2 周目で counts.get(x) === 1 になる最初の要素を探す。",
    "解答例:\n```js\nfunction firstNonRepeating(arr) {\n  const counts = new Map();\n  for (const x of arr) {\n    counts.set(x, (counts.get(x) ?? 0) + 1);\n  }\n  for (const x of arr) {\n    if (counts.get(x) === 1) return x;\n  }\n  return null;\n}\n```",
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
  solution: `function firstNonRepeating(arr) {
  const counts = new Map();
  for (const x of arr) {
    counts.set(x, (counts.get(x) ?? 0) + 1);
  }
  for (const x of arr) {
    if (counts.get(x) === 1) {
      return x;
    }
  }
  return null;
}
`,
  badSolutions: [
    {
      code: `function firstNonRepeating(arr) {
  return arr[0] ?? null;
}
`,
      description: "常に先頭要素を返している (テスト失敗)",
    },
    {
      code: `function firstNonRepeating(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr.indexOf(arr[i]) === arr.lastIndexOf(arr[i])) {
      return arr[i];
    }
  }
  return null;
}
`,
      description: "Map を使わず indexOf/lastIndexOf で実装している (AST required 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "Map.prototype.set",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map/set",
      pageTitle: "Map.prototype.set",
    },
  ],
};
