import type { Assignment } from "../../../types.js";

export const s4Ch11Fibonacci: Assignment = {
  id: "S4-Ch11-06-fibonacci",
  stage: "S4",
  chapterId: "Ch11",
  sequence: 6,
  title: "再帰でフィボナッチ数を求める",
  newConcept: "2 つの再帰呼び出しで分岐するパターン — 計算量が爆発する例として O(2^N) を体感する",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

**0 以上の整数** \`n\` を受け取り、 \`n\` 番目のフィボナッチ数を返す関数 \`fib\` を **再帰** で実装してください。 定義は以下:

- \`fib(0) === 0\`
- \`fib(1) === 1\`
- \`fib(n) === fib(n - 1) + fib(n - 2)\` (\`n >= 2\` のとき)

\`\`\`js
fib(0);   // → 0
fib(1);   // → 1
fib(2);   // → 1
fib(3);   // → 2
fib(7);   // → 13
fib(10);  // → 55
\`\`\`

## ポイント

- 階乗 (\`factorial\`) との違いは **再帰呼び出しが 2 つに分岐する** こと。 1 回の呼び出しで 2 つの部分問題に分かれていきます。
- ベースケースは **2 つ** あります: \`n === 0\` で \`0\`、 \`n === 1\` で \`1\`。 まとめて \`n < 2\` のとき \`n\` を返してもよい。
- この素朴な再帰は **計算量が O(2^N)** (指数時間)。 同じ \`fib(k)\` を何度も計算してしまうのが原因です。 \`fib(40)\` 程度でも数秒〜と非常に遅くなります。
  - これは **メモ化 (memoization)** や **動的計画法 (DP)** を学ぶ動機になります (今後の章で扱う)。 まずは 「素朴な再帰は遅くなりやすい」 ことを実感してください。

## ヒント

- AST で **ループ系を禁止**、 **\`function fib\` の宣言と \`return\` を必須** にしています。
- テストは \`fib(10)\` までで十分です (それ以上は遅くなる)。
`,
  starterCode: `function fib(n) {
  // ベースケース: n < 2 なら n を返す
  // 再帰ステップ: fib(n - 1) + fib(n - 2)
}
`,
  entryPoints: ["fib"],
  demoCall: `console.log(fib(7));`,
  tests: [
    {
      name: "fib(0) は 0",
      code: `fib(0) === 0`,
    },
    {
      name: "fib(1) は 1",
      code: `fib(1) === 1`,
    },
    {
      name: "fib(2) は 1",
      code: `fib(2) === 1`,
    },
    {
      name: "fib(3) は 2",
      code: `fib(3) === 2`,
    },
    {
      name: "fib(7) は 13",
      code: `fib(7) === 13`,
    },
    {
      name: "fib(10) は 55",
      code: `fib(10) === 55`,
    },
  ],
  hints: [
    "if (n < 2) return n; を先に書く。 そうでなければ return fib(n - 1) + fib(n - 2);。",
    "解答例:\n```js\nfunction fib(n) {\n  if (n < 2) {\n    return n;\n  }\n  return fib(n - 1) + fib(n - 2);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "function fib を宣言する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "node", nodeType: "ForStatement", label: "for ループを使わない (再帰で書く)" },
        { kind: "node", nodeType: "WhileStatement", label: "while ループを使わない (再帰で書く)" },
        { kind: "node", nodeType: "ForOfStatement", label: "for...of を使わない (再帰で書く)" },
        { kind: "node", nodeType: "ForInStatement", label: "for...in を使わない (再帰で書く)" },
        { kind: "node", nodeType: "DoWhileStatement", label: "do-while を使わない (再帰で書く)" },
        { kind: "method", name: "reduce", label: "S4 では reduce を使わない (Ch09 で導入)" },
        { kind: "method", name: "map", label: "S4 では map を使わない (Ch09 で導入)" },
      ],
    },
  },
  solution: `function fib(n) {
  if (n < 2) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
`,
  badSolutions: [
    {
      code: `function fib(n) {
  if (n < 2) {
    return n;
  }
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}
`,
      description: "for ループの反復で実装しており、 再帰になっていない (AST forbidden 違反)",
    },
    {
      code: `function fib(n) {
  return n;
}
`,
      description: "ベースケースだけで再帰せず、 fib(2) 以降が合わない (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "function 宣言",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/function",
      pageTitle: "function 宣言",
    },
  ],
};
