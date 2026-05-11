import type { Assignment } from "../../../types.js";

export const s4Ch16MakePromise: Assignment = {
  id: "S4-Ch16-01-make-promise",
  stage: "S4",
  chapterId: "Ch16",
  sequence: 1,
  title: "new Promise で値を解決する",
  newConcept: "Promise コンストラクタで resolve / reject を呼び分ける (Ch16 で初登場)",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

数値 \`a\` と \`b\` を受け取り、 **\`a / b\` の結果で resolve する Promise** を返す関数 \`safeDivide\` を実装してください。 ただし \`b === 0\` のときは \`new Error("division by zero")\` で **reject** してください。

\`\`\`js
await safeDivide(10, 2);        // → 5
await safeDivide(7, 2);         // → 3.5
await safeDivide(1, 0);         // → throws Error("division by zero")
\`\`\`

## ポイント

- **\`new Promise((resolve, reject) => ...)\`** が Promise を作る基本形です。 受け取った \`resolve\` / \`reject\` をどちらか一方だけ呼びます。
- 同期的に答えがわかる場合でも、 「結果を将来取り出す」 形にして API を統一できます。
- 呼び出し側は \`await safeDivide(...)\` で値を取り出し、 reject は \`try\` / \`catch\` で捕捉します。

## ヒント

- AST で **\`new\` 式 (NewExpression)** を必須にしています。 \`Promise.resolve(...)\` で済ませると required を満たせません。
- reject には **Error オブジェクト** を渡しましょう (\`reject(new Error("..."))\`)。 文字列を直接渡すとスタックトレースが取れません。
`,
  starterCode: `function safeDivide(a, b) {
  // new Promise((resolve, reject) => { ... }) を返す
  // b が 0 なら reject(new Error("division by zero"))
  // それ以外は resolve(a / b)
}
`,
  entryPoints: ["safeDivide"],
  demoCall: `(async () => console.log(await safeDivide(10, 2)))();`,
  tests: [
    {
      name: "通常の割り算は resolve される",
      code: `(async () => (await safeDivide(10, 2)) === 5)()`,
    },
    {
      name: "小数の結果も正しい",
      code: `(async () => (await safeDivide(7, 2)) === 3.5)()`,
    },
    {
      name: "0 で割ろうとすると reject される (Error)",
      code: `(async () => {
        try {
          await safeDivide(1, 0);
          return false;
        } catch (e) {
          return e instanceof Error && e.message === "division by zero";
        }
      })()`,
    },
    {
      name: "戻り値は Promise",
      code: `safeDivide(1, 1) instanceof Promise`,
    },
    {
      name: "0 を 0 以外で割ると 0 で resolve",
      code: `(async () => (await safeDivide(0, 5)) === 0)()`,
    },
    {
      name: "負数同士も正しく割れる",
      code: `(async () => (await safeDivide(-6, -3)) === 2)()`,
    },
  ],
  hints: [
    "new Promise((resolve, reject) => { ... }) の中で b === 0 を分岐させる。",
    "解答例:\n```js\nfunction safeDivide(a, b) {\n  return new Promise((resolve, reject) => {\n    if (b === 0) {\n      reject(new Error(\"division by zero\"));\n    } else {\n      resolve(a / b);\n    }\n  });\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で Promise を返す" },
        { kind: "node", nodeType: "NewExpression", label: "new Promise(...) を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function safeDivide(a, b) {
  return new Promise((resolve, reject) => {
    if (b === 0) {
      reject(new Error("division by zero"));
    } else {
      resolve(a / b);
    }
  });
}
`,
  badSolutions: [
    {
      code: `function safeDivide(a, b) {
  return a / b;
}
`,
      description: "Promise を返していない (テスト失敗 + AST required 違反)",
    },
    {
      code: `function safeDivide(a, b) {
  return Promise.resolve(a / b);
}
`,
      description: "Promise.resolve を使っていて new Promise(...) を使っていない (AST required 違反 + 0 除算で reject しない)",
    },
    {
      code: `function safeDivide(a, b) {
  return new Promise((resolve) => {
    resolve(a / b);
  });
}
`,
      description: "0 で割っても reject しない (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Promise() コンストラクター",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise",
      pageTitle: "Promise() コンストラクター",
    },
    {
      heading: "Promise を使う",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises",
      pageTitle: "Promise を使う",
    },
  ],
};
