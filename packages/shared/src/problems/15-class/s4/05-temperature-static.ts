import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch15TemperatureStatic: Assignment = {
  id: "S4-Ch15-05-temperature-static",
  stage: "S4",
  chapterId: "Ch15",
  sequence: 5,
  title: "static メソッドで Temperature の生成口を用意する",
  newConcept:
    "static メソッドはインスタンスではなくクラス自身にぶら下がる関数で、 ファクトリとして new を呼ぶのに便利",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

摂氏 (Celsius) で気温を保持する \`Temperature\` クラスを実装してください。

### Temperature

- \`constructor(celsius)\`: \`this.celsius = celsius\` を保存する。
- \`toCelsius()\`: \`this.celsius\` をそのまま返す。
- \`toFahrenheit()\`: 華氏に変換した値 (\`this.celsius * 9 / 5 + 32\`) を返す。
- \`static fromFahrenheit(f)\`: 華氏 \`f\` から **新しい \`Temperature\` インスタンス** を作って返す (内部は摂氏で保持)。

\`\`\`js
new Temperature(0).toFahrenheit();   // → 32
new Temperature(100).toFahrenheit(); // → 212

const t = Temperature.fromFahrenheit(212);
t.toCelsius();                       // → 100
t instanceof Temperature;            // → true
\`\`\`

## ポイント

- \`static\` メソッドは **クラス自身にぶら下がる** 関数で、 インスタンスから呼ぶのではなく \`Temperature.fromFahrenheit(...)\` のように **クラス名から直接** 呼びます。
- \`static\` メソッドのなかに \`this\` は出てきますが、 ここでの \`this\` は **インスタンスではなくクラス自身** (\`Temperature\`) を指します。 ふつうは混乱を避けるため、 クラス名を直接書いて \`return new Temperature(...)\` とするのが分かりやすいです。
- ファクトリ \`fromFahrenheit\` の中では **必ず \`new\` を使って** インスタンスを作ってください (返り値が普通のオブジェクトリテラルだと \`instanceof Temperature\` が false になります)。
- 温度変換: 摂氏 → 華氏は \`c * 9 / 5 + 32\`、 華氏 → 摂氏は \`(f - 32) * 5 / 9\`。
- AST で **\`ClassDeclaration\`** と **\`NewExpression\`** を必須にしています (\`static fromFahrenheit\` で \`new\` を使うため)。
`,
  starterFiles: singleFile(`class Temperature {
  // constructor(celsius)
  // toCelsius / toFahrenheit
  // static fromFahrenheit(f) で new Temperature(...) を返す
}
`),
  entryPoints: ["Temperature"],
  demoCall: `console.log(new Temperature(0).toFahrenheit());`,
  tests: [
    {
      name: "toCelsius は受け取った値をそのまま返す",
      code: `new Temperature(25).toCelsius() === 25`,
    },
    {
      name: "0℃ は 32℉",
      code: `new Temperature(0).toFahrenheit() === 32`,
    },
    {
      name: "100℃ は 212℉",
      code: `new Temperature(100).toFahrenheit() === 212`,
    },
    {
      name: "-40℃ は -40℉ (有名な交点)",
      code: `new Temperature(-40).toFahrenheit() === -40`,
    },
    {
      name: "Temperature.fromFahrenheit(32) は 0℃",
      code: `Temperature.fromFahrenheit(32).toCelsius() === 0`,
    },
    {
      name: "Temperature.fromFahrenheit(212) は 100℃",
      code: `Temperature.fromFahrenheit(212).toCelsius() === 100`,
    },
    {
      name: "fromFahrenheit は Temperature インスタンスを返す",
      code: `Temperature.fromFahrenheit(70) instanceof Temperature`,
    },
    {
      name: "fromFahrenheit はインスタンスメソッドではなく static",
      code: `typeof Temperature.fromFahrenheit === "function" && typeof new Temperature(0).fromFahrenheit === "undefined"`,
    },
  ],
  hints: [
    "toFahrenheit は return this.celsius * 9 / 5 + 32; で OK。",
    "static fromFahrenheit(f) { return new Temperature((f - 32) * 5 / 9); } のように、 摂氏に直してから new します。",
    "解答例:\n```js\nclass Temperature {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n  toCelsius() {\n    return this.celsius;\n  }\n  toFahrenheit() {\n    return this.celsius * 9 / 5 + 32;\n  }\n  static fromFahrenheit(f) {\n    return new Temperature((f - 32) * 5 / 9);\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "class で Temperature を定義する",
        },
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "static fromFahrenheit のなかで new Temperature(...) を使う",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "メソッドで値を return する",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  toCelsius() {
    return this.celsius;
  }
  toFahrenheit() {
    return this.celsius * 9 / 5 + 32;
  }
  static fromFahrenheit(f) {
    return new Temperature((f - 32) * 5 / 9);
  }
}
`,
  badSolutions: [
    {
      code: `class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  toCelsius() {
    return this.celsius;
  }
  toFahrenheit() {
    return this.celsius * 9 / 5 + 32;
  }
  fromFahrenheit(f) {
    return new Temperature((f - 32) * 5 / 9);
  }
}
`,
      description:
        "fromFahrenheit が static ではなくインスタンスメソッドになっており Temperature.fromFahrenheit が undefined (テスト失敗)",
    },
    {
      code: `class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  toCelsius() {
    return this.celsius;
  }
  toFahrenheit() {
    return this.celsius * 9 / 5 + 32;
  }
  static fromFahrenheit(f) {
    return { celsius: (f - 32) * 5 / 9 };
  }
}
`,
      description:
        "new を使わずオブジェクトリテラルを返している (NewExpression 違反 + instanceof / toCelsius が動かずテスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "static",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/static",
      pageTitle: "static",
    },
    {
      heading: "new",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/new",
      pageTitle: "new",
    },
  ],
};
