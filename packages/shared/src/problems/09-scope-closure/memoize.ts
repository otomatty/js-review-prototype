import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const memoize: Assignment = {
  id: "memoize",
  topicId: "scope-closure",
  title: "1引数関数のメモ化",
  difficulty: 3,
  description: `## 1引数関数のメモ化

任意の **1引数関数** \`fn\` を受け取り、引数に対する結果をキャッシュする新しい関数を返す \`memoize\` を実装してください。
**同じ引数で2回目以降の呼び出しは \`fn\` を再実行しない**ことが保証される必要があります。

引数のキー化は \`String(arg)\` で十分（テストは数値・文字列・真偽値・null・undefined を渡します）。

### 入出力例

\`\`\`js
let calls = 0;
const slow = (n) => { calls++; return n * n; };
const fast = memoize(slow);

fast(3)   // → 9    (calls === 1)
fast(3)   // → 9    (calls === 1, 再計算されない)
fast(4)   // → 16   (calls === 2)
fast(3)   // → 9    (calls === 2)
\`\`\`

### 制約

- **クロージャ**でキャッシュ（\`Map\` または \`Object.create(null)\` 推奨）を保持する
- グローバル変数禁止
- \`var\` は使わない
- 元の関数の戻り値を改ざんしない
`,
  starterCode: `function memoize(fn) {
  return (arg) => fn(arg);
}
`,
  solution: `function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
`,
  badSolutions: [
    {
      description: "in 演算子だけで判定すると false / undefined / null を再計算してしまう",
      code: `function memoize(fn) {
  const cache = {};
  return (arg) => {
    const key = String(arg);
    if (cache[key] !== undefined) return cache[key];
    const result = fn(arg);
    cache[key] = result;
    return result;
  };
}
`,
    },
  ],
  entryPoints: ["memoize"],
  tests: [
    {
      name: "計算結果が正しい",
      code: "(() => { const f = memoize((n) => n * n); return f(3) === 9 && f(4) === 16; })()",
    },
    {
      name: "同じ引数は1回だけ実行",
      code: "(() => { let c = 0; const f = memoize((n) => { c++; return n; }); f(1); f(1); f(1); return c === 1; })()",
    },
    {
      name: "別の引数は別実行",
      code: "(() => { let c = 0; const f = memoize((n) => { c++; return n; }); f(1); f(2); f(3); return c === 3; })()",
    },
    {
      name: "false を返してもキャッシュする",
      code: "(() => { let c = 0; const f = memoize((x) => { c++; return false; }); f(1); f(1); return c === 1 && f(1) === false; })()",
    },
    {
      name: "undefined を返してもキャッシュする",
      code: "(() => { let c = 0; const f = memoize((x) => { c++; return undefined; }); f(1); f(1); return c === 1 && f(1) === undefined; })()",
    },
    {
      name: "null を返してもキャッシュする",
      code: "(() => { let c = 0; const f = memoize((x) => { c++; return null; }); f(1); f(1); return c === 1 && f(1) === null; })()",
    },
    {
      name: "文字列引数",
      code: "memoize((s) => s.toUpperCase())('hi') === 'HI'",
    },
    {
      name: "別インスタンスはキャッシュを共有しない",
      code: "(() => { let c = 0; const make = () => memoize((n) => { c++; return n; }); make()(1); make()(1); return c === 2; })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
