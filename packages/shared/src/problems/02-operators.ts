import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const operators: Assignment[] = [
  // ────────────────────────────────────────────────
  // 2-1: 三項演算子で正負を分類
  // ────────────────────────────────────────────────
  {
    id: "sign-of",
    topicId: "operators",
    title: "三項演算子で符号を返す",
    difficulty: 1,
    description: `## 三項演算子で符号を返す

数値 \`n\` を受け取り、

- \`n > 0\` なら \`1\`
- \`n < 0\` なら \`-1\`
- それ以外（\`0\` または \`-0\`）なら \`0\`

を返す関数 \`signOf\` を実装してください。

### 入出力例

\`\`\`js
signOf(7)    // → 1
signOf(-3)   // → -1
signOf(0)    // → 0
signOf(-0)   // → 0
\`\`\`

### 制約

- \`if\` 文を**使わない**（**三項演算子**で表現する）
- \`Math.sign\` を使ってもよいが、その場合も三項演算子の練習として **\`if\` を避ける**
`,
    starterCode: `function signOf(n) {
  return 0;
}
`,
    solution: `function signOf(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}
`,
    badSolutions: [
      {
        description: "if 文を使ってしまい三項演算子の必須要件を満たさない",
        code: `function signOf(n) {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}
`,
      },
    ],
    entryPoints: ["signOf"],
    tests: [
      { name: "正の数", weight: 25, code: "signOf(7) === 1" },
      { name: "負の数", weight: 25, code: "signOf(-3) === -1" },
      { name: "0", weight: 25, code: "signOf(0) === 0" },
      { name: "-0", weight: 25, code: "signOf(-0) === 0" },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ConditionalExpression",
          label: "三項演算子 (?:) を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 2-2: null 合体演算子でデフォルト値
  // ────────────────────────────────────────────────
  {
    id: "default-port",
    topicId: "operators",
    title: "null合体でデフォルトポートを決める",
    difficulty: 2,
    description: `## null合体でデフォルトポートを決める

\`{ port }\` を受け取り、有効なポート番号を返す関数 \`resolvePort\` を実装してください。

- \`port\` が **数値で 1〜65535 の範囲** なら \`port\` を返す
- それ以外（\`null\` / \`undefined\` / \`0\` / 範囲外 / 数値以外）なら **デフォルト \`8080\`**

注意: \`port: 0\` は「指定なし」と同じ扱い（デフォルトを返す）にしてください。一方 \`||\` ではなく \`??\` だけだと「\`0\` を保持してしまう」点を意識してください。

### 入出力例

\`\`\`js
resolvePort({ port: 3000 })       // → 3000
resolvePort({ port: 80 })         // → 80
resolvePort({ port: 0 })          // → 8080
resolvePort({ port: null })       // → 8080
resolvePort({ port: undefined })  // → 8080
resolvePort({})                   // → 8080
resolvePort({ port: 70000 })      // → 8080  (範囲外)
resolvePort({ port: '3000' })     // → 8080  (型違い)
\`\`\`

### 制約

- \`if\` 文は使わない（**論理演算子**または三項演算子で表現する）
- \`var\` は使わない
`,
    starterCode: `function resolvePort(config) {
  return 8080;
}
`,
    solution: `function resolvePort(config) {
  const port = config.port;
  return (typeof port === 'number' && Number.isInteger(port) && port >= 1 && port <= 65535) ? port : 8080;
}
`,
    entryPoints: ["resolvePort"],
    tests: [
      {
        name: "3000",
        weight: 12,
        code: "resolvePort({port:3000}) === 3000",
      },
      {
        name: "80",
        weight: 12,
        code: "resolvePort({port:80}) === 80",
      },
      {
        name: "0 はデフォルト",
        weight: 14,
        code: "resolvePort({port:0}) === 8080",
      },
      {
        name: "null",
        weight: 12,
        code: "resolvePort({port:null}) === 8080",
      },
      {
        name: "undefined",
        weight: 12,
        code: "resolvePort({port:undefined}) === 8080",
      },
      {
        name: "プロパティなし",
        weight: 12,
        code: "resolvePort({}) === 8080",
      },
      {
        name: "範囲外",
        weight: 13,
        code: "resolvePort({port:70000}) === 8080",
      },
      {
        name: "型違い (文字列)",
        weight: 13,
        code: "resolvePort({port:'3000'}) === 8080",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 2-3: optional chaining
  // ────────────────────────────────────────────────
  {
    id: "deep-name",
    topicId: "operators",
    title: "optional chaining でネストを掘る",
    difficulty: 2,
    description: `## optional chaining でネストを掘る

ネストしたユーザーオブジェクトから **会社の名前**を返す関数 \`companyName\` を実装してください。
途中のいずれかが \`null\` / \`undefined\` の場合は \`'unknown'\` を返してください。

データ形状: \`{ profile?: { company?: { name?: string } } }\`

### 入出力例

\`\`\`js
companyName({ profile: { company: { name: 'Acme' } } })  // → 'Acme'
companyName({ profile: { company: {} } })                 // → 'unknown'
companyName({ profile: {} })                              // → 'unknown'
companyName({})                                            // → 'unknown'
companyName(null)                                          // → 'unknown'
companyName(undefined)                                     // → 'unknown'
\`\`\`

### 制約

- **optional chaining (\`?.\`)** と **null合体 (\`??\`)** を使う
- \`if\` 文・三項演算子を使わずに 1 行で書ける
- \`var\` は使わない
`,
    starterCode: `function companyName(user) {
  return 'unknown';
}
`,
    solution: `function companyName(user) {
  return user?.profile?.company?.name ?? 'unknown';
}
`,
    entryPoints: ["companyName"],
    tests: [
      {
        name: "正常系",
        weight: 20,
        code: "companyName({profile:{company:{name:'Acme'}}}) === 'Acme'",
      },
      {
        name: "name 欠落",
        weight: 16,
        code: "companyName({profile:{company:{}}}) === 'unknown'",
      },
      {
        name: "company 欠落",
        weight: 16,
        code: "companyName({profile:{}}) === 'unknown'",
      },
      {
        name: "profile 欠落",
        weight: 16,
        code: "companyName({}) === 'unknown'",
      },
      {
        name: "null",
        weight: 16,
        code: "companyName(null) === 'unknown'",
      },
      {
        name: "undefined",
        weight: 16,
        code: "companyName(undefined) === 'unknown'",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 2-4: 短絡評価
  // ────────────────────────────────────────────────
  {
    id: "guard-message",
    topicId: "operators",
    title: "短絡評価で表示文字列を組み立てる",
    difficulty: 2,
    description: `## 短絡評価で表示文字列を組み立てる

\`{ user, count }\` を受け取り、以下を返す関数 \`buildMessage\` を実装してください。

- \`user\` が空文字 / null / undefined → \`'匿名さん'\` と表示
- \`count\` が \`0\` または欠落 → 末尾に \`'(通知なし)'\` を付与
- \`count\` が 1 以上 → 末尾に \`'(N件)'\` を付与

形式: \`"{name}さん {suffix}"\`（半角スペース1つで区切る）

### 入出力例

\`\`\`js
buildMessage({ user: 'Alice', count: 3 })
// → 'Aliceさん (3件)'

buildMessage({ user: 'Bob', count: 0 })
// → 'Bobさん (通知なし)'

buildMessage({ user: '', count: 5 })
// → '匿名さん (5件)'

buildMessage({})
// → '匿名さん (通知なし)'

buildMessage({ user: null, count: undefined })
// → '匿名さん (通知なし)'
\`\`\`

### 制約

- 論理演算子 \`||\` で名前のフォールバックを書く
- \`if\` 文は使わない
- \`var\` は使わない
`,
    starterCode: `function buildMessage(input) {
  return '';
}
`,
    solution: "function buildMessage(input) {\n  const user = (input?.user || '匿名');\n  const count = input?.count;\n  const suffix = count > 0 ? `(${count}件)` : '(通知なし)';\n  return `${user}さん ${suffix}`;\n}\n",
    entryPoints: ["buildMessage"],
    tests: [
      {
        name: "Alice / 3",
        weight: 20,
        code: "buildMessage({user:'Alice', count:3}) === 'Aliceさん (3件)'",
      },
      {
        name: "Bob / 0",
        weight: 20,
        code: "buildMessage({user:'Bob', count:0}) === 'Bobさん (通知なし)'",
      },
      {
        name: "空名前",
        weight: 20,
        code: "buildMessage({user:'', count:5}) === '匿名さん (5件)'",
      },
      {
        name: "プロパティなし",
        weight: 20,
        code: "buildMessage({}) === '匿名さん (通知なし)'",
      },
      {
        name: "null / undefined",
        weight: 20,
        code: "buildMessage({user:null, count:undefined}) === '匿名さん (通知なし)'",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "LogicalExpression",
          label: "論理演算子 (|| / && / ??) を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
