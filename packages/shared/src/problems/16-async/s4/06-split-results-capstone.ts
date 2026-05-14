import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch16SplitResultsCapstone: Assignment = {
  id: "S4-Ch16-06-split-results-capstone",
  stage: "S4",
  chapterId: "Ch16",
  sequence: 6,
  title: "[卒業課題] Promise.allSettled で成功と失敗を分ける",
  newConcept: "Promise.allSettled で全件待ち、 status を見て fulfilled / rejected に振り分ける",
  estimatedMinutes: 35,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

Promise の配列 \`promises\` を受け取り、 **全件を並列に待ち** その結果を以下の形に振り分けて返す async 関数 \`splitResults\` を実装してください。

\`\`\`ts
{ fulfilled: Array<解決値>, rejected: Array<reject の理由> }
\`\`\`

\`Promise.allSettled\` を使い、 元の配列の **登場順** を保ったまま、 各要素を fulfilled または rejected のどちらかに分けます。

\`\`\`js
await splitResults([
  Promise.resolve(1),
  Promise.reject("oops"),
  Promise.resolve(2),
]);
// → { fulfilled: [1, 2], rejected: ["oops"] }

await splitResults([Promise.resolve(10), Promise.resolve(20)]);
// → { fulfilled: [10, 20], rejected: [] }

await splitResults([]);
// → { fulfilled: [], rejected: [] }
\`\`\`

## ポイント

- **これは S4 卒業課題のひとつ**。 並列実行 + 全件待機 + 結果集計 という非同期の典型パイプラインを 1 つの関数で組み立てます。
- \`Promise.all\` は **1 件でも reject すると全体が reject** してしまうため、 「失敗も含めて全部の結果を確認したい」 ケースでは \`Promise.allSettled\` を使います。
- \`Promise.allSettled\` の戻り値は \`{ status: "fulfilled", value }\` または \`{ status: "rejected", reason }\` のオブジェクト配列です。 これを 1 周して 2 つの配列に振り分けます。

## ヒント

- AST で **async 関数** / **AwaitExpression** / **\`Promise.allSettled\` (\`method: "allSettled"\`)** を必須にしています。
- **\`Promise.all\` は forbidden**。 reject 1 件で全体落ちを避けるためです。
- 振り分けは \`reduce\` でも \`for-of\` + 2 つの配列でも OK。
`,
  starterFiles: singleFile(`// async function を使い、 Promise.allSettled で全件待ち
// status を見て fulfilled / rejected に振り分けて返す
function splitResults(promises) {
  // ここに実装する
}
`),
  entryPoints: ["splitResults"],
  demoCall: `(async () => console.log(JSON.stringify(await splitResults([Promise.resolve(1), Promise.reject("oops"), Promise.resolve(2)]))))();`,
  tests: [
    {
      name: "fulfilled と rejected が混在しても登場順に振り分けられる",
      code: `(async () => {
        const r = await splitResults([
          Promise.resolve(1),
          Promise.reject("oops"),
          Promise.resolve(2),
        ]);
        return JSON.stringify(r.fulfilled) === JSON.stringify([1, 2])
          && JSON.stringify(r.rejected) === JSON.stringify(["oops"]);
      })()`,
    },
    {
      name: "全件 fulfilled なら rejected は空",
      code: `(async () => {
        const r = await splitResults([Promise.resolve(10), Promise.resolve(20)]);
        return JSON.stringify(r.fulfilled) === JSON.stringify([10, 20])
          && JSON.stringify(r.rejected) === JSON.stringify([]);
      })()`,
    },
    {
      name: "全件 rejected なら fulfilled は空",
      code: `(async () => {
        const r = await splitResults([Promise.reject("a"), Promise.reject("b")]);
        return JSON.stringify(r.fulfilled) === JSON.stringify([])
          && JSON.stringify(r.rejected) === JSON.stringify(["a", "b"]);
      })()`,
    },
    {
      name: "空配列なら両方とも空",
      code: `(async () => {
        const r = await splitResults([]);
        return JSON.stringify(r.fulfilled) === JSON.stringify([])
          && JSON.stringify(r.rejected) === JSON.stringify([]);
      })()`,
    },
    {
      name: "fulfilled の登場順が保たれる",
      code: `(async () => {
        const r = await splitResults([
          Promise.resolve("a"),
          Promise.reject("X"),
          Promise.resolve("b"),
          Promise.reject("Y"),
          Promise.resolve("c"),
        ]);
        return JSON.stringify(r.fulfilled) === JSON.stringify(["a", "b", "c"])
          && JSON.stringify(r.rejected) === JSON.stringify(["X", "Y"]);
      })()`,
    },
    {
      name: "戻り値は Promise",
      code: `splitResults([]) instanceof Promise`,
    },
    {
      name: "Error オブジェクトで reject された場合も reason として収集",
      code: `(async () => {
        const err = new Error("boom");
        const r = await splitResults([Promise.resolve(1), Promise.reject(err)]);
        return r.fulfilled[0] === 1 && r.rejected[0] === err;
      })()`,
    },
  ],
  hints: [
    "const settled = await Promise.allSettled(promises); 後は reduce か for-of で振り分け。",
    "解答例:\n```js\nasync function splitResults(promises) {\n  const settled = await Promise.allSettled(promises);\n  const fulfilled = [];\n  const rejected = [];\n  for (const r of settled) {\n    if (r.status === \"fulfilled\") {\n      fulfilled.push(r.value);\n    } else {\n      rejected.push(r.reason);\n    }\n  }\n  return { fulfilled, rejected };\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数で書く" },
        { kind: "node", nodeType: "AwaitExpression", label: "await で Promise を解決する" },
        { kind: "method", name: "allSettled", label: "Promise.allSettled で全件待つ" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で { fulfilled, rejected } を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "all", label: "Promise.all は 1 件 reject で全体落ちするので使わない" },
      ],
    },
  },
  solution: `async function splitResults(promises) {
  const settled = await Promise.allSettled(promises);
  const fulfilled = [];
  const rejected = [];
  for (const r of settled) {
    if (r.status === "fulfilled") {
      fulfilled.push(r.value);
    } else {
      rejected.push(r.reason);
    }
  }
  return { fulfilled, rejected };
}
`,
  badSolutions: [
    {
      code: `async function splitResults(promises) {
  const values = await Promise.all(promises);
  return { fulfilled: values, rejected: [] };
}
`,
      description: "Promise.all を使っているので 1 件 reject で全体が reject する (AST forbidden 違反 + テスト失敗)",
    },
    {
      code: `async function splitResults(promises) {
  const settled = await Promise.allSettled(promises);
  return { fulfilled: settled, rejected: [] };
}
`,
      description: "status を見て振り分けていない (テスト失敗)",
    },
    {
      code: `function splitResults(promises) {
  return Promise.allSettled(promises).then((settled) => ({
    fulfilled: settled.filter((r) => r.status === "fulfilled").map((r) => r.value),
    rejected: settled.filter((r) => r.status === "rejected").map((r) => r.reason),
  }));
}
`,
      description: ".then で書いていて async-fn / await を使っていない (AST required 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "Promise.allSettled",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled",
      pageTitle: "Promise.allSettled",
    },
    {
      heading: "Promise を使う",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises",
      pageTitle: "Promise を使う",
    },
  ],
};
