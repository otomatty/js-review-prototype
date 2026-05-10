import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const sumTwo: Assignment = {
  id: "sum-two",
  topicId: "variables-and-types",
  title: "const に値を入れて、その合計を返す",
  difficulty: 1,
  description: `## const に値を入れて、その合計を返す

\`addAges\` 関数を実装してください。 引数 \`childAge\` と \`parentAge\` を受け取り、 **2 人の年齢の合計** を返します。

ただし、 戻り値を作るときに **\`const\` で名前を付けた変数を経由してから return** してください。 ( \`return childAge + parentAge;\` のように直接書かない)

### 学習ポイント

- **\`const 名前 = 値;\`** で「変えない変数」を宣言する。
- 計算結果に **わかりやすい名前を付ける** と、 読んだ人がコードの意図を理解しやすい。
- \`const\` で宣言した変数には、 後から別の値を代入することはできない (=「再代入できない」)。

### 入出力例

\`\`\`js
addAges(7, 35)   // → 42
addAges(0, 0)    // → 0
addAges(20, 50)  // → 70
\`\`\`

### 制約

- 戻り値を作るのに **\`const total = ...\`** のような中間変数を使う
- \`var\` は使わない
`,
  starterCode: `// 子と親の年齢を受け取り、 合計を返す。
//
// 例:
//   addAges(7, 35) → 42
//
// 仕組みの解説:
//   const は「あとで変えない値に名前を付ける」 ための宣言。
//   const total = childAge + parentAge;
//   と書くと、 total という名前で合計を持っておける。
//
// TODO 1: const total = childAge + parentAge; を書く
// TODO 2: その total を return する
function addAges(childAge, parentAge) {
  return 0;
}
`,
  solution: `function addAges(childAge, parentAge) {
  const total = childAge + parentAge;
  return total;
}
`,
  badSolutions: [
    {
      description: "const 中間変数を使わずに直接 return している (制約違反 — required AST が満たされない)",
      code: `function addAges(childAge, parentAge) {
  return childAge + parentAge;
}
`,
    },
    {
      description: "var で宣言してしまっている",
      code: `function addAges(childAge, parentAge) {
  var total = childAge + parentAge;
  return total;
}
`,
    },
  ],
  entryPoints: ["addAges"],
  tests: [
    { name: "通常", code: "addAges(7, 35) === 42" },
    { name: "ゼロを含む", code: "addAges(0, 0) === 0" },
    { name: "大きな数", code: "addAges(20, 50) === 70" },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "VariableDeclaration",
        label: "const で中間変数を宣言する",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [
    { heading: "変数の宣言" },
    { heading: "宣言と初期化" },
  ],
};
