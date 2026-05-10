import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const makeCounter: Assignment = {
  id: "make-counter",
  topicId: "scope-closure",
  title: "カウンタを生成するクロージャ",
  difficulty: 1,
  description: `## カウンタを生成するクロージャ

呼び出すたびに **1 ずつ増加した値**を返す関数を、クロージャを使って生成する関数 \`makeCounter\` を実装してください。

\`makeCounter()\` が返す関数を呼び出すごとに、内部の状態が \`1, 2, 3, ...\` と進みます。

### 入出力例

\`\`\`js
const c = makeCounter();
c()   // → 1
c()   // → 2
c()   // → 3

const c2 = makeCounter();
c2()  // → 1   (独立した状態)
c()   // → 4   (元の c には影響なし)
\`\`\`

### 制約

- **クロージャ**で内部状態を保持する（外部スコープに変数を漏らさない）
- グローバル変数は禁止
- \`makeCounter\` から返す関数は **アロー関数** か **関数式**
- \`var\` は使わない
`,
  starterCode: `function makeCounter() {
  return () => 0;
}
`,
  solution: `function makeCounter() {
  let count = 0;
  return () => ++count;
}
`,
  entryPoints: ["makeCounter"],
  tests: [
    {
      name: "初回は 1",
      code: "makeCounter()() === 1",
    },
    {
      name: "1, 2, 3 と増える",
      code: "(() => { const c = makeCounter(); return c() === 1 && c() === 2 && c() === 3; })()",
    },
    {
      name: "独立したインスタンス",
      code: "(() => { const a = makeCounter(); const b = makeCounter(); a(); a(); return a() === 3 && b() === 1; })()",
    },
    {
      name: "状態のリーク無し (戻り値は数値)",
      code: "(() => { const c = makeCounter(); return typeof c() === 'number'; })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
