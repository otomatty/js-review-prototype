import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const addTwo: Assignment = {
  id: "add-two",
  topicId: "first-function",
  title: "二つの数を足して返す",
  difficulty: 1,
  description: `## 二つの数を足して返す

\`add\` 関数を実装してください。 引数 \`a\` と \`b\` を受け取り、 その合計を返します。

### この章で学ぶこと

- 引数は **複数** 渡せる ( \`function add(a, b)\` )
- \`+\` 演算子で **数値どうしを足し算** できる

### 入出力例

\`\`\`js
add(1, 2)   // → 3
add(0, 0)   // → 0
add(-3, 8)  // → 5
add(1.5, 2) // → 3.5
\`\`\`

### 制約

- 関数名は \`add\`、 引数名は \`a\`, \`b\` のまま
`,
  starterCode: `// add(a, b) は 2 つの数を足して返す関数です。
//
// 例:
//   add(1, 2)  → 3
//   add(0, 0)  → 0
//   add(-3, 8) → 5
//
// 仕組みの解説:
//   引数を 2 つ書くときは、 カンマで区切る:
//   function 名前(引数1, 引数2) { ... }
//   足し算は a + b で書ける。
//
// return 0 を return a + b に書き換えてください。
function add(a, b) {
  return 0;
}
`,
  solution: `function add(a, b) {
  return a + b;
}
`,
  badSolutions: [
    {
      description: "片方の引数しか使っていない",
      code: `function add(a, b) {
  return a;
}
`,
    },
    {
      description: "引き算になっている",
      code: `function add(a, b) {
  return a - b;
}
`,
    },
  ],
  entryPoints: ["add"],
  tests: [
    { name: "正の数どうし", code: "add(1, 2) === 3" },
    { name: "ゼロを含む", code: "add(0, 0) === 0" },
    { name: "負の数を含む", code: "add(-3, 8) === 5" },
    { name: "小数も足せる", code: "add(1.5, 2) === 3.5" },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    {
      heading: "算術演算子",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Expressions_and_operators",
      anchor: "算術演算子",
    },
  ],
};
