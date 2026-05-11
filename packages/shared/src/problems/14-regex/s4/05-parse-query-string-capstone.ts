import type { Assignment } from "../../../types.js";

export const s4Ch14ParseQueryStringCapstone: Assignment = {
  id: "S4-Ch14-05-parse-query-string-capstone",
  stage: "S4",
  chapterId: "Ch14",
  sequence: 5,
  title: "[卒業課題] クエリ文字列をオブジェクトにパースする",
  newConcept: "matchAll + 2 つのキャプチャを reduce でオブジェクトに組み立てるパイプライン",
  estimatedMinutes: 40,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

URL のクエリ文字列 \`s\` (例: \`"name=alice&age=30"\`) を受け取り、
\`{ key: value }\` のオブジェクトに変換する関数 \`parseQueryString\` を実装してください。

ルール:

- 区切り文字は \`&\`、 キーと値の区切りは \`=\`。
- 値は文字列のまま (数値変換などはしない)。
- 値が空 (\`"key="\`) はキーに対して空文字を持たせる。
- 同じキーが複数回現れた場合は **後から現れた値で上書き**。
- \`=\` を含まないパートはスキップする (\`"a&b=2"\` の \`a\` は無視)。
- 空文字列 \`""\` は空オブジェクト \`{}\` を返す。

\`\`\`js
parseQueryString("name=alice&age=30");   // → { name: "alice", age: "30" }
parseQueryString("");                    // → {}
parseQueryString("single=value");        // → { single: "value" }
parseQueryString("a=1&b=&c=3");          // → { a: "1", b: "", c: "3" }
parseQueryString("a=1&a=2");             // → { a: "2" }
parseQueryString("a&b=2");               // → { b: "2" }
\`\`\`

## ポイント

- **これは S4 卒業課題のひとつ**。 matchAll + キャプチャ + reduce の **3 段パイプライン** を組み立てます。
- パターン例: \`/([^=&]+)=([^&]*)/g\`
  - 1 つ目のキャプチャ \`([^=&]+)\` → キー (\`=\` も \`&\` も含まない 1 文字以上)
  - 2 つ目のキャプチャ \`([^&]*)\` → 値 (\`&\` を含まない 0 文字以上)
  - このパターンに合わないパート (\`=\` を含まないもの) は **マッチしないので自動的にスキップ** されます。
- \`[...s.matchAll(re)]\` で配列化し、 \`reduce\` で 1 つのオブジェクトにまとめます。

## ヒント

- AST で **\`matchAll\`** と **\`reduce\`** を必須にしています。 配列 + for ループの実装では通りません。
`,
  starterCode: `function parseQueryString(s) {
  // matchAll + キャプチャ + reduce でオブジェクトを組み立ててください
}
`,
  entryPoints: ["parseQueryString"],
  demoCall: `console.log(parseQueryString("name=alice&age=30"));`,
  tests: [
    {
      name: '"name=alice&age=30" は { name:"alice", age:"30" }',
      code: `JSON.stringify(parseQueryString("name=alice&age=30")) === JSON.stringify({ name: "alice", age: "30" })`,
    },
    {
      name: '"" は {}',
      code: `JSON.stringify(parseQueryString("")) === JSON.stringify({})`,
    },
    {
      name: '"single=value" は { single:"value" }',
      code: `JSON.stringify(parseQueryString("single=value")) === JSON.stringify({ single: "value" })`,
    },
    {
      name: '空の値も保持する',
      code: `JSON.stringify(parseQueryString("a=1&b=&c=3")) === JSON.stringify({ a: "1", b: "", c: "3" })`,
    },
    {
      name: "同じキーは後勝ち",
      code: `JSON.stringify(parseQueryString("a=1&a=2")) === JSON.stringify({ a: "2" })`,
    },
    {
      name: '"=" を含まないパートはスキップ',
      code: `JSON.stringify(parseQueryString("a&b=2")) === JSON.stringify({ b: "2" })`,
    },
    {
      name: "戻り値はオブジェクト (配列ではない)",
      code: `(() => {
        const r = parseQueryString("x=1");
        return typeof r === "object" && r !== null && !Array.isArray(r);
      })()`,
    },
  ],
  hints: [
    "1) [...s.matchAll(/([^=&]+)=([^&]*)/g)] でキー/値のキャプチャ配列に。 2) reduce(... , {}) でオブジェクトに集約。",
    "解答例:\n```js\nfunction parseQueryString(s) {\n  return [...s.matchAll(/([^=&]+)=([^&]*)/g)].reduce(\n    (obj, m) => {\n      obj[m[1]] = m[2];\n      return obj;\n    },\n    {},\n  );\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return でオブジェクトを返す" },
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
        { kind: "method", name: "matchAll", label: "String#matchAll を使う" },
        { kind: "method", name: "reduce", label: "Array#reduce でオブジェクトに集約する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function parseQueryString(s) {
  return [...s.matchAll(/([^=&]+)=([^&]*)/g)].reduce(
    (obj, m) => {
      obj[m[1]] = m[2];
      return obj;
    },
    {},
  );
}
`,
  badSolutions: [
    {
      code: `function parseQueryString(s) {
  const out = {};
  for (const pair of s.split("&")) {
    const [k, v] = pair.split("=");
    out[k] = v;
  }
  return out;
}
`,
      description: "matchAll / reduce / 正規表現を使っていない (AST required 違反 + 空文字を {\"\": undefined} にしてしまう)",
    },
    {
      code: `function parseQueryString(s) {
  return [...s.matchAll(/([^=&]+)=([^&]*)/g)].reduce(
    (obj, m) => {
      obj[m[2]] = m[1];
      return obj;
    },
    {},
  );
}
`,
      description: "キーと値を逆に格納している (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "String.prototype.matchAll()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll",
      pageTitle: "String.prototype.matchAll()",
    },
    {
      heading: "Array.prototype.reduce()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
      pageTitle: "Array.prototype.reduce()",
    },
  ],
};
