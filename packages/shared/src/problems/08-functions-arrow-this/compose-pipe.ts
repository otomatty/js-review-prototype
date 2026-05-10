import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const composePipe: Assignment = {
  id: "compose-pipe",
  topicId: "functions-arrow-this",
  title: "関数を左から順に適用するパイプ",
  difficulty: 2,
  description: `## 関数を左から順に適用するパイプ

任意個数の単項関数を受け取り、それらを **左から順に** 適用する関数を返す高階関数 \`pipe\` を実装してください。

### 入出力例

\`\`\`js
const inc = (n) => n + 1;
const dbl = (n) => n * 2;

pipe(inc, dbl)(3)            // → 8     ((3+1)*2)
pipe(dbl, inc)(3)            // → 7     ((3*2)+1)
pipe(inc, dbl, inc)(3)       // → 9     ((3+1)*2 + 1)
pipe()(42)                   // → 42    (空パイプは恒等関数)
pipe((s) => s.trim())('  a  ')
// → 'a'
\`\`\`

### 制約

- **アロー関数のみ** で実装する（\`function\` 宣言禁止）
- **残余引数** で関数列を受け取る
- \`reduce\` で実装するのが定番
- \`var\` は使わない
`,
  starterCode: `const pipe = (...fns) => (x) => x;
`,
  solution: `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
`,
  entryPoints: ["pipe"],
  tests: [
    {
      name: "(3+1)*2 = 8",
      code: "pipe((n)=>n+1, (n)=>n*2)(3) === 8",
    },
    {
      name: "(3*2)+1 = 7",
      code: "pipe((n)=>n*2, (n)=>n+1)(3) === 7",
    },
    {
      name: "3 段",
      code: "pipe((n)=>n+1, (n)=>n*2, (n)=>n+1)(3) === 9",
    },
    {
      name: "空パイプは恒等",
      code: "pipe()(42) === 42",
    },
    {
      name: "文字列処理",
      code: "pipe((s)=>s.trim())('  a  ') === 'a'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ArrowFunctionExpression",
        label: "アロー関数を使う",
      },
      {
        kind: "node",
        nodeType: "RestElement",
        label: "残余引数 (...fns) を使う",
      },
    ],
    forbidden: [
      {
        kind: "node",
        nodeType: "FunctionDeclaration",
        label: "function 宣言は使わない",
      },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
