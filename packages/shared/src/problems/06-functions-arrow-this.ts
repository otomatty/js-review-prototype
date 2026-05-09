import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const functionsArrowThis: Assignment[] = [
  // ────────────────────────────────────────────────
  // 6-1: アロー関数で 2 倍にする
  // ────────────────────────────────────────────────
  {
    id: "arrow-double",
    topicId: "functions-arrow-this",
    title: "アロー関数で値を2倍にする",
    difficulty: 1,
    description: `## アロー関数で値を2倍にする

数値 \`n\` を受け取り、\`n * 2\` を返す関数 \`double\` を **アロー関数** で実装してください。

### 入出力例

\`\`\`js
double(3)    // → 6
double(0)    // → 0
double(-4)   // → -8
double(0.5)  // → 1
\`\`\`

### 制約

- アロー関数 \`const double = (n) => ...\` または \`const double = n => ...\` で書く
- \`function\` 宣言は禁止
- \`var\` は使わない
`,
    starterCode: `const double = (n) => 0;
`,
    solution: `const double = (n) => n * 2;
`,
    entryPoints: ["double"],
    tests: [
      { name: "3", code: "double(3) === 6" },
      { name: "0", code: "double(0) === 0" },
      { name: "負数", code: "double(-4) === -8" },
      { name: "小数", code: "Math.abs(double(0.5) - 1) < 1e-9" },
    ],
    eslint: {
      rules: {
        ...COMMON_LINT_RULES,
        "prefer-arrow-callback": "error",
      },
    },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ArrowFunctionExpression",
          label: "アロー関数で実装する",
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
  },

  // ────────────────────────────────────────────────
  // 6-2: コールバックを受け取る (高階関数)
  // ────────────────────────────────────────────────
  {
    id: "apply-twice",
    topicId: "functions-arrow-this",
    title: "関数を2回適用する高階関数",
    difficulty: 2,
    description: `## 関数を2回適用する高階関数

関数 \`fn\` と値 \`x\` を受け取り、\`fn(fn(x))\` を返す関数 \`applyTwice\` を実装してください。

### 入出力例

\`\`\`js
applyTwice((n) => n + 1, 5)        // → 7
applyTwice((s) => s + '!', 'hi')   // → 'hi!!'
applyTwice((arr) => [...arr, 0], [1, 2])
// → [1, 2, 0, 0]
\`\`\`

### 制約

- **アロー関数** で実装する
- \`function\` 宣言は禁止
- \`var\` は使わない
`,
    starterCode: `const applyTwice = (fn, x) => x;
`,
    solution: `const applyTwice = (fn, x) => fn(fn(x));
`,
    entryPoints: ["applyTwice"],
    tests: [
      {
        name: "数値 +1 を 2 回",
        code: "applyTwice((n) => n + 1, 5) === 7",
      },
      {
        name: "文字列追記",
        code: "applyTwice((s) => s + '!', 'hi') === 'hi!!'",
      },
      {
        name: "配列",
        code: "JSON.stringify(applyTwice((arr) => [...arr, 0], [1,2])) === JSON.stringify([1,2,0,0])",
      },
      {
        name: "恒等関数",
        code: "applyTwice((v) => v, 42) === 42",
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
  },

  // ────────────────────────────────────────────────
  // 6-3: 関数合成
  // ────────────────────────────────────────────────
  {
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
  },

  // ────────────────────────────────────────────────
  // 6-4: アロー関数の this バインドを利用する
  // ────────────────────────────────────────────────
  {
    id: "delayed-greeter",
    topicId: "functions-arrow-this",
    title: "後で呼び出す関数を作る",
    difficulty: 2,
    description: `## 後で呼び出す関数を作る

文字列 \`name\` を受け取り、\`'Hello, {name}!'\` を返す **引数なしの関数** を返す高階関数 \`makeGreeter\` を実装してください。

返り値の関数を後から呼び出しても、最初に渡した \`name\` で挨拶を作れる必要があります。

### 入出力例

\`\`\`js
const greetAlice = makeGreeter('Alice');
greetAlice()    // → 'Hello, Alice!'
greetAlice()    // → 'Hello, Alice!'  (何度呼んでも同じ)

const greetBob = makeGreeter('Bob');
greetBob()      // → 'Hello, Bob!'
greetAlice()    // → 'Hello, Alice!'  (Bob を作っても Alice は壊れない)
\`\`\`

### 制約

- **アロー関数** で実装する
- **テンプレートリテラル** で挨拶を組み立てる
- \`function\` 宣言は禁止
- \`var\` は使わない
`,
    starterCode: `const makeGreeter = (name) => () => '';
`,
    solution: "const makeGreeter = (name) => () => `Hello, ${name}!`;\n",
    entryPoints: ["makeGreeter"],
    tests: [
      {
        name: "Alice",
        code: "makeGreeter('Alice')() === 'Hello, Alice!'",
      },
      {
        name: "何度呼んでも同じ",
        code: "(() => { const g = makeGreeter('Alice'); return g() === 'Hello, Alice!' && g() === 'Hello, Alice!'; })()",
      },
      {
        name: "別インスタンスは独立",
        code: "(() => { const a = makeGreeter('Alice'); const b = makeGreeter('Bob'); return a() === 'Hello, Alice!' && b() === 'Hello, Bob!'; })()",
      },
      {
        name: "空文字でも組み立てる",
        code: "makeGreeter('')() === 'Hello, !'",
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
          nodeType: "TemplateLiteral",
          label: "テンプレートリテラルを使う",
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
  },
];
