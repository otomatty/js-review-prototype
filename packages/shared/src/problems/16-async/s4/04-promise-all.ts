import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch16PromiseAll: Assignment = {
  id: "S4-Ch16-04-promise-all",
  stage: "S4",
  chapterId: "Ch16",
  sequence: 4,
  title: "Promise.all で並列に待つ",
  newConcept: "Promise.all で複数の Promise を並列に待ち、 解決値配列を取り出す",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

数値を resolve する Promise の配列 \`promises\` を受け取り、 **全ての値を並列に待って合計を返す** async 関数 \`sumAll\` を実装してください。 \`Promise.all\` を使って 1 回の await で全件を解決させてください。

\`\`\`js
await sumAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);  // → 6
await sumAll([Promise.resolve(10)]);                                          // → 10
await sumAll([]);                                                              // → 0
\`\`\`

## ポイント

- **\`Promise.all(promises)\`** は、 渡した Promise が **全部解決したときに** 解決値の配列を返す Promise を作ります。
- 「逐次 await を for ループで回す」 と前の Promise を待ってから次に進むので時間がかかります。 並列に待ちたいときは \`Promise.all\` が定石です。
- \`Promise.all\` の結果は \`[v1, v2, v3, ...]\` の配列なので、 \`reduce\` や \`for-of\` で合計できますが、 本問では **\`for\` ループは禁止**。 \`reduce\` などの関数型集約か他の手段を使ってください。

## ヒント

- AST で **\`async-fn\`** / **\`await\`** / **\`Promise.all\` (\`method: "all"\`)** を必須にしています。
- **\`for\` / \`for-of\` ループは禁止** にしてあるため、 \`Promise.all\` 後の合計は \`reduce\` などで書きましょう。
`,
  starterFiles: singleFile(`// async function を使い、 Promise.all で全件を並列に待って合計を返す
function sumAll(promises) {
  // ここに実装する
}
`),
  entryPoints: ["sumAll"],
  demoCall: `(async () => console.log(await sumAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])))();`,
  tests: [
    {
      name: "3 つの値の合計",
      code: `(async () => (await sumAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])) === 6)()`,
    },
    {
      name: "1 件だけならその値が返る",
      code: `(async () => (await sumAll([Promise.resolve(10)])) === 10)()`,
    },
    {
      name: "空配列は 0",
      code: `(async () => (await sumAll([])) === 0)()`,
    },
    {
      name: "負数を含む合計",
      code: `(async () => (await sumAll([Promise.resolve(5), Promise.resolve(-3), Promise.resolve(2)])) === 4)()`,
    },
    {
      name: "戻り値は Promise",
      code: `sumAll([Promise.resolve(1)]) instanceof Promise`,
    },
    {
      name: "解決値が小数でも合算できる",
      code: `(async () => Math.abs((await sumAll([Promise.resolve(0.1), Promise.resolve(0.2)])) - 0.3) < 1e-9)()`,
    },
  ],
  hints: [
    "const values = await Promise.all(promises); return values.reduce((s, v) => s + v, 0);",
    "解答例:\n```js\nasync function sumAll(promises) {\n  const values = await Promise.all(promises);\n  return values.reduce((sum, v) => sum + v, 0);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数で書く" },
        { kind: "node", nodeType: "AwaitExpression", label: "await で Promise を解決する" },
        { kind: "method", name: "all", label: "Promise.all で並列に待つ" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "node", nodeType: "ForStatement", label: "for ループではなく Promise.all を使う" },
        { kind: "node", nodeType: "ForOfStatement", label: "for-of で逐次 await にしない (並列にする)" },
      ],
    },
  },
  solution: `async function sumAll(promises) {
  const values = await Promise.all(promises);
  return values.reduce((sum, v) => sum + v, 0);
}
`,
  badSolutions: [
    {
      code: `async function sumAll(promises) {
  let total = 0;
  for (const p of promises) {
    total += await p;
  }
  return total;
}
`,
      description: "for-of で逐次 await している (AST forbidden 違反、 並列実行になっていない)",
    },
    {
      code: `function sumAll(promises) {
  return Promise.all(promises).then((values) => values.reduce((s, v) => s + v, 0));
}
`,
      description: ".then で書いていて async-fn / await を使っていない (AST required 違反)",
    },
    {
      code: `async function sumAll(promises) {
  const values = await Promise.all(promises);
  return values[0];
}
`,
      description: "合計ではなく先頭要素だけ返している (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Promise.all",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/all",
      pageTitle: "Promise.all",
    },
  ],
};
