import type { Assignment } from "./types.js";

/**
 * 課題定義 (3問固定)。
 *
 * このファイルがクライアントに含まれることで、UI が課題を切り替えられる。
 * サーバはこのファイルを import せず、リクエストに含まれる tests 配列をそのまま実行する。
 */

const COMMON_LINT_RULES = {
  eqeqeq: "error",
  "no-var": "error",
  "prefer-const": "warn",
} as const;

export const assignments: Assignment[] = [
  // ─────────────────────────────────────────────────────
  // 課題1: 配列の合計
  // ─────────────────────────────────────────────────────
  {
    id: "sum",
    title: "配列の合計",
    difficulty: 1,
    description: `## 課題1: 配列の合計

数値の配列を受け取り、その合計を返す関数 \`sum\` を実装してください。

### 入出力例

\`\`\`js
sum([1, 2, 3])      // → 6
sum([])             // → 0
sum([-1, -2, 3])    // → 0
sum([0.5, 1.5])     // → 2
\`\`\`

### 制約

- \`reduce\` を使うこと
- \`for\` 文や \`var\` は使わないこと
`,
    starterCode: `function sum(numbers) {
  // ここに実装してください
  return 0;
}
`,
    entryPoints: ["sum"],
    tests: [
      { name: "正の整数 [1,2,3] → 6", weight: 25, code: "sum([1,2,3]) === 6" },
      { name: "空配列 [] → 0", weight: 25, code: "sum([]) === 0" },
      {
        name: "負の数を含む [-1,-2,3] → 0",
        weight: 25,
        code: "sum([-1,-2,3]) === 0",
      },
      {
        name: "小数 [0.5,1.5] → 2",
        weight: 25,
        code: "Math.abs(sum([0.5,1.5]) - 2) < 1e-9",
      },
    ],
    eslint: {
      rules: {
        ...COMMON_LINT_RULES,
      },
    },
    ast: {
      required: [
        { kind: "method", name: "reduce", label: "reduce を使うこと" },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: { test: 70, lint: 15, ast: 15 },
  },

  // ─────────────────────────────────────────────────────
  // 課題2: オブジェクト配列のフィルタ
  // ─────────────────────────────────────────────────────
  {
    id: "adults",
    title: "成人のフィルタ",
    difficulty: 2,
    description: `## 課題2: 成人だけを抽出

ユーザー配列 \`users\` (\`{name: string, age: number}\` の配列) を受け取り、 \`age\` が **18歳以上** の人だけを抽出した配列を返す関数 \`adults\` を実装してください。

### 入出力例

\`\`\`js
adults([
  { name: 'Alice', age: 17 },
  { name: 'Bob', age: 18 },
  { name: 'Carol', age: 30 },
])
// → [{ name: 'Bob', age: 18 }, { name: 'Carol', age: 30 }]
\`\`\`

### 制約

- \`filter\` を使うこと
- \`for\` 文は使わないこと
`,
    starterCode: `function adults(users) {
  // ここに実装してください
  return [];
}
`,
    entryPoints: ["adults"],
    tests: [
      {
        name: "全員大人",
        weight: 25,
        code: `JSON.stringify(adults([{name:'A',age:20},{name:'B',age:30}])) === JSON.stringify([{name:'A',age:20},{name:'B',age:30}])`,
      },
      {
        name: "全員子ども",
        weight: 25,
        code: `JSON.stringify(adults([{name:'A',age:5},{name:'B',age:17}])) === JSON.stringify([])`,
      },
      {
        name: "境界値 18 を含む",
        weight: 25,
        code: `JSON.stringify(adults([{name:'A',age:17},{name:'B',age:18}])) === JSON.stringify([{name:'B',age:18}])`,
      },
      {
        name: "空配列",
        weight: 25,
        code: `JSON.stringify(adults([])) === JSON.stringify([])`,
      },
    ],
    eslint: {
      rules: {
        ...COMMON_LINT_RULES,
        "no-unused-vars": "warn",
      },
    },
    ast: {
      required: [
        { kind: "method", name: "filter", label: "filter を使うこと" },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      ],
    },
    weights: { test: 70, lint: 15, ast: 15 },
  },

  // ─────────────────────────────────────────────────────
  // 課題3: 文字列の頻度カウント
  // ─────────────────────────────────────────────────────
  {
    id: "countChars",
    title: "文字頻度カウント",
    difficulty: 3,
    description: `## 課題3: 文字頻度カウント

文字列を受け取り、各文字の出現回数を表すオブジェクトを返す関数 \`countChars\` を実装してください。

### 入出力例

\`\`\`js
countChars('aabbc')     // → { a: 2, b: 2, c: 1 }
countChars('')          // → {}
countChars('あああ')     // → { 'あ': 3 }
\`\`\`

### 制約

- \`var\` は使わないこと (実装方針は自由)
`,
    starterCode: `function countChars(str) {
  // ここに実装してください
  return {};
}
`,
    entryPoints: ["countChars"],
    tests: [
      {
        name: "英字 'aabbc'",
        weight: 20,
        code: `JSON.stringify(countChars('aabbc')) === JSON.stringify({a:2,b:2,c:1})`,
      },
      {
        name: "空文字 ''",
        weight: 20,
        code: `JSON.stringify(countChars('')) === JSON.stringify({})`,
      },
      {
        name: "単一文字 'aaaa'",
        weight: 20,
        code: `JSON.stringify(countChars('aaaa')) === JSON.stringify({a:4})`,
      },
      {
        name: "日本語 'あああ'",
        weight: 20,
        code: `JSON.stringify(countChars('あああ')) === JSON.stringify({'あ':3})`,
      },
      {
        name: "数字混在 'a1a1'",
        weight: 20,
        code: `JSON.stringify(countChars('a1a1')) === JSON.stringify({a:2,'1':2})`,
      },
    ],
    eslint: {
      rules: {
        ...COMMON_LINT_RULES,
      },
    },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: { test: 70, lint: 15, ast: 15 },
  },
];

export function findAssignment(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id);
}
