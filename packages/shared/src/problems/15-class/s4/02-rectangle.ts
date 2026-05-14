import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch15Rectangle: Assignment = {
  id: "S4-Ch15-02-rectangle",
  stage: "S4",
  chapterId: "Ch15",
  sequence: 2,
  title: "Rectangle クラスで面積と周長を計算する",
  newConcept:
    "constructor で受け取ったフィールドから複数のメソッドで派生値を計算する",
  estimatedMinutes: 25,
  difficulty: 1,
  testKind: "function",
  description: `## やること

幅と高さを持つ \`Rectangle\` クラスを実装してください。

- \`constructor(width, height)\`: \`this.width\` と \`this.height\` に保存する。
- \`area()\`: 面積 (\`this.width * this.height\`) を返す。
- \`perimeter()\`: 周長 (\`2 * (this.width + this.height)\`) を返す。
- \`isSquare()\`: \`this.width === this.height\` のとき \`true\`、 そうでないとき \`false\` を返す。

\`\`\`js
const r = new Rectangle(3, 4);
r.area();       // → 12
r.perimeter();  // → 14
r.isSquare();   // → false

new Rectangle(5, 5).isSquare();  // → true
\`\`\`

## ポイント

- フィールド (\`this.width\`、 \`this.height\`) はコンストラクタで 1 回だけ保存し、 メソッドはそれを **読み出すだけ** にします。 同じ計算 (\`width * height\`) をメソッドで毎回書くことになりますが、 「フィールドは状態、 メソッドは状態から派生する値」 という分担が classic な class の使い方です。
- メソッド名のあとは **必ず \`()\` を付けて呼ぶ** こと: \`r.area\` (関数本体への参照) と \`r.area()\` (実行) は別物です。
- \`isSquare()\` は \`width === height\` の真偽をそのまま \`return\` で返せます (\`if (...) return true; else return false;\` と書く必要はありません)。
- AST で **\`ClassDeclaration\`** を必須にしています。
`,
  starterFiles: singleFile(`class Rectangle {
  // constructor(width, height) で this.width / this.height をセットする
  // area / perimeter / isSquare を定義する
}
`),
  entryPoints: ["Rectangle"],
  demoCall: `console.log(new Rectangle(3, 4).area());`,
  tests: [
    {
      name: "area: 3 x 4 は 12",
      code: `new Rectangle(3, 4).area() === 12`,
    },
    {
      name: "perimeter: 3 x 4 は 14",
      code: `new Rectangle(3, 4).perimeter() === 14`,
    },
    {
      name: "area: 5 x 5 は 25",
      code: `new Rectangle(5, 5).area() === 25`,
    },
    {
      name: "perimeter: 5 x 5 は 20",
      code: `new Rectangle(5, 5).perimeter() === 20`,
    },
    {
      name: "isSquare: 3 x 4 は false",
      code: `new Rectangle(3, 4).isSquare() === false`,
    },
    {
      name: "isSquare: 5 x 5 は true",
      code: `new Rectangle(5, 5).isSquare() === true`,
    },
    {
      name: "0 を含む辺でも壊れない",
      code: `(() => { const r = new Rectangle(0, 7); return r.area() === 0 && r.perimeter() === 14; })()`,
    },
    {
      name: "フィールドはコンストラクタ引数を保持している",
      code: `(() => { const r = new Rectangle(3, 4); return r.width === 3 && r.height === 4; })()`,
    },
  ],
  hints: [
    "constructor(width, height) { this.width = width; this.height = height; }",
    "area() { return this.width * this.height; } のように、 フィールドから計算した値を return します。",
    "解答例:\n```js\nclass Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n  area() {\n    return this.width * this.height;\n  }\n  perimeter() {\n    return 2 * (this.width + this.height);\n  }\n  isSquare() {\n    return this.width === this.height;\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class で Rectangle を定義する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "area / perimeter / isSquare で値を return する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
  perimeter() {
    return 2 * (this.width + this.height);
  }
  isSquare() {
    return this.width === this.height;
  }
}
`,
  badSolutions: [
    {
      code: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width + this.height;
  }
  perimeter() {
    return 2 * (this.width + this.height);
  }
  isSquare() {
    return this.width === this.height;
  }
}
`,
      description: "area が足し算になっている (テスト失敗)",
    },
    {
      code: `function makeRectangle(width, height) {
  return {
    width,
    height,
    area() { return width * height; },
    perimeter() { return 2 * (width + height); },
    isSquare() { return width === height; },
  };
}
`,
      description:
        "class を使わずオブジェクトリテラルで実装している (ClassDeclaration 違反)",
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
      heading: "メソッド定義",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Method_definitions",
      pageTitle: "メソッド定義",
    },
  ],
};
