import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const limitedCounter: Assignment = {
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
  solution: `class LimitedCounter {
  #count = 0;
  #limit;

  constructor(limit) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('limit must be a positive integer');
    }
    this.#limit = limit;
  }
  increment() {
    if (this.#count >= this.#limit) return false;
    this.#count++;
    return true;
  }
  reset() { this.#count = 0; }
  get count() { return this.#count; }
  get isFull() { return this.#count >= this.#limit; }
}
`,
  entryPoints: ["LimitedCounter"],
  tests: [
    {
      name: "初期 0",
      code: "new LimitedCounter(3).count === 0",
    },
    {
      name: "increment 増加",
      code: "(() => { const c = new LimitedCounter(3); c.increment(); return c.count === 1; })()",
    },
    {
      name: "increment 戻り値 true",
      code: "new LimitedCounter(3).increment() === true",
    },
    {
      name: "上限に達したら false",
      code: "(() => { const c = new LimitedCounter(2); c.increment(); c.increment(); return c.increment() === false && c.count === 2; })()",
    },
    {
      name: "isFull",
      code: "(() => { const c = new LimitedCounter(2); c.increment(); c.increment(); return c.isFull === true; })()",
    },
    {
      name: "reset",
      code: "(() => { const c = new LimitedCounter(3); c.increment(); c.increment(); c.reset(); return c.count === 0 && c.isFull === false; })()",
    },
    {
      name: "limit バリデーション",
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
      {
        kind: "node",
        nodeType: "ClassPrivateProperty",
        label: "#フィールド (プライベートフィールド宣言) を使う",
      },
      {
        kind: "node",
        nodeType: "PrivateName",
        label: "#count を参照する (this.#count)",
      },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
