import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch11Factorial: Assignment = {
  id: "S4-Ch11-05-factorial",
  stage: "S4",
  chapterId: "Ch11",
  sequence: 5,
  title: "再帰で階乗を求める",
  newConcept: "関数の中から自分自身を呼び出す再帰の入口 — ベースケースと再帰呼び出しの組み合わせ",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

**0 以上の整数** \`n\` を受け取り、 階乗 \`n!\` を返す関数 \`factorial\` を **再帰** で実装してください。

- \`factorial(0) === 1\`
- \`factorial(1) === 1\`
- \`factorial(n) === n * factorial(n - 1)\` (\`n >= 2\` のとき)

\`\`\`js
factorial(0);   // → 1
factorial(1);   // → 1
factorial(5);   // → 120
factorial(6);   // → 720
factorial(10);  // → 3628800
\`\`\`

## ポイント

- これは **再帰 (recursion)** の最も基本的な題材です。 再帰関数は 2 つの部品で書きます:
  1. **ベースケース (base case)** — それ以上分解できない最小の入力。 ここで **再帰せず値を返す**。 階乗なら \`n <= 1\` のとき \`1\` を返す。
  2. **再帰ステップ** — 自分自身をより小さな問題に対して呼ぶ。 階乗なら \`n * factorial(n - 1)\`。
- AST で **\`for\` / \`while\` / \`for...of\` などのループ構文を禁止** しています。 必ず **自分自身の呼び出し** で書いてください。
- ベースケースを書き忘れると **無限再帰** になってスタックがあふれます (\`Maximum call stack size exceeded\`)。

## ヒント

- 「\`n\` が小さくなり続け、 いつかベースケースに到達するか?」 を意識してください。 各呼び出しで \`n - 1\` のように **小さくして** 渡すのが鉄則です。
- \`factorial\` は \`n\` がそこそこ大きいと \`Number\` の精度を超えますが、 このテストでは \`n = 10\` までしか確認しません。
`,
  starterFiles: singleFile(`function factorial(n) {
  // ベースケース: n <= 1 なら 1
  // 再帰ステップ: それ以外なら n * factorial(n - 1)
}
`),
  entryPoints: ["factorial"],
  demoCall: `console.log(factorial(5));`,
  tests: [
    {
      name: "factorial(0) は 1",
      code: `factorial(0) === 1`,
    },
    {
      name: "factorial(1) は 1",
      code: `factorial(1) === 1`,
    },
    {
      name: "factorial(2) は 2",
      code: `factorial(2) === 2`,
    },
    {
      name: "factorial(5) は 120",
      code: `factorial(5) === 120`,
    },
    {
      name: "factorial(6) は 720",
      code: `factorial(6) === 720`,
    },
    {
      name: "factorial(10) は 3628800",
      code: `factorial(10) === 3628800`,
    },
  ],
  hints: [
    "if (n <= 1) return 1; を先に書く。 そうでなければ return n * factorial(n - 1);。",
    "解答例:\n```js\nfunction factorial(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "function factorial を宣言する" },
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
  solution: `function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}
`,
  badSolutions: [
    {
      code: `function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}
`,
      description: "for ループで書いており、 再帰になっていない (AST forbidden 違反)",
    },
    {
      code: `function factorial(n) {
  return n * factorial(n - 1);
}
`,
      description: "ベースケースがなく無限再帰になる (テスト失敗 = スタックオーバーフロー)",
    },
  ],
  mdnSections: [
    {
      heading: "function 宣言",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/function",
      pageTitle: "function 宣言",
    },
    {
      heading: "再帰",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions",
      pageTitle: "関数",
    },
  ],
};
