import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s5Ch14TokenizeExpression: Assignment = {
  id: "S5-Ch14-01-tokenize-expression",
  stage: "S5",
  chapterId: "Ch14",
  sequence: 1,
  title: "算術式をトークン列に分解する (名前付きキャプチャ + matchAll)",
  newConcept:
    "1 本の正規表現に 3 種類の **名前付きキャプチャ** `(?<num>...)` を並べ、 `matchAll` のイテレータを `for...of` で 1 件ずつ回しながら 「どの名前付きグループがヒットしたか」 でトークン種別を判定する設計。 空白はパターンにマッチしないので自動でスキップされる",
  estimatedMinutes: 50,
  difficulty: 3,
  testKind: "function",
  lintPreset: "S5",
  description: `## やること

算術式の文字列 \`s\` を **トークン列 (オブジェクトの配列)** に分解する関数 \`tokenize\` を、 **1 本の正規表現に名前付きキャプチャグループ \`(?<name>...)\` を並べる** スタイルで実装してください。

戻り値は \`{ type, value }\` のオブジェクトの配列です。 \`type\` は次の 3 種類のいずれか:

- \`"number"\` … 整数または小数 (\`"3"\`、 \`"3.14"\`)
- \`"operator"\` … \`+\`、 \`-\`、 \`*\`、 \`/\` のいずれか 1 文字
- \`"paren"\` … \`(\` または \`)\`

\`\`\`js
tokenize("1+2");
// → [
//     { type: "number", value: "1" },
//     { type: "operator", value: "+" },
//     { type: "number", value: "2" },
//   ]

tokenize("(3.14 * 2) - 0.5");
// → [
//     { type: "paren", value: "(" },
//     { type: "number", value: "3.14" },
//     { type: "operator", value: "*" },
//     { type: "number", value: "2" },
//     { type: "paren", value: ")" },
//     { type: "operator", value: "-" },
//     { type: "number", value: "0.5" },
//   ]

tokenize("");        // → []
tokenize("   ");     // → []   (空白は自動でスキップ)
tokenize("42");      // → [{ type: "number", value: "42" }]
\`\`\`

## ポイント

これは S5 (設計演習) の入口です。 S4 では 1 種類のパターン (\`#(\w+)\` でハッシュタグなど) を \`matchAll\` で抜き出すところまで扱いました。 S5 では **複数の種別を 1 本の正規表現で同時に拾う** という、 ちゃんとした字句解析 (レキサ) の設計を体験します。

### 名前付きキャプチャグループ \`(?<name>...)\`

通常のキャプチャ \`( ... )\` は \`m[1]\`、 \`m[2]\` のように **添字** で取り出します。 これは 「どの番号が何を表すか」 を覚えていないといけません。

\`(?<num>\\d+)\` のように **名前を付けたキャプチャ** は \`m.groups.num\` のように **名前で取り出せます**。 トークン種別ごとに名前を付けておけば、 マッチした m から 「どの名前が \`undefined\` ではないか」 を見るだけで種別が決まります。

例:

\`\`\`js
const re = /(?<num>\\d+)|(?<word>[a-z]+)/g;
for (const m of "abc 123".matchAll(re)) {
  // m.groups は { num: "...", word: "..." } の形
  // マッチした方だけ値が入り、 反対側は undefined
}
\`\`\`

### 正規表現のひな型

\`\`\`
/(?<number>\\d+(?:\\.\\d+)?)|(?<operator>[+\\-*/])|(?<paren>[()])/g
\`\`\`

- \`(?<number>\\d+(?:\\.\\d+)?)\` … 整数 + 任意の小数部 (\`(?:\\.\\d+)?\` は **非キャプチャ** で 「あってもなくてもよい」)
- \`(?<operator>[+\\-*/])\` … 演算子 1 文字。 文字クラス内の \`-\` は **エスケープ** しておくと範囲指定と勘違いされず安全
- \`(?<paren>[()])\` … 括弧 1 文字
- \`|\` (OR) で 3 つを並べる。 \`/g\` フラグで全件マッチ

このパターンは **空白文字を含んでいない** ので、 \`s.matchAll(re)\` を回すと **空白は単に飛ばされて** トークンだけが順番に取れます。 これがレキサのスキャナとしての規約です。

### \`matchAll\` + \`for...of\` のループ

\`s.matchAll(re)\` は **イテレータ** を返します。 \`for (const m of s.matchAll(re)) { ... }\` で 1 件ずつ取り出し、 \`m.groups.number\` などをチェックして tokens 配列に push してください。

\`[...s.matchAll(re)].map(...)\` でも書けますが、 ここでは **「1 件ずつ処理する」** という字句解析の自然な書き方を強制するため、 **\`ForOfStatement\` を AST 必須** にしています。

### 守るべき設計

- 名前付きキャプチャを使う (= 正規表現に \`(?<...>...)\` を 1 つ以上含める)。 添字で取り出すスタイル (\`m[1]\`、 \`m[2]\`) は読み手にとって「番号と種別の対応表」を頭の中に持つ負担が大きく、 種別が増えるとすぐ壊れます。
- \`var\` は使わない。 \`==\` / \`!=\` も使わない (\`m.groups.number !== undefined\` のように厳密比較で書く)。

## ヒント

- 名前付きキャプチャは \`undefined\` 比較ではなく **\`m.groups\` のキーの存在判定** でも書けます。 ただし JavaScript の \`m.groups\` は **すべての名前のキーを持ち、 マッチしない方は \`undefined\` が入っている** ので、 値の比較が一番素直です。
- 配列に push してから最後に return する形は副作用を伴いますが、 字句解析の文脈では「ストリーム → 配列」 のテンプレとして自然な書き方です。 \`reduce\` でも書けますが今回は \`for...of\` を要件にしています。
`,
  starterFiles: singleFile(`function tokenize(s) {
  // 1) 3 種類の名前付きキャプチャを並べた正規表現 re を作る
  //    例: /(?<number>\\d+(?:\\.\\d+)?)|(?<operator>[+\\-*\\/])|(?<paren>[()])/g

  // 2) tokens = [] を用意する

  // 3) for (const m of s.matchAll(re)) { ... } で 1 件ずつ取り出し、
  //    m.groups.number / m.groups.operator / m.groups.paren のうち
  //    undefined でないものを見て、 { type, value } を tokens に push

  // 4) tokens を return する
}
`),
  entryPoints: ["tokenize"],
  demoCall: `console.log(tokenize("(3.14 * 2) - 0.5"));`,
  tests: [
    {
      name: '"1+2" は number 1 / operator + / number 2 の 3 トークン',
      code: `JSON.stringify(tokenize("1+2")) === JSON.stringify([
        { type: "number", value: "1" },
        { type: "operator", value: "+" },
        { type: "number", value: "2" },
      ])`,
    },
    {
      name: '"" は空配列',
      code: `JSON.stringify(tokenize("")) === JSON.stringify([])`,
    },
    {
      name: "空白だけの文字列は空配列 (空白はマッチしないので自動スキップ)",
      code: `JSON.stringify(tokenize("   ")) === JSON.stringify([])`,
    },
    {
      name: "1 つの整数だけでも 1 トークンとして返る",
      code: `JSON.stringify(tokenize("42")) === JSON.stringify([{ type: "number", value: "42" }])`,
    },
    {
      name: "小数 (3.14) は 1 つの number トークン",
      code: `JSON.stringify(tokenize("3.14")) === JSON.stringify([{ type: "number", value: "3.14" }])`,
    },
    {
      name: "括弧つき式 (1 + 2) を 5 トークンに分解",
      code: `JSON.stringify(tokenize("(1 + 2)")) === JSON.stringify([
        { type: "paren", value: "(" },
        { type: "number", value: "1" },
        { type: "operator", value: "+" },
        { type: "number", value: "2" },
        { type: "paren", value: ")" },
      ])`,
    },
    {
      name: "演算子 4 種すべて (+ - * /) を識別できる",
      code: `JSON.stringify(tokenize("1+2-3*4/5")) === JSON.stringify([
        { type: "number", value: "1" },
        { type: "operator", value: "+" },
        { type: "number", value: "2" },
        { type: "operator", value: "-" },
        { type: "number", value: "3" },
        { type: "operator", value: "*" },
        { type: "number", value: "4" },
        { type: "operator", value: "/" },
        { type: "number", value: "5" },
      ])`,
    },
    {
      name: "前後の空白も無視される (タブや複数空白も同様)",
      code: `JSON.stringify(tokenize("  1   +\\t2  ")) === JSON.stringify([
        { type: "number", value: "1" },
        { type: "operator", value: "+" },
        { type: "number", value: "2" },
      ])`,
    },
    {
      name: "複雑な式 (3.14 * 2) - 0.5 を 7 トークンに分解",
      code: `JSON.stringify(tokenize("(3.14 * 2) - 0.5")) === JSON.stringify([
        { type: "paren", value: "(" },
        { type: "number", value: "3.14" },
        { type: "operator", value: "*" },
        { type: "number", value: "2" },
        { type: "paren", value: ")" },
        { type: "operator", value: "-" },
        { type: "number", value: "0.5" },
      ])`,
    },
    {
      name: "value は常に文字列 (number 型ではない)",
      code: `(() => {
        const toks = tokenize("42");
        return toks.length === 1 && typeof toks[0].value === "string";
      })()`,
    },
  ],
  hints: [
    "1) 名前付きキャプチャ /(?<number>\\\\d+(?:\\\\.\\\\d+)?)|(?<operator>[+\\\\-*\\\\/])|(?<paren>[()])/g を作る。 2) tokens = []。 3) for (const m of s.matchAll(re)) で 1 件ずつ。 4) m.groups.number !== undefined なら type: 'number' で push、 以下同様。",
    "m.groups は **すべての名前のキーを持ったオブジェクト** で、 マッチしなかった名前の値は undefined です。 だから !== undefined で 「どれにマッチしたか」 を判別できます。",
    "演算子の文字クラス [+\\\\-*\\\\/] では - を必ずエスケープしておきましょう。 [a-z] のような範囲指定と区別する必要があるため、 - が文字クラスの真ん中にあるときは \\\\- で書くのが安全です。",
    "解答例:\n```js\nfunction tokenize(s) {\n  const re = /(?<number>\\d+(?:\\.\\d+)?)|(?<operator>[+\\-*\\/])|(?<paren>[()])/g;\n  const tokens = [];\n  for (const m of s.matchAll(re)) {\n    if (m.groups.number !== undefined) {\n      tokens.push({ type: 'number', value: m.groups.number });\n    }\n    if (m.groups.operator !== undefined) {\n      tokens.push({ type: 'operator', value: m.groups.operator });\n    }\n    if (m.groups.paren !== undefined) {\n      tokens.push({ type: 'paren', value: m.groups.paren });\n    }\n  }\n  return tokens;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
        { kind: "node", nodeType: "ReturnStatement", label: "return でトークン配列を返す" },
        { kind: "node", nodeType: "ForOfStatement", label: "for...of で matchAll のイテレータを 1 件ずつ回す" },
        { kind: "method", name: "matchAll", label: "String#matchAll を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function tokenize(s) {
  const re = /(?<number>\\d+(?:\\.\\d+)?)|(?<operator>[+\\-*\\/])|(?<paren>[()])/g;
  const tokens = [];
  for (const m of s.matchAll(re)) {
    if (m.groups.number !== undefined) {
      tokens.push({ type: "number", value: m.groups.number });
    }
    if (m.groups.operator !== undefined) {
      tokens.push({ type: "operator", value: m.groups.operator });
    }
    if (m.groups.paren !== undefined) {
      tokens.push({ type: "paren", value: m.groups.paren });
    }
  }
  return tokens;
}
`,
  badSolutions: [
    {
      code: `function tokenize(s) {
  const tokens = [];
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      tokens.push({ type: "number", value: ch });
    } else if ("+-*/".includes(ch)) {
      tokens.push({ type: "operator", value: ch });
    } else if (ch === "(" || ch === ")") {
      tokens.push({ type: "paren", value: ch });
    }
  }
  return tokens;
}
`,
      description:
        "正規表現を使わず 1 文字ずつ判定している。 AST required の RegExpLiteral / matchAll が満たされないうえ、 \"3.14\" を 1 トークンとしてまとめられず \"3\" \".\" \"1\" \"4\" のようにバラバラに出てしまう",
    },
    {
      code: `function tokenize(s) {
  const re = /(?<number>\\d+(?:\\.\\d+)?)|(?<operator>[+\\-*\\/])|(?<paren>[()])/g;
  const tokens = [];
  for (const m of s.matchAll(re)) {
    if (m.groups.number !== undefined) {
      tokens.push({ type: "number", value: Number(m.groups.number) });
    }
    if (m.groups.operator !== undefined) {
      tokens.push({ type: "operator", value: m.groups.operator });
    }
    if (m.groups.paren !== undefined) {
      tokens.push({ type: "paren", value: m.groups.paren });
    }
  }
  return tokens;
}
`,
      description:
        "value を Number(...) で数値に変換してしまっている。 トークナイザは **生のテキストをそのまま** 返すのが役割で、 数値化は後段のパース工程に任せる責務分離が定石 (字句解析と意味解析を混ぜない)。 「value は常に文字列」 テストで Number 型になり失敗する",
    },
    {
      code: `function tokenize(s) {
  const re = /(?<number>\\d+(?:\\.\\d+)?)|(?<operator>[+\\-*\\/])|(?<paren>[()])/g;
  return [...s.matchAll(re)].map((m) => {
    if (m.groups.number !== undefined) {
      return { type: "number", value: m.groups.number };
    }
    if (m.groups.operator !== undefined) {
      return { type: "operator", value: m.groups.operator };
    }
    return { type: "paren", value: m.groups.paren };
  });
}
`,
      description:
        "map で書いてしまっており、 AST required の ForOfStatement (for...of で 1 件ずつ回す) を満たさない。 字句解析は 「ストリームを 1 件ずつ消費していく」 のが自然な書き方なので、 S5 では明示的に for...of を強制している",
    },
    {
      code: `function tokenize(s) {
  const re = /(?<number>\\d+)|(?<operator>[+\\-*\\/])|(?<paren>[()])/g;
  const tokens = [];
  for (const m of s.matchAll(re)) {
    if (m.groups.number !== undefined) {
      tokens.push({ type: "number", value: m.groups.number });
    }
    if (m.groups.operator !== undefined) {
      tokens.push({ type: "operator", value: m.groups.operator });
    }
    if (m.groups.paren !== undefined) {
      tokens.push({ type: "paren", value: m.groups.paren });
    }
  }
  return tokens;
}
`,
      description:
        "number のパターンが \\d+ だけで小数部 (?:\\.\\d+)? を含んでいない。 \"3.14\" を 1 トークン化できず \"3\" と \"14\" の 2 つに割れる (\".\" はどのパターンにも一致しないのでスキップされる) ため、 小数のテストが失敗する",
    },
  ],
  mdnSections: [
    {
      heading: "名前付きキャプチャグループ",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group",
      pageTitle: "名前付きキャプチャグループ",
    },
    {
      heading: "String.prototype.matchAll()",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll",
      pageTitle: "String.prototype.matchAll()",
    },
  ],
};
