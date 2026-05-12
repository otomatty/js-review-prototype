import type { Assignment } from "../../../types.js";

export const s5Ch12FixCartTotal: Assignment = {
  id: "S5-Ch12-02-fix-cart-total",
  stage: "S5",
  chapterId: "Ch12",
  sequence: 2,
  title: "[デバッグ] ショッピングカート合計の仕様 vs 実装の差を直す",
  newConcept:
    "**仕様書と実装の差** を 3 箇所 (addItem の重複マージ / calcTotal の数量 / 割引の解釈) で見つけて直す。 単体では気付きにくい統合バグを潰す訓練",
  estimatedMinutes: 70,
  difficulty: 2,
  testKind: "function",
  description: `## やること

ショッピングカートの集計を 3 つの関数 (\`addItem\` / \`applyDiscount\` / \`calcTotal\`) で実装しています。 **仕様書** は次のとおりですが、 現状の実装には複数の食い違いがあります。 仕様に合わせて修正してください。

### カートの形

\`\`\`js
const cart = {
  items: [
    // { productId: "A", name: "Apple", price: 100, quantity: 2 },
  ],
  discountPercent: 0,    // 0〜100 の数値。 0 なら割引なし
};
\`\`\`

### 仕様

- \`addItem(cart, item)\` — \`item = { productId, name, price, quantity }\` を \`cart.items\` に追加する。 **同じ \`productId\` が既にカートにある場合は、 別行を作らず数量を加算** する。 違う \`productId\` は末尾に新しい行として追加。 cart を返す。
- \`applyDiscount(cart, percent)\` — \`cart.discountPercent\` を \`percent\` (0〜100) に設定する。 cart を返す。
- \`calcTotal(cart)\` — 税込合計金額を返す。
  - **小計** = 全 item の \`price × quantity\` の合計
  - **割引後** = 小計 × \`(1 - discountPercent / 100)\`  （**パーセント** であり、 金額ではない）
  - **税込** = 割引後 × \`(1 + 0.1)\`  （消費税 10%）
  - 戻り値は **小数第 2 位までに四捨五入** (\`Math.round(x * 100) / 100\`)。

### 期待値 vs 現状

\`\`\`js
let cart = { items: [], discountPercent: 0 };
addItem(cart, { productId: "A", name: "Apple", price: 100, quantity: 2 });
addItem(cart, { productId: "A", name: "Apple", price: 100, quantity: 1 });
// 期待: items.length === 1, items[0].quantity === 3
// 現状: items.length === 2 (同じ A が 2 行に分かれている)

calcTotal({ items: [{ productId: "A", name: "A", price: 100, quantity: 3 }], discountPercent: 0 });
// 期待: 330  (100 × 3 × 1.1)
// 現状: 110  (quantity を掛け忘れ、 100 × 1.1 になっている)

calcTotal({ items: [{ productId: "A", name: "A", price: 1000, quantity: 1 }], discountPercent: 10 });
// 期待: 990  (1000 × 0.9 × 1.1)
// 現状: 1089 (割引を「10 円引き」 と解釈してしまっている: (1000 - 10) × 1.1)
\`\`\`

## ポイント

- 3 つのバグは **それぞれ別の関数 / 別のロジック** にある。 単体では「テスト 1 個だけ通る」 状態に直すのは簡単だが、 **全テストを揃って通す** ためには 3 箇所すべて仕様と照合する必要がある。 これが「複数関数にまたがるバグ」 の難しさ。
- \`addItem\` のバグは **見落としやすい**: 1 個だけ追加するテストでは気付かず、 同じ商品を 2 回追加して初めて表面化する。 仕様書に「同じ \`productId\` は数量加算」 と明記されている。
- \`calcTotal\` の **数量忘れ** と **割引解釈** は別バグ。 まず数量 1 のテストだけ通るか確認し、 通ったら数量 ≥ 2 のテスト → 割引のテスト と段階を進める。
- バグの切り分けは **「小さい入力で再現 → 1 箇所ずつ直す」** が鉄則。 一度に全部直そうとせず、 失敗テストを 1 個ずつ潰す。
- **仕様書を読む**: 「percent」 と書かれていれば必ず \`/ 100\` がある。 「discount」 という名前だけ見て「引き算」 と即断しない。

## 制約

- 関数名 (\`addItem\` / \`applyDiscount\` / \`calcTotal\`) と引数は変えない。
- カートは破壊的に更新してよい (\`cart.items.push\` / \`cart.discountPercent = ...\` は OK)。 ただし **入力 \`item\` オブジェクト** を保持して後で書き換えると cart にも影響するので、 \`addItem\` では新しい行を作るとき \`{ ...item }\` でコピーすること (現状コードも既にコピーしている)。
- 税率は **0.1 (10%)** で固定。
- \`calcTotal\` の戻り値は **数値**。 \`Math.round(x * 100) / 100\` で小数 2 桁に丸める。
`,
  starterCode: `const TAX_RATE = 0.1;

function addItem(cart, item) {
  cart.items.push({ ...item });
  return cart;
}

function applyDiscount(cart, percent) {
  cart.discountPercent = percent;
  return cart;
}

function calcTotal(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.price, 0);
  const afterDiscount = subtotal - cart.discountPercent;
  const total = afterDiscount * (1 + TAX_RATE);
  return Math.round(total * 100) / 100;
}
`,
  entryPoints: ["addItem", "applyDiscount", "calcTotal"],
  demoCall: `(() => {
  const cart = { items: [], discountPercent: 0 };
  addItem(cart, { productId: "A", name: "Apple", price: 100, quantity: 2 });
  addItem(cart, { productId: "A", name: "Apple", price: 100, quantity: 1 });
  applyDiscount(cart, 10);
  console.log(JSON.stringify(cart));
  console.log(calcTotal(cart));
})();`,
  tests: [
    {
      name: "addItem: 異なる productId は別行として追加される",
      code: `(() => {
        const cart = { items: [], discountPercent: 0 };
        addItem(cart, { productId: "A", name: "A", price: 100, quantity: 1 });
        addItem(cart, { productId: "B", name: "B", price: 200, quantity: 2 });
        return cart.items.length === 2
          && cart.items[0].productId === "A" && cart.items[0].quantity === 1
          && cart.items[1].productId === "B" && cart.items[1].quantity === 2;
      })()`,
    },
    {
      name: "addItem: 同じ productId は数量加算 (1 行のまま)",
      code: `(() => {
        const cart = { items: [], discountPercent: 0 };
        addItem(cart, { productId: "A", name: "A", price: 100, quantity: 2 });
        addItem(cart, { productId: "A", name: "A", price: 100, quantity: 1 });
        return cart.items.length === 1 && cart.items[0].quantity === 3;
      })()`,
    },
    {
      name: "addItem: 3 回連続で同じ商品を入れても 1 行で合算される",
      code: `(() => {
        const cart = { items: [], discountPercent: 0 };
        addItem(cart, { productId: "X", name: "X", price: 50, quantity: 1 });
        addItem(cart, { productId: "X", name: "X", price: 50, quantity: 2 });
        addItem(cart, { productId: "X", name: "X", price: 50, quantity: 4 });
        return cart.items.length === 1 && cart.items[0].quantity === 7;
      })()`,
    },
    {
      name: "applyDiscount: discountPercent をセットして cart を返す",
      code: `(() => {
        const cart = { items: [], discountPercent: 0 };
        const ret = applyDiscount(cart, 25);
        return ret === cart && cart.discountPercent === 25;
      })()`,
    },
    {
      name: "calcTotal: 単一アイテム quantity 1 (税のみ)",
      code: `calcTotal({ items: [{ productId: "A", name: "A", price: 100, quantity: 1 }], discountPercent: 0 }) === 110`,
    },
    {
      name: "calcTotal: 単一アイテム quantity 3 (数量を掛ける)",
      code: `calcTotal({ items: [{ productId: "A", name: "A", price: 100, quantity: 3 }], discountPercent: 0 }) === 330`,
    },
    {
      name: "calcTotal: 複数アイテムは price × quantity の和",
      code: `calcTotal({ items: [
        { productId: "A", name: "A", price: 100, quantity: 2 },
        { productId: "B", name: "B", price: 200, quantity: 1 },
      ], discountPercent: 0 }) === 440`,
    },
    {
      name: "calcTotal: 10% 割引はパーセントとして掛ける (引き算ではない)",
      code: `calcTotal({ items: [{ productId: "A", name: "A", price: 1000, quantity: 1 }], discountPercent: 10 }) === 990`,
    },
    {
      name: "calcTotal: 25% 割引で小数も丸めて返る",
      code: `calcTotal({ items: [{ productId: "A", name: "A", price: 1000, quantity: 1 }], discountPercent: 25 }) === 825`,
    },
    {
      name: "calcTotal: 空カートは 0",
      code: `calcTotal({ items: [], discountPercent: 0 }) === 0`,
    },
    {
      name: "統合: addItem × 3 + applyDiscount + calcTotal",
      code: `(() => {
        const cart = { items: [], discountPercent: 0 };
        addItem(cart, { productId: "A", name: "A", price: 100, quantity: 2 });
        addItem(cart, { productId: "B", name: "B", price: 200, quantity: 1 });
        addItem(cart, { productId: "A", name: "A", price: 100, quantity: 1 });
        applyDiscount(cart, 10);
        return calcTotal(cart) === 495;
      })()`,
    },
  ],
  hints: [
    "失敗しているテストを 1 つずつ読み、 どの関数のどのロジックが仕様と違うかを 1 個ずつ特定する。 3 箇所ある。",
    "`addItem` は **追加前に同じ `productId` が cart.items にあるかチェック**。 あれば `quantity` を加算するだけで return。 なければ新しい行を push。 `Array.prototype.find` が使える。",
    "`calcTotal` の小計は **price × quantity の和**。 reduce で `sum + it.price * it.quantity` と書く。",
    "`calcTotal` の割引は **パーセント (× (1 - discountPercent / 100))**。 「10 円引き」 ではなく「10% 引き」。 `subtotal - cart.discountPercent` は仕様違反。",
    "解答例:\n```js\nconst TAX_RATE = 0.1;\n\nfunction addItem(cart, item) {\n  const existing = cart.items.find((it) => it.productId === item.productId);\n  if (existing) {\n    existing.quantity = existing.quantity + item.quantity;\n    return cart;\n  }\n  cart.items.push({ ...item });\n  return cart;\n}\n\nfunction applyDiscount(cart, percent) {\n  cart.discountPercent = percent;\n  return cart;\n}\n\nfunction calcTotal(cart) {\n  const subtotal = cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0);\n  const afterDiscount = subtotal * (1 - cart.discountPercent / 100);\n  const total = afterDiscount * (1 + TAX_RATE);\n  return Math.round(total * 100) / 100;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "FunctionDeclaration", label: "function 宣言で 3 関数を書く" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で結果を返す" },
        { kind: "method", name: "reduce", label: "calcTotal の小計計算に reduce を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `const TAX_RATE = 0.1;

function addItem(cart, item) {
  const existing = cart.items.find((it) => it.productId === item.productId);
  if (existing) {
    existing.quantity = existing.quantity + item.quantity;
    return cart;
  }
  cart.items.push({ ...item });
  return cart;
}

function applyDiscount(cart, percent) {
  cart.discountPercent = percent;
  return cart;
}

function calcTotal(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const afterDiscount = subtotal * (1 - cart.discountPercent / 100);
  const total = afterDiscount * (1 + TAX_RATE);
  return Math.round(total * 100) / 100;
}
`,
  badSolutions: [
    {
      code: `const TAX_RATE = 0.1;

function addItem(cart, item) {
  cart.items.push({ ...item });
  return cart;
}

function applyDiscount(cart, percent) {
  cart.discountPercent = percent;
  return cart;
}

function calcTotal(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.price, 0);
  const afterDiscount = subtotal - cart.discountPercent;
  const total = afterDiscount * (1 + TAX_RATE);
  return Math.round(total * 100) / 100;
}
`,
      description: "元のバグそのまま (重複マージ無し / 数量掛け忘れ / 割引が引き算)",
    },
    {
      code: `const TAX_RATE = 0.1;

function addItem(cart, item) {
  const existing = cart.items.find((it) => it.productId === item.productId);
  if (existing) {
    existing.quantity = existing.quantity + item.quantity;
    return cart;
  }
  cart.items.push({ ...item });
  return cart;
}

function applyDiscount(cart, percent) {
  cart.discountPercent = percent;
  return cart;
}

function calcTotal(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const afterDiscount = subtotal - cart.discountPercent;
  const total = afterDiscount * (1 + TAX_RATE);
  return Math.round(total * 100) / 100;
}
`,
      description: "addItem と数量は直したが、 割引解釈をパーセントに直し忘れている (10% off テストが失敗)",
    },
    {
      code: `const TAX_RATE = 0.1;

function addItem(cart, item) {
  const existing = cart.items.find((it) => it.productId === item.productId);
  if (existing) {
    existing.quantity = existing.quantity + item.quantity;
    return cart;
  }
  cart.items.push({ ...item });
  return cart;
}

function applyDiscount(cart, percent) {
  cart.discountPercent = percent;
  return cart;
}

function calcTotal(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const afterDiscount = subtotal * (1 - cart.discountPercent / 100);
  return Math.round(afterDiscount * 100) / 100;
}
`,
      description: "calcTotal で消費税を掛け忘れている (税のみのテストや統合テストが軒並み失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Array.prototype.find",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/find",
      pageTitle: "Array.prototype.find",
    },
    {
      heading: "Array.prototype.reduce",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
      pageTitle: "Array.prototype.reduce",
    },
    {
      heading: "Math.round",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/round",
      pageTitle: "Math.round",
    },
  ],
};
