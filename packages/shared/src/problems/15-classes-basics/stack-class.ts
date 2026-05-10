import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const stackClass: Assignment = {
  id: "stack-class",
  topicId: "classes-basics",
  title: "Stack クラスを実装する",
  difficulty: 2,
  description: `## Stack クラスを実装する

LIFO の **Stack クラス** を実装してください。

メソッド:

- \`push(value)\`: 末尾に追加し、新しい size を返す
- \`pop()\`: 末尾を取り出して返す。空なら \`undefined\`
- \`peek()\`: 末尾を返すだけ（取り出さない）。空なら \`undefined\`
- \`size()\`: 要素数を返す
- \`isEmpty()\`: 空なら \`true\`

内部実装は配列で構いません。

### 入出力例

\`\`\`js
const s = new Stack();
s.isEmpty()       // → true
s.push(1)         // → 1
s.push(2)         // → 2
s.push(3)         // → 3
s.size()          // → 3
s.peek()          // → 3
s.pop()           // → 3
s.pop()           // → 2
s.size()          // → 1
s.isEmpty()       // → false
s.pop()           // → 1
s.pop()           // → undefined
\`\`\`

### 制約

- **\`class\` 構文** を使う
- \`var\` は使わない
`,
  starterCode: `class Stack {
  constructor() {
    this._items = [];
  }

  push(value) { return 0; }
  pop() {}
  peek() {}
  size() { return 0; }
  isEmpty() { return true; }
}
`,
  solution: `class Stack {
  constructor() {
    this._items = [];
  }
  push(value) {
    this._items.push(value);
    return this._items.length;
  }
  pop() {
    return this._items.pop();
  }
  peek() {
    return this._items[this._items.length - 1];
  }
  size() {
    return this._items.length;
  }
  isEmpty() {
    return this._items.length === 0;
  }
}
`,
  entryPoints: ["Stack"],
  tests: [
    {
      name: "初期は空",
      code: "new Stack().isEmpty() === true",
    },
    {
      name: "push 戻り値はサイズ",
      code: "(() => { const s = new Stack(); return s.push(1) === 1 && s.push(2) === 2; })()",
    },
    {
      name: "size",
      code: "(() => { const s = new Stack(); s.push(1); s.push(2); s.push(3); return s.size() === 3; })()",
    },
    {
      name: "peek は取り出さない",
      code: "(() => { const s = new Stack(); s.push(7); return s.peek() === 7 && s.size() === 1; })()",
    },
    {
      name: "pop で LIFO 順",
      code: "(() => { const s = new Stack(); s.push(1); s.push(2); s.push(3); return s.pop() === 3 && s.pop() === 2 && s.pop() === 1; })()",
    },
    {
      name: "空の pop は undefined",
      code: "new Stack().pop() === undefined",
    },
    {
      name: "空の peek は undefined",
      code: "new Stack().peek() === undefined",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ClassDeclaration",
        label: "class 構文を使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
