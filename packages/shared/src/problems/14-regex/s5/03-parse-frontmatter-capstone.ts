import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s5Ch14ParseFrontmatterCapstone: Assignment = {
  id: "S5-Ch14-03-parse-frontmatter-capstone",
  stage: "S5",
  chapterId: "Ch14",
  sequence: 3,
  title:
    "[卒業課題] Markdown 風文書を 「フロントマター + 本文」 に分解する多段パーサーを設計する",
  newConcept:
    "**ヘッダ部の正規表現** (`---` 区切り) と **行内の key: value 正規表現** (名前付きキャプチャ) を組み合わせ、 `parseFrontmatterLine` (1 行) と `parseDocument` (全体) の 2 段階で多段入力を構造化する。 例外を使わず、 マッチ失敗は `null` で表現する S5 卒業課題",
  estimatedMinutes: 65,
  difficulty: 3,
  testKind: "function",
  lintPreset: "S5",
  isCapstone: true,
  description: `## やること

これは **Ch14 正規表現 S5 卒業課題** です。 Ch14 で学んだ正規表現の知識を 「**複数行入力の本格的なパーサー設計**」 にまとめます。

Markdown のような **フロントマター付き文書** を、 メタ情報のオブジェクトと本文の文字列に分解する 2 つの関数を実装してください。

### 入力フォーマット

\`\`\`
---
title: My Post
date: 2026-05-12
tags: js, regex
---
This is the body.
Second line.
\`\`\`

- 1 行目が **\`---\`** で始まる → そこから次の \`---\` までが **フロントマター**
- フロントマターの中身は **\`key: value\`** 形式の 1 行ずつ
- 終端の \`---\` の **次の行から本文** が始まる
- 1 行目が \`---\` でない場合や、 終端の \`---\` が無い場合は **フロントマター無し** として扱い、 全文を本文にする

### 実装する関数

1. \`parseFrontmatterLine(line)\` — \`key: value\` 形式の **1 行** をパースして \`{ key, value }\` を返す純粋関数。
   - key は **英字で始まり、 続きは英数字 / アンダースコア / ハイフン** で 1 文字以上
   - key と value の間は **\`:\`** (前後の空白は許容)
   - 形式に合わない場合は **\`null\`** を返す (\`throw\` しない)
   - 名前付きキャプチャ \`(?<key>...)\` \`(?<value>...)\` を使うこと

2. \`parseDocument(text)\` — 文書全体を **\`{ meta, body }\`** に分解する集約関数。
   - フロントマターがある → \`meta\` は \`{ key1: value1, key2: value2, ... }\` のオブジェクト、 \`body\` は終端 \`---\` の次の行以降の文字列
   - フロントマターが無い → \`meta = {}\`、 \`body = text\` (元の入力をそのまま)
   - フロントマター内の **形式違反行** (例えば \`:\` を含まない行) は **無視** (\`meta\` に入れない)
   - **\`parseFrontmatterLine\` を呼んで** フロントマター内の行をパースする (同じ正規表現を 2 度書かない)

\`\`\`js
parseFrontmatterLine("title: My Post");      // → { key: "title", value: "My Post" }
parseFrontmatterLine("date:2026-05-12");     // → { key: "date",  value: "2026-05-12" }   (空白なしでも可)
parseFrontmatterLine("not a kv pair");       // → null
parseFrontmatterLine("");                    // → null
parseFrontmatterLine(":value-without-key");  // → null

parseDocument(
  "---\\n" +
  "title: My Post\\n" +
  "date: 2026-05-12\\n" +
  "---\\n" +
  "Body line 1.\\n" +
  "Body line 2."
);
// → {
//     meta: { title: "My Post", date: "2026-05-12" },
//     body: "Body line 1.\\nBody line 2.",
//   }

parseDocument("Just plain text, no frontmatter.");
// → { meta: {}, body: "Just plain text, no frontmatter." }

parseDocument("---\\ntitle: X\\nno-closing-delim");
// → { meta: {}, body: "---\\ntitle: X\\nno-closing-delim" }   (終端 --- が無いのでフロントマター無し扱い)
\`\`\`

## ポイント

S5 卒業課題として、 Ch14 で学んだ 5 つの道具をまとめて使います:

| 道具 | どこで使うか |
|---|---|
| 正規表現リテラル | 2 種類のパターン (文書全体・1 行) |
| 名前付きキャプチャ \`(?<name>...)\` | \`key\` / \`value\` を取り出す |
| 量指定子 \`+\` / \`*\` / \`?\` | 「1 文字以上」 「あってもなくても」 |
| 文字クラス \`[A-Za-z]\`、 \`\\w\`、 \`\\s\` | key の許容文字、 空白 |
| アンカー \`^\` \`$\` | 「行全体」 を厳密にマッチさせる |

### 文書全体を 2 つに分けるパターン例

\`\`\`
/^---\\n(?<frontmatter>[\\s\\S]*?)\\n---\\n?(?<body>[\\s\\S]*)$/
\`\`\`

- \`^---\\n\` … 先頭の \`---\` と改行
- \`(?<frontmatter>[\\s\\S]*?)\` … **非貪欲な** 「任意の文字」 (改行を含む)。 \`[\\s\\S]\` は \`.\` と違って改行にもマッチする頻出イディオム
- \`\\n---\\n?\` … 終端の \`---\` (その後の改行は **\`?\`** で 「あってもなくてもよい」)
- \`(?<body>[\\s\\S]*)$\` … 本文を末尾までキャプチャ。 0 文字でも可
- マッチしない (= 終端 \`---\` が無い、 そもそも \`---\` で始まらない) → \`{ meta: {}, body: text }\`

### 1 行の key: value パターン例

\`\`\`
/^(?<key>[A-Za-z][\\w-]*)\\s*:\\s*(?<value>.+)$/
\`\`\`

- key は **英字で始まる** ことを強制 (\`[A-Za-z]\`)。 続きは \`\\w\` (英数字 + アンダースコア) または \`-\`
- \`\\s*\` で前後の空白を緩く吸収
- \`(?<value>.+)\` で 「1 文字以上のなにか」

### 守るべき設計

- \`parseDocument\` は **\`parseFrontmatterLine\` を内部で呼ぶ**。 同じ正規表現を 2 箇所に書かない (DRY)。
- 例外は投げない。 \`parseFrontmatterLine\` がマッチ失敗時 \`null\` を返し、 \`parseDocument\` は \`null\` を **\`meta\` に入れない** ことで「失敗を値として扱う」 設計を貫く。
- \`var\` 不可、 \`==\` / \`!=\` 不可、 \`throw\` 不可 (= \`ThrowStatement\` を AST forbidden にしています)。

## ヒント

- \`text.match(re)\` でマッチを取り、 \`m === null\` ならフロントマター無しとして \`{ meta: {}, body: text }\` を返す。
- フロントマター部分は \`m.groups.frontmatter.split("\\n")\` で 1 行ずつに分解し、 各行を \`parseFrontmatterLine\` に渡す。 戻り値が \`null\` でないなら \`meta[parsed.key] = parsed.value\` で集約。
- 本文は \`m.groups.body\` をそのまま使うだけです。
- 「非貪欲 \`*?\`」 を忘れて \`[\\s\\S]*\` (貪欲) にすると、 本文中に \`---\` を含む文書で **本文側の \`---\` までフロントマターと誤認** されます。 非貪欲 \`*?\` で 「**最短マッチ**」 にするのが定石です。
`,
  starterFiles: singleFile(`function parseFrontmatterLine(line) {
  // /^(?<key>[A-Za-z][\\w-]*)\\s*:\\s*(?<value>.+)$/ で line.match
  // null なら null を返す
  // マッチしたら { key, value } を返す
}

function parseDocument(text) {
  // 1) /^---\\n(?<frontmatter>[\\s\\S]*?)\\n---\\n?(?<body>[\\s\\S]*)$/ で text.match
  // 2) null なら { meta: {}, body: text } を返す (= フロントマター無し)
  // 3) m.groups.frontmatter を split("\\n") で行に分け、 parseFrontmatterLine で 1 行ずつパース
  //    null でないものを meta[key] = value で集約
  // 4) { meta, body: m.groups.body } を返す
}
`),
  entryPoints: ["parseFrontmatterLine", "parseDocument"],
  demoCall: `console.log(parseDocument("---\\ntitle: Hello\\ndate: 2026-05-12\\n---\\nThis is the body."));`,
  tests: [
    {
      name: "parseFrontmatterLine: 通常の key: value を分解",
      code: `JSON.stringify(parseFrontmatterLine("title: My Post")) === JSON.stringify({ key: "title", value: "My Post" })`,
    },
    {
      name: "parseFrontmatterLine: 空白なし (key:value) でもパースできる",
      code: `JSON.stringify(parseFrontmatterLine("date:2026-05-12")) === JSON.stringify({ key: "date", value: "2026-05-12" })`,
    },
    {
      name: "parseFrontmatterLine: 形式違反は null",
      code: `parseFrontmatterLine("not a kv pair") === null`,
    },
    {
      name: "parseFrontmatterLine: 空文字は null",
      code: `parseFrontmatterLine("") === null`,
    },
    {
      name: "parseFrontmatterLine: 数字で始まる key は null (英字始まりが必須)",
      code: `parseFrontmatterLine("123key: value") === null`,
    },
    {
      name: "parseFrontmatterLine: コロンだけで key が無いと null",
      code: `parseFrontmatterLine(":value-without-key") === null`,
    },
    {
      name: "parseFrontmatterLine: ハイフン入りの key (camel-case) も許容",
      code: `JSON.stringify(parseFrontmatterLine("my-key: my-value")) === JSON.stringify({ key: "my-key", value: "my-value" })`,
    },
    {
      name: "parseDocument: フロントマター + 本文を正しく分解",
      code: `JSON.stringify(parseDocument("---\\ntitle: My Post\\ndate: 2026-05-12\\n---\\nBody line 1.\\nBody line 2.")) === JSON.stringify({
        meta: { title: "My Post", date: "2026-05-12" },
        body: "Body line 1.\\nBody line 2.",
      })`,
    },
    {
      name: "parseDocument: フロントマター無しの文書はそのまま body に",
      code: `JSON.stringify(parseDocument("Just plain text, no frontmatter.")) === JSON.stringify({
        meta: {},
        body: "Just plain text, no frontmatter.",
      })`,
    },
    {
      name: "parseDocument: 終端 --- が無いとフロントマター無し扱い",
      code: `JSON.stringify(parseDocument("---\\ntitle: X\\nno-closing-delim")) === JSON.stringify({
        meta: {},
        body: "---\\ntitle: X\\nno-closing-delim",
      })`,
    },
    {
      name: "parseDocument: 空文字は { meta:{}, body:'' }",
      code: `JSON.stringify(parseDocument("")) === JSON.stringify({ meta: {}, body: "" })`,
    },
    {
      name: "parseDocument: フロントマターのみ (本文なし) も処理できる",
      code: `JSON.stringify(parseDocument("---\\ntitle: X\\n---")) === JSON.stringify({
        meta: { title: "X" },
        body: "",
      })`,
    },
    {
      name: "parseDocument: フロントマター内の形式違反行は meta に入れない",
      code: `JSON.stringify(parseDocument("---\\ntitle: Good\\nbroken line\\nauthor: Alice\\n---\\nbody")) === JSON.stringify({
        meta: { title: "Good", author: "Alice" },
        body: "body",
      })`,
    },
    {
      name: "parseDocument: 本文中の --- は フロントマターと混同しない (非貪欲マッチ)",
      code: `JSON.stringify(parseDocument("---\\ntitle: T\\n---\\nfirst body line\\n---\\nthen more body")) === JSON.stringify({
        meta: { title: "T" },
        body: "first body line\\n---\\nthen more body",
      })`,
    },
    {
      name: "parseDocument: 本文に複数行が含まれる場合も body 文字列を保持する",
      code: `(() => {
        const r = parseDocument("---\\nkey: v\\n---\\nL1\\nL2\\nL3");
        return r.meta.key === "v" && r.body === "L1\\nL2\\nL3";
      })()`,
    },
  ],
  hints: [
    "1) parseFrontmatterLine: /^(?<key>[A-Za-z][\\\\w-]*)\\\\s*:\\\\s*(?<value>.+)$/ で line.match → null/オブジェクト。",
    "2) parseDocument: /^---\\\\n(?<frontmatter>[\\\\s\\\\S]*?)\\\\n---\\\\n?(?<body>[\\\\s\\\\S]*)$/ で text.match → null なら { meta:{}, body:text }。",
    "[\\\\s\\\\S] は 「. と違って改行も含むあらゆる文字」 を表す定石パターンです。 dotAll フラグ (s) を使わなくても改行をまたぐマッチが書けます。",
    "非貪欲量指定子 *? を使うのが要点です。 [\\\\s\\\\S]* (貪欲) だと本文の最後にある --- もフロントマターの終端と誤認してしまいます。",
    "解答例:\n```js\nfunction parseFrontmatterLine(line) {\n  const m = line.match(/^(?<key>[A-Za-z][\\w-]*)\\s*:\\s*(?<value>.+)$/);\n  if (m === null) {\n    return null;\n  }\n  return { key: m.groups.key, value: m.groups.value };\n}\n\nfunction parseDocument(text) {\n  const m = text.match(/^---\\n(?<frontmatter>[\\s\\S]*?)\\n---\\n?(?<body>[\\s\\S]*)$/);\n  if (m === null) {\n    return { meta: {}, body: text };\n  }\n  const meta = {};\n  for (const line of m.groups.frontmatter.split('\\n')) {\n    const parsed = parseFrontmatterLine(line);\n    if (parsed !== null) {\n      meta[parsed.key] = parsed.value;\n    }\n  }\n  return { meta, body: m.groups.body };\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で結果を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "parseFrontmatterLine / parseDocument を function 宣言する" },
        { kind: "method", name: "split", label: "split でフロントマター内を行ごとに分解する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
        { kind: "node", nodeType: "ThrowStatement", label: "throw は使わない (失敗は null で表現する)" },
      ],
    },
  },
  solution: `function parseFrontmatterLine(line) {
  const m = line.match(/^(?<key>[A-Za-z][\\w-]*)\\s*:\\s*(?<value>.+)$/);
  if (m === null) {
    return null;
  }
  return { key: m.groups.key, value: m.groups.value };
}

function parseDocument(text) {
  const m = text.match(/^---\\n(?<frontmatter>[\\s\\S]*?)\\n---\\n?(?<body>[\\s\\S]*)$/);
  if (m === null) {
    return { meta: {}, body: text };
  }
  const meta = {};
  for (const line of m.groups.frontmatter.split("\\n")) {
    const parsed = parseFrontmatterLine(line);
    if (parsed !== null) {
      meta[parsed.key] = parsed.value;
    }
  }
  return { meta, body: m.groups.body };
}
`,
  badSolutions: [
    {
      code: `function parseFrontmatterLine(line) {
  const m = line.match(/^(?<key>[A-Za-z][\\w-]*)\\s*:\\s*(?<value>.+)$/);
  if (m === null) {
    return null;
  }
  return { key: m.groups.key, value: m.groups.value };
}

function parseDocument(text) {
  const m = text.match(/^---\\n(?<frontmatter>[\\s\\S]*)\\n---\\n?(?<body>[\\s\\S]*)$/);
  if (m === null) {
    return { meta: {}, body: text };
  }
  const meta = {};
  for (const line of m.groups.frontmatter.split("\\n")) {
    const parsed = parseFrontmatterLine(line);
    if (parsed !== null) {
      meta[parsed.key] = parsed.value;
    }
  }
  return { meta, body: m.groups.body };
}
`,
      description:
        "[\\\\s\\\\S]* が **貪欲マッチ** のままで非貪欲 *? を忘れている。 本文中に --- を含む文書で、 本文の途中の --- までをフロントマターと誤認してしまい、 「本文中の --- は フロントマターと混同しない」 テストで body が短くなりすぎて失敗する",
    },
    {
      code: `function parseFrontmatterLine(line) {
  const m = line.match(/^(?<key>[A-Za-z][\\w-]*)\\s*:\\s*(?<value>.+)$/);
  if (m === null) {
    return null;
  }
  return { key: m.groups.key, value: m.groups.value };
}

function parseDocument(text) {
  const m = text.match(/^---\\n(?<frontmatter>[\\s\\S]*?)\\n---\\n?(?<body>[\\s\\S]*)$/);
  if (m === null) {
    return { meta: {}, body: text };
  }
  const meta = {};
  for (const line of m.groups.frontmatter.split("\\n")) {
    const parsed = parseFrontmatterLine(line);
    meta[parsed.key] = parsed.value;
  }
  return { meta, body: m.groups.body };
}
`,
      description:
        "parseDocument が parseFrontmatterLine の戻り値 null をチェックしていない。 フロントマター内に形式違反行があると null.key の参照で TypeError を投げてしまい、 「形式違反行は meta に入れない」 テストが失敗する。 例外を投げずに null を弾く設計が S5 の本題",
    },
    {
      code: `function parseFrontmatterLine(line) {
  const m = line.match(/^(?<key>\\w+)\\s*:\\s*(?<value>.+)$/);
  if (m === null) {
    return null;
  }
  return { key: m.groups.key, value: m.groups.value };
}

function parseDocument(text) {
  const m = text.match(/^---\\n(?<frontmatter>[\\s\\S]*?)\\n---\\n?(?<body>[\\s\\S]*)$/);
  if (m === null) {
    return { meta: {}, body: text };
  }
  const meta = {};
  for (const line of m.groups.frontmatter.split("\\n")) {
    const parsed = parseFrontmatterLine(line);
    if (parsed !== null) {
      meta[parsed.key] = parsed.value;
    }
  }
  return { meta, body: m.groups.body };
}
`,
      description:
        "key の正規表現が \\\\w+ (英数字+アンダースコア) になっており、 「英字で始まる」 制約が抜けている。 \"123key: value\" のような数字始まりも通ってしまい、 「数字で始まる key は null」 テストが失敗する",
    },
    {
      code: `function parseFrontmatterLine(line) {
  const m = line.match(/^(?<key>[A-Za-z][\\w-]*)\\s*:\\s*(?<value>.+)$/);
  if (m === null) {
    return null;
  }
  return { key: m.groups.key, value: m.groups.value };
}

function parseDocument(text) {
  if (!text.startsWith("---\\n")) {
    return { meta: {}, body: text };
  }
  const lines = text.split("\\n");
  const meta = {};
  const bodyLines = [];
  let inBody = false;
  for (let i = 1; i < lines.length; i += 1) {
    if (inBody) {
      bodyLines.push(lines[i]);
    } else if (lines[i] === "---") {
      inBody = true;
    } else {
      const parsed = parseFrontmatterLine(lines[i]);
      if (parsed !== null) {
        meta[parsed.key] = parsed.value;
      }
    }
  }
  return { meta, body: bodyLines.join("\\n") };
}
`,
      description:
        "parseDocument が 「終端 --- が無いケース」 を区別していない。 \"---\\\\ntitle: X\\\\nno-closing-delim\" のような入力で、 終端 --- が見つからないまま全部フロントマターとして処理してしまい、 期待される { meta:{}, body: 元の文字列 } にならず meta にゴミが入る (「終端 --- が無いとフロントマター無し扱い」 テストが失敗)",
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
      heading: "量指定子",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Regular_expressions/Quantifier",
      pageTitle: "量指定子",
    },
  ],
};
