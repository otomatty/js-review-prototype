import type { Assignment } from "../../../types.js";

export const s5Ch15ShoppingCart: Assignment = {
  id: "S5-Ch15-02-shopping-cart",
  stage: "S5",
  chapterId: "Ch15",
  sequence: 2,
  title: "Product と Cart で 「継承より集約」 を体験する",
  newConcept:
    "値オブジェクト (`Product`) と、 それを集約する集合 (`Cart`) の 2 つの class を、 **継承ではなくコンポジション** で組み立てる。 同じ Product を 2 回追加したら数量をまとめる行設計、 `#privateField` で値オブジェクトの不変性を守る、 不変条件 (価格 >= 0) を class 内で throw して弾く",
  estimatedMinutes: 60,
  difficulty: 3,
  testKind: "function",
  lintPreset: "S5",
  description: `## やること

買い物カゴを **\`Product\` と \`Cart\` の 2 つの class** で設計してください。 ここで一番大事な設計判断は 「\`Cart\` は \`Product\` を \`extends\` しない」 ということです。 \`Cart\` は \`Product\` の **一種ではなく**、 \`Product\` を **複数まとめて持つ別物** だからです。 こういうとき、 継承ではなく **集約 (コンポジション)** で組みます。

### Product (値オブジェクト)

- \`constructor(name, price)\` で \`#name\` / \`#price\` を private で持つ。
- \`price < 0\` のときは \`throw new Error(...)\` で弾く (不正な値を class の中で防ぐ)。
- \`getName()\` / \`getPrice()\` のみ公開する。 **setter は作らない** (= 一度作ったら値が変わらない不変オブジェクトとして扱う)。

### Cart (集約)

- \`constructor()\` で **\`#lines = []\`** を private に持つ。 各要素は \`{ product, qty }\` の形のオブジェクト 1 行。
- \`add(product, qty)\`: 既に同じ \`product\` (参照が一致) が \`#lines\` にあれば、 その行の \`qty\` を加算する。 無ければ新規行 \`{ product, qty }\` を push する。 \`qty <= 0\` のときは何もしない。
- \`remove(product)\`: 該当行を \`#lines\` から取り除く (見つからなければ何もしない)。
- \`total()\`: 全行の \`price * qty\` の合計を数値で返す。 空なら 0。
- \`size()\`: 行数 (= 別商品の種類数) を返す。

\`\`\`js
const apple = new Product("apple", 100);
const banana = new Product("banana", 80);

const cart = new Cart();
cart.add(apple, 2);          // [ {apple, 2} ]
cart.add(banana, 3);         // [ {apple, 2}, {banana, 3} ]
cart.add(apple, 1);          // [ {apple, 3}, {banana, 3} ]   ← 行は増えず qty が増える
cart.size();                 // → 2 (行は 2 つ)
cart.total();                // → 100*3 + 80*3 = 540

cart.remove(banana);         // [ {apple, 3} ]
cart.size();                 // → 1
cart.total();                // → 300

new Product("free", -1);     // throws Error
\`\`\`

## ポイント

### 「Cart は Product である」 ではない

オブジェクト指向の入門でよくある罠が 「機能を追加したいときに何でも extends する」 です。 \`Cart extends Product\` と書くと、 「Cart は Product **の一種** である」 という意味になります。 でも実際は **Cart は Product を複数持っているだけ** です。 こういうときは継承ではなく、 「内部に持つ」 = **コンポジション (集約)** を選びます。 \`#lines\` 配列に Product を持たせるのがその実現方法です。

### 値オブジェクトは作ったら変わらない

\`Product\` は **1 つの商品** という値の表現で、 名前や価格が後から変わったりはしません (商品マスタを書き換えたいときは別の Product を新しく作る)。 setter を作らず、 \`#name\` / \`#price\` を private にして外部から書き換えられなくすることで、 「Product を持ち回っている間は値が動かない」 という安心が生まれます。

### 同じ Product を 2 回 add したら 1 行にまとめる

「林檎を 2 個」 と 「林檎を 1 個」 を **別々の行** にすると、 表示も合計計算も面倒になります。 集約側 (\`Cart\`) で **「同じ参照の Product があれば足す、 無ければ作る」** という決まりごとを守るのが行設計のキモです。 \`#lines.find((line) => line.product === product)\` で行を探し、 あれば \`qty\` を加算、 無ければ push、 と書き分けます。

### 不変条件は class の中で守る

「価格は 0 以上」 という決まりごとを **外の呼び出し側に書かせる** と、 必ずどこかで漏れます。 \`Product\` の constructor で \`throw\` してしまえば、 **どこから new されても価格が負の Product は存在できない** ことが保証できます (\`#privateField\` + 不変条件 + 例外、 という S5 の典型パターン)。

### 守るべき設計

- **\`Product\` と \`Cart\` の 2 つの class** を定義する。 entryPoints も両方を指定します。
- \`Cart\` は \`Product\` を **\`extends\` しない**。 集約 (\`#lines\` 配列に持つ) で組む。
- \`#name\` / \`#price\` / \`#lines\` を private フィールドで持つ。
- 価格が負のときは \`throw new Error(...)\` で弾く。
- \`var\` / \`==\` / \`!=\` は使わない。
`,
  starterCode: `// Product と Cart の 2 つのクラスを定義してください
class Product {
  // #name / #price を private で持つ
  // price < 0 なら throw new Error(...)
  // getName() / getPrice() のみ公開
}

class Cart {
  // #lines = []; (各要素は { product, qty })
  // add(product, qty), remove(product), total(), size() を実装する
  // 注意: Cart は Product を extends しない (集約で組む)
}
`,
  entryPoints: ["Product", "Cart"],
  demoCall: `const apple = new Product("apple", 100); const cart = new Cart(); cart.add(apple, 2); console.log(cart.total());`,
  tests: [
    {
      name: "Product と Cart の両方が class として定義されている",
      code: `typeof Product === "function" && typeof Cart === "function"`,
    },
    {
      name: "Cart は Product を継承していない (Cart is-a Product ではない)",
      code: `(() => { const c = new Cart(); return !(c instanceof Product); })()`,
    },
    {
      name: "Product の getName / getPrice で値を取り出せる",
      code: `(() => { const p = new Product("apple", 120); return p.getName() === "apple" && p.getPrice() === 120; })()`,
    },
    {
      name: "Product の price が負だと constructor で例外",
      code: `(() => { try { new Product("free", -1); return false; } catch (e) { return e instanceof Error; } })()`,
    },
    {
      name: "Product の name / price は外から直接読めない (private)",
      code: `(() => { const p = new Product("apple", 100); return !("name" in p) && !("price" in p); })()`,
    },
    {
      name: "空 Cart は total=0, size=0",
      code: `(() => { const c = new Cart(); return c.total() === 0 && c.size() === 0; })()`,
    },
    {
      name: "add 1 件で size=1, total=price*qty",
      code: `(() => { const apple = new Product("apple", 100); const c = new Cart(); c.add(apple, 3); return c.size() === 1 && c.total() === 300; })()`,
    },
    {
      name: "別 product を add すると行が増える",
      code: `(() => { const a = new Product("a", 100); const b = new Product("b", 50); const c = new Cart(); c.add(a, 1); c.add(b, 2); return c.size() === 2 && c.total() === 200; })()`,
    },
    {
      name: "同じ product を 2 回 add すると行は 1 つで qty が合算される",
      code: `(() => { const a = new Product("a", 100); const c = new Cart(); c.add(a, 2); c.add(a, 3); return c.size() === 1 && c.total() === 500; })()`,
    },
    {
      name: "remove で該当行が消える",
      code: `(() => { const a = new Product("a", 100); const b = new Product("b", 50); const c = new Cart(); c.add(a, 2); c.add(b, 1); c.remove(b); return c.size() === 1 && c.total() === 200; })()`,
    },
    {
      name: "qty <= 0 の add は無視される",
      code: `(() => { const a = new Product("a", 100); const c = new Cart(); c.add(a, 0); c.add(a, -3); return c.size() === 0 && c.total() === 0; })()`,
    },
    {
      name: "#lines は外から直接読めない",
      code: `(() => { const c = new Cart(); return !("lines" in c); })()`,
    },
  ],
  hints: [
    "Product の constructor で if (price < 0) throw new Error(...) と書いた後、 this.#name = name; this.#price = price; の順で代入します。",
    "Cart#add は const existing = this.#lines.find((line) => line.product === product); で行を探し、 existing なら existing.qty += qty;、 そうでなければ this.#lines.push({ product, qty }); と分岐します。",
    "Cart#total は this.#lines.reduce((sum, line) => sum + line.product.getPrice() * line.qty, 0) のように reduce で書くのが綺麗です。",
    "解答例:\n```js\nclass Product {\n  #name;\n  #price;\n  constructor(name, price) {\n    if (price < 0) {\n      throw new Error(\"price must be >= 0\");\n    }\n    this.#name = name;\n    this.#price = price;\n  }\n  getName() { return this.#name; }\n  getPrice() { return this.#price; }\n}\n\nclass Cart {\n  #lines = [];\n  add(product, qty) {\n    if (qty <= 0) return;\n    const existing = this.#lines.find((line) => line.product === product);\n    if (existing !== undefined) {\n      existing.qty += qty;\n      return;\n    }\n    this.#lines.push({ product, qty });\n  }\n  remove(product) {\n    const i = this.#lines.findIndex((line) => line.product === product);\n    if (i >= 0) this.#lines.splice(i, 1);\n  }\n  total() {\n    return this.#lines.reduce(\n      (sum, line) => sum + line.product.getPrice() * line.qty,\n      0,\n    );\n  }\n  size() { return this.#lines.length; }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "Product / Cart を class で定義する",
        },
        {
          kind: "node",
          nodeType: "ClassPrivateProperty",
          label: "#name / #price / #lines などを private フィールドで宣言する",
        },
        {
          kind: "node",
          nodeType: "ThrowStatement",
          label: "Product の constructor で price < 0 のとき throw する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "getName / getPrice / total / size などで return する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `class Product {
  #name;
  #price;
  constructor(name, price) {
    if (price < 0) {
      throw new Error("price must be >= 0");
    }
    this.#name = name;
    this.#price = price;
  }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Cart {
  #lines = [];
  add(product, qty) {
    if (qty <= 0) return;
    const existing = this.#lines.find((line) => line.product === product);
    if (existing !== undefined) {
      existing.qty += qty;
      return;
    }
    this.#lines.push({ product, qty });
  }
  remove(product) {
    const i = this.#lines.findIndex((line) => line.product === product);
    if (i >= 0) this.#lines.splice(i, 1);
  }
  total() {
    return this.#lines.reduce(
      (sum, line) => sum + line.product.getPrice() * line.qty,
      0,
    );
  }
  size() { return this.#lines.length; }
}
`,
  badSolutions: [
    {
      code: `class Product {
  #name;
  #price;
  constructor(name, price) {
    if (price < 0) throw new Error("price must be >= 0");
    this.#name = name;
    this.#price = price;
  }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Cart extends Product {
  #lines = [];
  constructor() {
    super("cart", 0);
  }
  add(product, qty) {
    if (qty <= 0) return;
    this.#lines.push({ product, qty });
  }
  remove(product) {
    const i = this.#lines.findIndex((l) => l.product === product);
    if (i >= 0) this.#lines.splice(i, 1);
  }
  total() {
    return this.#lines.reduce((s, l) => s + l.product.getPrice() * l.qty, 0);
  }
  size() { return this.#lines.length; }
}
`,
      description:
        "Cart を Product から extends してしまっている。 Cart is-a Product ではなく Cart has-a Product (集約) なので、 これは設計の誤り。 「Cart は Product を継承していない」 テストで new Cart() instanceof Product が true になって失敗する。",
    },
    {
      code: `class Product {
  #name;
  #price;
  constructor(name, price) {
    if (price < 0) throw new Error("price must be >= 0");
    this.#name = name;
    this.#price = price;
  }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Cart {
  #lines = [];
  add(product, qty) {
    if (qty <= 0) return;
    this.#lines.push({ product, qty });
  }
  remove(product) {
    const i = this.#lines.findIndex((l) => l.product === product);
    if (i >= 0) this.#lines.splice(i, 1);
  }
  total() {
    return this.#lines.reduce((s, l) => s + l.product.getPrice() * l.qty, 0);
  }
  size() { return this.#lines.length; }
}
`,
      description:
        "add で 「既存行を探して足す」 をやらず、 毎回新規行を push してしまっている。 同じ product を 2 回追加すると size が 2 になってしまうため、 「同じ product を 2 回 add すると行は 1 つで qty が合算される」 テストで失敗する。",
    },
    {
      code: `class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
  getName() { return this.name; }
  getPrice() { return this.price; }
}

class Cart {
  constructor() { this.lines = []; }
  add(product, qty) {
    if (qty <= 0) return;
    const existing = this.lines.find((l) => l.product === product);
    if (existing) { existing.qty += qty; return; }
    this.lines.push({ product, qty });
  }
  remove(product) {
    const i = this.lines.findIndex((l) => l.product === product);
    if (i >= 0) this.lines.splice(i, 1);
  }
  total() {
    return this.lines.reduce((s, l) => s + l.product.getPrice() * l.qty, 0);
  }
  size() { return this.lines.length; }
}
`,
      description:
        "private フィールドを 1 つも使わず、 価格 < 0 の throw もしていない。 AST required の ClassPrivateProperty と ThrowStatement に違反し、 「price が負だと例外」 「name / price は外から直接読めない」 「#lines は外から直接読めない」 のテストで失敗する。",
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
      heading: "プライベートクラス機能",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/Private_properties",
      pageTitle: "プライベートクラス機能",
    },
  ],
};
