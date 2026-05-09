import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const scopeClosure: Assignment[] = [
  // ────────────────────────────────────────────────
  // 7-1: カウンタファクトリ
  // ────────────────────────────────────────────────
  {
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
  },

  // ────────────────────────────────────────────────
  // 7-2: メモ化 (memoize)
  // ────────────────────────────────────────────────
  {
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
  },

  // ────────────────────────────────────────────────
  // 7-3: プライベート変数 (シンプルな金庫)
  // ────────────────────────────────────────────────
  {
    id: "make-vault",
    topicId: "scope-closure",
    title: "クロージャでプライベート変数を作る",
    difficulty: 2,
    description: `## クロージャでプライベート変数を作る

数値の初期残高 \`initial\` を受け取り、以下の3つのメソッドを持つオブジェクトを返す関数 \`makeVault\` を実装してください。

- \`deposit(n)\`: 残高に \`n\` を加える（\`n\` は正の整数のみ。それ以外は無視）
- \`withdraw(n)\`: 残高から \`n\` を引く（残高不足や不正な \`n\` の場合は無視）
- \`balance()\`: 現在の残高を返す

返したオブジェクトの **外部から残高に直接アクセスできてはいけません**（クロージャで保護）。

### 入出力例

\`\`\`js
const v = makeVault(100);
v.balance()       // → 100
v.deposit(50);
v.balance()       // → 150
v.withdraw(30);
v.balance()       // → 120
v.withdraw(9999); // 残高不足、無視
v.balance()       // → 120
v.deposit(-10);   // 不正、無視
v.balance()       // → 120
v.balance        // 関数 (プロパティとしての残高は存在しない)
\`\`\`

### 制約

- **クロージャ**で残高を保護する
- 戻り値オブジェクトに残高そのものを露出させない
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `function makeVault(initial) {
  return {
    deposit(n) {},
    withdraw(n) {},
    balance() { return 0; },
  };
}
`,
    solution: `function makeVault(initial) {
  let balance = initial;
  return {
    deposit(n) {
      if (Number.isInteger(n) && n > 0) balance += n;
    },
    withdraw(n) {
      if (Number.isInteger(n) && n > 0 && n <= balance) balance -= n;
    },
    balance() {
      return balance;
    },
  };
}
`,
    entryPoints: ["makeVault"],
    tests: [
      {
        name: "初期残高",
        code: "makeVault(100).balance() === 100",
      },
      {
        name: "deposit",
        code: "(() => { const v = makeVault(100); v.deposit(50); return v.balance() === 150; })()",
      },
      {
        name: "withdraw",
        code: "(() => { const v = makeVault(100); v.withdraw(30); return v.balance() === 70; })()",
      },
      {
        name: "残高不足は無視",
        code: "(() => { const v = makeVault(100); v.withdraw(9999); return v.balance() === 100; })()",
      },
      {
        name: "負数 deposit は無視",
        code: "(() => { const v = makeVault(100); v.deposit(-10); return v.balance() === 100; })()",
      },
      {
        name: "balance は関数 (プロパティ非露出)",
        code: "typeof makeVault(100).balance === 'function'",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
  },
];
