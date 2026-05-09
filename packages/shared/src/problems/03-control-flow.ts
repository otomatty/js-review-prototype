import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const controlFlow: Assignment[] = [
  // ────────────────────────────────────────────────
  // 3-1: 早期 return でネストを浅くする
  // ────────────────────────────────────────────────
  {
    id: "early-return-discount",
    topicId: "control-flow",
    title: "早期returnで割引判定をフラットにする",
    difficulty: 1,
    description: `## 早期returnで割引判定をフラットにする

\`{ price, isMember, isWeekend }\` を受け取り、適用後の価格を返す関数 \`finalPrice\` を実装してください。

ルール（**上から順に評価**）:

1. \`price\` が \`0\` 以下 → そのまま返す
2. \`isMember && isWeekend\` → 30% 引き（\`Math.round\` で整数化）
3. \`isMember\` のみ → 10% 引き
4. \`isWeekend\` のみ → 5% 引き
5. それ以外 → 値引きなし

### 入出力例

\`\`\`js
finalPrice({ price: 1000, isMember: true,  isWeekend: true  })  // → 700
finalPrice({ price: 1000, isMember: true,  isWeekend: false })  // → 900
finalPrice({ price: 1000, isMember: false, isWeekend: true  })  // → 950
finalPrice({ price: 1000, isMember: false, isWeekend: false })  // → 1000
finalPrice({ price: 0,    isMember: true,  isWeekend: true  })  // → 0
finalPrice({ price: -50,  isMember: true,  isWeekend: true  })  // → -50
\`\`\`

### 制約

- 早期 \`return\` パターンを使う（\`if\` のネストを 1 段までに抑える）
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `function finalPrice(input) {
  return 0;
}
`,
    solution: `function finalPrice(input) {
  const { price, isMember, isWeekend } = input;
  if (price <= 0) return price;
  if (isMember && isWeekend) return Math.round(price * 0.7);
  if (isMember) return Math.round(price * 0.9);
  if (isWeekend) return Math.round(price * 0.95);
  return price;
}
`,
    entryPoints: ["finalPrice"],
    tests: [
      {
        name: "会員 × 週末 → 30%off",
        code: "finalPrice({price:1000,isMember:true,isWeekend:true}) === 700",
      },
      {
        name: "会員のみ → 10%off",
        code: "finalPrice({price:1000,isMember:true,isWeekend:false}) === 900",
      },
      {
        name: "週末のみ → 5%off",
        code: "finalPrice({price:1000,isMember:false,isWeekend:true}) === 950",
      },
      {
        name: "通常価格",
        code: "finalPrice({price:1000,isMember:false,isWeekend:false}) === 1000",
      },
      {
        name: "0 円はそのまま",
        code: "finalPrice({price:0,isMember:true,isWeekend:true}) === 0",
      },
      {
        name: "負の価格はそのまま",
        code: "finalPrice({price:-50,isMember:true,isWeekend:true}) === -50",
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
  // 3-2: switch で分類
  // ────────────────────────────────────────────────
  {
    id: "weekday-jp",
    topicId: "control-flow",
    title: "switch で曜日番号を日本語に変換する",
    difficulty: 1,
    description: `## switch で曜日番号を日本語に変換する

\`0\` 〜 \`6\` の整数を受け取り、

| 入力 | 戻り値 |
|---|---|
| \`0\` | \`'日'\` |
| \`1\` | \`'月'\` |
| \`2\` | \`'火'\` |
| \`3\` | \`'水'\` |
| \`4\` | \`'木'\` |
| \`5\` | \`'金'\` |
| \`6\` | \`'土'\` |
| その他 | \`'不明'\` |

を返す関数 \`weekdayJa\` を実装してください。

### 入出力例

\`\`\`js
weekdayJa(0)    // → '日'
weekdayJa(3)    // → '水'
weekdayJa(7)    // → '不明'
weekdayJa(-1)   // → '不明'
weekdayJa('0')  // → '不明'  (型違いも不明)
\`\`\`

### 制約

- **\`switch\` 文** で実装する
- \`var\` は使わない
- 配列やオブジェクトを使った辞書引きは禁止（\`switch\` の練習）
`,
    starterCode: `function weekdayJa(n) {
  return '不明';
}
`,
    solution: `function weekdayJa(n) {
  switch (n) {
    case 0: return '日';
    case 1: return '月';
    case 2: return '火';
    case 3: return '水';
    case 4: return '木';
    case 5: return '金';
    case 6: return '土';
    default: return '不明';
  }
}
`,
    entryPoints: ["weekdayJa"],
    tests: [
      { name: "0 → 日", code: "weekdayJa(0) === '日'" },
      { name: "1 → 月", code: "weekdayJa(1) === '月'" },
      { name: "2 → 火", code: "weekdayJa(2) === '火'" },
      { name: "3 → 水", code: "weekdayJa(3) === '水'" },
      { name: "4 → 木", code: "weekdayJa(4) === '木'" },
      { name: "5 → 金", code: "weekdayJa(5) === '金'" },
      { name: "6 → 土", code: "weekdayJa(6) === '土'" },
      {
        name: "範囲外は 不明",
        code: "weekdayJa(7) === '不明' && weekdayJa(-1) === '不明'",
      },
      {
        name: "型違いは 不明",
        code: "weekdayJa('0') === '不明'",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "SwitchStatement",
          label: "switch 文を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 3-3: truthy/falsy の意識
  // ────────────────────────────────────────────────
  {
    id: "is-blank",
    topicId: "control-flow",
    title: "空とみなせる値を判定する",
    difficulty: 2,
    description: `## 空とみなせる値を判定する

任意の値を受け取り、「**空**」とみなせる場合に \`true\`、そうでなければ \`false\` を返す関数 \`isBlank\` を実装してください。

「空」の定義:

- \`null\` または \`undefined\`
- 空文字 \`''\` または **空白だけの文字列**（\`'  '\` や \`'\\n\\t'\`）
- 空配列 \`[]\`
- 空オブジェクト \`{}\` （プロパティ 0 個）

「空ではない」例:

- \`0\`, \`false\`, \`NaN\` は **空ではない**（プリミティブとしては値がある）
- \`'  a  '\`（中身がある）
- \`[null]\`（要素 1 個）
- \`{ a: undefined }\`（キーが 1 個）

### 入出力例

\`\`\`js
isBlank(null)        // → true
isBlank(undefined)   // → true
isBlank('')          // → true
isBlank('   ')       // → true
isBlank([])          // → true
isBlank({})          // → true

isBlank(0)           // → false
isBlank(false)       // → false
isBlank(NaN)         // → false
isBlank('a')         // → false
isBlank([null])      // → false
isBlank({a:undefined}) // → false
\`\`\`

### 制約

- \`var\` は使わない
- 真偽値で短絡的に判定（\`!value\`）すると \`0\` や \`false\` を巻き込んで誤検知することに注意
`,
    starterCode: `function isBlank(value) {
  return false;
}
`,
    solution: `function isBlank(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
`,
    badSolutions: [
      {
        description: "!value で短絡判定すると 0 や false を空扱いしてしまう",
        code: `function isBlank(value) {
  if (!value) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
`,
      },
    ],
    entryPoints: ["isBlank"],
    tests: [
      { name: "null", code: "isBlank(null) === true" },
      { name: "undefined", code: "isBlank(undefined) === true" },
      { name: "空文字", code: "isBlank('') === true" },
      { name: "空白のみ", code: "isBlank('   ') === true" },
      {
        name: "改行・タブのみ",
        code: "isBlank('\\n\\t') === true",
      },
      { name: "空配列", code: "isBlank([]) === true" },
      { name: "空オブジェクト", code: "isBlank({}) === true" },
      { name: "0 は false", code: "isBlank(0) === false" },
      { name: "false は false", code: "isBlank(false) === false" },
      { name: "NaN は false", code: "isBlank(NaN) === false" },
      {
        name: "中身ありの配列",
        code: "isBlank([null]) === false",
      },
      {
        name: "キーありのオブジェクト",
        code: "isBlank({a:undefined}) === false",
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
  // 3-4: BMI 分類 (ガード節 + 段階的な if)
  // ────────────────────────────────────────────────
  {
    id: "bmi-category",
    topicId: "control-flow",
    title: "BMIをカテゴリに分類する",
    difficulty: 2,
    description: `## BMIをカテゴリに分類する

身長 (m) と体重 (kg) を受け取り、BMI のカテゴリ文字列を返す関数 \`bmiCategory\` を実装してください。

BMI = \`weight / (height ** 2)\` を計算し、

| 範囲 | 戻り値 |
|---|---|
| \`bmi < 18.5\` | \`'低体重'\` |
| \`18.5 <= bmi < 25\` | \`'普通体重'\` |
| \`25 <= bmi < 30\` | \`'肥満(1度)'\` |
| \`30 <= bmi\` | \`'肥満(2度以上)'\` |

ただし以下は **\`'不正'\`** を返す（ガード節）:

- \`height\` または \`weight\` が **0 以下**
- どちらかが **数値でない**（\`Number.isFinite\` で false）

### 入出力例

\`\`\`js
bmiCategory(1.7, 50)    // → '低体重'   (bmi ≈ 17.30)
bmiCategory(1.7, 65)    // → '普通体重' (bmi ≈ 22.49)
bmiCategory(1.7, 80)    // → '肥満(1度)' (bmi ≈ 27.68)
bmiCategory(1.7, 90)    // → '肥満(2度以上)' (bmi ≈ 31.14)
bmiCategory(0, 60)      // → '不正'
bmiCategory(1.7, -1)    // → '不正'
bmiCategory('1.7', 60)  // → '不正'
\`\`\`

### 制約

- 入力チェックは関数の冒頭で行い、不正なら早期 \`return\` する
- \`var\` は使わない
`,
    starterCode: `function bmiCategory(height, weight) {
  return '不正';
}
`,
    solution: `function bmiCategory(height, weight) {
  if (!Number.isFinite(height) || !Number.isFinite(weight)) return '不正';
  if (height <= 0 || weight <= 0) return '不正';
  const bmi = weight / (height * height);
  if (bmi < 18.5) return '低体重';
  if (bmi < 25) return '普通体重';
  if (bmi < 30) return '肥満(1度)';
  return '肥満(2度以上)';
}
`,
    entryPoints: ["bmiCategory"],
    tests: [
      {
        name: "低体重",
        code: "bmiCategory(1.7, 50) === '低体重'",
      },
      {
        name: "普通体重",
        code: "bmiCategory(1.7, 65) === '普通体重'",
      },
      {
        name: "肥満1度",
        code: "bmiCategory(1.7, 80) === '肥満(1度)'",
      },
      {
        name: "肥満2度以上",
        code: "bmiCategory(1.7, 90) === '肥満(2度以上)'",
      },
      {
        name: "境界値 18.5",
        code: "bmiCategory(1.0, 18.5) === '普通体重'",
      },
      {
        name: "境界値 25",
        code: "bmiCategory(1.0, 25) === '肥満(1度)'",
      },
      {
        name: "0 以下は不正",
        code: "bmiCategory(0, 60) === '不正' && bmiCategory(1.7, -1) === '不正'",
      },
      {
        name: "型違いは不正",
        code: "bmiCategory('1.7', 60) === '不正'",
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
