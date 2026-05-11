import type { Assignment } from "../../../types.js";

export const s4Ch13SafeRunnerCapstone: Assignment = {
  id: "S4-Ch13-05-safe-runner-capstone",
  stage: "S4",
  chapterId: "Ch13",
  sequence: 5,
  title: "[卒業課題] カスタム Error + 振り分け + finally の安全な実行ランナー",
  newConcept:
    "カスタム Error + 多分岐 catch + finally を組み合わせた一連のエラー設計",
  estimatedMinutes: 40,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

S4 卒業課題のひとつです。 これまでの「カスタム Error クラス」「\`instanceof\` による振り分け」「\`finally\`」 を 1 つの関数にまとめます。

### 1. \`TimeoutError\` クラス

\`Error\` を継承した \`TimeoutError\` クラスを定義してください。
- コンストラクタは \`(message)\` を受け取り、 \`super(message)\` を呼んで、 \`this.name = "TimeoutError"\` をセットする。

### 2. \`safeRun(fn, stats)\` 関数

\`fn\` (引数なし) と統計オブジェクト \`stats\` を受け取り、 次のように動かします。

- 最初に \`fn()\` を呼び、 結果に応じて返す:
  - 成功:                  \`{ ok: true, value: <戻り値> }\`
  - \`TimeoutError\`:        \`{ ok: false, kind: "timeout", message: <error.message> }\`
  - \`TypeError\`:           \`{ ok: false, kind: "type",    message: <error.message> }\`
  - その他の例外:          \`{ ok: false, kind: "other",   message: <error.message> }\`
- **成功/失敗にかかわらず** 、 \`finally\` ブロックで \`stats.attempts\` を **+1** する (未定義なら 0 から始めて +1)。

\`\`\`js
const stats = { attempts: 0 };
safeRun(() => 42, stats);                                  // → { ok: true, value: 42 }
safeRun(() => { throw new TimeoutError("slow"); }, stats); // → { ok: false, kind: "timeout", message: "slow" }
safeRun(() => { throw new TypeError("bad"); }, stats);     // → { ok: false, kind: "type",    message: "bad" }
safeRun(() => { throw new Error("boom"); }, stats);        // → { ok: false, kind: "other",   message: "boom" }
stats.attempts;   // → 4   (4 回ぶんカウントされる)
\`\`\`

## ポイント

- 「**カスタム Error は最も具体的な型から判定する**」 のがコツです。 今回 \`TimeoutError\` の親は \`Error\` ですが、 もし将来 \`TimeoutError\` の親を別の独自クラスにすると、 並べる順を間違えるだけで分岐に到達しなくなります。
- \`stats.attempts\` の更新は **成功/失敗の両方で必ず行う** ので、 \`finally\` ブロックに入れるのが自然です。 \`try\` の末尾と \`catch\` の末尾の両方に書くのは重複で、 片方だけ更新を忘れる典型バグの源になります。
- AST で **ClassDeclaration / TryStatement / ReturnStatement** を必須にしています。
- これは S4 卒業課題のひとつなので、 ここまで学んできた **try/catch / カスタム Error / 振り分け / finally** を 1 つの関数にまとめて使い切る練習です。
`,
  starterCode: `class TimeoutError extends Error {
  // constructor で super を呼び、 name をセット
}

function safeRun(fn, stats) {
  // try { ... } catch (e) { ... } finally { ... } で結果と統計を返す
}
`,
  entryPoints: ["TimeoutError", "safeRun"],
  demoCall: `console.log(safeRun(() => 42, { attempts: 0 }));`,
  tests: [
    {
      name: "成功時 ok:true / value",
      code: `(() => { const s = { attempts: 0 }; const r = safeRun(() => 42, s); return r.ok === true && r.value === 42; })()`,
    },
    {
      name: 'TimeoutError は kind:"timeout"',
      code: `(() => { const s = { attempts: 0 }; const r = safeRun(() => { throw new TimeoutError("slow"); }, s); return r.ok === false && r.kind === "timeout" && r.message === "slow"; })()`,
    },
    {
      name: 'TypeError は kind:"type"',
      code: `(() => { const s = { attempts: 0 }; const r = safeRun(() => { throw new TypeError("bad"); }, s); return r.ok === false && r.kind === "type" && r.message === "bad"; })()`,
    },
    {
      name: '汎用 Error は kind:"other"',
      code: `(() => { const s = { attempts: 0 }; const r = safeRun(() => { throw new Error("boom"); }, s); return r.ok === false && r.kind === "other" && r.message === "boom"; })()`,
    },
    {
      name: 'RangeError は kind:"other" (TypeError 以外の組み込み)',
      code: `(() => { const s = { attempts: 0 }; const r = safeRun(() => { throw new RangeError("rng"); }, s); return r.ok === false && r.kind === "other" && r.message === "rng"; })()`,
    },
    {
      name: "TimeoutError は Error のサブクラス",
      code: `new TimeoutError("x") instanceof Error`,
    },
    {
      name: 'TimeoutError.name は "TimeoutError"',
      code: `new TimeoutError("x").name === "TimeoutError"`,
    },
    {
      name: "成功時に stats.attempts が +1 される",
      code: `(() => { const s = { attempts: 0 }; safeRun(() => 1, s); return s.attempts === 1; })()`,
    },
    {
      name: "失敗時にも stats.attempts が +1 される",
      code: `(() => { const s = { attempts: 0 }; safeRun(() => { throw new Error("x"); }, s); return s.attempts === 1; })()`,
    },
    {
      name: "複数回呼べば累積される",
      code: `(() => { const s = { attempts: 0 }; safeRun(() => 1, s); safeRun(() => { throw new TypeError("x"); }, s); safeRun(() => { throw new TimeoutError("x"); }, s); return s.attempts === 3; })()`,
    },
  ],
  hints: [
    'class TimeoutError extends Error { constructor(message) { super(message); this.name = "TimeoutError"; } }',
    "safeRun では 1) try で value を返す 2) catch で instanceof TimeoutError / TypeError / それ以外 に分岐 3) finally で stats.attempts++",
    '解答例:\n```js\nclass TimeoutError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = "TimeoutError";\n  }\n}\n\nfunction safeRun(fn, stats) {\n  try {\n    return { ok: true, value: fn() };\n  } catch (e) {\n    if (e instanceof TimeoutError) {\n      return { ok: false, kind: "timeout", message: e.message };\n    }\n    if (e instanceof TypeError) {\n      return { ok: false, kind: "type", message: e.message };\n    }\n    return { ok: false, kind: "other", message: e.message };\n  } finally {\n    stats.attempts = (stats.attempts ?? 0) + 1;\n  }\n}\n```',
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "TimeoutError クラスを class で定義する",
        },
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try/catch/finally を使う",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "結果オブジェクトを return する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
}

