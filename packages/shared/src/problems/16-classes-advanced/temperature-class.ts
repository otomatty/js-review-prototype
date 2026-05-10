import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const temperatureClass: Assignment = {
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
  solution: `class Temperature {
  constructor(celsius) {
    // setter 経由で同じバリデーションを通す (constructor 経由でも -273.15 未満を弾く)
    this.celsius = celsius;
  }
  get celsius() { return this._celsius; }
  set celsius(v) {
    if (v < -273.15) throw new Error('below absolute zero');
    this._celsius = v;
  }
  get fahrenheit() {
    return this._celsius * 9 / 5 + 32;
  }
  set fahrenheit(f) {
    this.celsius = (f - 32) * 5 / 9;
  }
}
`,
  entryPoints: ["Temperature"],
  tests: [
    {
      name: "celsius getter",
      code: "new Temperature(25).celsius === 25",
    },
    {
      name: "fahrenheit getter (25→77)",
      code: "Math.abs(new Temperature(25).fahrenheit - 77) < 1e-9",
    },
    {
      name: "celsius setter",
      code: "(() => { const t = new Temperature(0); t.celsius = 100; return Math.abs(t.fahrenheit - 212) < 1e-9; })()",
    },
    {
      name: "fahrenheit setter",
      code: "(() => { const t = new Temperature(0); t.fahrenheit = 32; return Math.abs(t.celsius - 0) < 1e-9; })()",
    },
    {
      name: "fahrenheit setter (212)",
      code: "(() => { const t = new Temperature(0); t.fahrenheit = 212; return Math.abs(t.celsius - 100) < 1e-9; })()",
    },
    {
      name: "下限バリデーション",
      code: "(() => { const t = new Temperature(0); try { t.celsius = -300; return false; } catch(e) { return e instanceof Error; } })()",
    },
    {
      name: "下限境界 -273.15 は OK",
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
};
