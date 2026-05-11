import type { Assignment } from "../../../types.js";

export const s4Ch15Stack: Assignment = {
  id: "S4-Ch15-03-stack",
  stage: "S4",
  chapterId: "Ch15",
  sequence: 3,
  title: "Stack クラスで配列を包んで使い勝手を整える",
  newConcept:
    "内部に配列を持つ class を作り、 外からはメソッド経由でだけ触らせる (カプセル化の入口)",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

「最後に入れたものが最初に出る」 (LIFO: Last In First Out) データ構造である **スタック** を、 内部で配列を 1 本持つ class として実装してください。

- \`constructor()\`: 内部の配列フィールド \`this.items\` を空配列 \`[]\` で初期化する。
- \`push(value)\`: \`value\` を内部配列の末尾に追加する。
- \`pop()\`: 末尾の要素を取り出して **戻り値として返す** (空なら \`undefined\`)。
- \`peek()\`: 末尾の要素を **取り出さずに見るだけ** (空なら \`undefined\`)。
- \`size()\`: 現在の要素数を返す。

\`\`\`js
const s = new Stack();
s.push(1);
s.push(2);
s.push(3);
s.size();   // → 3
s.peek();   // → 3        (まだ pop していない)
s.pop();    // → 3
s.pop();    // → 2
s.size();   // → 1
s.pop();    // → 1
s.pop();    // → undefined (空)
\`\`\`

## ポイント

- スタックは **内側は普通の配列**、 **外側はメソッドだけ** で触らせる、 という構造です。 こうしておくと「内部が配列か別のデータ構造かは利用側に関係ない」 状態を作れます (= カプセル化)。
- \`Array.prototype.push\` / \`Array.prototype.pop\` を素直に呼び出せば実装できます。 \`pop\` は配列が空のとき \`undefined\` を返すので、 空の判定を自前で書く必要はありません。
- \`peek()\` は \`this.items[this.items.length - 1]\` で末尾要素を **読むだけ**。 配列の中身は変えてはいけません。
- AST で **\`ClassDeclaration\`** と **\`ReturnStatement\`** を必須にしています。
`,
  starterCode: `class Stack {
  // constructor を定義し、 内部用の配列フィールドを空配列で初期化する


  // push メソッド: 受け取った値を内部配列の末尾に積む


  // pop メソッド: 内部配列の末尾を取り出して return する


  // peek メソッド: 内部配列の末尾要素を取り出さずに読んで return する


  // size メソッド: 内部配列の要素数を return する
}
`,
  entryPoints: ["Stack"],
  demoCall: `const s = new Stack(); s.push(1); s.push(2); console.log(s.pop());`,
  tests: [
    {
      name: "新規 Stack のサイズは 0",
      code: `new Stack().size() === 0`,
    },
    {
      name: "push したぶんサイズが増える",
      code: `(() => { const s = new Stack(); s.push(1); s.push(2); return s.size() === 2; })()`,
    },
    {
      name: "pop は最後に push したものを返す (LIFO)",
      code: `(() => { const s = new Stack(); s.push(1); s.push(2); s.push(3); return s.pop() === 3 && s.pop() === 2 && s.pop() === 1; })()`,
    },
    {
      name: "pop でサイズが減る",
      code: `(() => { const s = new Stack(); s.push("a"); s.push("b"); s.pop(); return s.size() === 1; })()`,
    },
    {
      name: "空の pop は undefined",
      code: `new Stack().pop() === undefined`,
    },
    {
      name: "空の peek は undefined",
      code: `new Stack().peek() === undefined`,
    },
    {
      name: "peek は要素を取り出さない (size 不変)",
      code: `(() => { const s = new Stack(); s.push(10); const v = s.peek(); return v === 10 && s.size() === 1; })()`,
    },
    {
      name: "数値以外も入れられる (任意の値が入る)",
      code: `(() => { const s = new Stack(); s.push("hello"); s.push({a: 1}); return s.size() === 2 && s.peek().a === 1; })()`,
    },
  ],
  hints: [
    "constructor() { this.items = []; } から始めます。",
    "push は this.items.push(value) を呼ぶだけ。 pop / peek も Array のメソッドを使えば短く書けます。",
    "解答例:\n```js\nclass Stack {\n  constructor() {\n    this.items = [];\n  }\n  push(value) {\n    this.items.push(value);\n  }\n  pop() {\n    return this.items.pop();\n  }\n  peek() {\n    return this.items[this.items.length - 1];\n  }\n  size() {\n    return this.items.length;\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class で Stack を定義する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "pop / peek / size で値を return する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class Stack {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  size() {
    return this.items.length;
  }
}
`,
  badSolutions: [
    {
      code: `class Stack {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
  }
  pop() {
    return this.items.shift();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  size() {
    return this.items.length;
  }
}
`,
      description:
        "pop が末尾ではなく先頭を取り出しているため FIFO になり LIFO テストが失敗する",
    },
    {
      code: `class Stack {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
  }
  pop() {
    const v = this.items.pop();
    this.items.push(v);
    return v;
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  size() {
    return this.items.length;
  }
}
`,
      description: "pop が要素を取り出していない (size が減らずテスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Array.prototype.push",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
      pageTitle: "Array.prototype.push",
    },
    {
      heading: "Array.prototype.pop",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/pop",
      pageTitle: "Array.prototype.pop",
    },
  ],
};
