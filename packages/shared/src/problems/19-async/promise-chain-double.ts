import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const promiseChainDouble: Assignment = {
  id: "promise-chain-double",
  topicId: "async",
  title: "Promise を then で 3 段連結する",
  difficulty: 2,
  description: `## Promise を then で 3 段連結する

数値 \`n\` を受け取り、**\`.then\` を 3 回連結** して値を毎回 2 倍にする Promise を返す関数 \`chainDouble\` を実装してください。

つまり \`n\` → \`n*2\` → \`n*4\` → \`n*8\` と段階的に倍化していきます。

### 入出力例

\`\`\`js
chainDouble(1).then(v => v)   // → 8
chainDouble(3).then(v => v)   // → 24
chainDouble(0).then(v => v)   // → 0
\`\`\`

### 制約

- \`Promise.resolve(...)\` を起点に **\`.then\` を 3 回** 連結する
- 各 \`.then\` のコールバックは値を 2 倍にする
- \`async / await\` は使わず、\`.then\` のチェーンで書く
- \`var\` は使わない
`,
  starterCode: `function chainDouble(n) {
  return Promise.resolve(n);
}
`,
  solution: `function chainDouble(n) {
  return Promise.resolve(n)
    .then((v) => v * 2)
    .then((v) => v * 2)
    .then((v) => v * 2);
}
`,
  badSolutions: [
    {
      description: "Promise を返さず同期で値を返している",
      code: `function chainDouble(n) {
  return n * 8;
}
`,
    },
  ],
  entryPoints: ["chainDouble"],
  tests: [
    {
      name: "1 → 8",
      code: "chainDouble(1).then(v => v === 8)",
    },
    {
      name: "3 → 24",
      code: "chainDouble(3).then(v => v === 24)",
    },
    {
      name: "0 → 0",
      code: "chainDouble(0).then(v => v === 0)",
    },
    {
      name: "戻り値は Promise",
      code: "(() => { const r = chainDouble(2); return r && typeof r.then === 'function'; })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "then", label: ".then チェーンを使う" },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "async-fn", label: "async 関数は使わない" },
      {
        kind: "node",
        nodeType: "AwaitExpression",
        label: "await は使わない",
      },
    ],
  },
};
