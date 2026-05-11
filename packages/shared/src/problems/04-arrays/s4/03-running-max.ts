import type { Assignment } from "../../../types.js";

export const s4Ch04RunningMax: Assignment = {
  id: "S4-Ch04-03-running-max",
  stage: "S4",
  chapterId: "Ch04",
  sequence: 3,
  title: "各位置までの累積最大値を返す",
  newConcept: "走査中の「ここまでの最大」 を状態として持ち、 結果配列に都度書き込む",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

数値配列 \`arr\` を受け取り、 各位置までの **累積最大値** を並べた配列 \`out\` を返す関数 \`runningMax\` を実装してください。

- \`out[i] === Math.max(arr[0], arr[1], ..., arr[i])\`
- 戻り値の長さは \`arr.length\` (空配列なら \`[]\`)

\`\`\`js
runningMax([3, 1, 4, 1, 5, 9, 2, 6]);   // → [3, 3, 4, 4, 5, 9, 9, 9]
runningMax([5]);                         // → [5]
runningMax([]);                          // → []
runningMax([-1, -2, -3]);                // → [-1, -1, -1]
runningMax([1, 2, 3, 4]);                // → [1, 2, 3, 4]
\`\`\`

## ポイント

- 「現在の最大候補」 を \`let m\` で保持し、 配列を 1 周しながら **\`if (n > m) m = n;\`** で更新します。
- 更新したあとに \`out.push(m)\` で各位置の累積最大を記録します。
- AST で \`if 文\` を必須にしているので、 \`m = Math.max(m, n)\` の 1 行更新では通りません。 自分の手で **条件分岐** を書いてください。
`,
  starterCode: `function runningMax(arr) {
  // let m を初期化し、 for...of で if (n > m) m = n; を回して out に push する
}
`,
  entryPoints: ["runningMax"],
  demoCall: `console.log(runningMax([3, 1, 4, 1, 5, 9, 2, 6]));`,
  tests: [
    {
      name: "runningMax([3,1,4,1,5,9,2,6])",
      code: `JSON.stringify(runningMax([3, 1, 4, 1, 5, 9, 2, 6])) === JSON.stringify([3, 3, 4, 4, 5, 9, 9, 9])`,
    },
    {
      name: "空配列は空",
      code: `JSON.stringify(runningMax([])) === JSON.stringify([])`,
    },
    {
      name: "要素 1 個ならそのまま",
      code: `JSON.stringify(runningMax([5])) === JSON.stringify([5])`,
    },
    {
      name: "全て負の数でも初期値に影響されない",
      code: `JSON.stringify(runningMax([-1, -2, -3])) === JSON.stringify([-1, -1, -1])`,
    },
    {
      name: "単調増加",
      code: `JSON.stringify(runningMax([1, 2, 3, 4])) === JSON.stringify([1, 2, 3, 4])`,
    },
    {
      name: "戻り値の長さは arr.length と一致",
      code: `runningMax([7, 7, 7, 7]).length === 4`,
    },
  ],
  hints: [
    "let m = arr[0] で初期化、 const out = [] を用意。 ただし空配列の場合は最初の if で初期化する手もある。",
    "for (const n of arr) で走査し、 「初回 or n > m なら m = n」 → out.push(m) の順。",
    "解答例:\n```js\nfunction runningMax(arr) {\n  const out = [];\n  let m = 0;\n  let first = true;\n  for (const n of arr) {\n    if (first) {\n      m = n;\n      first = false;\n    } else if (n > m) {\n      m = n;\n    }\n    out.push(m);\n  }\n  return out;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で累積最大値の配列を返す" },
        { kind: "node", nodeType: "IfStatement", label: "if で最大値を更新する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "reduce", label: "S4 では reduce を使わない (Ch09 で導入)" },
        { kind: "method", name: "map", label: "S4 では map を使わない (Ch09 で導入)" },
        { kind: "method", name: "slice", label: "slice + Math.max のショートカットを避ける" },
      ],
    },
  },
  solution: `function runningMax(arr) {
  const out = [];
  let m = 0;
  let first = true;
  for (const n of arr) {
    if (first) {
      m = n;
      first = false;
    } else if (n > m) {
      m = n;
    }
    out.push(m);
  }
  return out;
}
`,
  badSolutions: [
    {
      code: `function runningMax(arr) {
  return arr.map((_, i) => Math.max(...arr.slice(0, i + 1)));
}
`,
      description: "map と slice を使った安易解 (AST forbidden 違反)",
    },
    {
      code: `function runningMax(arr) {
  const out = [];
  let m = arr[0];
  for (const n of arr) {
    m = Math.max(m, n);
    out.push(m);
  }
  return out;
}
`,
      description: "Math.max で更新しており IfStatement が無い (AST required 違反)",
    },
    {
      code: `function runningMax(arr) {
  const out = [];
  let m = 0;
  for (const n of arr) {
    if (n > m) {
      m = n;
    }
    out.push(m);
  }
  return out;
}
`,
      description: "初期値を 0 にしているため全要素が負のとき誤った最大を返す (テスト失敗)",
    },
  ],
  mdnSections: [
    { heading: "配列の作成" },
    {
      heading: "Array.prototype.push",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
      pageTitle: "Array.prototype.push",
    },
  ],
};
