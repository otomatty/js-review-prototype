import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const moneyClass: Assignment = {
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
  solution: "class Money {\n  constructor(amount, currency) {\n    this.amount = amount;\n    this.currency = currency;\n  }\n  add(other) {\n    if (other.currency !== this.currency) {\n      throw new Error('currency mismatch');\n    }\n    return new Money(this.amount + other.amount, this.currency);\n  }\n  format() {\n    return `${this.amount.toLocaleString('en-US')} ${this.currency}`;\n  }\n  static fromJpy(amount) { return new Money(amount, 'JPY'); }\n  static fromUsd(amount) { return new Money(amount, 'USD'); }\n}\n",
  entryPoints: ["Money"],
  tests: [
    {
      name: "fromJpy",
      code: "(() => { const m = Money.fromJpy(100); return m.amount === 100 && m.currency === 'JPY'; })()",
    },
    {
      name: "fromUsd",
      code: "(() => { const m = Money.fromUsd(50); return m.amount === 50 && m.currency === 'USD'; })()",
    },
    {
      name: "add (新しいインスタンス)",
      code: "(() => { const a = Money.fromJpy(1000); const b = Money.fromJpy(234); const c = a.add(b); return c instanceof Money && c.amount === 1234 && a.amount === 1000; })()",
    },
    {
      name: "format 3桁区切り",
      code: "Money.fromJpy(1234).format() === '1,234 JPY'",
    },
    {
      name: "format 0",
      code: "Money.fromJpy(0).format() === '0 JPY'",
    },
    {
      name: "format 大きい数",
      code: "Money.fromJpy(1234567).format() === '1,234,567 JPY'",
    },
    {
      name: "通貨違いは throw",
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
};