function safeRun(fn, stats) {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    if (e instanceof TimeoutError) {
      return { ok: false, kind: "timeout", message: e.message };
    }
    if (e instanceof TypeError) {
      return { ok: false, kind: "type", message: e.message };
    }
    return { ok: false, kind: "other", message: e.message };
  } finally {
    stats.attempts = (stats.attempts ?? 0) + 1;
  }
}
`,
  badSolutions: [
    {
      code: `class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
}

function safeRun(fn, stats) {
  try {
    const v = fn();
    stats.attempts = (stats.attempts ?? 0) + 1;
    return { ok: true, value: v };
  } catch (e) {
    if (e instanceof TimeoutError) {
      return { ok: false, kind: "timeout", message: e.message };
    }
    if (e instanceof TypeError) {
      return { ok: false, kind: "type", message: e.message };
    }
    return { ok: false, kind: "other", message: e.message };
  }
}
`,
      description:
        "finally を使っておらず失敗時に stats.attempts がインクリメントされない",
    },
    {
      code: `function safeRun(fn, stats) {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return { ok: false, kind: "other", message: e.message };
  } finally {
    stats.attempts = (stats.attempts ?? 0) + 1;
  }
}
`,
      description:
        "TimeoutError クラスを定義しておらず、 振り分けもしていない (ClassDeclaration 違反 + テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "try...catch (finally 節)",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
    {
      heading: "Error: カスタムエラーで extends",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error",
      pageTitle: "Error",
    },
  ],
};
