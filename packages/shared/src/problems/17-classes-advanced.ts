import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const classesAdvanced: Assignment[] = [
  // ────────────────────────────────────────────────
  // 17-1: extends と super
  // ────────────────────────────────────────────────
  {
    id: "shape-inheritance",
    topicId: "classes-advanced",
    title: "Shape を継承して Square と Circle を作る",
    difficulty: 2,
    description: `## Shape を継承して Square と Circle を作る

基底クラス \`Shape\` と、それを継承した \`Square\`、\`Circle\` を実装してください。

\`Shape\`:
- \`name\` プロパティを持つ（コンストラクタで保存）
- \`area()\`: \`0\` を返す（サブクラスが上書き）
- \`describe()\`: \`'{name}: area={area}'\` を返す（テンプレートリテラル）

\`Square extends Shape\`:
- \`new Square(side)\` で \`name='square'\` をスーパークラスに渡し、\`side\` を保存
- \`area()\`: \`side * side\` を返す

\`Circle extends Shape\`:
- \`new Circle(radius)\` で \`name='circle'\` をスーパークラスに渡し、\`radius\` を保存
- \`area()\`: \`Math.PI * radius * radius\` を返す

### 入出力例

\`\`\`js
const s = new Square(3);
s.name           // → 'square'
s.area()         // → 9
s.describe()     // → 'square: area=9'

const c = new Circle(2);
c.name           // → 'circle'
c.area()         // → ≈12.566...
c.describe()     // → 'circle: area=12.566370614359172'

s instanceof Square   // → true
s instanceof Shape    // → true
c instanceof Shape    // → true
c instanceof Square   // → false
\`\`\`

### 制約

- **\`extends\`** と **\`super(...)\`** を使う
- \`Square\` と \`Circle\` のコンストラクタで \`super(name)\` を呼ぶ
- \`var\` は使わない
`,
    starterCode: `class Shape {
  constructor(name) {
    this.name = name;
  }
  area() { return 0; }
  describe() { return ''; }
}

class Square extends Shape {
  constructor(side) {
    super('square');
    this.side = side;
  }
  area() { return 0; }
}

class Circle extends Shape {
  constructor(radius) {
    super('circle');
    this.radius = radius;
  }
  area() { return 0; }
}
`,
    entryPoints: ["Shape", "Square", "Circle"],
    tests: [
      {
        name: "Square.area",
        weight: 16,
        code: "new Square(3).area() === 9",
      },
      {
        name: "Square.name",
        weight: 14,
        code: "new Square(3).name === 'square'",
      },
      {
        name: "Square.describe",
        weight: 14,
        code: "new Square(3).describe() === 'square: area=9'",
      },
      {
        name: "Circle.area",
        weight: 14,
        code: "Math.abs(new Circle(2).area() - Math.PI * 4) < 1e-9",
      },
      {
        name: "Circle.name",
        weight: 14,
        code: "new Circle(2).name === 'circle'",
      },
      {
        name: "instanceof Shape",
        weight: 14,
        code: "new Square(1) instanceof Shape && new Circle(1) instanceof Shape",
      },
      {
        name: "型の独立",
        weight: 14,
        code: "!(new Square(1) instanceof Circle) && !(new Circle(1) instanceof Square)",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class 宣言を使う",
        },
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "describe でテンプレートリテラルを使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 17-2: static メソッドとファクトリ
  // ────────────────────────────────────────────────
  {
    id: "money-class",
    topicId: "classes-advanced",
    title: "Money クラスとファクトリメソッド",
    difficulty: 2,
    description: `## Money クラスとファクトリメソッド

通貨と金額を保持する \`Money\` クラスを実装してください。

- インスタンス: \`new Money(amount, currency)\` で \`amount\` と \`currency\` を保持
- メソッド \`add(other)\`: 同じ通貨どうしのみ加算した **新しい Money** を返す。通貨が違えば \`Error\` を throw
- メソッド \`format()\`: \`'1,234 JPY'\` のように **3桁区切り**+空白+通貨記号

- **static メソッド** \`Money.fromJpy(amount)\`: \`new Money(amount, 'JPY')\` のショートカット
- **static メソッド** \`Money.fromUsd(amount)\`: \`new Money(amount, 'USD')\` のショートカット

### 入出力例

\`\`\`js
const a = Money.fromJpy(1000);
const b = Money.fromJpy(234);
a.add(b).format()    // → '1,234 JPY'

Money.fromJpy(0).format()       // → '0 JPY'
Money.fromJpy(1234567).format() // → '1,234,567 JPY'

const usd = Money.fromUsd(10);
try { a.add(usd); } catch (e) { e instanceof Error }   // → true
\`\`\`

### 制約

- **\`class\` 構文** + **\`static\` メソッド**
- \`add\` は破壊的でない（新しい \`Money\` を返す）
- 3桁区切りは \`Number.prototype.toLocaleString('en-US')\` または手書きで実装
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  add(other) { return this; }
  format() { return ''; }

  static fromJpy(amount) { return new Money(amount, 'JPY'); }
  static fromUsd(amount) { return new Money(amount, 'USD'); }
}
`,
    entryPoints: ["Money"],
    tests: [
      {
        name: "fromJpy",
        weight: 14,
        code: "(() => { const m = Money.fromJpy(100); return m.amount === 100 && m.currency === 'JPY'; })()",
      },
      {
        name: "fromUsd",
        weight: 14,
        code: "(() => { const m = Money.fromUsd(50); return m.amount === 50 && m.currency === 'USD'; })()",
      },
      {
        name: "add (新しいインスタンス)",
        weight: 14,
        code: "(() => { const a = Money.fromJpy(1000); const b = Money.fromJpy(234); const c = a.add(b); return c instanceof Money && c.amount === 1234 && a.amount === 1000; })()",
      },
      {
        name: "format 3桁区切り",
        weight: 15,
        code: "Money.fromJpy(1234).format() === '1,234 JPY'",
      },
      {
        name: "format 0",
        weight: 15,
        code: "Money.fromJpy(0).format() === '0 JPY'",
      },
      {
        name: "format 大きい数",
        weight: 14,
        code: "Money.fromJpy(1234567).format() === '1,234,567 JPY'",
      },
      {
        name: "通貨違いは throw",
        weight: 14,
        code: "(() => { try { Money.fromJpy(1).add(Money.fromUsd(1)); return false; } catch(e) { return e instanceof Error; } })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class 宣言を使う",
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
  // 17-3: getter / setter
  // ────────────────────────────────────────────────
  {
    id: "temperature-class",
    topicId: "classes-advanced",
    title: "Temperature クラスで getter / setter",
    difficulty: 2,
    description: `## Temperature クラスで getter / setter

セルシウス温度を扱う \`Temperature\` クラスを実装してください。

- コンストラクタ: \`new Temperature(celsius)\`（内部に \`_celsius\` として保持）
- **getter** \`celsius\`: \`_celsius\` を返す
- **getter** \`fahrenheit\`: 華氏に換算した値を返す（\`c * 9 / 5 + 32\`）
- **setter** \`celsius\`: 値を保存（**\`-273.15\` 未満なら \`Error\` を throw**）
- **setter** \`fahrenheit\`: 華氏で受け取り、内部はセルシウスに変換して保存

### 入出力例

\`\`\`js
const t = new Temperature(25);
t.celsius        // → 25
t.fahrenheit     // → 77

t.celsius = 100;
t.fahrenheit     // → 212

t.fahrenheit = 32;
t.celsius        // → 0

try { t.celsius = -300 } catch(e) { e instanceof Error }  // → true
\`\`\`

### 制約

- **\`get celsius() {...}\` / \`set celsius(v) {...}\`** など、class 内 getter/setter 構文を使う
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get celsius() { return this._celsius; }
  set celsius(v) { this._celsius = v; }

  get fahrenheit() { return 0; }
  set fahrenheit(f) {}
}
`,
    entryPoints: ["Temperature"],
    tests: [
      {
        name: "celsius getter",
        weight: 14,
        code: "new Temperature(25).celsius === 25",
      },
      {
        name: "fahrenheit getter (25→77)",
        weight: 14,
        code: "Math.abs(new Temperature(25).fahrenheit - 77) < 1e-9",
      },
      {
        name: "celsius setter",
        weight: 14,
        code: "(() => { const t = new Temperature(0); t.celsius = 100; return Math.abs(t.fahrenheit - 212) < 1e-9; })()",
      },
      {
        name: "fahrenheit setter",
        weight: 15,
        code: "(() => { const t = new Temperature(0); t.fahrenheit = 32; return Math.abs(t.celsius - 0) < 1e-9; })()",
      },
      {
        name: "fahrenheit setter (212)",
        weight: 15,
        code: "(() => { const t = new Temperature(0); t.fahrenheit = 212; return Math.abs(t.celsius - 100) < 1e-9; })()",
      },
      {
        name: "下限バリデーション",
        weight: 14,
        code: "(() => { const t = new Temperature(0); try { t.celsius = -300; return false; } catch(e) { return e instanceof Error; } })()",
      },
      {
        name: "下限境界 -273.15 は OK",
        weight: 14,
        code: "(() => { const t = new Temperature(0); t.celsius = -273.15; return t.celsius === -273.15; })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class 宣言を使う",
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
  // 17-4: private fields でカウンタ
  // ────────────────────────────────────────────────
  {
    id: "limited-counter",
    topicId: "classes-advanced",
    title: "private field で上限付きカウンタ",
    difficulty: 3,
    description: `## private field で上限付きカウンタ

\`#count\` を **プライベートフィールド**として持つ \`LimitedCounter\` クラスを実装してください。

- コンストラクタ: \`new LimitedCounter(limit)\` — \`limit\` は正の整数（それ以外なら \`Error\` を throw）
- \`increment()\`: \`#count\` を 1 増やす。**\`limit\` を超える場合は何もせず \`false\` を返す**。成功時は \`true\` を返す
- \`reset()\`: \`#count\` を 0 に戻す
- getter \`count\`: 現在のカウントを返す
- getter \`isFull\`: \`#count >= limit\` なら \`true\`

外部から \`#count\` への直接アクセスができてはいけません（\`c.#count\` を書くと SyntaxError になる仕様）。

### 入出力例

\`\`\`js
const c = new LimitedCounter(3);
c.count            // → 0
c.increment()      // → true
c.count            // → 1
c.increment()      // → true
c.increment()      // → true
c.isFull           // → true
c.increment()      // → false   (上限到達、増えない)
c.count            // → 3
c.reset();
c.count            // → 0
c.isFull           // → false

try { new LimitedCounter(0); } catch(e) { e instanceof Error }  // → true
\`\`\`

### 制約

- \`#count\` プライベートフィールドを使う（\`this._count\` のような慣習名のみは不可）
- **\`class\` 構文** + getter
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `class LimitedCounter {
  #count = 0;
  #limit;

  constructor(limit) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('limit must be a positive integer');
    }
    this.#limit = limit;
  }

  increment() { return false; }
  reset() {}
  get count() { return this.#count; }
  get isFull() { return false; }
}
`,
    entryPoints: ["LimitedCounter"],
    tests: [
      {
        name: "初期 0",
        weight: 12,
        code: "new LimitedCounter(3).count === 0",
      },
      {
        name: "increment 増加",
        weight: 14,
        code: "(() => { const c = new LimitedCounter(3); c.increment(); return c.count === 1; })()",
      },
      {
        name: "increment 戻り値 true",
        weight: 14,
        code: "new LimitedCounter(3).increment() === true",
      },
      {
        name: "上限に達したら false",
        weight: 16,
        code: "(() => { const c = new LimitedCounter(2); c.increment(); c.increment(); return c.increment() === false && c.count === 2; })()",
      },
      {
        name: "isFull",
        weight: 14,
        code: "(() => { const c = new LimitedCounter(2); c.increment(); c.increment(); return c.isFull === true; })()",
      },
      {
        name: "reset",
        weight: 14,
        code: "(() => { const c = new LimitedCounter(3); c.increment(); c.increment(); c.reset(); return c.count === 0 && c.isFull === false; })()",
      },
      {
        name: "limit バリデーション",
        weight: 16,
        code: "(() => { try { new LimitedCounter(0); return false; } catch(e) { return e instanceof Error; } })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class 宣言を使う",
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
