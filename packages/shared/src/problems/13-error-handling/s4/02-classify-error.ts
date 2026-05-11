import type { Assignment } from "../../../types.js";

export const s4Ch13ClassifyError: Assignment = {
  id: "S4-Ch13-02-classify-error",
  stage: "S4",
  chapterId: "Ch13",
  sequence: 2,
  title: "catch 内で instanceof により例外型を振り分ける",
  newConcept: "1 つの catch 節で複数の Error 型を分岐する",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

関数 \`fn\` (引数なし) を受け取り、 その結果に応じて次の文字列を返す関数 \`classifyError\` を実装してください。

- \`fn()\` が **成功** した: \`"ok"\`
- \`fn()\` が **TypeError** を投げた: \`"type"\`
- \`fn()\` が **RangeError** を投げた: \`"range"\`
- \`fn()\` が **SyntaxError** を投げた: \`"syntax"\`
- 上記以外の例外 (\`Error\` や非 Error 値 など): \`"other"\`

\`\`\`js
classifyError(() => 1);                                // → "ok"
classifyError(() => { throw new TypeError("x"); });    // → "type"
classifyError(() => { throw new RangeError("x"); });   // → "range"
classifyError(() => { throw new SyntaxError("x"); });  // → "syntax"
classifyError(() => { throw new Error("x"); });        // → "other"
classifyError(() => { throw "boom"; });                // → "other"
\`\`\`

## ポイント

- catch 節は **1 つだけ** ですが、 \`instanceof\` で **複数の Error 型に分岐** できます。 これが JavaScript の典型的な「多分岐 catch」 です。
- 並べる順番に注意。 \`TypeError\` / \`RangeError\` / \`SyntaxError\` はすべて \`Error\` のサブクラスなので、 もし \`if (e instanceof Error)\` を先に書いてしまうと、 残りの分岐に到達しません。 **より具体的な型から判定** します。
- \`if (...) { return ... }\` を並べる「ガード節」 で書くとネストを浅く保てます (S4 では \`no-else-return\` がついています)。
- AST で **TryStatement** を必須にしています。
`,
  starterCode: `function classifyError(fn) {
  // try/catch で fn() を呼び、 catch 側で instanceof により分岐する
}
`,
  entryPoints: ["classifyError"],
  demoCall: `console.log(classifyError(() => { throw new TypeError("bad"); }));`,
  tests: [
    {
      name: '成功時は "ok"',
      code: `classifyError(() => 1) === "ok"`,
    },
    {
      name: '0 を返しても "ok"',
      code: `classifyError(() => 0) === "ok"`,
    },
    {
      name: '空文字列を返しても "ok"',
      code: `classifyError(() => "") === "ok"`,
    },
    {
      name: 'TypeError は "type"',
      code: `classifyError(() => { throw new TypeError("x"); }) === "type"`,
    },
    {
      name: 'RangeError は "range"',
      code: `classifyError(() => { throw new RangeError("x"); }) === "range"`,
    },
    {
      name: 'SyntaxError は "syntax"',
      code: `classifyError(() => { throw new SyntaxError("x"); }) === "syntax"`,
    },
    {
      name: '汎用 Error は "other"',
      code: `classifyError(() => { throw new Error("x"); }) === "other"`,
    },
    {
      name: '文字列を throw も "other"',
      code: `classifyError(() => { throw "boom"; }) === "other"`,
    },
  ],
  hints: [
    'catch (e) の中で if (e instanceof TypeError) return "type"; のように分岐します。',
    "Error より先に TypeError / RangeError / SyntaxError をチェックすること (継承関係に注意)。",
    '解答例:\n```js\nfunction classifyError(fn) {\n  try {\n    fn();\n    return "ok";\n  } catch (e) {\n    if (e instanceof TypeError) {\n      return "type";\n    }\n    if (e instanceof RangeError) {\n      return "range";\n    }\n    if (e instanceof SyntaxError) {\n      return "syntax";\n    }\n    return "other";\n  }\n}\n```',
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try/catch を使う",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "return で分類結果を返す",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `function classifyError(fn) {
  try {
    fn();
    return "ok";
  } catch (e) {
    if (e instanceof TypeError) {
      return "type";
    }
    if (e instanceof RangeError) {
      return "range";
    }
    if (e instanceof SyntaxError) {
      return "syntax";
    }
    return "other";
  }
}
`,
  badSolutions: [
    {
      code: `function classifyError(fn) {
  try {
    fn();
    return "ok";
  } catch (e) {
    return "other";
  }
}
`,
      description:
        '全ての例外を "other" にしていて、 TypeError / RangeError / SyntaxError の分岐ができていない',
    },
    {
      code: `function classifyError(fn) {
  try {
    fn();
    return "ok";
  } catch (e) {
    if (e instanceof Error) {
      return "other";
    }
    if (e instanceof TypeError) {
      return "type";
    }
    if (e instanceof RangeError) {
      return "range";
    }
    if (e instanceof SyntaxError) {
      return "syntax";
    }
    return "other";
  }
}
`,
      description:
        "Error を先に判定しているため、 サブクラス (TypeError 等) の分岐に到達せず常に other",
    },
  ],
  mdnSections: [
    {
      heading: "instanceof",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/instanceof",
      pageTitle: "instanceof",
    },
  ],
};
