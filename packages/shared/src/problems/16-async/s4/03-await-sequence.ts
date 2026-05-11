import type { Assignment } from "../../../types.js";

export const s4Ch16AwaitSequence: Assignment = {
  id: "S4-Ch16-03-await-sequence",
  stage: "S4",
  chapterId: "Ch16",
  sequence: 3,
  title: "2 つの Promise を順番に await する",
  newConcept: "複数の await を逐次に書く。 各 Promise を順番に解決していくパターン",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

2 つの Promise \`p1\`、 \`p2\` を受け取り、 **両方の解決値を足した数** を返す async 関数 \`addAwaited\` を実装してください。 ただし **\`p1\` を await してから \`p2\` を await する** 逐次の形で書いてください。

\`\`\`js
await addAwaited(Promise.resolve(2), Promise.resolve(3));     // → 5
await addAwaited(Promise.resolve(0), Promise.resolve(10));    // → 10
await addAwaited(Promise.resolve(-1), Promise.resolve(1));    // → 0
\`\`\`

## ポイント

- **逐次 await** は \`const a = await p1; const b = await p2;\` の形で書きます。 \`p1\` が解決するのを待ってから \`p2\` を待つので、 **両者の合計時間** がかかります。
- 「両方を **同時に** 待ちたい」 場合は次問で扱う \`Promise.all\` を使いますが、 ここではまず **逐次に書ける** ことを身につけます。
- \`Promise.all\` は今回 **forbidden** にしてあります (次問の準備です)。

## ヒント

- AST で **async 関数** と **AwaitExpression** を必須、 **\`Promise.all\` (\`method: "all"\`)** を禁止にしています。
- await を 2 回明示的に書きましょう。
`,
  starterCode: `// async function を使い、 p1 を await してから p2 を await して合計を返す
function addAwaited(p1, p2) {
  // ここに実装する
}
`,
  entryPoints: ["addAwaited"],
  demoCall: `(async () => console.log(await addAwaited(Promise.resolve(2), Promise.resolve(3))))();`,
  tests: [
    {
      name: "2 + 3 = 5",
      code: `(async () => (await addAwaited(Promise.resolve(2), Promise.resolve(3))) === 5)()`,
    },
    {
      name: "0 + 10 = 10",
      code: `(async () => (await addAwaited(Promise.resolve(0), Promise.resolve(10))) === 10)()`,
    },
    {
      name: "-1 + 1 = 0",
      code: `(async () => (await addAwaited(Promise.resolve(-1), Promise.resolve(1))) === 0)()`,
    },
    {
      name: "戻り値は Promise",
      code: `addAwaited(Promise.resolve(1), Promise.resolve(2)) instanceof Promise`,
    },
    {
      name: "小数も足せる",
      code: `(async () => (await addAwaited(Promise.resolve(1.5), Promise.resolve(2.5))) === 4)()`,
    },
  ],
  hints: [
    "const a = await p1; const b = await p2; return a + b;",
    "解答例:\n```js\nasync function addAwaited(p1, p2) {\n  const a = await p1;\n  const b = await p2;\n  return a + b;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数で書く" },
        { kind: "node", nodeType: "AwaitExpression", label: "await で Promise を解決する" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "all", label: "ここでは Promise.all は使わない (次問で扱う)" },
        { kind: "method", name: "then", label: ".then ではなく await を使う" },
      ],
    },
  },
  solution: `async function addAwaited(p1, p2) {
  const a = await p1;
  const b = await p2;
  return a + b;
}
`,
  badSolutions: [
    {
      code: `async function addAwaited(p1, p2) {
  const [a, b] = await Promise.all([p1, p2]);
  return a + b;
}
`,
      description: "Promise.all を使っている (この問題では forbidden、 次問で扱う)",
    },
    {
      code: `function addAwaited(p1, p2) {
  return Promise.resolve(p1).then((a) => Promise.resolve(p2).then((b) => a + b));
}
`,
      description: ".then で書いている (AST forbidden 違反 + async-fn required 違反)",
    },
    {
      code: `function addAwaited(p1, p2) {
  return p1 + p2;
}
`,
      description: "await していないので Promise オブジェクトを文字列連結している (テスト失敗 + AST required 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "await",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await",
      pageTitle: "await",
    },
  ],
};
