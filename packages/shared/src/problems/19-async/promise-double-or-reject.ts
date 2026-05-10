import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const promiseDoubleOrReject: Assignment = {
  id: "promise-double-or-reject",
  topicId: "async",
  title: "値を倍にする Promise (負数は reject)",
  difficulty: 1,
  description: `## 値を倍にする Promise (負数は reject)

数値 \`n\` を受け取り、**Promise を返す** 関数 \`asyncDouble\` を実装してください。

- \`n >= 0\` のとき: \`n * 2\` を **resolve** する
- \`n < 0\` のとき: \`Error\` を **reject** する (メッセージは任意)

### 入出力例

\`\`\`js
asyncDouble(5).then(v => v)         // → 10
asyncDouble(0).then(v => v)         // → 0
asyncDouble(-1).catch(e => e)       // → Error インスタンス
\`\`\`

### 制約

- \`new Promise((resolve, reject) => {...})\` を使う
- 同期で値を返さない (必ず Promise を返す)
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
  starterCode: `function asyncDouble(n) {
  return null;
}
`,
  solution: `function asyncDouble(n) {
  return new Promise((resolve, reject) => {
    if (n >= 0) {
      resolve(n * 2);
    } else {
      reject(new Error('negative input'));
    }
  });
}
`,
  badSolutions: [
    {
      description: "Promise を返さず同期で値を返している",
      code: `function asyncDouble(n) {
  if (n >= 0) return n * 2;
  throw new Error('negative input');
}
`,
    },
  ],
  entryPoints: ["asyncDouble"],
  tests: [
    {
      name: "正値で resolve",
      code: "asyncDouble(5).then(v => v === 10)",
    },
    {
      name: "0 でも resolve",
      code: "asyncDouble(0).then(v => v === 0)",
    },
    {
      name: "負値で reject",
      code: "asyncDouble(-3).then(() => false, e => e instanceof Error)",
    },
    {
      name: "戻り値は Promise",
      code: "(() => { const r = asyncDouble(1); return r && typeof r.then === 'function'; })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "NewExpression",
        label: "new Promise(...) を使う",
      },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
