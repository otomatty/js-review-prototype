import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch13RetryWithFallback: Assignment = {
  id: "S4-Ch13-03-retry-with-fallback",
  stage: "S4",
  chapterId: "Ch13",
  sequence: 3,
  title: "失敗を最大 N 回までリトライし、 だめなら既定値",
  newConcept: "try/catch をループで回して再試行 (リトライ + フォールバック)",
  estimatedMinutes: 30,
  difficulty: 3,
  testKind: "function",
  description: `## やること

関数 \`fn\` (引数なし)、 試行回数 \`max\` (\`1\` 以上の整数)、 既定値 \`fallback\` を受け取り、 次の規則で値を返す関数 \`retry\` を実装してください。

- \`fn()\` を **最大 \`max\` 回** 呼ぶ
- 途中で **例外を投げずに値を返した時点** で、 その値をそのまま返す
- \`max\` 回すべて例外で終わった場合は \`fallback\` を返す

\`\`\`js
let count = 0;
retry(() => { count++; if (count < 3) throw new Error("x"); return count; }, 5, -1);
// → 3 (3 回目で成功)

retry(() => { throw new Error("nope"); }, 3, "default");
// → "default"  (3 回ぜんぶ失敗 → fallback)

retry(() => 42, 5, -1);
// → 42 (1 回目で成功すれば残りは呼ばれない)
\`\`\`

## ポイント

- ループの中に \`try { return fn(); } catch (e) { /* 次の試行へ進む */ }\` を入れる、 が定番パターンです。
- ループ脱出を **\`try\` 内の \`return\` 一発** で書けるとシンプル。 成功した瞬間に関数全体が終わるので、 残りの試行は走りません。
- ループを抜けた = 全試行失敗、 なので最後に \`return fallback;\` します。
- AST で **TryStatement** を必須にしています。 \`fn()\` のエラーを **try で受けずに伝搬させる** とリトライにならないので注意。
`,
  starterFiles: singleFile(`function retry(fn, max, fallback) {
  // max 回まで fn() を試行し、 成功時はその値を、 全失敗時は fallback を返す
}
`),
  entryPoints: ["retry"],
  demoCall: `console.log(retry(() => 42, 3, -1));`,
  tests: [
    {
      name: "1 回目で成功すれば即その値を返す",
      code: `(() => { let n = 0; const r = retry(() => { n++; return 42; }, 3, -1); return r === 42 && n === 1; })()`,
    },
    {
      name: "2 回目で成功",
      code: `(() => { let n = 0; const r = retry(() => { n++; if (n < 2) throw new Error("x"); return "ok"; }, 5, "fb"); return r === "ok" && n === 2; })()`,
    },
    {
      name: "max 回全て失敗したら fallback を返す",
      code: `(() => { let n = 0; const r = retry(() => { n++; throw new Error("x"); }, 3, "default"); return r === "default" && n === 3; })()`,
    },
    {
      name: "max=1 で失敗すれば 1 回試行して fallback",
      code: `(() => { let n = 0; const r = retry(() => { n++; throw new Error("x"); }, 1, -1); return r === -1 && n === 1; })()`,
    },
    {
      name: "max=1 で成功するなら 1 回で値が返る",
      code: `(() => { let n = 0; const r = retry(() => { n++; return 7; }, 1, -1); return r === 7 && n === 1; })()`,
    },
    {
      name: "成功後はそれ以上 fn を呼ばない",
      code: `(() => { let n = 0; retry(() => { n++; if (n < 2) throw new Error("x"); return "ok"; }, 100, "fb"); return n === 2; })()`,
    },
    {
      name: "fallback は任意の値 (オブジェクトでも OK)",
      code: `(() => { const fb = { ok: false }; const r = retry(() => { throw new Error("x"); }, 2, fb); return r === fb; })()`,
    },
    {
      name: "TypeError のような派生例外でもリトライ対象",
      code: `(() => { let n = 0; const r = retry(() => { n++; if (n < 3) throw new TypeError("x"); return n; }, 5, -1); return r === 3; })()`,
    },
  ],
  hints: [
    "for (let i = 0; i < max; i++) { try { return fn(); } catch (e) { /* 次へ */ } } return fallback;",
    "解答例:\n```js\nfunction retry(fn, max, fallback) {\n  for (let i = 0; i < max; i++) {\n    try {\n      return fn();\n    } catch (e) {\n      // 次の試行へ\n    }\n  }\n  return fallback;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try/catch で例外を受ける",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "成功値か fallback を return する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `function retry(fn, max, fallback) {
  for (let i = 0; i < max; i++) {
    try {
      return fn();
    } catch (e) {
      // 次の試行へ
    }
  }
  return fallback;
}
`,
  badSolutions: [
    {
      code: `function retry(fn, max, fallback) {
  for (let i = 0; i < max; i++) {
    const v = fn();
    if (v !== undefined) {
      return v;
    }
  }
  return fallback;
}
`,
      description:
        "try/catch を使っておらず、 fn() の例外でそのまま落ちる (AST 違反 + テスト失敗)",
    },
    {
      code: `function retry(fn, max, fallback) {
  try {
    return fn();
  } catch (e) {
    return fallback;
  }
}
`,
      description: "1 回しか試行しておらず、 max 回リトライしていない",
    },
  ],
  mdnSections: [
    {
      heading: "try...catch",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
  ],
};
