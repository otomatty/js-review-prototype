import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const pointClass: Assignment = {
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
  solution: "class Point {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n  distanceFromOrigin() {\n    return Math.sqrt(this.x * this.x + this.y * this.y);\n  }\n  toString() {\n    return `(${this.x}, ${this.y})`;\n  }\n}\n",
  entryPoints: ["Point"],
  tests: [
    {
      name: "プロパティ x, y",
      code: "(() => { const p = new Point(3,4); return p.x === 3 && p.y === 4; })()",
    },
    {
      name: "distanceFromOrigin (3,4)→5",
      code: "new Point(3,4).distanceFromOrigin() === 5",
    },
    {
      name: "distanceFromOrigin (0,0)→0",
      code: "new Point(0,0).distanceFromOrigin() === 0",
    },
    {
      name: "toString (3,4)",
      code: "new Point(3,4).toString() === '(3, 4)'",
    },
    {
      name: "toString (-3,-4)",
      code: "new Point(-3,-4).toString() === '(-3, -4)'",
    },
    {
      name: "instance",
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
};
