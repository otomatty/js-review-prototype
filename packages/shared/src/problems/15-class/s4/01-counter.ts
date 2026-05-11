import type { Assignment } from "../../../types.js";

export const s4Ch15Counter: Assignment = {
  id: "S4-Ch15-01-counter",
  stage: "S4",
  chapterId: "Ch15",
  sequence: 1,
  title: "Counter クラスで「数を覚えておく箱」 を作る",
  newConcept:
    "class の constructor で this にフィールドを初期化し、 インスタンスメソッドで状態を更新する",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

\`Counter\` というクラスを実装してください。 オブジェクトリテラルでも書ける処理ですが、 ここでは **「同じ形のカウンタを new でいくつでも作れる型」 として class を使う** 練習をします。

- \`constructor(initial = 0)\`: 引数 \`initial\` を \`this.count\` にセットする。 省略時は 0 にする。
- \`increment()\`: \`this.count\` を 1 増やす。
- \`decrement()\`: \`this.count\` を 1 減らす。
- \`getCount()\`: 現在の \`this.count\` を返す。

\`\`\`js
const c = new Counter();
c.increment();
c.increment();
c.increment();
c.decrement();
c.getCount();   // → 2

const c2 = new Counter(10);
c2.getCount();  // → 10
\`\`\`

## ポイント

- \`class\` の中の \`constructor\` は **\`new Counter(...)\` したとき 1 回だけ呼ばれる** 初期化関数です。 ここで \`this.xxx = ...\` の形でフィールドを置きます。
- \`increment()\` のような **インスタンスメソッド** は、 そのインスタンス (\`this\`) の状態を読み書きします。 同じ class から作った別のインスタンスは状態が独立しています (テスト 7 で確認します)。
- 引数 \`initial = 0\` のように **デフォルト引数** を書いておくと、 \`new Counter()\` のように省略しても 0 で初期化されます。
- AST で **\`ClassDeclaration\`** を必須にしています。 \`function Counter(...) { ... }\` + \`prototype.xxx = ...\` のような旧来の書き方では通りません。
`,
  starterCode: `class Counter {
  // constructor(initial = 0) で this.count を初期化
  // increment / decrement / getCount を定義する
}
`,
  entryPoints: ["Counter"],
  demoCall: `const c = new Counter(); c.increment(); console.log(c.getCount());`,
  tests: [
    {
      name: "new Counter() の初期値は 0",
      code: `new Counter().getCount() === 0`,
    },
    {
      name: "new Counter(10) の初期値は 10",
      code: `new Counter(10).getCount() === 10`,
    },
    {
      name: "increment で 1 増える",
      code: `(() => { const c = new Counter(); c.increment(); return c.getCount() === 1; })()`,
    },
    {
      name: "increment を 3 回呼ぶと 3 になる",
      code: `(() => { const c = new Counter(); c.increment(); c.increment(); c.increment(); return c.getCount() === 3; })()`,
    },
    {
      name: "decrement で 1 減る",
      code: `(() => { const c = new Counter(5); c.decrement(); return c.getCount() === 4; })()`,
    },
    {
      name: "increment と decrement の混在も正しい",
      code: `(() => { const c = new Counter(); c.increment(); c.increment(); c.increment(); c.decrement(); return c.getCount() === 2; })()`,
    },
    {
      name: "2 つのインスタンスは独立した状態を持つ",
      code: `(() => { const a = new Counter(); const b = new Counter(); a.increment(); a.increment(); b.increment(); return a.getCount() === 2 && b.getCount() === 1; })()`,
    },
  ],
  hints: [
    "constructor(initial = 0) { this.count = initial; } のように、 引数を this.count に代入します。",
    "increment / decrement / getCount は class 内のメソッド (`function` キーワードや `:` を書かない関数定義) として並べます。",
    "解答例:\n```js\nclass Counter {\n  constructor(initial = 0) {\n    this.count = initial;\n  }\n  increment() {\n    this.count += 1;\n  }\n  decrement() {\n    this.count -= 1;\n  }\n  getCount() {\n    return this.count;\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class で Counter を定義する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class Counter {
  constructor(initial = 0) {
    this.count = initial;
  }
  increment() {
    this.count += 1;
  }
  decrement() {
    this.count -= 1;
  }
  getCount() {
    return this.count;
  }
}
`,
  badSolutions: [
    {
      code: `function Counter(initial = 0) {
  this.count = initial;
}
Counter.prototype.increment = function () { this.count += 1; };
Counter.prototype.decrement = function () { this.count -= 1; };
Counter.prototype.getCount = function () { return this.count; };
`,
      description:
        "class 構文を使わず prototype で書いている (ClassDeclaration が見つからない)",
    },
    {
      code: `class Counter {
  constructor(initial = 0) {
    this.count = initial;
  }
  increment() {
    this.count += 1;
  }
  decrement() {
    this.count -= 1;
  }
  getCount() {
    return this.count + 1;
  }
}
`,
      description: "getCount が +1 多く返る (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "クラスを使用する",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_classes",
      pageTitle: "クラスを使用する",
    },
    {
      heading: "constructor",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/constructor",
      pageTitle: "constructor",
    },
  ],
};
