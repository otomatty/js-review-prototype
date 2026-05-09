import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const variablesAndTypes: Assignment[] = [
  // ────────────────────────────────────────────────
  // 1-1: const と let の使い分け
  // ────────────────────────────────────────────────
  {
    id: "let-vs-const",
    topicId: "variables-and-types",
    title: "再代入する値だけを let にする",
    difficulty: 1,
    description: `## 再代入する値だけを let にする

整数 \`n\` を受け取り、\`1\` から \`n\` までの合計を返す関数 \`sumTo\` を実装してください。

学習ポイント: **再代入する値だけ \`let\`、それ以外は \`const\`**。

### 入出力例

\`\`\`js
sumTo(3)   // → 6
sumTo(1)   // → 1
sumTo(0)   // → 0
sumTo(10)  // → 55
\`\`\`

### 制約

- 累計を保持する変数は \`let\` で宣言する
- それ以外（合計値の上限など）は \`const\` で宣言する
- \`var\` は使わない
`,
    starterCode: `function sumTo(n) {
  // 1〜n の合計を返す
  return 0;
}
`,
    solution: `function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
`,
    badSolutions: [
      {
        description: "1から始めず 0 を返す (空ループのバグ)",
        code: `function sumTo(n) {
  let total = 0;
  for (let i = 0; i < n; i++) total += i;
  return total;
}
`,
      },
    ],
    entryPoints: ["sumTo"],
    tests: [
      { name: "sumTo(3) === 6", code: "sumTo(3) === 6" },
      { name: "sumTo(1) === 1", code: "sumTo(1) === 1" },
      { name: "sumTo(0) === 0 (空ループ)", code: "sumTo(0) === 0" },
      { name: "sumTo(10) === 55", code: "sumTo(10) === 55" },
    ],
    eslint: {
      rules: {
        ...COMMON_LINT_RULES,
        "prefer-const": "error",
      },
    },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
  },

  // ────────────────────────────────────────────────
  // 1-2: typeof で型に応じた処理
  // ────────────────────────────────────────────────
  {
    id: "describe-type",
    topicId: "variables-and-types",
    title: "typeof で型を判別する",
    difficulty: 1,
    description: `## typeof で型を判別する

任意の値を受け取り、以下の文字列を返す関数 \`describeType\` を実装してください。

| 入力 | 戻り値 |
|---|---|
| \`number\` | \`"数値"\` |
| \`string\` | \`"文字列"\` |
| \`boolean\` | \`"真偽値"\` |
| \`null\` | \`"なし"\` |
| \`undefined\` | \`"なし"\` |
| その他（オブジェクト・配列・関数） | \`"その他"\` |

注意: \`typeof null\` は \`"object"\` を返す JavaScript の落とし穴があります。

### 入出力例

\`\`\`js
describeType(42)         // → '数値'
describeType('hi')       // → '文字列'
describeType(true)       // → '真偽値'
describeType(null)       // → 'なし'
describeType(undefined)  // → 'なし'
describeType([])         // → 'その他'
describeType({})         // → 'その他'
describeType(() => 1)    // → 'その他'
\`\`\`

### 制約

- \`typeof\` を必ず使う
- \`==\` / \`!=\` は使わない（厳密比較を使う）
`,
    starterCode: `function describeType(value) {
  return 'その他';
}
`,
    solution: `function describeType(value) {
  if (value === null) return 'なし';
  const t = typeof value;
  if (t === 'number') return '数値';
  if (t === 'string') return '文字列';
  if (t === 'boolean') return '真偽値';
  if (t === 'undefined') return 'なし';
  return 'その他';
}
`,
    badSolutions: [
      {
        description: "typeof null === 'object' の落とし穴を考慮しない",
        code: `function describeType(value) {
  const t = typeof value;
  if (t === 'number') return '数値';
  if (t === 'string') return '文字列';
  if (t === 'boolean') return '真偽値';
  if (t === 'undefined') return 'なし';
  return 'その他';
}
`,
      },
    ],
    entryPoints: ["describeType"],
    tests: [
      { name: "数値", code: "describeType(42) === '数値'" },
      { name: "文字列", code: "describeType('hi') === '文字列'" },
      { name: "真偽値", code: "describeType(true) === '真偽値'" },
      { name: "null は 'なし'", code: "describeType(null) === 'なし'" },
      {
        name: "undefined は 'なし'",
        code: "describeType(undefined) === 'なし'",
      },
      {
        name: "配列は 'その他'",
        code: "describeType([1,2]) === 'その他'",
      },
      {
        name: "関数は 'その他'",
        code: "describeType(() => 1) === 'その他'",
      },
    ],
    eslint: {
      rules: { ...COMMON_LINT_RULES },
    },
    ast: {
      forbidden: [
        { kind: "loose-eq", label: "== / != は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 1-3: 数値文字列のパース
  // ────────────────────────────────────────────────
  {
    id: "parse-int-safe",
    topicId: "variables-and-types",
    title: "安全に整数化する",
    difficulty: 2,
    description: `## 安全に整数化する

任意の値を受け取り、**整数に変換できれば数値で**、できなければ \`null\` を返す関数 \`toIntOrNull\` を実装してください。

### 入出力例

\`\`\`js
toIntOrNull('42')      // → 42
toIntOrNull('  -7  ')  // → -7
toIntOrNull(3.14)      // → 3       (小数は切り捨て)
toIntOrNull('3.9')     // → 3
toIntOrNull('abc')     // → null
toIntOrNull('')        // → null
toIntOrNull(null)      // → null
toIntOrNull(undefined) // → null
toIntOrNull(NaN)       // → null
toIntOrNull(true)      // → null    (真偽値は対象外)
\`\`\`

### 制約

- \`Number.isFinite\` または \`Number.isNaN\` を使ってチェックする
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `function toIntOrNull(value) {
  return null;
}
`,
    solution: `function toIntOrNull(value) {
  if (typeof value === 'boolean') return null;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return Math.trunc(value);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return null;
    return Math.trunc(n);
  }
  return null;
}
`,
    entryPoints: ["toIntOrNull"],
    tests: [
      { name: "数字文字列", code: "toIntOrNull('42') === 42" },
      {
        name: "前後空白を許容",
        code: "toIntOrNull('  -7  ') === -7",
      },
      {
        name: "小数は切り捨て",
        code: "toIntOrNull(3.14) === 3",
      },
      {
        name: "小数文字列",
        code: "toIntOrNull('3.9') === 3",
      },
      {
        name: "非数値文字列は null",
        code: "toIntOrNull('abc') === null",
      },
      {
        name: "空文字は null",
        code: "toIntOrNull('') === null",
      },
      {
        name: "null は null",
        code: "toIntOrNull(null) === null",
      },
      {
        name: "NaN は null",
        code: "toIntOrNull(NaN) === null",
      },
      {
        name: "真偽値は null (型を厳しく)",
        code: "toIntOrNull(true) === null",
      },
    ],
    eslint: {
      rules: { ...COMMON_LINT_RULES },
    },
    ast: {
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 1-4: テンプレートリテラルでの整形
  // ────────────────────────────────────────────────
  {
    id: "format-greeting",
    topicId: "variables-and-types",
    title: "テンプレートリテラルで挨拶を組み立てる",
    difficulty: 1,
    description: `## テンプレートリテラルで挨拶を組み立てる

\`{ name, age }\` を受け取り、\`"こんにちは、{name}さん（{age}歳）！"\` という文字列を返す関数 \`greet\` を実装してください。

### 入出力例

\`\`\`js
greet({ name: 'Alice', age: 30 })
// → 'こんにちは、Aliceさん（30歳）！'

greet({ name: '太郎', age: 0 })
// → 'こんにちは、太郎さん（0歳）！'
\`\`\`

### 制約

- **テンプレートリテラル**（バッククォートで囲む文字列）を使う
- \`+\` 演算子による文字列連結は禁止（\`label += '...'\` も禁止）
- \`var\` は使わない
`,
    starterCode: `function greet(user) {
  return '';
}
`,
    solution: "function greet(user) {\n  const { name, age } = user;\n  return `こんにちは、${name}さん（${age}歳）！`;\n}\n",
    entryPoints: ["greet"],
    tests: [
      {
        name: "Alice / 30",
        code: "greet({name:'Alice', age:30}) === 'こんにちは、Aliceさん（30歳）！'",
      },
      {
        name: "太郎 / 0 (年齢0でも0と表示)",
        code: "greet({name:'太郎', age:0}) === 'こんにちは、太郎さん（0歳）！'",
      },
      {
        name: "空文字の名前でも結合される",
        code: "greet({name:'', age:5}) === 'こんにちは、さん（5歳）！'",
      },
    ],
    eslint: {
      rules: {
        ...COMMON_LINT_RULES,
        "prefer-template": "error",
      },
    },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "テンプレートリテラルを使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
  },
];
