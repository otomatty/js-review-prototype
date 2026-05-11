import type { Assignment } from "../../../types.js";

export const s4Ch13CleanupWithFinally: Assignment = {
  id: "S4-Ch13-04-cleanup-with-finally",
  stage: "S4",
  chapterId: "Ch13",
  sequence: 4,
  title: "finally で必ずクリーンアップを実行する",
  newConcept: "try/catch/finally の finally 節で副作用を保証する",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

「成功しても失敗しても必ず特定の処理を走らせたい」 場面を扱います。 関数 \`work\` (引数なし)、 関数 \`cleanup\` (引数なし) を受け取り、 次のように動く関数 \`withCleanup\` を実装してください。

- \`work()\` が成功した場合: \`{ ok: true, value: <戻り値> }\` を返す
- \`work()\` が例外を投げた場合: \`{ ok: false, error: <例外のメッセージ> }\` を返す
- 上記いずれの場合も、 **\`cleanup()\` は必ず 1 回だけ呼び出す** こと

\`\`\`js
let closed = 0;
withCleanup(() => 42, () => { closed++; });
// → { ok: true, value: 42 }    closed === 1

withCleanup(() => { throw new Error("oops"); }, () => { closed++; });
// → { ok: false, error: "oops" }   closed === 2 (累計)
\`\`\`

## ポイント

- 同じ後始末を **\`try\` ブロックの末尾と \`catch\` ブロックの末尾の両方** に書くこともできますが、 重複してバグの温床になります (片方だけ更新を忘れる、 等)。
- \`finally\` は **try / catch のどちらを通っても必ず実行される** ブロックです。 リソースのクローズや統計の更新など、 「絶対に通したい」 処理に使います。
- \`cleanup()\` の中でさらに例外が起きるケースは扱わなくて OK です (テストでは安全な cleanup のみ渡されます)。
- AST で **TryStatement** を必須にしています。
`,
  starterCode: `function withCleanup(work, cleanup) {
  // work() の成功/失敗を結果オブジェクトに変換し、 finally で cleanup を呼ぶ
}
`,
  entryPoints: ["withCleanup"],
  demoCall: `console.log(withCleanup(() => 42, () => {}));`,
  tests: [
    {
      name: "成功時 ok:true / value",
      code: `(() => { const r = withCleanup(() => 42, () => {}); return r.ok === true && r.value === 42; })()`,
    },
    {
      name: "失敗時 ok:false / error メッセージ",
      code: `(() => { const r = withCleanup(() => { throw new Error("oops"); }, () => {}); return r.ok === false && r.error === "oops"; })()`,
    },
    {
      name: "成功時も cleanup が 1 回呼ばれる",
      code: `(() => { let n = 0; withCleanup(() => 1, () => { n++; }); return n === 1; })()`,
    },
    {
      name: "失敗時も cleanup が 1 回呼ばれる",
      code: `(() => { let n = 0; withCleanup(() => { throw new Error("x"); }, () => { n++; }); return n === 1; })()`,
    },
    {
      name: "cleanup は work の後 (= 呼び出し終了直前) に走る",
      code: `(() => { const log = []; withCleanup(() => { log.push("work"); return 1; }, () => { log.push("cleanup"); }); return log[0] === "work" && log[1] === "cleanup"; })()`,
    },
    {
      name: "0 を返しても ok:true",
      code: `(() => { const r = withCleanup(() => 0, () => {}); return r.ok === true && r.value === 0; })()`,
    },
    {
      name: "TypeError のメッセージも error に入る",
      code: `(() => { const r = withCleanup(() => { throw new TypeError("bad type"); }, () => {}); return r.ok === false && r.error === "bad type"; })()`,
    },
  ],
  hints: [
    "try { return { ok: true, value: work() }; } catch (e) { return { ok: false, error: e.message }; } finally { cleanup(); }",
    "解答例:\n```js\nfunction withCleanup(work, cleanup) {\n  try {\n    return { ok: true, value: work() };\n  } catch (e) {\n    return { ok: false, error: e.message };\n  } finally {\n    cleanup();\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
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
  solution: `function withCleanup(work, cleanup) {
  try {
    return { ok: true, value: work() };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    cleanup();
  }
}
`,
  badSolutions: [
    {
      code: `function withCleanup(work, cleanup) {
  try {
    const v = work();
    return { ok: true, value: v };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
`,
      description: "cleanup を一切呼んでいない (テスト「cleanup が呼ばれる」 で失敗)",
    },
    {
      code: `function withCleanup(work, cleanup) {
  try {
    const v = work();
    cleanup();
    return { ok: true, value: v };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
`,
      description:
        "成功時しか cleanup を呼んでいない (失敗時に cleanup が呼ばれずテスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "try...catch (finally 節)",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
  ],
};
