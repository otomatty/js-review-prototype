import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const strings: Assignment[] = [
  // ────────────────────────────────────────────────
  // 9-1: 大文字化と前後トリム
  // ────────────────────────────────────────────────
  {
    id: "normalize-name",
    topicId: "strings",
    title: "名前を正規化する",
    difficulty: 1,
    description: `## 名前を正規化する

任意の文字列を受け取り、

1. 前後の空白をトリム
2. **先頭1文字だけを大文字**
3. それ以降は **全て小文字**

した文字列を返す関数 \`normalizeName\` を実装してください。空文字や全空白の場合は \`''\` を返してください。

### 入出力例

\`\`\`js
normalizeName('alice')         // → 'Alice'
normalizeName('  BOB  ')       // → 'Bob'
normalizeName('cArOl')         // → 'Carol'
normalizeName('')              // → ''
normalizeName('   ')           // → ''
normalizeName('A')             // → 'A'
\`\`\`

### 制約

- \`String.prototype.trim\` を使う
- \`String.prototype.toUpperCase\` / \`toLowerCase\` を使う
- \`var\` は使わない
`,
    starterCode: `function normalizeName(input) {
  return '';
}
`,
    solution: `function normalizeName(input) {
  const trimmed = input.trim();
  if (trimmed.length === 0) return '';
  return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
}
`,
    entryPoints: ["normalizeName"],
    tests: [
      { name: "alice → Alice", weight: 17, code: "normalizeName('alice') === 'Alice'" },
      {
        name: "前後トリム",
        weight: 17,
        code: "normalizeName('  BOB  ') === 'Bob'",
      },
      {
        name: "混在ケース",
        weight: 16,
        code: "normalizeName('cArOl') === 'Carol'",
      },
      { name: "空文字", weight: 17, code: "normalizeName('') === ''" },
      { name: "空白のみ", weight: 17, code: "normalizeName('   ') === ''" },
      { name: "1文字", weight: 16, code: "normalizeName('A') === 'A'" },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "trim", label: "trim を使う" },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 9-2: split と join で CSV 整形
  // ────────────────────────────────────────────────
  {
    id: "csv-titlecase",
    topicId: "strings",
    title: "CSV をタイトルケースで返す",
    difficulty: 2,
    description: `## CSVをタイトルケースで返す

カンマ区切りの単語列（前後・要素間に空白あり）を受け取り、各単語を **タイトルケース** にして \`', '\` で連結した文字列を返す関数 \`titleCsv\` を実装してください。

タイトルケース: 先頭が大文字・他は小文字（例: \`'apple'\` → \`'Apple'\`）。

### 入出力例

\`\`\`js
titleCsv('apple,banana, CHERRY ')
// → 'Apple, Banana, Cherry'

titleCsv('  alice  ,  BOB  ')
// → 'Alice, Bob'

titleCsv('')
// → ''

titleCsv('one')
// → 'One'

titleCsv('a, , b')
// → 'A, , B'   (空要素はそのまま空のまま)
\`\`\`

### 制約

- **\`split\`** と **\`join\`** を使う
- 配列に対して **\`map\`** で変換する
- \`var\` は使わない
- \`for\` 文は使わない
`,
    starterCode: `function titleCsv(input) {
  return '';
}
`,
    solution: `function titleCsv(input) {
  if (input === '') return '';
  return input
    .split(',')
    .map((s) => {
      const t = s.trim();
      if (t.length === 0) return '';
      return t[0].toUpperCase() + t.slice(1).toLowerCase();
    })
    .join(', ');
}
`,
    entryPoints: ["titleCsv"],
    tests: [
      {
        name: "通常",
        weight: 25,
        code: "titleCsv('apple,banana, CHERRY ') === 'Apple, Banana, Cherry'",
      },
      {
        name: "空白多め",
        weight: 25,
        code: "titleCsv('  alice  ,  BOB  ') === 'Alice, Bob'",
      },
      { name: "空文字", weight: 17, code: "titleCsv('') === ''" },
      { name: "1要素", weight: 17, code: "titleCsv('one') === 'One'" },
      {
        name: "空要素を含む",
        weight: 16,
        code: "titleCsv('a, , b') === 'A, , B'",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "split", label: "split を使う" },
        { kind: "method", name: "join", label: "join を使う" },
        { kind: "method", name: "map", label: "map を使う" },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 9-3: 回文判定
  // ────────────────────────────────────────────────
  {
    id: "is-palindrome",
    topicId: "strings",
    title: "回文かどうか判定する",
    difficulty: 2,
    description: `## 回文かどうか判定する

文字列を受け取り、**英数字以外の文字を除き、大文字小文字を無視**して回文かどうかを返す関数 \`isPalindrome\` を実装してください。

空文字は \`true\`（空文字は回文とみなす）として扱います。

### 入出力例

\`\`\`js
isPalindrome('racecar')                     // → true
isPalindrome('A man a plan a canal Panama') // → true
isPalindrome('hello')                        // → false
isPalindrome('No lemon, no melon')           // → true
isPalindrome('')                             // → true
isPalindrome('a')                            // → true
isPalindrome('ab')                           // → false
\`\`\`

### 制約

- 文字列メソッドや配列メソッドを駆使する
- \`var\` は使わない
- \`for\` 文や \`while\` 文を使わずに書ける（英数字以外の除去には \`String.prototype.replace\` と正規表現、または \`Array.prototype.filter\` を使ってよい）
`,
    starterCode: `function isPalindrome(input) {
  return false;
}
`,
    solution: `function isPalindrome(input) {
  const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}
`,
    entryPoints: ["isPalindrome"],
    tests: [
      {
        name: "racecar",
        weight: 14,
        code: "isPalindrome('racecar') === true",
      },
      {
        name: "句読点無視",
        weight: 14,
        code: "isPalindrome('A man a plan a canal Panama') === true",
      },
      {
        name: "hello は false",
        weight: 14,
        code: "isPalindrome('hello') === false",
      },
      {
        name: "No lemon, no melon",
        weight: 14,
        code: "isPalindrome('No lemon, no melon') === true",
      },
      { name: "空文字", weight: 14, code: "isPalindrome('') === true" },
      { name: "1文字", weight: 14, code: "isPalindrome('a') === true" },
      { name: "ab は false", weight: 16, code: "isPalindrome('ab') === false" },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        {
          kind: "node",
          nodeType: "WhileStatement",
          label: "while 文は使わない",
        },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 9-4: テンプレートリテラルで日付整形
  // ────────────────────────────────────────────────
  {
    id: "format-yyyy-mm-dd",
    topicId: "strings",
    title: "日付を YYYY-MM-DD で整形する",
    difficulty: 2,
    description: `## 日付を YYYY-MM-DD で整形する

\`{ year, month, day }\` を受け取り、\`'YYYY-MM-DD'\` 形式の文字列を返す関数 \`formatYmd\` を実装してください。

- \`year\` は **4桁ゼロパディング**
- \`month\` / \`day\` は **2桁ゼロパディング**
- \`year\` が負・5桁以上、\`month\` が 1-12 外、\`day\` が 1-31 外ならば \`'invalid'\` を返す

### 入出力例

\`\`\`js
formatYmd({ year: 2024, month: 1,  day: 5  })  // → '2024-01-05'
formatYmd({ year: 2024, month: 12, day: 31 })  // → '2024-12-31'
formatYmd({ year: 9, month: 9, day: 9 })        // → '0009-09-09'
formatYmd({ year: -1, month: 1, day: 1 })       // → 'invalid'
formatYmd({ year: 2024, month: 13, day: 1 })    // → 'invalid'
formatYmd({ year: 2024, month: 2, day: 32 })    // → 'invalid'
\`\`\`

(注: 2月の日数や閏年の厳密判定までは要求しません。 \`day\` が 1〜31 の範囲なら有効とします。)

### 制約

- **テンプレートリテラル** で組み立てる
- ゼロパディングは \`String.prototype.padStart\` を使う
- \`var\` は使わない
`,
    starterCode: `function formatYmd(date) {
  return 'invalid';
}
`,
    solution: "function formatYmd(date) {\n  const { year, month, day } = date;\n  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return 'invalid';\n  if (year < 0 || year > 9999) return 'invalid';\n  if (month < 1 || month > 12) return 'invalid';\n  if (day < 1 || day > 31) return 'invalid';\n  const y = String(year).padStart(4, '0');\n  const m = String(month).padStart(2, '0');\n  const d = String(day).padStart(2, '0');\n  return `${y}-${m}-${d}`;\n}\n",
    entryPoints: ["formatYmd"],
    tests: [
      {
        name: "通常",
        weight: 16,
        code: "formatYmd({year:2024,month:1,day:5}) === '2024-01-05'",
      },
      {
        name: "境界",
        weight: 16,
        code: "formatYmd({year:2024,month:12,day:31}) === '2024-12-31'",
      },
      {
        name: "1桁年",
        weight: 17,
        code: "formatYmd({year:9,month:9,day:9}) === '0009-09-09'",
      },
      {
        name: "負の年",
        weight: 17,
        code: "formatYmd({year:-1,month:1,day:1}) === 'invalid'",
      },
      {
        name: "範囲外月",
        weight: 17,
        code: "formatYmd({year:2024,month:13,day:1}) === 'invalid'",
      },
      {
        name: "範囲外日",
        weight: 17,
        code: "formatYmd({year:2024,month:2,day:32}) === 'invalid'",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "テンプレートリテラルを使う",
        },
        { kind: "method", name: "padStart", label: "padStart を使う" },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
