import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch13AttemptResult: Assignment = {
  id: "S3-Ch13-04-attempt-result",
  stage: "S3",
  chapterId: "Ch13",
  sequence: 4,
  title: "成功/失敗をオブジェクトで返す attempt",
  newConcept: "例外を結果オブジェクトに変換する (Result パターン)",
  estimatedMinutes: 15,
  difficulty: 3,
  testKind: "function",
  description: `## やること

関数 \`fn\` (引数なし) を受け取り、 以下を返す関数 \`attempt\` を実装してください。

- \`fn()\` が **成功** したら \`{ ok: true, value: <戻り値> }\`
- \`fn()\` が **例外を投げた** ら \`{ ok: false, error: <例外のメッセージ> }\`

\`\`\`js
attempt(() => 42);
// → { ok: true, value: 42 }

attempt(() => { throw new Error("oops"); });
// → { ok: false, error: "oops" }

attempt(() => "hello");
// → { ok: true, value: "hello" }
\`\`\`

## ポイント

- try/catch の典型応用。 結果をオブジェクトに包んで返すと、 呼び出し側が **失敗を分岐しやすく** なります。
- catch (e) で受けた例外の \`.message\` プロパティをエラーフィールドに入れます。
`,
  starterFiles: singleFile(`function attempt(fn) {
  // try/catch で成功/失敗をオブジェクトで返す
}
`),
  entryPoints: ["attempt"],
  demoCall: `console.log(attempt(() => 42));`,
  tests: [
    {
      name: "成功時 ok:true, value:42",
      code: `(() => { const r = attempt(() => 42); return r.ok === true && r.value === 42; })()`,
    },
    {
      name: "例外時 ok:false, error:'oops'",
      code: `(() => { const r = attempt(() => { throw new Error("oops"); }); return r.ok === false && r.error === "oops"; })()`,
    },
    {
      name: '"hello" を返す',
      code: `(() => { const r = attempt(() => "hello"); return r.ok === true && r.value === "hello"; })()`,
    },
    {
      name: "0 でも ok:true",
      code: `(() => { const r = attempt(() => 0); return r.ok === true && r.value === 0; })()`,
    },
    {
      name: "TypeError も error にできる",
      code: `(() => { const r = attempt(() => { throw new TypeError("bad type"); }); return r.ok === false && r.error === "bad type"; })()`,
    },
  ],
  hints: [
    "try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: e instanceof Error ? e.message : String(e) }; }",
    "解答例:\n```js\nfunction attempt(fn) {\n  try {\n    return { ok: true, value: fn() };\n  } catch (e) {\n    return { ok: false, error: e instanceof Error ? e.message : String(e) };\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return でオブジェクトを返す" },
        { kind: "node", nodeType: "TryStatement", label: "try/catch を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function attempt(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
`,
  badSolutions: [
    {
      code: `function attempt(fn) {
  return { ok: true, value: fn() };
}
`,
      description: "try/catch を使っておらず例外で落ちる",
    },
    {
      code: `function attempt(fn) {
  try {
    return fn();
  } catch (e) {
    return null;
  }
}
`,
      description: "結果オブジェクトを返していない",
    },
  ],
  mdnSections: [
    {
      heading: "Error.prototype.message",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/message",
      pageTitle: "Error.prototype.message",
    },
  ],
};
