import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const arraysIteration: Assignment[] = [
  // ────────────────────────────────────────────────
  // 12-1: 配列の合計 (旧 sum: reduce 必須)
  // ────────────────────────────────────────────────
  {
    id: "sum",
    topicId: "arrays-iteration",
    title: "配列の合計",
    difficulty: 1,
    description: `## 配列の合計

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
    solution: `function sum(numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
`,
    entryPoints: ["sum"],
    tests: [
      { name: "正の整数 [1,2,3] → 6", code: "sum([1,2,3]) === 6" },
      { name: "空配列 [] → 0", code: "sum([]) === 0" },
      {
        name: "負の数を含む [-1,-2,3] → 0",
        code: "sum([-1,-2,3]) === 0",
      },
      {
        name: "小数 [0.5,1.5] → 2",
        code: "Math.abs(sum([0.5,1.5]) - 2) < 1e-9",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "reduce", label: "reduce を使うこと" },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 12-2: 成人のフィルタ (旧 adults: filter 必須)
  // ────────────────────────────────────────────────
  {
    id: "adults",
    topicId: "arrays-iteration",
    title: "成人のフィルタ",
    difficulty: 2,
    description: `## 成人だけを抽出

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
    solution: `function adults(users) {
  return users.filter((u) => u.age >= 18);
}
`,
    entryPoints: ["adults"],
    tests: [
      {
        name: "全員大人",
        code: `JSON.stringify(adults([{name:'A',age:20},{name:'B',age:30}])) === JSON.stringify([{name:'A',age:20},{name:'B',age:30}])`,
      },
      {
        name: "全員子ども",
        code: `JSON.stringify(adults([{name:'A',age:5},{name:'B',age:17}])) === JSON.stringify([])`,
      },
      {
        name: "境界値 18 を含む",
        code: `JSON.stringify(adults([{name:'A',age:17},{name:'B',age:18}])) === JSON.stringify([{name:'B',age:18}])`,
      },
      {
        name: "空配列",
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
      required: [{ kind: "method", name: "filter", label: "filter を使うこと" }],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 12-3: map で値を取り出す
  // ────────────────────────────────────────────────
  {
    id: "pluck-names",
    topicId: "arrays-iteration",
    title: "オブジェクト配列から name を取り出す",
    difficulty: 1,
    description: `## オブジェクト配列から name を取り出す

\`{ name: string, ... }\` の配列を受け取り、名前だけを並べた配列を返す関数 \`pluckNames\` を実装してください。

### 入出力例

\`\`\`js
pluckNames([{name:'A'},{name:'B'},{name:'C'}])
// → ['A','B','C']

pluckNames([{name:'X', age:1}])
// → ['X']

pluckNames([])
// → []
\`\`\`

### 制約

- **\`map\`** を使う
- \`for\` 文は使わない
- \`var\` は使わない
`,
    starterCode: `function pluckNames(items) {
  return [];
}
`,
    solution: `function pluckNames(items) {
  return items.map((x) => x.name);
}
`,
    entryPoints: ["pluckNames"],
    tests: [
      {
        name: "3要素",
        code: "JSON.stringify(pluckNames([{name:'A'},{name:'B'},{name:'C'}])) === JSON.stringify(['A','B','C'])",
      },
      {
        name: "他プロパティを無視",
        code: "JSON.stringify(pluckNames([{name:'X', age:1}])) === JSON.stringify(['X'])",
      },
      {
        name: "空配列",
        code: "JSON.stringify(pluckNames([])) === JSON.stringify([])",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [{ kind: "method", name: "map", label: "map を使う" }],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 12-4: groupBy
  // ────────────────────────────────────────────────
  {
    id: "group-by",
    topicId: "arrays-iteration",
    title: "reduce でキー別にグループ化する",
    difficulty: 3,
    description: `## reduce でキー別にグループ化する

オブジェクトの配列 \`items\` と、各要素からキー文字列を取り出す関数 \`keyFn\` を受け取り、キーごとに要素をまとめたオブジェクトを返す関数 \`groupBy\` を実装してください。

### 入出力例

\`\`\`js
groupBy(
  [{type:'a',v:1},{type:'b',v:2},{type:'a',v:3}],
  (x) => x.type
)
// → { a: [{type:'a',v:1},{type:'a',v:3}], b: [{type:'b',v:2}] }

groupBy([1,2,3,4], (n) => n % 2 === 0 ? 'even' : 'odd')
// → { odd: [1,3], even: [2,4] }

groupBy([], () => 'x')
// → {}
\`\`\`

### 制約

- **\`reduce\`** を使う
- \`for\` 文は使わない
- \`var\` は使わない
- 元の配列を変更しない
`,
    starterCode: `function groupBy(items, keyFn) {
  return {};
}
`,
    solution: `function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const k = keyFn(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}
`,
    entryPoints: ["groupBy"],
    tests: [
      {
        name: "type で分類",
        code: "JSON.stringify(groupBy([{type:'a',v:1},{type:'b',v:2},{type:'a',v:3}], (x)=>x.type)) === JSON.stringify({a:[{type:'a',v:1},{type:'a',v:3}], b:[{type:'b',v:2}]})",
      },
      {
        name: "even/odd",
        code: "JSON.stringify(groupBy([1,2,3,4], (n)=>n%2===0?'even':'odd')) === JSON.stringify({odd:[1,3], even:[2,4]})",
      },
      {
        name: "空配列",
        code: "JSON.stringify(groupBy([], ()=>'x')) === JSON.stringify({})",
      },
      {
        name: "全て同一キー",
        code: "JSON.stringify(groupBy([1,2,3], ()=>'k')) === JSON.stringify({k:[1,2,3]})",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [{ kind: "method", name: "reduce", label: "reduce を使う" }],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 12-5: some / every で全称・存在判定
  // ────────────────────────────────────────────────
  {
    id: "validate-passwords",
    topicId: "arrays-iteration",
    title: "全パスワードの強度を一括判定する",
    difficulty: 2,
    description: `## 全パスワードの強度を一括判定する

文字列の配列 \`passwords\` を受け取り、

- \`{ allStrong: boolean, hasWeak: boolean }\`

を返す関数 \`validatePasswords\` を実装してください。

「**強い**」の定義: 8文字以上、かつ数字を1つ以上含む。
「**弱い**」: それ以外、または **空文字列**。

空配列の場合: \`{ allStrong: true, hasWeak: false }\`（空集合に対する全称は真、存在は偽）。

### 入出力例

\`\`\`js
validatePasswords(['abc12345', 'xyz98765'])
// → { allStrong: true, hasWeak: false }

validatePasswords(['abc12345', 'short'])
// → { allStrong: false, hasWeak: true }

validatePasswords(['abc1234', 'xyz9876'])  // 7文字
// → { allStrong: false, hasWeak: true }

validatePasswords([])
// → { allStrong: true, hasWeak: false }
\`\`\`

### 制約

- **\`every\`** で \`allStrong\` を求める
- **\`some\`** で \`hasWeak\` を求める
- \`for\` 文は使わない
- \`var\` は使わない
`,
    starterCode: `function validatePasswords(passwords) {
  return { allStrong: true, hasWeak: false };
}
`,
    solution: `function validatePasswords(passwords) {
  const isStrong = (p) => p.length >= 8 && /\\d/.test(p);
  return {
    allStrong: passwords.every(isStrong),
    hasWeak: passwords.some((p) => !isStrong(p)),
  };
}
`,
    entryPoints: ["validatePasswords"],
    tests: [
      {
        name: "全強",
        code: "JSON.stringify(validatePasswords(['abc12345','xyz98765'])) === JSON.stringify({allStrong:true,hasWeak:false})",
      },
      {
        name: "弱混在",
        code: "JSON.stringify(validatePasswords(['abc12345','short'])) === JSON.stringify({allStrong:false,hasWeak:true})",
      },
      {
        name: "全て7文字 (弱)",
        code: "JSON.stringify(validatePasswords(['abc1234','xyz9876'])) === JSON.stringify({allStrong:false,hasWeak:true})",
      },
      {
        name: "空配列",
        code: "JSON.stringify(validatePasswords([])) === JSON.stringify({allStrong:true,hasWeak:false})",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "every", label: "every を使う" },
        { kind: "method", name: "some", label: "some を使う" },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },
];
