import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const objectsBasics: Assignment[] = [
  // ────────────────────────────────────────────────
  // 14-1: shorthand と computed key
  // ────────────────────────────────────────────────
  {
    id: "make-record",
    topicId: "objects-basics",
    title: "shorthand と computed key で1件分のレコードを作る",
    difficulty: 1,
    description: `## shorthand と computed key で1件分のレコードを作る

\`key\`、\`value\`、\`tag\` を受け取り、

\`\`\`js
{ [key]: value, tag, createdAt: 'now' }
\`\`\`

形式のオブジェクトを返す関数 \`makeRecord\` を実装してください。

注意:

- \`createdAt\` は固定で文字列 \`'now'\`
- \`tag\` は **shorthand** で書く
- 1番目のキーは **computed property name (\`[key]\`)** で書く

### 入出力例

\`\`\`js
makeRecord('id', 1, 'a')
// → { id: 1, tag: 'a', createdAt: 'now' }

makeRecord('name', 'Alice', 'admin')
// → { name: 'Alice', tag: 'admin', createdAt: 'now' }
\`\`\`

### 制約

- shorthand プロパティを使う（\`{ tag: tag }\` ではなく \`{ tag }\`）
- computed property name を使う
- \`var\` は使わない
`,
    starterCode: `function makeRecord(key, value, tag) {
  return {};
}
`,
    entryPoints: ["makeRecord"],
    tests: [
      {
        name: "id, 1, a",
        weight: 33,
        code: "JSON.stringify(makeRecord('id', 1, 'a')) === JSON.stringify({id:1, tag:'a', createdAt:'now'})",
      },
      {
        name: "name, Alice, admin",
        weight: 34,
        code: "JSON.stringify(makeRecord('name', 'Alice', 'admin')) === JSON.stringify({name:'Alice', tag:'admin', createdAt:'now'})",
      },
      {
        name: "数値キー風な文字列",
        weight: 33,
        code: "JSON.stringify(makeRecord('123', null, '')) === JSON.stringify({'123':null, tag:'', createdAt:'now'})",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 14-2: 文字頻度カウント (旧 countChars)
  // ────────────────────────────────────────────────
  {
    id: "countChars",
    topicId: "objects-basics",
    title: "文字頻度カウント",
    difficulty: 3,
    description: `## 文字頻度カウント

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
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 14-3: Object.entries / fromEntries で値を加工
  // ────────────────────────────────────────────────
  {
    id: "map-values",
    topicId: "objects-basics",
    title: "オブジェクトの値だけを変換する",
    difficulty: 2,
    description: `## オブジェクトの値だけを変換する

オブジェクト \`obj\` と変換関数 \`fn\` を受け取り、**キーはそのまま、値のみ \`fn\` で変換**した新しいオブジェクトを返す関数 \`mapValues\` を実装してください。

### 入出力例

\`\`\`js
mapValues({ a: 1, b: 2, c: 3 }, (n) => n * 2)
// → { a: 2, b: 4, c: 6 }

mapValues({ x: 'hi' }, (s) => s.toUpperCase())
// → { x: 'HI' }

mapValues({}, (n) => n)
// → {}
\`\`\`

### 制約

- **\`Object.entries\`** と **\`Object.fromEntries\`** を組み合わせる
- 配列の **\`map\`** で値を変換する
- 元のオブジェクトを変更しない
- \`for\` 文は使わない
- \`var\` は使わない
`,
    starterCode: `function mapValues(obj, fn) {
  return obj;
}
`,
    entryPoints: ["mapValues"],
    tests: [
      {
        name: "数値倍",
        weight: 25,
        code: "JSON.stringify(mapValues({a:1,b:2,c:3}, (n)=>n*2)) === JSON.stringify({a:2,b:4,c:6})",
      },
      {
        name: "文字列変換",
        weight: 25,
        code: "JSON.stringify(mapValues({x:'hi'}, (s)=>s.toUpperCase())) === JSON.stringify({x:'HI'})",
      },
      {
        name: "空オブジェクト",
        weight: 25,
        code: "JSON.stringify(mapValues({}, (n)=>n)) === JSON.stringify({})",
      },
      {
        name: "元オブジェクトを変更しない",
        weight: 25,
        code: "(() => { const o = {a:1}; mapValues(o, (n)=>n*100); return o.a === 1; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        { kind: "method", name: "entries", label: "Object.entries を使う" },
        {
          kind: "method",
          name: "fromEntries",
          label: "Object.fromEntries を使う",
        },
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
  // 14-4: Object.freeze と不変なディープ更新
  // ────────────────────────────────────────────────
  {
    id: "deep-set",
    topicId: "objects-basics",
    title: "ネストしたプロパティを不変に更新する",
    difficulty: 3,
    description: `## ネストしたプロパティを不変に更新する

オブジェクト \`obj\`、キー配列 \`path\`、値 \`value\` を受け取り、\`path\` の位置を \`value\` に更新した **新しいオブジェクト** を返す関数 \`deepSet\` を実装してください。

途中のキーが存在しない場合は **新しいオブジェクトを作って** 埋めてください。
**元のオブジェクトおよびネストしたサブオブジェクトを変更してはいけません**。

### 入出力例

\`\`\`js
deepSet({ a: { b: 1 } }, ['a', 'b'], 99)
// → { a: { b: 99 } }

deepSet({}, ['a', 'b', 'c'], 1)
// → { a: { b: { c: 1 } } }

deepSet({ a: { b: { c: 1 }, x: 9 } }, ['a', 'b', 'c'], 2)
// → { a: { b: { c: 2 }, x: 9 } }    (兄弟プロパティを保持)

deepSet({ a: 1 }, [], 'ignore')
// → { a: 1 }   (path が空なら元のオブジェクトのコピーを返す)
\`\`\`

### 制約

- スプレッド構文で各階層を再構築する
- \`var\` は使わない
- 元のオブジェクトを変更しない（テストで検証）
- 再帰実装が自然
`,
    starterCode: `function deepSet(obj, path, value) {
  return obj;
}
`,
    entryPoints: ["deepSet"],
    tests: [
      {
        name: "深さ2",
        weight: 22,
        code: "JSON.stringify(deepSet({a:{b:1}}, ['a','b'], 99)) === JSON.stringify({a:{b:99}})",
      },
      {
        name: "途中キー欠落で生成",
        weight: 22,
        code: "JSON.stringify(deepSet({}, ['a','b','c'], 1)) === JSON.stringify({a:{b:{c:1}}})",
      },
      {
        name: "兄弟を保持",
        weight: 22,
        code: "JSON.stringify(deepSet({a:{b:{c:1},x:9}}, ['a','b','c'], 2)) === JSON.stringify({a:{b:{c:2},x:9}})",
      },
      {
        name: "空 path",
        weight: 17,
        code: "JSON.stringify(deepSet({a:1}, [], 'ignore')) === JSON.stringify({a:1})",
      },
      {
        name: "元オブジェクトを変更しない",
        weight: 17,
        code: "(() => { const o = {a:{b:1}}; deepSet(o, ['a','b'], 99); return o.a.b === 1; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
