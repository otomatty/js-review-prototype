import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const withDefaults: Assignment = {
  id: "with-defaults",
  topicId: "destructuring-spread",
  title: "デフォルト値で穴埋めする",
  difficulty: 2,
  description: `## デフォルト値で穴埋めする

設定オブジェクトの **デフォルト** \`defaults\` と **ユーザー指定の上書き** \`overrides\` を受け取り、両者をマージした **新しいオブジェクト** を返す関数 \`withDefaults\` を実装してください。

\`overrides\` のキーは \`defaults\` を上書きし、\`overrides\` に **存在しないキー** は \`defaults\` の値を維持します。
ただし \`overrides\` のキーが \`undefined\` の場合は **デフォルト値を保持**してください（明示的な \`null\` は **null として上書き**）。

### 入出力例

\`\`\`js
withDefaults({ port: 8080, host: 'localhost' }, { port: 3000 })
// → { port: 3000, host: 'localhost' }

withDefaults({ port: 8080, host: 'localhost' }, {})
// → { port: 8080, host: 'localhost' }

withDefaults({ port: 8080 }, { port: undefined })
// → { port: 8080 }      (undefined は無視)

withDefaults({ port: 8080 }, { port: null })
// → { port: null }      (null は明示なので上書き)
\`\`\`

### 制約

- **スプレッド構文** で新オブジェクトを組み立てる
- \`var\` は使わない
- 元のオブジェクトを変更しない
`,
  starterCode: `function withDefaults(defaults, overrides) {
  return defaults;
}
`,
  solution: `function withDefaults(defaults, overrides) {
  const filtered = {};
  for (const k of Object.keys(overrides)) {
    if (overrides[k] !== undefined) filtered[k] = overrides[k];
  }
  return { ...defaults, ...filtered };
}
`,
  entryPoints: ["withDefaults"],
  tests: [
    {
      name: "上書き",
      code: "JSON.stringify(withDefaults({port:8080, host:'localhost'}, {port:3000})) === JSON.stringify({port:3000, host:'localhost'})",
    },
    {
      name: "上書きなし",
      code: "JSON.stringify(withDefaults({port:8080, host:'localhost'}, {})) === JSON.stringify({port:8080, host:'localhost'})",
    },
    {
      name: "undefined はデフォルトを保持",
      code: "JSON.stringify(withDefaults({port:8080}, {port:undefined})) === JSON.stringify({port:8080})",
    },
    {
      name: "null は上書き",
      code: "JSON.stringify(withDefaults({port:8080}, {port:null})) === JSON.stringify({port:null})",
    },
    {
      name: "元オブジェクトを変更しない",
      code: "(() => { const d = {a:1}; const o = {a:2}; withDefaults(d,o); return d.a === 1 && o.a === 2; })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
