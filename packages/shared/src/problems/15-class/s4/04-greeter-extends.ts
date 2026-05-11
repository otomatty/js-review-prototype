import type { Assignment } from "../../../types.js";

export const s4Ch15GreeterExtends: Assignment = {
  id: "S4-Ch15-04-greeter-extends",
  stage: "S4",
  chapterId: "Ch15",
  sequence: 4,
  title: "extends と super で挨拶クラスを派生させる",
  newConcept:
    "extends で親クラスを継承し、 constructor で super() を呼び、 メソッドをオーバーライドする",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

挨拶を返す \`Greeter\` クラスと、 それを **継承** した \`FormalGreeter\` クラスを実装してください。

### Greeter

- \`constructor(name)\`: \`this.name = name\` をセットする。
- \`greet()\`: \`"Hello, " + name + "!"\` を返す。

### FormalGreeter extends Greeter

- \`constructor(name, title)\`: **まず \`super(name)\` を呼んで** 親の constructor に \`name\` を渡し、 そのうえで \`this.title = title\` をセットする。
- \`greet()\`: \`"Good day, " + title + " " + name + "."\` を返す (親の \`greet\` を上書き)。

\`\`\`js
new Greeter("Alice").greet();
// → "Hello, Alice!"

new FormalGreeter("Bob", "Dr.").greet();
// → "Good day, Dr. Bob."

new FormalGreeter("Bob", "Dr.") instanceof Greeter;  // → true
\`\`\`

## ポイント

- \`class Child extends Parent\` と書くと、 親の機能 (フィールド・メソッド) を引き継ぎます。 子で同名のメソッドを書けば **オーバーライド** されます。
- 子の \`constructor\` では、 **\`this\` に触れる前に必ず \`super(...)\` を呼ぶ** こと。 これは構文上のルールで、 忘れると \`ReferenceError: Must call super constructor in derived class\` になります。
- \`super(name)\` は親の \`constructor(name)\` を呼び出します。 これで \`this.name\` が親のコードで初期化されます。
- \`instanceof\` は親クラスでも \`true\` を返します (\`new FormalGreeter(...) instanceof Greeter\` は \`true\`)。 「FormalGreeter は Greeter の一種」 という関係を機械的に確認できる仕組みです。
- AST で **\`ClassDeclaration\`** を必須にしています。 親と子で **合計 2 つ** の class 宣言が必要です。
`,
  starterCode: `class Greeter {
  // constructor(name) で this.name をセット、 greet() を定義する
}

class FormalGreeter extends Greeter {
  // constructor(name, title) で super(name) → this.title をセット、 greet() を上書きする
}
`,
  entryPoints: ["Greeter", "FormalGreeter"],
  demoCall: `console.log(new FormalGreeter("Bob", "Dr.").greet());`,
  tests: [
    {
      name: 'Greeter.greet は "Hello, Alice!"',
      code: `new Greeter("Alice").greet() === "Hello, Alice!"`,
    },
    {
      name: "Greeter.name は引数を保持している",
      code: `new Greeter("Alice").name === "Alice"`,
    },
    {
      name: 'FormalGreeter.greet は "Good day, Dr. Bob."',
      code: `new FormalGreeter("Bob", "Dr.").greet() === "Good day, Dr. Bob."`,
    },
    {
      name: "FormalGreeter は name フィールドを (親から) 持つ",
      code: `new FormalGreeter("Bob", "Dr.").name === "Bob"`,
    },
    {
      name: "FormalGreeter は title フィールドを持つ",
      code: `new FormalGreeter("Bob", "Dr.").title === "Dr."`,
    },
    {
      name: "FormalGreeter は Greeter のサブクラス (instanceof で true)",
      code: `new FormalGreeter("Bob", "Dr.") instanceof Greeter`,
    },
    {
      name: "FormalGreeter は FormalGreeter のインスタンスでもある",
      code: `new FormalGreeter("Bob", "Dr.") instanceof FormalGreeter`,
    },
    {
      name: "FormalGreeter.greet は親 Greeter.greet を上書きしている",
      code: `new FormalGreeter("Bob", "Dr.").greet() !== new Greeter("Bob").greet()`,
    },
  ],
  hints: [
    'class Greeter { constructor(name) { this.name = name; } greet() { return "Hello, " + this.name + "!"; } }',
    "FormalGreeter の constructor は最初の行で必ず super(name) を呼びます。 これを忘れると this に触った瞬間に ReferenceError になります。",
    '解答例:\n```js\nclass Greeter {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return "Hello, " + this.name + "!";\n  }\n}\n\nclass FormalGreeter extends Greeter {\n  constructor(name, title) {\n    super(name);\n    this.title = title;\n  }\n  greet() {\n    return "Good day, " + this.title + " " + this.name + ".";\n  }\n}\n```',
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class で Greeter / FormalGreeter を定義する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "greet で文字列を return する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class Greeter {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name + "!";
  }
}

class FormalGreeter extends Greeter {
  constructor(name, title) {
    super(name);
    this.title = title;
  }
  greet() {
    return "Good day, " + this.title + " " + this.name + ".";
  }
}
`,
  badSolutions: [
    {
      code: `class Greeter {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name + "!";
  }
}

class FormalGreeter {
  constructor(name, title) {
    this.name = name;
    this.title = title;
  }
  greet() {
    return "Good day, " + this.title + " " + this.name + ".";
  }
}
`,
      description:
        "extends を使っていないため instanceof Greeter が false (テスト失敗)",
    },
    {
      code: `class Greeter {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "Hello, " + this.name + "!";
  }
}

class FormalGreeter extends Greeter {
  constructor(name, title) {
    super(name);
    this.title = title;
  }
}
`,
      description:
        "FormalGreeter で greet を上書きしていない (親の Hello 形式が返り、 テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "extends",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/extends",
      pageTitle: "extends",
    },
    {
      heading: "super",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/super",
      pageTitle: "super",
    },
  ],
};
