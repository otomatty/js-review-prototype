import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch16TryCatchAsync: Assignment = {
  id: "S4-Ch16-05-try-catch-async",
  stage: "S4",
  chapterId: "Ch16",
  sequence: 5,
  title: "try / catch で reject を受け止める",
  newConcept: "async 関数の中で try / catch を使い、 Promise の reject をフォールバック値に置き換える",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

Promise \`p\` と任意のフォールバック値 \`fallback\` を受け取り、 \`p\` が **resolve したらその値、 reject したら \`fallback\`** を返す async 関数 \`safeAwait\` を実装してください。 await した値を \`try\` / \`catch\` で捕捉します。

\`\`\`js
await safeAwait(Promise.resolve(42), -1);                         // → 42
await safeAwait(Promise.reject(new Error("boom")), -1);           // → -1
await safeAwait(Promise.reject("oops"), "fallback");              // → "fallback"
\`\`\`

## ポイント

- await した Promise が reject すると **例外として throw される** ので、 \`try\` / \`catch\` で受け止められます。 これが「非同期エラー処理の同期的な書き方」 です。
- \`.catch(...)\` メソッドでも実現できますが、 本問では **\`try\` / \`catch\` を使う** ことを必須にしています (構文に慣れる目的)。
- 「reject の中身そのもの」 ではなく、 受け取った \`fallback\` を返します。

## ヒント

- AST で **async 関数** / **AwaitExpression** / **TryStatement** を必須、 **\`.catch(...)\`** を禁止にしています。
- catch ブロックでは reject の中身を **無視して** OK です (\`catch (_)\`)。
`,
  starterFiles: singleFile(`// async function を使い、 try / catch で reject を捕捉して fallback を返す
function safeAwait(p, fallback) {
  // ここに実装する
}
`),
  entryPoints: ["safeAwait"],
  demoCall: `(async () => console.log(await safeAwait(Promise.reject(new Error("boom")), -1)))();`,
  tests: [
    {
      name: "resolve した値はそのまま返る",
      code: `(async () => (await safeAwait(Promise.resolve(42), -1)) === 42)()`,
    },
    {
      name: "Error で reject されたら fallback",
      code: `(async () => (await safeAwait(Promise.reject(new Error("boom")), -1)) === -1)()`,
    },
    {
      name: "文字列 reject でも fallback",
      code: `(async () => (await safeAwait(Promise.reject("oops"), "fallback")) === "fallback")()`,
    },
    {
      name: "fallback に null を渡してもよい",
      code: `(async () => (await safeAwait(Promise.reject(new Error("x")), null)) === null)()`,
    },
    {
      name: "resolve(undefined) はそのまま undefined",
      code: `(async () => {
        const r = await safeAwait(Promise.resolve(undefined), -1);
        return r === undefined;
      })()`,
    },
    {
      name: "戻り値は Promise",
      code: `safeAwait(Promise.resolve(1), 0) instanceof Promise`,
    },
  ],
  hints: [
    "try { return await p; } catch (_) { return fallback; }",
    "解答例:\n```js\nasync function safeAwait(p, fallback) {\n  try {\n    return await p;\n  } catch (_e) {\n    return fallback;\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数で書く" },
        { kind: "node", nodeType: "AwaitExpression", label: "await で Promise を解決する" },
        { kind: "node", nodeType: "TryStatement", label: "try / catch で reject を捕捉する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "method", name: "catch", label: ".catch(...) ではなく try / catch を使う" },
      ],
    },
  },
  solution: `async function safeAwait(p, fallback) {
  try {
    return await p;
  } catch (_e) {
    return fallback;
  }
}
`,
  badSolutions: [
    {
      code: `function safeAwait(p, fallback) {
  return Promise.resolve(p).catch(() => fallback);
}
`,
      description: ".catch で書いている (AST forbidden 違反 + try/catch / async-fn / await すべて required 違反)",
    },
    {
      code: `async function safeAwait(p, fallback) {
  return await p;
}
`,
      description: "try / catch がなく reject が漏れる (テスト失敗 + AST required 違反)",
    },
    {
      code: `async function safeAwait(p, fallback) {
  try {
    return await p;
  } catch (e) {
    return e;
  }
}
`,
      description: "fallback ではなくエラー自身を返している (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "try...catch",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
    {
      heading: "Promise を使う",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises",
      pageTitle: "Promise を使う",
    },
  ],
};
