import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const tryParseJson: Assignment = {
  id: "try-parse-json",
  topicId: "error-handling",
  title: "JSONパースを Result 型で包む",
  difficulty: 2,
  description: `## JSONパースを Result 型で包む

文字列を受け取り、\`JSON.parse\` の結果を **Result 型風オブジェクト** で返す関数 \`tryParseJson\` を実装してください。

成功時: \`{ ok: true, value: <パース結果> }\`
失敗時: \`{ ok: false, error: <Errorのmessage文字列> }\`

### 入出力例

\`\`\`js
tryParseJson('{"a":1}')
// → { ok: true, value: { a: 1 } }

tryParseJson('[1,2,3]')
// → { ok: true, value: [1,2,3] }

tryParseJson('not-json')
// → { ok: false, error: '<エラーメッセージ>' }

tryParseJson('')
// → { ok: false, error: '<エラーメッセージ>' }

tryParseJson('null')
// → { ok: true, value: null }
\`\`\`

### 制約

- **\`try / catch\`** で例外を捕捉する
- 例外が出ても呼び出し側に \`throw\` し直さない
- \`var\` は使わない
`,
  starterCode: `function tryParseJson(text) {
  return { ok: false, error: 'unimplemented' };
}
`,
  solution: `function tryParseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
`,
  entryPoints: ["tryParseJson"],
  tests: [
    {
      name: "object",
      code: "JSON.stringify(tryParseJson('{\"a\":1}')) === JSON.stringify({ok:true,value:{a:1}})",
    },
    {
      name: "array",
      code: "JSON.stringify(tryParseJson('[1,2,3]')) === JSON.stringify({ok:true,value:[1,2,3]})",
    },
    {
      name: "invalid",
      code: "(() => { const r = tryParseJson('not-json'); return r.ok === false && typeof r.error === 'string' && r.error.length > 0; })()",
    },
    {
      name: "empty string",
      code: "(() => { const r = tryParseJson(''); return r.ok === false && typeof r.error === 'string'; })()",
    },
    {
      name: "null literal",
      code: "JSON.stringify(tryParseJson('null')) === JSON.stringify({ok:true,value:null})",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "TryStatement",
        label: "try / catch を使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
