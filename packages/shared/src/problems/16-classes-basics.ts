import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const classesBasics: Assignment[] = [
  // ────────────────────────────────────────────────
  // 16-1: 基本的な class
  // ────────────────────────────────────────────────
  {
    id: "point-class",
    topicId: "classes-basics",
    title: "Point クラスを定義する",
    difficulty: 1,
    description: `## Point クラスを定義する

2次元座標を表す **\`Point\` クラス** を実装してください。

- コンストラクタ: \`new Point(x, y)\` で \`x\`, \`y\` を保存
- メソッド \`distanceFromOrigin()\`: 原点 (0, 0) からのユークリッド距離を返す
- メソッド \`toString()\`: \`'(x, y)'\` 形式の文字列を返す（テンプレートリテラル使用）

### 入出力例

\`\`\`js
const p = new Point(3, 4);
p.x                       // → 3
p.y                       // → 4
p.distanceFromOrigin()    // → 5
p.toString()              // → '(3, 4)'

new Point(0, 0).distanceFromOrigin()  // → 0
new Point(-3, -4).toString()           // → '(-3, -4)'
\`\`\`

### 制約

- **\`class\` 構文** を使う（\`function Point() { ... this.x = ... }\` のような関数コンストラクタは禁止）
- \`Math.hypot\` または \`Math.sqrt\` を使う
- \`var\` は使わない
`,
    starterCode: `class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceFromOrigin() {
    return 0;
  }

  toString() {
    return '';
  }
}
`,
    entryPoints: ["Point"],
    tests: [
      {
        name: "プロパティ x, y",
        weight: 18,
        code: "(() => { const p = new Point(3,4); return p.x === 3 && p.y === 4; })()",
      },
      {
        name: "distanceFromOrigin (3,4)→5",
        weight: 18,
        code: "new Point(3,4).distanceFromOrigin() === 5",
      },
      {
        name: "distanceFromOrigin (0,0)→0",
        weight: 16,
        code: "new Point(0,0).distanceFromOrigin() === 0",
      },
      {
        name: "toString (3,4)",
        weight: 16,
        code: "new Point(3,4).toString() === '(3, 4)'",
      },
      {
        name: "toString (-3,-4)",
        weight: 16,
        code: "new Point(-3,-4).toString() === '(-3, -4)'",
      },
      {
        name: "instance",
        weight: 16,
        code: "(new Point(0,0)) instanceof Point",
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
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "toString でテンプレートリテラルを使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 16-2: メソッドで状態を更新する
  // ────────────────────────────────────────────────
  {
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
    entryPoints: ["Stack"],
    tests: [
      {
        name: "初期は空",
        weight: 12,
        code: "new Stack().isEmpty() === true",
      },
      {
        name: "push 戻り値はサイズ",
        weight: 14,
        code: "(() => { const s = new Stack(); return s.push(1) === 1 && s.push(2) === 2; })()",
      },
      {
        name: "size",
        weight: 14,
        code: "(() => { const s = new Stack(); s.push(1); s.push(2); s.push(3); return s.size() === 3; })()",
      },
      {
        name: "peek は取り出さない",
        weight: 14,
        code: "(() => { const s = new Stack(); s.push(7); return s.peek() === 7 && s.size() === 1; })()",
      },
      {
        name: "pop で LIFO 順",
        weight: 16,
        code: "(() => { const s = new Stack(); s.push(1); s.push(2); s.push(3); return s.pop() === 3 && s.pop() === 2 && s.pop() === 1; })()",
      },
      {
        name: "空の pop は undefined",
        weight: 14,
        code: "new Stack().pop() === undefined",
      },
      {
        name: "空の peek は undefined",
        weight: 16,
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
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 16-3: 引数オブジェクトの分割代入を伴う class
  // ────────────────────────────────────────────────
  {
    id: "todo-class",
    topicId: "classes-basics",
    title: "Todo クラスで完了状態を管理する",
    difficulty: 2,
    description: `## Todo クラスで完了状態を管理する

\`{ id, title }\` を受け取り Todo を表現する **\`Todo\` クラス** を実装してください。

- コンストラクタ: \`new Todo({ id, title })\` で \`id\`, \`title\` を保存し、\`done\` を \`false\` に初期化
- \`complete()\`: \`done\` を \`true\` にする
- \`reopen()\`: \`done\` を \`false\` に戻す
- \`label()\`: \`done\` なら \`'[x] {title}'\`、そうでなければ \`'[ ] {title}'\`

### 入出力例

\`\`\`js
const t = new Todo({ id: 1, title: '買い物' });
t.id          // → 1
t.title       // → '買い物'
t.done        // → false
t.label()     // → '[ ] 買い物'

t.complete();
t.label()     // → '[x] 買い物'

t.reopen();
t.label()     // → '[ ] 買い物'
\`\`\`

### 制約

- **\`class\` 構文** を使う
- コンストラクタ引数は **オブジェクト分割代入** で受ける: \`constructor({ id, title })\`
- \`label()\` は **テンプレートリテラル** で組み立てる
- \`var\` は使わない
`,
    starterCode: `class Todo {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
    this.done = false;
  }

  complete() {}
  reopen() {}
  label() { return ''; }
}
`,
    entryPoints: ["Todo"],
    tests: [
      {
        name: "初期状態",
        weight: 16,
        code: "(() => { const t = new Todo({id:1,title:'買い物'}); return t.id === 1 && t.title === '買い物' && t.done === false; })()",
      },
      {
        name: "未完了 label",
        weight: 16,
        code: "new Todo({id:1,title:'買い物'}).label() === '[ ] 買い物'",
      },
      {
        name: "complete",
        weight: 17,
        code: "(() => { const t = new Todo({id:1,title:'掃除'}); t.complete(); return t.done === true; })()",
      },
      {
        name: "完了 label",
        weight: 17,
        code: "(() => { const t = new Todo({id:1,title:'掃除'}); t.complete(); return t.label() === '[x] 掃除'; })()",
      },
      {
        name: "reopen",
        weight: 17,
        code: "(() => { const t = new Todo({id:1,title:'A'}); t.complete(); t.reopen(); return t.done === false && t.label() === '[ ] A'; })()",
      },
      {
        name: "instanceof",
        weight: 17,
        code: "new Todo({id:1,title:'A'}) instanceof Todo",
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
        {
          kind: "node",
          nodeType: "ObjectPattern",
          label: "constructor で分割代入を使う",
        },
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "テンプレートリテラルを使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 16-4: Range クラス + イテレータ的な toArray
  // ────────────────────────────────────────────────
  {
    id: "range-class",
    topicId: "classes-basics",
    title: "Range クラスで範囲を扱う",
    difficulty: 2,
    description: `## Range クラスで範囲を扱う

開始値 \`start\` (含む) と終了値 \`end\` (含まない) を持つ **\`Range\` クラス** を実装してください。

- コンストラクタ: \`new Range(start, end)\`
- \`length()\`: 要素数を返す（負や逆順なら \`0\`）
- \`contains(n)\`: \`start <= n < end\` なら \`true\`
- \`toArray()\`: \`[start, start+1, ..., end-1]\` の配列を返す

### 入出力例

\`\`\`js
const r = new Range(1, 5);
r.length()        // → 4
r.contains(1)     // → true
r.contains(5)     // → false
r.contains(0)     // → false
r.toArray()       // → [1, 2, 3, 4]

new Range(3, 3).length()    // → 0
new Range(5, 1).toArray()   // → []  (逆順は空)
new Range(0, 3).toArray()   // → [0, 1, 2]
\`\`\`

### 制約

- **\`class\` 構文** を使う
- \`var\` は使わない
- メソッドは for ループ／\`Array.from\` どちらで実装してもよい
`,
    starterCode: `class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  length() { return 0; }
  contains(n) { return false; }
  toArray() { return []; }
}
`,
    entryPoints: ["Range"],
    tests: [
      {
        name: "length 4",
        weight: 16,
        code: "new Range(1,5).length() === 4",
      },
      {
        name: "contains 境界",
        weight: 16,
        code: "(() => { const r = new Range(1,5); return r.contains(1) === true && r.contains(5) === false && r.contains(0) === false; })()",
      },
      {
        name: "toArray",
        weight: 17,
        code: "JSON.stringify(new Range(1,5).toArray()) === JSON.stringify([1,2,3,4])",
      },
      {
        name: "0 から始まる",
        weight: 17,
        code: "JSON.stringify(new Range(0,3).toArray()) === JSON.stringify([0,1,2])",
      },
      {
        name: "同値は空",
        weight: 17,
        code: "new Range(3,3).length() === 0 && new Range(3,3).toArray().length === 0",
      },
      {
        name: "逆順は空",
        weight: 17,
        code: "new Range(5,1).length() === 0 && new Range(5,1).toArray().length === 0",
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
    weights: DEFAULT_WEIGHTS,
  },
];
