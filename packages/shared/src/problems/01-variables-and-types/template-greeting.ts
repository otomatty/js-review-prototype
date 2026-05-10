import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const templateGreeting: Assignment = {
  id: "template-greeting",
  topicId: "variables-and-types",
  title: "テンプレートリテラルで自己紹介を作る",
  difficulty: 1,
  description:
    "## テンプレートリテラルで自己紹介を作る\n\n" +
    "`greet` 関数を実装してください。 引数 `name` (名前の文字列) と `age` (年齢の数値) を受け取り、 " +
    "**テンプレートリテラル** を使って `\"私は<name> (<age>歳) です。\"` という文字列を返します。\n\n" +
    "### 学習ポイント\n\n" +
    "- **テンプレートリテラル**: バッククォート `` ` `` で囲む文字列。 `${変数}` で値を埋め込める。\n" +
    "  - 例: `` `合計は${total}円です` ``\n" +
    "- 値が **数値でも自動で文字列に変換** される（テンプレートリテラル内で `${数値}` を書ける）。\n" +
    "- `+` での文字列連結より **読みやすい** ので、 普段はテンプレートリテラルを使う。\n\n" +
    "### 入出力例\n\n" +
    "```js\n" +
    "greet('Alice', 22)  // → '私はAlice (22歳) です。'\n" +
    "greet('太郎', 8)    // → '私は太郎 (8歳) です。'\n" +
    "greet('', 0)        // → '私は (0歳) です。'\n" +
    "```\n\n" +
    "### 制約\n\n" +
    "- バッククォート `` ` `` で囲むテンプレートリテラルを使う\n" +
    "- `+` での文字列連結は使わない (`prefer-template` ルールで禁止)\n" +
    "- `var` は使わない\n",
  starterCode:
    "// 自己紹介の文字列をテンプレートリテラルで作る。\n" +
    "//\n" +
    "// 例:\n" +
    "//   greet('Alice', 22) → '私はAlice (22歳) です。'\n" +
    "//\n" +
    "// 仕組みの解説:\n" +
    "//   バッククォート ` で囲んだ文字列の中で ${ } を使うと、\n" +
    "//   変数や式の値をそのまま埋め込める。\n" +
    "//   例: `合計は${total}円です`\n" +
    "//\n" +
    "// TODO: return `私は${name} (${age}歳) です。`; を書く\n" +
    "function greet(name, age) {\n" +
    "  return '';\n" +
    "}\n",
  solution:
    "function greet(name, age) {\n" +
    "  return `私は${name} (${age}歳) です。`;\n" +
    "}\n",
  badSolutions: [
    {
      description: "テンプレートリテラルではなく + 連結を使ってしまっている (prefer-template に違反)",
      code:
        "function greet(name, age) {\n" +
        "  return '私は' + name + ' (' + age + '歳) です。';\n" +
        "}\n",
    },
    {
      description: "テンプレートリテラルを使ったが文字列の中身がフォーマット通りになっていない",
      code:
        "function greet(name, age) {\n" +
        "  return `名前: ${name}, 年齢: ${age}`;\n" +
        "}\n",
    },
  ],
  entryPoints: ["greet"],
  tests: [
    {
      name: "通常",
      code: "greet('Alice', 22) === '私はAlice (22歳) です。'",
    },
    {
      name: "日本語の名前",
      code: "greet('太郎', 8) === '私は太郎 (8歳) です。'",
    },
    {
      name: "空文字とゼロでも崩れない",
      code: "greet('', 0) === '私は (0歳) です。'",
    },
  ],
  eslint: {
    rules: {
      ...COMMON_LINT_RULES,
      "prefer-template": "error",
    },
  },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "TemplateLiteral",
        label: "テンプレートリテラルを使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
  mdnSections: [{ heading: "文字列リテラル" }],
};
