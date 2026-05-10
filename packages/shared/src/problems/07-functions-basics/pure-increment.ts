import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const pureIncrement: Assignment = {
  id: "pure-increment",
  topicId: "functions-basics",
  title: "副作用なしでカウンタを増やす",
  difficulty: 2,
  description: `## 副作用なしでカウンタを増やす

\`{ count }\` の形のオブジェクトと整数 \`amount\` を受け取り、\`count\` を \`amount\` 増やした **新しいオブジェクト** を返す関数 \`incrementCount\` を実装してください。

### 入出力例

\`\`\`js
incrementCount({ count: 0 }, 1)
// → { count: 1 }

incrementCount({ count: 5 }, -3)
// → { count: 2 }

incrementCount({ count: 0, name: 'a' }, 2)
// → { count: 2, name: 'a' }   (count 以外は維持)
\`\`\`

### 重要

- 引数の **オブジェクトを変更してはいけない**（純粋関数）
- 同じ参照は返さない（新しいオブジェクトを返す）

### 制約

- スプレッド構文 \`{ ...state, ... }\` または \`Object.assign({}, ...)\` で新オブジェクトを作る
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
  starterCode: `function incrementCount(state, amount) {
  return state;
}
`,
  solution: `function incrementCount(state, amount) {
  return { ...state, count: state.count + amount };
}
`,
  badSolutions: [
    {
      description: "元のオブジェクトを破壊的に変更してしまう",
      code: `function incrementCount(state, amount) {
  state.count += amount;
  return state;
}
`,
    },
  ],
  entryPoints: ["incrementCount"],
  tests: [
    {
      name: "単純加算",
      code: "JSON.stringify(incrementCount({count:0}, 1)) === JSON.stringify({count:1})",
    },
    {
      name: "減算",
      code: "JSON.stringify(incrementCount({count:5}, -3)) === JSON.stringify({count:2})",
    },
    {
      name: "他プロパティを保持",
      code: "JSON.stringify(incrementCount({count:0,name:'a'}, 2)) === JSON.stringify({count:2,name:'a'})",
    },
    {
      name: "元オブジェクトを変更しない",
      code: "(() => { const s = {count:0}; incrementCount(s, 5); return s.count === 0; })()",
    },
    {
      name: "新しい参照を返す",
      code: "(() => { const s = {count:0}; return incrementCount(s, 1) !== s; })()",
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
