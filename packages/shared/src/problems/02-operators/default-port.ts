import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const defaultPort: Assignment = {
  id: "default-port",
  topicId: "operators",
  title: "null合体でデフォルトポートを決める",
  difficulty: 2,
  description: `## null合体でデフォルトポートを決める

\`{ port }\` を受け取り、有効なポート番号を返す関数 \`resolvePort\` を実装してください。

- \`port\` が **数値で 1〜65535 の範囲** なら \`port\` を返す
- それ以外（\`null\` / \`undefined\` / \`0\` / 範囲外 / 数値以外）なら **デフォルト \`8080\`**

注意: \`port: 0\` は「指定なし」と同じ扱い（デフォルトを返す）にしてください。一方 \`||\` ではなく \`??\` だけだと「\`0\` を保持してしまう」点を意識してください。

### 入出力例

\`\`\`js
resolvePort({ port: 3000 })       // → 3000
resolvePort({ port: 80 })         // → 80
resolvePort({ port: 0 })          // → 8080
resolvePort({ port: null })       // → 8080
resolvePort({ port: undefined })  // → 8080
resolvePort({})                   // → 8080
resolvePort({ port: 70000 })      // → 8080  (範囲外)
resolvePort({ port: '3000' })     // → 8080  (型違い)
\`\`\`

### 制約

- \`if\` 文は使わない（**論理演算子**または三項演算子で表現する）
- \`var\` は使わない
`,
  starterCode: `function resolvePort(config) {
  return 8080;
}
`,
  solution: `function resolvePort(config) {
  const port = config.port;
  return (typeof port === 'number' && Number.isInteger(port) && port >= 1 && port <= 65535) ? port : 8080;
}
`,
  entryPoints: ["resolvePort"],
  tests: [
    {
      name: "3000",
      code: "resolvePort({port:3000}) === 3000",
    },
    {
      name: "80",
      code: "resolvePort({port:80}) === 80",
    },
    {
      name: "0 はデフォルト",
      code: "resolvePort({port:0}) === 8080",
    },
    {
      name: "null",
      code: "resolvePort({port:null}) === 8080",
    },
    {
      name: "undefined",
      code: "resolvePort({port:undefined}) === 8080",
    },
    {
      name: "プロパティなし",
      code: "resolvePort({}) === 8080",
    },
    {
      name: "範囲外",
      code: "resolvePort({port:70000}) === 8080",
    },
    {
      name: "型違い (文字列)",
      code: "resolvePort({port:'3000'}) === 8080",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
