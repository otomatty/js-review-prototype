import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch16AwaitBasic: Assignment = {
  id: "S4-Ch16-02-await-basic",
  stage: "S4",
  chapterId: "Ch16",
  sequence: 2,
  title: "async / await で値を取り出す",
  newConcept: "async 関数の中で await を使い、 Promise の解決値を同期的な書き方で受け取る",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

Promise (または素の値) を受け取り、 **中身の値に 1 を足して返す** \`async\` 関数 \`addOne\` を実装してください。 await で Promise を解決させてから加算します。

\`\`\`js
await addOne(Promise.resolve(41));   // → 42
await addOne(Promise.resolve(0));    // → 1
await addOne(10);                     // → 11   (素の値も await で受け取れる)
\`\`\`

## ポイント

- **\`async function\`** で宣言した関数は **必ず Promise を返します**。 中で \`return v\` と書くと \`Promise.resolve(v)\` 相当の値が返ります。
- **\`await\`** は Promise の解決を待ち、 中身の値を取り出します。 素の値に await しても、 そのままその値が返るので安心して使えます。
- このパターンを使うと、 非同期処理を **同期処理と同じ見た目** で書けます。

## ヒント

- AST で **async 関数** と **AwaitExpression (await 式)** の両方を必須にしています。 \`.then(...)\` だけでは required を満たせません。
- \`.then(...)\` も AST で **forbidden** にしてあるため、 await を使って書いてください。
`,
  starterFiles: singleFile(`// async function を使い、 await で値を取り出して 1 を足して返す
function addOne(p) {
  // ここに実装する
}
`),
  entryPoints: ["addOne"],
  demoCall: `(async () => console.log(await addOne(Promise.resolve(41))))();`,
  tests: [
    {
      name: "Promise の中身に 1 を足す",
      code: `(async () => (await addOne(Promise.resolve(41))) === 42)()`,
    },
    {
      name: "0 を渡せば 1 になる",
      code: `(async () => (await addOne(Promise.resolve(0))) === 1)()`,
    },
    {
      name: "素の数値にも対応する",
      code: `(async () => (await addOne(10)) === 11)()`,
    },
    {
      name: "戻り値は Promise",
      code: `addOne(1) instanceof Promise`,
    },
    {
      name: "負数も加算される",
      code: `(async () => (await addOne(Promise.resolve(-5))) === -4)()`,
    },
  ],
  hints: [
    "async function addOne(p) { const v = await p; return v + 1; }",
    "解答例:\n```js\nasync function addOne(p) {\n  const value = await p;\n  return value + 1;\n}\n```",
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
        { kind: "method", name: "then", label: ".then(...) ではなく await を使う" },
      ],
    },
  },
  solution: `async function addOne(p) {
  const value = await p;
  return value + 1;
}
`,
  badSolutions: [
    {
      code: `function addOne(p) {
  return p + 1;
}
`,
      description: "await を使わず Promise オブジェクトに 1 を足している (AST required 違反 + テスト失敗)",
    },
    {
      code: `function addOne(p) {
  return Promise.resolve(p).then((v) => v + 1);
}
`,
      description: ".then で実装している (AST forbidden 違反 + async-fn required 違反)",
    },
    {
      code: `async function addOne(p) {
  return p + 1;
}
`,
      description: "async ではあるが await していないので Promise + 1 になる (テスト失敗 + AwaitExpression 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "await",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await",
      pageTitle: "await",
    },
    {
      heading: "async function",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function",
      pageTitle: "async function",
    },
  ],
};
