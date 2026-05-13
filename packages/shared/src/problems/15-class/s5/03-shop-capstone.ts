import type { Assignment } from "../../../types.js";

export const s5Ch15ShopCapstone: Assignment = {
  id: "S5-Ch15-03-shop-capstone",
  stage: "S5",
  chapterId: "Ch15",
  sequence: 3,
  title: "[卒業課題] Product / Inventory / Shop の 3 class で在庫管理を設計する",
  newConcept:
    "**値オブジェクト (`Product`) / 集合 (`Inventory`) / ユースケース (`Shop`)** の 3 段の責務分割。 `Shop` が `new Inventory()` を内部で所有し、 在庫操作を **委譲** する。 在庫不足のときは状態を変えずに失敗を値で返し、 例外で抜けない。 `Map` を `#privateField` に持って 「sku → 数量 / sku → Product」 を class の中だけで管理する",
  estimatedMinutes: 80,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  lintPreset: "S5",
  description: `## やること

Ch15 S5 の **卒業課題** です。 これまでに学んだ 「複数 class の連携」 「コンポジション」 「\`#privateField\` で不変条件を守る」 を組み合わせて、 **小さな在庫管理付きショップ** を **\`Product\` / \`Inventory\` / \`Shop\` の 3 つの class** で実装してください。

### Product (値オブジェクト)

- \`constructor(sku, name, price)\` で \`#sku\` / \`#name\` / \`#price\` を private で持つ。
- \`price < 0\` のときは \`throw new Error(...)\`。
- \`getSku()\` / \`getName()\` / \`getPrice()\` のみ公開。 setter は無し。

### Inventory (集合)

- \`constructor()\` で **\`#stock = new Map()\`** を private に持つ (キー: \`sku\`、 値: 現在数量)。
- \`receive(product, qty)\`: \`qty > 0\` のときに限り、 \`product.getSku()\` を key にして現在数量に \`qty\` を加算する (未登録なら 0 からスタート)。
- \`take(sku, qty)\`: \`qty > 0\` かつ現在数量が \`qty\` 以上のときに限り、 数量を減らして \`true\` を返す。 そうでなければ **数量を変えずに** \`false\` を返す。
- \`level(sku)\`: 現在数量を返す。 未登録の sku なら \`0\`。

### Shop (ユースケース)

- \`constructor()\` で **\`#inventory = new Inventory()\`** と **\`#catalog = new Map()\`** (sku → Product) を private で初期化する。 Shop が Inventory を **所有** している (Shop の外に Inventory が漏れない)。
- \`register(product, initialQty)\`: \`#catalog.set(product.getSku(), product)\` で商品マスタに登録し、 在庫追加を \`#inventory.receive(product, initialQty)\` に **委譲** する (Shop 自身は数量を保持しない)。
- \`buy(sku, qty)\`:
  - \`#catalog\` から Product を引く。 未登録なら \`{ ok: false, total: 0 }\` を返す。
  - \`#inventory.take(sku, qty)\` を呼び、 成功なら \`{ ok: true, total: price * qty }\`、 失敗なら \`{ ok: false, total: 0 }\` を返す。
- \`stockOf(sku)\`: \`#inventory.level(sku)\` の結果をそのまま返す (これも委譲)。

\`\`\`js
const apple = new Product("APL", "apple", 100);
const banana = new Product("BNN", "banana", 80);

const shop = new Shop();
shop.register(apple, 10);
shop.register(banana, 5);

shop.stockOf("APL");           // → 10
shop.buy("APL", 3);            // → { ok: true,  total: 300 }
shop.stockOf("APL");           // → 7
shop.buy("APL", 100);          // → { ok: false, total: 0 } (在庫不足)
shop.stockOf("APL");           // → 7 (失敗しても在庫は動かない)
shop.buy("UNKNOWN", 1);        // → { ok: false, total: 0 }

// Inventory は Shop の外からは見えない
"inventory" in shop;           // → false

// 同じ sku を再 register すると在庫が積み上がる
shop.register(apple, 5);
shop.stockOf("APL");           // → 12
\`\`\`

## ポイント

S5 卒業課題として、 ここまでの 2 問で学んだ 「値オブジェクト」 「集合」 のうえに **「ユースケース」 という 3 段目** を載せます。 これが Ch15 S5 の全体像です。

### 3 段の責務分割: 値 / 集合 / ユースケース

- **Product (値オブジェクト)** … 1 つの商品の表現。 不変条件 (\`price >= 0\`) を constructor で守る。
- **Inventory (集合)** … 在庫データの集合 (\`sku → 数量\` の Map)。 「在庫を足す / 取る / 見る」 のだけを知っている。 「金額」 「カタログ」 のような上位の概念は持たない。
- **Shop (ユースケース)** … 「商品を登録する」 「買う」 という 利用者向けの操作 をまとめる層。 \`buy\` の中で 「カタログから Product を引く → Inventory に在庫を減らさせる → 金額を計算して返す」 という 3 ステップを 組み立てる。

この 3 段の責務分割ができていれば、 例えば 「ロギングを足したい」 「在庫の永続化先を変えたい」 のような要求が来ても、 触る class が 1 つで済むようになります。

### 委譲 (delegation): 自分でやらず、 持ち主に頼む

\`Shop\` は **自分で** \`stock\` Map を持って数量を直接いじったりしません。 \`shop.buy\` の中で \`#inventory.take(sku, qty)\` を呼んで、 「在庫を減らせるかどうか」 の判定と更新を **すべて Inventory に任せます**。 これが **委譲** です。 同じ in-memory の Map を 2 箇所で同期しないと壊れる、 という地獄を避けられます。

### 失敗は値で返す、 例外で抜けない

\`buy\` は在庫不足や未登録 sku のときに **例外を投げません**。 \`{ ok: false, total: 0 }\` という **値** を返します。 これは Ch13 S5 で扱った 「Result 型的な失敗の扱い」 と同じ発想で、 「処理が失敗しても呼び出し側がそのまま受け取って分岐できる」 という設計です。 例外を投げると呼び出し側が必ず \`try/catch\` を書かないといけなくなり、 1 個でも忘れると上に伝搬してアプリ全体が落ちます。

### 不変条件を class の中で閉じ込める

- 「\`Product\` の価格は 0 以上」 → \`Product\` の constructor で \`throw\` する。
- 「在庫は負にならない」 → \`Inventory#take\` の中で 「足りないときは減らさない」 と書く (\`#stock\` は private なので外から直接書き換えられない)。
- 「Shop の外から Inventory にアクセスできない」 → Shop の \`#inventory\` を private にする。 これで \`shop.inventory.take(...)\` のような裏口を塞げる。

### 守るべき設計

- **\`Product\` / \`Inventory\` / \`Shop\` の 3 つの class** を定義する。 entryPoints も 3 つすべて指定します。
- Shop は \`new Inventory()\` を constructor で内部生成する (= 所有)。
- \`#sku\` / \`#name\` / \`#price\` / \`#stock\` / \`#inventory\` / \`#catalog\` は private フィールド。
- \`Inventory#take\` は **状態を変えずに false を返す** (失敗時)。
- \`Shop#buy\` は **例外を投げず** \`{ ok, total }\` の値を返す。
- \`var\` / \`==\` / \`!=\` は使わない。
`,
  starterCode: `// Product / Inventory / Shop の 3 つのクラスを定義してください
class Product {
  // #sku / #name / #price を private で持つ
  // price < 0 なら throw new Error(...)
  // getSku() / getName() / getPrice() のみ公開
}

class Inventory {
  // #stock = new Map(); (sku → 数量)
  // receive(product, qty) / take(sku, qty) → boolean / level(sku) → number
}

class Shop {
  // #inventory = new Inventory();
  // #catalog = new Map(); (sku → Product)
  // register(product, initialQty)
  // buy(sku, qty) → { ok, total }
  // stockOf(sku) → number
}
`,
  entryPoints: ["Product", "Inventory", "Shop"],
  demoCall: `const p = new Product("APL", "apple", 100); const shop = new Shop(); shop.register(p, 10); console.log(shop.buy("APL", 3));`,
  tests: [
    {
      name: "Product / Inventory / Shop の 3 つが class として定義されている",
      code: `typeof Product === "function" && typeof Inventory === "function" && typeof Shop === "function"`,
    },
    {
      name: "Product の getSku / getName / getPrice で値が取れる",
      code: `(() => { const p = new Product("APL", "apple", 100); return p.getSku() === "APL" && p.getName() === "apple" && p.getPrice() === 100; })()`,
    },
    {
      name: "Product の price が負だと constructor で例外",
      code: `(() => { try { new Product("X", "x", -1); return false; } catch (e) { return e instanceof Error; } })()`,
    },
    {
      name: "Inventory 単体で receive → level で在庫が反映",
      code: `(() => { const p = new Product("APL", "apple", 100); const inv = new Inventory(); inv.receive(p, 5); return inv.level("APL") === 5; })()`,
    },
    {
      name: "Inventory#take 成功で true を返し残量が減る",
      code: `(() => { const p = new Product("APL", "apple", 100); const inv = new Inventory(); inv.receive(p, 5); const ok = inv.take("APL", 3); return ok === true && inv.level("APL") === 2; })()`,
    },
    {
      name: "Inventory#take 在庫不足で false を返し残量は不変",
      code: `(() => { const p = new Product("APL", "apple", 100); const inv = new Inventory(); inv.receive(p, 5); const ok = inv.take("APL", 100); return ok === false && inv.level("APL") === 5; })()`,
    },
    {
      name: "Inventory#level は未登録の sku に対して 0 を返す",
      code: `new Inventory().level("UNKNOWN") === 0`,
    },
    {
      name: "Shop#register → stockOf で在庫が反映される",
      code: `(() => { const p = new Product("APL", "apple", 100); const shop = new Shop(); shop.register(p, 10); return shop.stockOf("APL") === 10; })()`,
    },
    {
      name: "Shop#buy 成功で { ok: true, total: price*qty } を返し在庫が減る",
      code: `(() => { const p = new Product("APL", "apple", 100); const shop = new Shop(); shop.register(p, 10); const r = shop.buy("APL", 3); return r.ok === true && r.total === 300 && shop.stockOf("APL") === 7; })()`,
    },
    {
      name: "Shop#buy 在庫不足で { ok: false, total: 0 } を返し在庫は不変",
      code: `(() => { const p = new Product("APL", "apple", 100); const shop = new Shop(); shop.register(p, 10); const r = shop.buy("APL", 100); return r.ok === false && r.total === 0 && shop.stockOf("APL") === 10; })()`,
    },
    {
      name: "Shop#buy 未登録 sku は { ok: false, total: 0 } を返す",
      code: `(() => { const shop = new Shop(); const r = shop.buy("UNKNOWN", 1); return r.ok === false && r.total === 0; })()`,
    },
    {
      name: "同じ sku を再 register すると在庫が積み上がる",
      code: `(() => { const p = new Product("APL", "apple", 100); const shop = new Shop(); shop.register(p, 7); shop.register(p, 5); return shop.stockOf("APL") === 12; })()`,
    },
    {
      name: "Shop の private フィールドは外から見えない (inventory / catalog / stock など)",
      code: `(() => { const shop = new Shop(); return !("inventory" in shop) && !("catalog" in shop) && !("stock" in shop); })()`,
    },
    {
      name: "Shop は Inventory の一種ではない (extends していない)",
      code: `(() => { const shop = new Shop(); return !(shop instanceof Inventory); })()`,
    },
  ],
  hints: [
    "Inventory#receive は const cur = this.#stock.get(sku) ?? 0; this.#stock.set(sku, cur + qty); の形が定番です (qty > 0 のときだけ実行)。",
    "Inventory#take は 「条件を満たすときだけ更新する」 がポイント。 if (qty > 0 && (this.#stock.get(sku) ?? 0) >= qty) の分岐の中で減算して true を返し、 そうでなければ何もせず false を return します。",
    "Shop#buy は 1) catalog から Product を引いて未登録なら早期 return、 2) inventory.take の結果で分岐、 という 2 ステップに分けると書きやすいです。",
    "解答例:\n```js\nclass Product {\n  #sku; #name; #price;\n  constructor(sku, name, price) {\n    if (price < 0) throw new Error(\"price must be >= 0\");\n    this.#sku = sku;\n    this.#name = name;\n    this.#price = price;\n  }\n  getSku() { return this.#sku; }\n  getName() { return this.#name; }\n  getPrice() { return this.#price; }\n}\n\nclass Inventory {\n  #stock = new Map();\n  receive(product, qty) {\n    if (qty <= 0) return;\n    const sku = product.getSku();\n    const cur = this.#stock.get(sku) ?? 0;\n    this.#stock.set(sku, cur + qty);\n  }\n  take(sku, qty) {\n    const cur = this.#stock.get(sku) ?? 0;\n    if (qty > 0 && cur >= qty) {\n      this.#stock.set(sku, cur - qty);\n      return true;\n    }\n    return false;\n  }\n  level(sku) { return this.#stock.get(sku) ?? 0; }\n}\n\nclass Shop {\n  #inventory = new Inventory();\n  #catalog = new Map();\n  register(product, initialQty) {\n    this.#catalog.set(product.getSku(), product);\n    this.#inventory.receive(product, initialQty);\n  }\n  buy(sku, qty) {\n    const product = this.#catalog.get(sku);\n    if (product === undefined) return { ok: false, total: 0 };\n    if (this.#inventory.take(sku, qty)) {\n      return { ok: true, total: product.getPrice() * qty };\n    }\n    return { ok: false, total: 0 };\n  }\n  stockOf(sku) { return this.#inventory.level(sku); }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "Product / Inventory / Shop を class で定義する",
        },
        {
          kind: "node",
          nodeType: "ClassPrivateProperty",
          label: "#sku / #stock / #inventory / #catalog などを private フィールドで宣言する",
        },
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "Shop の中で new Inventory() を生成する (所有)",
        },
        {
          kind: "node",
          nodeType: "ThrowStatement",
          label: "Product の price < 0 のとき throw する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "take / level / buy / stockOf などで return する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `class Product {
  #sku;
  #name;
  #price;
  constructor(sku, name, price) {
    if (price < 0) {
      throw new Error("price must be >= 0");
    }
    this.#sku = sku;
    this.#name = name;
    this.#price = price;
  }
  getSku() { return this.#sku; }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Inventory {
  #stock = new Map();
  receive(product, qty) {
    if (qty <= 0) return;
    const sku = product.getSku();
    const cur = this.#stock.get(sku) ?? 0;
    this.#stock.set(sku, cur + qty);
  }
  take(sku, qty) {
    const cur = this.#stock.get(sku) ?? 0;
    if (qty > 0 && cur >= qty) {
      this.#stock.set(sku, cur - qty);
      return true;
    }
    return false;
  }
  level(sku) { return this.#stock.get(sku) ?? 0; }
}

class Shop {
  #inventory = new Inventory();
  #catalog = new Map();
  register(product, initialQty) {
    this.#catalog.set(product.getSku(), product);
    this.#inventory.receive(product, initialQty);
  }
  buy(sku, qty) {
    const product = this.#catalog.get(sku);
    if (product === undefined) return { ok: false, total: 0 };
    if (this.#inventory.take(sku, qty)) {
      return { ok: true, total: product.getPrice() * qty };
    }
    return { ok: false, total: 0 };
  }
  stockOf(sku) { return this.#inventory.level(sku); }
}
`,
  badSolutions: [
    {
      code: `class Product {
  #sku; #name; #price;
  constructor(sku, name, price) {
    if (price < 0) throw new Error("price must be >= 0");
    this.#sku = sku; this.#name = name; this.#price = price;
  }
  getSku() { return this.#sku; }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Shop {
  #stock = new Map();
  #catalog = new Map();
  register(product, initialQty) {
    this.#catalog.set(product.getSku(), product);
    const cur = this.#stock.get(product.getSku()) ?? 0;
    this.#stock.set(product.getSku(), cur + initialQty);
  }
  buy(sku, qty) {
    const product = this.#catalog.get(sku);
    if (product === undefined) return { ok: false, total: 0 };
    const cur = this.#stock.get(sku) ?? 0;
    if (qty > 0 && cur >= qty) {
      this.#stock.set(sku, cur - qty);
      return { ok: true, total: product.getPrice() * qty };
    }
    return { ok: false, total: 0 };
  }
  stockOf(sku) { return this.#stock.get(sku) ?? 0; }
}
`,
      description:
        "Inventory class を作らず、 Shop に直接 #stock を持たせてしまっている。 「Product / Inventory / Shop の 3 つが class」 のテストで Inventory が typeof !== 'function' になって失敗する。 また在庫管理の責務が Shop に染み込み、 ユースケース層 と 集合層 の分離が崩れる。",
    },
    {
      code: `class Product {
  #sku; #name; #price;
  constructor(sku, name, price) {
    if (price < 0) throw new Error("price must be >= 0");
    this.#sku = sku; this.#name = name; this.#price = price;
  }
  getSku() { return this.#sku; }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Inventory {
  #stock = new Map();
  receive(product, qty) {
    const cur = this.#stock.get(product.getSku()) ?? 0;
    this.#stock.set(product.getSku(), cur + qty);
  }
  take(sku, qty) {
    const cur = this.#stock.get(sku) ?? 0;
    this.#stock.set(sku, cur - qty);
    return true;
  }
  level(sku) { return this.#stock.get(sku) ?? 0; }
}

class Shop {
  #inventory = new Inventory();
  #catalog = new Map();
  register(product, initialQty) {
    this.#catalog.set(product.getSku(), product);
    this.#inventory.receive(product, initialQty);
  }
  buy(sku, qty) {
    const product = this.#catalog.get(sku);
    if (product === undefined) return { ok: false, total: 0 };
    this.#inventory.take(sku, qty);
    return { ok: true, total: product.getPrice() * qty };
  }
  stockOf(sku) { return this.#inventory.level(sku); }
}
`,
      description:
        "take が在庫不足のチェックをせず、 残量より大きい qty でも減算して true を返してしまう。 さらに buy も take の戻り値を見ずに常に { ok: true } を返す。 「在庫不足で { ok: false, total: 0 } を返し在庫は不変」 のテストで失敗する。 状態を変えずに失敗を値で返す、 という S5 の規約が守れていない。",
    },
    {
      code: `class Product {
  #sku; #name; #price;
  constructor(sku, name, price) {
    if (price < 0) throw new Error("price must be >= 0");
    this.#sku = sku; this.#name = name; this.#price = price;
  }
  getSku() { return this.#sku; }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Inventory {
  #stock = new Map();
  receive(product, qty) {
    if (qty <= 0) return;
    const cur = this.#stock.get(product.getSku()) ?? 0;
    this.#stock.set(product.getSku(), cur + qty);
  }
  take(sku, qty) {
    const cur = this.#stock.get(sku) ?? 0;
    if (qty > 0 && cur >= qty) {
      this.#stock.set(sku, cur - qty);
      return true;
    }
    return false;
  }
  level(sku) { return this.#stock.get(sku) ?? 0; }
}

class Shop extends Inventory {
  #catalog = new Map();
  register(product, initialQty) {
    this.#catalog.set(product.getSku(), product);
    this.receive(product, initialQty);
  }
  buy(sku, qty) {
    const product = this.#catalog.get(sku);
    if (product === undefined) return { ok: false, total: 0 };
    if (this.take(sku, qty)) {
      return { ok: true, total: product.getPrice() * qty };
    }
    return { ok: false, total: 0 };
  }
  stockOf(sku) { return this.level(sku); }
}
`,
      description:
        "Shop を Inventory から extends してしまっており、 Shop is-a Inventory という意味になってしまう。 Shop は Inventory の一種ではなく、 内部に Inventory を 持つ (集約 / 所有) だけ。 「Shop は Inventory の一種ではない」 テストで shop instanceof Inventory が true になって失敗する。 さらに Inventory の API がそのまま Shop の外に漏れる (例: shop.take(...) が呼べてしまう)。",
    },
    {
      code: `class Product {
  #sku; #name; #price;
  constructor(sku, name, price) {
    if (price < 0) throw new Error("price must be >= 0");
    this.#sku = sku; this.#name = name; this.#price = price;
  }
  getSku() { return this.#sku; }
  getName() { return this.#name; }
  getPrice() { return this.#price; }
}

class Inventory {
  #stock = new Map();
  receive(product, qty) {
    if (qty <= 0) return;
    const cur = this.#stock.get(product.getSku()) ?? 0;
    this.#stock.set(product.getSku(), cur + qty);
  }
  take(sku, qty) {
    const cur = this.#stock.get(sku) ?? 0;
    if (qty > 0 && cur >= qty) {
      this.#stock.set(sku, cur - qty);
      return true;
    }
    throw new Error("insufficient stock");
  }
  level(sku) { return this.#stock.get(sku) ?? 0; }
}

class Shop {
  #inventory = new Inventory();
  #catalog = new Map();
  register(product, initialQty) {
    this.#catalog.set(product.getSku(), product);
    this.#inventory.receive(product, initialQty);
  }
  buy(sku, qty) {
    const product = this.#catalog.get(sku);
    if (product === undefined) return { ok: false, total: 0 };
    this.#inventory.take(sku, qty);
    return { ok: true, total: product.getPrice() * qty };
  }
  stockOf(sku) { return this.#inventory.level(sku); }
}
`,
      description:
        "在庫不足を例外で抜けてしまっている。 buy が try/catch を書いていないため、 在庫不足の buy 呼び出しがそのまま例外で落ち、 「在庫不足で { ok: false, total: 0 } を返す」 テストが false 値を期待しているのに例外で死ぬ。 S5 では 「失敗は値で返す、 例外で抜けない」 を規約にしている。",
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
    {
      heading: "Map",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map",
      pageTitle: "Map",
    },
  ],
};
