import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const destructuringSpread: Assignment[] = [
  // ────────────────────────────────────────────────
  // 13-1: 引数の分割代入
  // ────────────────────────────────────────────────
  {
    id: "user-summary",
    topicId: "destructuring-spread",
    title: "引数を分割代入で受け取る",
    difficulty: 1,
    description: `## 引数を分割代入で受け取る

\`{ name, age, role }\` 形式のオブジェクトを受け取り、\`'{name}({role}) - {age}歳'\` 形式の文字列を返す関数 \`userSummary\` を実装してください。

\`role\` が省略された場合は \`'guest'\` を使ってください。

### 入出力例

\`\`\`js
userSummary({ name: 'Alice', age: 30, role: 'admin' })
// → 'Alice(admin) - 30歳'

userSummary({ name: 'Bob', age: 18 })
// → 'Bob(guest) - 18歳'

userSummary({ name: '太郎', age: 0, role: 'kid' })
// → '太郎(kid) - 0歳'
\`\`\`

### 制約

- **引数で分割代入** する: \`function userSummary({ name, age, role = 'guest' })\`
- **テンプレートリテラル** で結合する
- \`var\` は使わない
`,
    starterCode: `function userSummary(user) {
  return '';
}
`,
    entryPoints: ["userSummary"],
    tests: [
      {
        name: "通常",
        weight: 33,
        code: "userSummary({name:'Alice', age:30, role:'admin'}) === 'Alice(admin) - 30歳'",
      },
      {
        name: "role 省略は guest",
        weight: 34,
        code: "userSummary({name:'Bob', age:18}) === 'Bob(guest) - 18歳'",
      },
      {
        name: "0歳",
        weight: 33,
        code: "userSummary({name:'太郎', age:0, role:'kid'}) === '太郎(kid) - 0歳'",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ObjectPattern",
          label: "オブジェクトの分割代入を使う",
        },
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "テンプレートリテラルを使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 13-2: 配列の分割代入
  // ────────────────────────────────────────────────
  {
    id: "swap",
    topicId: "destructuring-spread",
    title: "配列の分割代入で値を入れ替える",
    difficulty: 1,
    description: `## 配列の分割代入で値を入れ替える

長さ 2 以上の配列を受け取り、\`[1番目の要素, 0番目の要素, ...残り]\` の **新しい配列** を返す関数 \`swap\` を実装してください。
長さが 0 または 1 の場合は元の配列のコピーを返してください。

### 入出力例

\`\`\`js
swap([1, 2, 3, 4])   // → [2, 1, 3, 4]
swap(['a', 'b'])     // → ['b', 'a']
swap([42])           // → [42]
swap([])             // → []
\`\`\`

### 制約

- **配列の分割代入** \`const [a, b, ...rest] = arr\` を使う
- **スプレッド構文** で再構築する
- 元の配列を変更しない
- \`var\` は使わない
`,
    starterCode: `function swap(arr) {
  return arr;
}
`,
    entryPoints: ["swap"],
    tests: [
      {
        name: "4要素",
        weight: 25,
        code: "JSON.stringify(swap([1,2,3,4])) === JSON.stringify([2,1,3,4])",
      },
      {
        name: "2要素",
        weight: 25,
        code: "JSON.stringify(swap(['a','b'])) === JSON.stringify(['b','a'])",
      },
      {
        name: "1要素",
        weight: 17,
        code: "JSON.stringify(swap([42])) === JSON.stringify([42])",
      },
      {
        name: "空配列",
        weight: 16,
        code: "JSON.stringify(swap([])) === JSON.stringify([])",
      },
      {
        name: "元配列を変更しない",
        weight: 17,
        code: "(() => { const a = [1,2,3]; swap(a); return JSON.stringify(a) === JSON.stringify([1,2,3]); })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ArrayPattern",
          label: "配列の分割代入を使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 13-3: rest と spread でオブジェクトを部分更新
  // ────────────────────────────────────────────────
  {
    id: "omit-key",
    topicId: "destructuring-spread",
    title: "指定キーを除いたオブジェクトを返す",
    difficulty: 2,
    description: `## 指定キーを除いたオブジェクトを返す

オブジェクト \`obj\` とキー文字列 \`key\` を受け取り、\`key\` を除いた **新しいオブジェクト** を返す関数 \`omit\` を実装してください。
**元のオブジェクトを変更してはいけません**。

### 入出力例

\`\`\`js
omit({ a: 1, b: 2, c: 3 }, 'b')
// → { a: 1, c: 3 }

omit({ a: 1 }, 'a')
// → {}

omit({ a: 1, b: 2 }, 'z')   // 存在しないキー
// → { a: 1, b: 2 }

omit({}, 'a')
// → {}
\`\`\`

### 制約

- **計算プロパティ名による分割代入 + 残余 (\`{ [key]: _, ...rest }\`)** を使う
- **\`delete\` 演算子は禁止**（破壊的）
- \`var\` は使わない
`,
    starterCode: `function omit(obj, key) {
  return obj;
}
`,
    entryPoints: ["omit"],
    tests: [
      {
        name: "中央のキーを除く",
        weight: 22,
        code: "JSON.stringify(omit({a:1,b:2,c:3}, 'b')) === JSON.stringify({a:1,c:3})",
      },
      {
        name: "唯一のキーを除く",
        weight: 22,
        code: "JSON.stringify(omit({a:1}, 'a')) === JSON.stringify({})",
      },
      {
        name: "存在しないキー",
        weight: 22,
        code: "JSON.stringify(omit({a:1,b:2}, 'z')) === JSON.stringify({a:1,b:2})",
      },
      {
        name: "空オブジェクト",
        weight: 17,
        code: "JSON.stringify(omit({}, 'a')) === JSON.stringify({})",
      },
      {
        name: "元オブジェクトを変更しない",
        weight: 17,
        code: "(() => { const o = {a:1,b:2}; omit(o, 'a'); return JSON.stringify(o) === JSON.stringify({a:1,b:2}); })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 13-4: 配列のスプレッド + デフォルト値
  // ────────────────────────────────────────────────
  {
    id: "with-defaults",
    topicId: "destructuring-spread",
    title: "デフォルト値で穴埋めする",
    difficulty: 2,
    description: `## デフォルト値で穴埋めする

設定オブジェクトの **デフォルト** \`defaults\` と **ユーザー指定の上書き** \`overrides\` を受け取り、両者をマージした **新しいオブジェクト** を返す関数 \`withDefaults\` を実装してください。

\`overrides\` のキーは \`defaults\` を上書きし、\`overrides\` に **存在しないキー** は \`defaults\` の値を維持します。
ただし \`overrides\` のキーが \`undefined\` の場合は **デフォルト値を保持**してください（明示的な \`null\` は **null として上書き**）。

### 入出力例

\`\`\`js
withDefaults({ port: 8080, host: 'localhost' }, { port: 3000 })
// → { port: 3000, host: 'localhost' }

withDefaults({ port: 8080, host: 'localhost' }, {})
// → { port: 8080, host: 'localhost' }

withDefaults({ port: 8080 }, { port: undefined })
// → { port: 8080 }      (undefined は無視)

withDefaults({ port: 8080 }, { port: null })
// → { port: null }      (null は明示なので上書き)
\`\`\`

### 制約

- **スプレッド構文** で新オブジェクトを組み立てる
- \`var\` は使わない
- 元のオブジェクトを変更しない
`,
    starterCode: `function withDefaults(defaults, overrides) {
  return defaults;
}
`,
    entryPoints: ["withDefaults"],
    tests: [
      {
        name: "上書き",
        weight: 22,
        code: "JSON.stringify(withDefaults({port:8080, host:'localhost'}, {port:3000})) === JSON.stringify({port:3000, host:'localhost'})",
      },
      {
        name: "上書きなし",
        weight: 22,
        code: "JSON.stringify(withDefaults({port:8080, host:'localhost'}, {})) === JSON.stringify({port:8080, host:'localhost'})",
      },
      {
        name: "undefined はデフォルトを保持",
        weight: 22,
        code: "JSON.stringify(withDefaults({port:8080}, {port:undefined})) === JSON.stringify({port:8080})",
      },
      {
        name: "null は上書き",
        weight: 17,
        code: "JSON.stringify(withDefaults({port:8080}, {port:null})) === JSON.stringify({port:null})",
      },
      {
        name: "元オブジェクトを変更しない",
        weight: 17,
        code: "(() => { const d = {a:1}; const o = {a:2}; withDefaults(d,o); return d.a === 1 && o.a === 2; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
