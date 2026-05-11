import type { Assignment } from "../../../types.js";

export const s4Ch15BankAccountCapstone: Assignment = {
  id: "S4-Ch15-06-bank-account-capstone",
  stage: "S4",
  chapterId: "Ch15",
  sequence: 6,
  title: "[卒業課題] BankAccount を #privateField + static factory で守る",
  newConcept:
    "#privateField で外から書き換えられないフィールドを作り、 static ファクトリで生成口を集約する",
  estimatedMinutes: 40,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

S4 卒業課題のひとつです。 これまで学んだ **constructor / メソッド / static** に、 \`#privateField\` を加えて 「外から残高を書き換えられない」 銀行口座クラスを実装します。

### BankAccount

- \`#balance\` という **private フィールド** を持つ。
- \`constructor(initialBalance = 0)\`: \`initialBalance\` が **0 未満なら例外** (\`Error\`) を投げる。 そうでなければ \`this.#balance\` を初期化する。
- \`deposit(amount)\`: \`amount > 0\` のとき \`this.#balance\` に加算する。 \`amount <= 0\` のときは **何もしない** (例外は投げない)。
- \`withdraw(amount)\`: \`amount > 0\` かつ \`amount <= this.#balance\` のとき残高を引いて \`true\` を返す。 そうでなければ **残高は変えずに \`false\`** を返す。
- \`getBalance()\`: 現在の \`this.#balance\` を返す (これが残高を外から読む唯一の経路)。
- \`static fromYen(yen)\`: \`new BankAccount(yen)\` を返す static ファクトリ。

\`\`\`js
const a = new BankAccount(100);
a.deposit(50);       a.getBalance();   // → 150
a.withdraw(70);                         // → true
a.getBalance();                         // → 80
a.withdraw(1000);                       // → false (足りない)
a.getBalance();                         // → 80     (動いていない)
a.deposit(-10);      a.getBalance();   // → 80     (負の入金は無視)

// 外から #balance を覗こうとしてもアクセスできない
"balance" in a;                         // → false
a.balance;                              // → undefined

new BankAccount(-1);                    // throws Error
BankAccount.fromYen(500) instanceof BankAccount;   // → true
\`\`\`

## ポイント

- \`class\` の中で \`#balance\` のように **\`#\` 始まりのフィールド** を宣言すると、 そのクラスの **インスタンスメソッドからしか触れない** private フィールドになります。 外部コード (\`a.#balance\`) も継承先 (将来 \`extends BankAccount\` した子クラス) も触れません。
- private フィールドは **使う前にクラスのトップで宣言** が必要です:
  \`\`\`js
  class BankAccount {
    #balance;        // ← この宣言を忘れると SyntaxError
    constructor(...) { ... }
  }
  \`\`\`
- 「不正な値を弾く責任」 を class 内に閉じ込めるのが、 private フィールドのうれしさです。 残高を 0 未満にする経路 (\`constructor\`、 \`withdraw\`) はクラスの内部にしかないので、 外から見ると 「\`BankAccount\` のインスタンスは絶対に残高が負にならない」 ことが保証できます。
- \`static fromYen\` のような **static ファクトリ** は、 「同じ class でも引数の意味が違う複数の入り口」 を整理するのに使えます (ここでは円を意識した別名)。
- AST で **\`ClassDeclaration\`** **\`NewExpression\`** **\`ClassPrivateProperty\`** **\`ThrowStatement\`** **\`ReturnStatement\`** を必須にしています。 これは S4 卒業課題のひとつなので、 これまでに登場した道具を 1 つの class にすべて使い切る練習です。
`,
  starterCode: `class BankAccount {
  // #balance を private フィールドとして宣言する
  // constructor(initialBalance = 0) で 0 未満なら throw new Error(...)
  // deposit / withdraw / getBalance / static fromYen を実装する
}
`,
  entryPoints: ["BankAccount"],
  demoCall: `const a = new BankAccount(100); a.deposit(50); console.log(a.getBalance());`,
  tests: [
    {
      name: "初期残高 0",
      code: `new BankAccount().getBalance() === 0`,
    },
    {
      name: "初期残高は引数で設定できる",
      code: `new BankAccount(100).getBalance() === 100`,
    },
    {
      name: "deposit で残高が増える",
      code: `(() => { const a = new BankAccount(100); a.deposit(50); return a.getBalance() === 150; })()`,
    },
    {
      name: "withdraw が成功すると true を返し残高が減る",
      code: `(() => { const a = new BankAccount(100); const ok = a.withdraw(40); return ok === true && a.getBalance() === 60; })()`,
    },
    {
      name: "残高不足の withdraw は false を返し残高は不変",
      code: `(() => { const a = new BankAccount(100); const ok = a.withdraw(1000); return ok === false && a.getBalance() === 100; })()`,
    },
    {
      name: "0 以下の deposit は無視される (例外も投げない)",
      code: `(() => { const a = new BankAccount(100); a.deposit(0); a.deposit(-5); return a.getBalance() === 100; })()`,
    },
    {
      name: "0 以下の withdraw は false (残高は変わらない)",
      code: `(() => { const a = new BankAccount(100); const r1 = a.withdraw(0); const r2 = a.withdraw(-5); return r1 === false && r2 === false && a.getBalance() === 100; })()`,
    },
    {
      name: "初期残高が負だと constructor で例外",
      code: `(() => { try { new BankAccount(-1); return false; } catch (e) { return e instanceof Error; } })()`,
    },
    {
      name: "#balance は外から直接読めない (balance プロパティは undefined)",
      code: `(() => { const a = new BankAccount(100); return a.balance === undefined && !("balance" in a); })()`,
    },
    {
      name: "static fromYen は BankAccount のインスタンスを返す",
      code: `(() => { const a = BankAccount.fromYen(500); return a instanceof BankAccount && a.getBalance() === 500; })()`,
    },
    {
      name: "fromYen は static (インスタンス側からは見えない)",
      code: `typeof BankAccount.fromYen === "function" && typeof new BankAccount(0).fromYen === "undefined"`,
    },
  ],
  hints: [
    "class の先頭で #balance; と宣言してから、 constructor 内で this.#balance = initialBalance; と代入します。",
    "deposit / withdraw は引数の正当性チェックをしてから残高を更新します。 不正なときは false を返す (deposit は何もせずに終わる) のがポイント。",
    '解答例:\n```js\nclass BankAccount {\n  #balance;\n  constructor(initialBalance = 0) {\n    if (initialBalance < 0) {\n      throw new Error("initialBalance must be >= 0");\n    }\n    this.#balance = initialBalance;\n  }\n  deposit(amount) {\n    if (amount > 0) {\n      this.#balance += amount;\n    }\n  }\n  withdraw(amount) {\n    if (amount > 0 && amount <= this.#balance) {\n      this.#balance -= amount;\n      return true;\n    }\n    return false;\n  }\n  getBalance() {\n    return this.#balance;\n  }\n  static fromYen(yen) {\n    return new BankAccount(yen);\n  }\n}\n```',
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class で BankAccount を定義する",
        },
        {
          kind: "node",
          nodeType: "ClassPrivateProperty",
          label: "#balance を private フィールドとして宣言する",
        },
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "static fromYen の内部で new BankAccount(...) を使う",
        },
        {
          kind: "node",
          nodeType: "ThrowStatement",
          label: "初期残高が負のとき throw する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "withdraw / getBalance / fromYen で return する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class BankAccount {
  #balance;
  constructor(initialBalance = 0) {
    if (initialBalance < 0) {
      throw new Error("initialBalance must be >= 0");
    }
    this.#balance = initialBalance;
  }
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }
  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }
  getBalance() {
    return this.#balance;
  }
  static fromYen(yen) {
    return new BankAccount(yen);
  }
}
`,
  badSolutions: [
    {
      code: `class BankAccount {
  constructor(initialBalance = 0) {
    if (initialBalance < 0) {
      throw new Error("initialBalance must be >= 0");
    }
    this.balance = initialBalance;
  }
  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
    }
  }
  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      return true;
    }
    return false;
  }
  getBalance() {
    return this.balance;
  }
  static fromYen(yen) {
    return new BankAccount(yen);
  }
}
`,
      description:
        "#balance を使わず this.balance (公開) にしている (ClassPrivateProperty 違反 + 外から balance が読めてしまうテスト失敗)",
    },
    {
      code: `class BankAccount {
  #balance;
  constructor(initialBalance = 0) {
    if (initialBalance < 0) {
      throw new Error("initialBalance must be >= 0");
    }
    this.#balance = initialBalance;
  }
  deposit(amount) {
    this.#balance += amount;
  }
  withdraw(amount) {
    this.#balance -= amount;
    return true;
  }
  getBalance() {
    return this.#balance;
  }
  static fromYen(yen) {
    return new BankAccount(yen);
  }
}
`,
      description:
        "deposit / withdraw が引数のチェックをしていないため、 負の入金や残高超過でも残高が変わってしまう (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "プライベートクラス機能",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/Private_properties",
      pageTitle: "プライベートクラス機能",
    },
    {
      heading: "static",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/static",
      pageTitle: "static",
    },
  ],
};
