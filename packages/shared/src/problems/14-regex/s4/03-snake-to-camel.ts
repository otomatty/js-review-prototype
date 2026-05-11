import type { Assignment } from "../../../types.js";

export const s4Ch14SnakeToCamel: Assignment = {
  id: "S4-Ch14-03-snake-to-camel",
  stage: "S4",
  chapterId: "Ch14",
  sequence: 3,
  title: "snake_case を camelCase に変換する (replace + コールバック)",
  newConcept: "`replace` の第 2 引数に関数を渡してキャプチャを加工する",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

文字列 \`s\` を受け取り、 \`snake_case\` を \`camelCase\` に変換した文字列を返す関数 \`snakeToCamel\` を実装してください。
ルール:

- アンダースコア \`_\` と **直後の単語文字 1 文字** をまとめて 「その単語文字を大文字化したもの」 で置換する。
  (英字なら大文字化、 数字なら数字のまま — どちらの場合もアンダースコア自体は消える)
- 末尾のアンダースコアなど 「直後に単語文字が無い」 場合はマッチしないのでそのまま残ります。

\`\`\`js
snakeToCamel("hello_world");      // → "helloWorld"
snakeToCamel("foo_bar_baz");      // → "fooBarBaz"
snakeToCamel("single");           // → "single"
snakeToCamel("");                 // → ""
snakeToCamel("user_id_2");        // → "userId2"  (数字の場合はアンダースコアだけ消える)
\`\`\`

## ポイント

- \`String.replace\` の **第 2 引数に関数** を渡すと、 マッチごとにその関数で置換結果を組み立てられます。
  関数の引数は \`(マッチ全体, キャプチャ1, キャプチャ2, ...)\`。
- パターン: \`/_([A-Za-z0-9])/g\` で 「アンダースコア + 英数字 1 文字」 をキャプチャ (区切りの \`_\` 自体を取り込まないように \`\\\\w\` ではなく文字クラスを使う)。
- コールバックで \`(_, c) => c.toUpperCase()\` のように 「キャプチャを大文字化したもの」 を返せばアンダースコアごと置換できます。
  (数字に対する \`toUpperCase\` はそのまま数字なので、 結果としてアンダースコアだけが消えます)

## ヒント

- AST で **\`ArrowFunctionExpression\`** と **\`replace\` メソッド** を必須にしています。
  \`replace\` の第 2 引数にアロー関数を渡す書き方が要求されます。
`,
  starterCode: `function snakeToCamel(s) {
  // s.replace の第 2 引数にアロー関数を渡し、 キャプチャを大文字化してください
}
`,
  entryPoints: ["snakeToCamel"],
  demoCall: `console.log(snakeToCamel("hello_world_foo"));`,
  tests: [
    { name: '"hello_world" は "helloWorld"', code: `snakeToCamel("hello_world") === "helloWorld"` },
    { name: '"foo_bar_baz" は "fooBarBaz"', code: `snakeToCamel("foo_bar_baz") === "fooBarBaz"` },
    { name: '"single" は "single"', code: `snakeToCamel("single") === "single"` },
    { name: '"" は ""', code: `snakeToCamel("") === ""` },
    { name: '"user_id_2" は "userId2"', code: `snakeToCamel("user_id_2") === "userId2"` },
    { name: '"a_b_c_d" は "aBCD"', code: `snakeToCamel("a_b_c_d") === "aBCD"` },
  ],
  hints: [
    "s.replace(/_([A-Za-z0-9])/g, (_, c) => c.toUpperCase()) のように、 replace の第 2 引数に関数を渡します。",
    "解答例:\n```js\nfunction snakeToCamel(s) {\n  return s.replace(/_([A-Za-z0-9])/g, (_, c) => c.toUpperCase());\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で文字列を返す" },
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
        { kind: "node", nodeType: "ArrowFunctionExpression", label: "アロー関数で置換コールバックを書く" },
        { kind: "method", name: "replace", label: "String#replace を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function snakeToCamel(s) {
  return s.replace(/_([A-Za-z0-9])/g, (_, c) => c.toUpperCase());
}
`,
  badSolutions: [
    {
      code: `function snakeToCamel(s) {
  return s.replace(/_/g, "");
}
`,
      description: "アンダースコアを消すだけで次の文字を大文字化していない (AST required 違反 + テスト失敗)",
    },
    {
      code: `function snakeToCamel(s) {
  const parts = s.split("_");
  let out = parts[0];
  for (let i = 1; i < parts.length; i++) {
    out += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
  }
  return out;
}
`,
      description: "replace + コールバックを使わず split で実装している (AST required 違反)",
    },
  ],
  mdnSections: [
    {
      heading: "String.prototype.replace() - 引数として関数を指定する",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace",
      pageTitle: "String.prototype.replace()",
    },
  ],
};
