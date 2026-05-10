import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const shapeInheritance: Assignment = {
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
  solution: "class Shape {\n  constructor(name) {\n    this.name = name;\n  }\n  area() { return 0; }\n  describe() {\n    return `${this.name}: area=${this.area()}`;\n  }\n}\n\nclass Square extends Shape {\n  constructor(side) {\n    super('square');\n    this.side = side;\n  }\n  area() { return this.side * this.side; }\n}\n\nclass Circle extends Shape {\n  constructor(radius) {\n    super('circle');\n    this.radius = radius;\n  }\n  area() { return Math.PI * this.radius * this.radius; }\n}\n",
  entryPoints: ["Shape", "Square", "Circle"],
  tests: [
    {
      name: "Square.area",
      code: "new Square(3).area() === 9",
    },
    {
      name: "Square.name",
      code: "new Square(3).name === 'square'",
    },
    {
      name: "Square.describe",
      code: "new Square(3).describe() === 'square: area=9'",
    },
    {
      name: "Circle.area",
      code: "Math.abs(new Circle(2).area() - Math.PI * 4) < 1e-9",
    },
    {
      name: "Circle.name",
      code: "new Circle(2).name === 'circle'",
    },
    {
      name: "instanceof Shape",
      code: "new Square(1) instanceof Shape && new Circle(1) instanceof Shape",
    },
    {
      name: "型の独立",
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
};
