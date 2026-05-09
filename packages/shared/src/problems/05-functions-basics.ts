import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const functionsBasics: Assignment[] = [
  // ────────────────────────────────────────────────
  // 5-1: デフォルト引数
  // ────────────────────────────────────────────────
  {
    id: "default-greeting",
    topicId: "functions-basics",
    title: "デフォルト引数で挨拶を作る",
    difficulty: 1,
    description: `## デフォルト引数で挨拶を作る

\`name\` と \`prefix\` を受け取り、\`"{prefix} {name}"\` を返す関数 \`greet\` を実装してください。

- \`prefix\` が省略された場合は \`'Hello,'\` を使う
- \`prefix\` に空文字 \`''\` が**明示的**に渡された場合は **そのまま空文字を使う**（先頭スペースができないように整形）

注意: \`prefix\` が省略された場合（\`undefined\`）と、明示的に \`''\` を渡された場合を区別すること。これは \`||\` を使うと混同しやすい有名な落とし穴です。

### 入出力例

\`\`\`js
greet('Alice')          // → 'Hello, Alice'
greet('Alice', 'やあ')   // → 'やあ Alice'
greet('Alice', '')      // → 'Alice'
greet('Alice', undefined) // → 'Hello, Alice'
\`\`\`

### 制約

- **デフォルト引数構文**（\`function greet(name, prefix = 'Hello,')\`）を使う
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `function greet(name, prefix) {
  return '';
}
`,
    solution: "function greet(name, prefix = 'Hello,') {\n  if (prefix === '') return name;\n  return `${prefix} ${name}`;\n}\n",
    badSolutions: [
      {
        description: "|| でフォールバックすると空文字を巻き込み 'Hello, Alice' になる",
        code: "function greet(name, prefix) {\n  const p = prefix || 'Hello,';\n  return `${p} ${name}`;\n}\n",
      },
    ],
    entryPoints: ["greet"],
    tests: [
      {
        name: "省略",
        code: "greet('Alice') === 'Hello, Alice'",
      },
      {
        name: "明示プレフィックス",
        code: "greet('Alice', 'やあ') === 'やあ Alice'",
      },
      {
        name: "空文字プレフィックスは保持",
        code: "greet('Alice', '') === 'Alice'",
      },
      {
        name: "undefined はデフォルト",
        code: "greet('Alice', undefined) === 'Hello, Alice'",
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

  // ────────────────────────────────────────────────
  // 5-2: 残余引数
  // ────────────────────────────────────────────────
  {
    id: "rest-average",
    topicId: "functions-basics",
    title: "残余引数で平均を計算する",
    difficulty: 1,
    description: `## 残余引数で平均を計算する

任意個数の数値を可変長引数で受け取り、その算術平均を返す関数 \`average\` を実装してください。
**引数が 0 個**の場合は \`0\` を返してください。

### 入出力例

\`\`\`js
average(1, 2, 3)        // → 2
average(10)             // → 10
average()               // → 0
average(1.5, 2.5)       // → 2
average(-1, 1)          // → 0
\`\`\`

### 制約

- **残余引数 (\`...args\`)** を使って引数を配列で受け取る
- \`var\` は使わない
- 配列やオブジェクトを引数として渡す形にしない（あくまで可変長個別引数）
`,
    starterCode: `function average() {
  return 0;
}
`,
    solution: `function average(...args) {
  if (args.length === 0) return 0;
  const total = args.reduce((a, b) => a + b, 0);
  return total / args.length;
}
`,
    entryPoints: ["average"],
    tests: [
      { name: "3 引数", code: "average(1,2,3) === 2" },
      { name: "1 引数", code: "average(10) === 10" },
      { name: "0 引数", code: "average() === 0" },
      {
        name: "小数",
        code: "Math.abs(average(1.5, 2.5) - 2) < 1e-9",
      },
      { name: "符号混在", code: "average(-1, 1) === 0" },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "RestElement",
          label: "残余引数 (...args) を使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
  },

  // ────────────────────────────────────────────────
  // 5-3: 純粋関数化
  // ────────────────────────────────────────────────
  {
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
  },

  // ────────────────────────────────────────────────
  // 5-4: 関数式 (function expression)
  // ────────────────────────────────────────────────
  {
    id: "function-expression-power",
    topicId: "functions-basics",
    title: "関数式で累乗を計算する",
    difficulty: 2,
    description: `## 関数式で累乗を計算する

\`base\` と非負整数 \`exp\` を受け取り、\`base ** exp\` を返す関数 \`power\` を、**関数式 (\`const power = function(...) { ... }\`)** として実装してください。

\`exp\` が負または整数でない場合は \`NaN\` を返してください。 \`base ** 0 === 1\`（\`0 ** 0\` も 1）。

### 入出力例

\`\`\`js
power(2, 10)    // → 1024
power(3, 0)     // → 1
power(0, 0)     // → 1
power(5, 1)     // → 5
power(2, -1)    // → NaN
power(2, 1.5)   // → NaN
\`\`\`

### 制約

- **関数式** で実装する（\`function\` 宣言は禁止）
- \`Math.pow\` / \`**\` 演算子は禁止 — \`for\` ループまたは再帰で計算する
- \`var\` は使わない
`,
    starterCode: `const power = function(base, exp) {
  return NaN;
};
`,
    solution: `const power = function(base, exp) {
  if (!Number.isInteger(exp) || exp < 0) return NaN;
  let result = 1;
  for (let i = 0; i < exp; i++) {
    result *= base;
  }
  return result;
};
`,
    entryPoints: ["power"],
    tests: [
      { name: "2^10", code: "power(2, 10) === 1024" },
      { name: "3^0 = 1", code: "power(3, 0) === 1" },
      { name: "0^0 = 1", code: "power(0, 0) === 1" },
      { name: "5^1 = 5", code: "power(5, 1) === 5" },
      {
        name: "負の指数は NaN",
        code: "Number.isNaN(power(2, -1))",
      },
      {
        name: "小数の指数は NaN",
        code: "Number.isNaN(power(2, 1.5))",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "FunctionExpression",
          label: "関数式 (const f = function() {...}) を使う",
        },
      ],
      forbidden: [
        {
          kind: "node",
          nodeType: "FunctionDeclaration",
          label: "function 宣言は使わない",
        },
        { kind: "method", name: "pow", label: "Math.pow は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },
];
