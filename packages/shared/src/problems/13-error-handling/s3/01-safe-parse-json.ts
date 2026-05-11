import type { Assignment } from "../../../types.js";

export const s3Ch13SafeParseJson: Assignment = {
  id: "S3-Ch13-01-safe-parse-json",
  stage: "S3",
  chapterId: "Ch13",
  sequence: 1,
  title: "try/catch で安全にパースする",
  newConcept: "try/catch でエラーを捕まえ、 代替値を返す",
  estimatedMinutes: 12,
  difficulty: 2,
  testKind: "function",
  description: `## やること

文字列 \`text\` を受け取り、 \`JSON.parse(text)\` を試みて結果を返す関数 \`safeParseJson\` を実装してください。 パースに失敗 (例外発生) したときは \`null\` を返します。

\`\`\`js
safeParseJson('{"a":1}');     // → { a: 1 }
safeParseJson("[1,2,3]");     // → [1, 2, 3]
safeParseJson("not json");    // → null
safeParseJson("{");           // → null
\`\`\`

## ポイント

- \`try { ... } catch (e) { return null; }\` の形で失敗時の値を決めます。
- \`catch (e)\` は **例外オブジェクト** を受け取れますが、 ここでは使わなくても OK です。
`,
  starterCode: `function safeParseJson(text) {
  // try/catch で実装してください
}
`,
  entryPoints: ["safeParseJson"],
  demoCall: `console.log(safeParseJson('{"a":1}'));`,
  tests: [
    {
      name: 'safeParseJson(\'{"a":1}\') は {a:1}',
      code: `(() => { const r = safeParseJson('{"a":1}'); return r && r.a === 1; })()`,
    },
    {
      name: 'safeParseJson("[1,2,3]") は [1,2,3]',
      code: `(() => { const r = safeParseJson("[1,2,3]"); return Array.isArray(r) && r.length === 3 && r[0] === 1; })()`,
    },
    {
      name: 'safeParseJson("not json") は null',
      code: `safeParseJson("not json") === null`,
    },
    {
      name: 'safeParseJson("{") は null',
      code: `safeParseJson("{") === null`,
    },
    {
      name: 'safeParseJson("123") は 123',
      code: `safeParseJson("123") === 123`,
    },
  ],
  hints: [
    "try { return JSON.parse(text); } catch (e) { return null; }",
    "解答例:\n```js\nfunction safeParseJson(text) {\n  try {\n    return JSON.parse(text);\n  } catch (e) {\n    return null;\n  }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
        { kind: "node", nodeType: "TryStatement", label: "try/catch を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}
`,
  badSolutions: [
    {
      code: `function safeParseJson(text) {
  return JSON.parse(text);
}
`,
      description: "try/catch を使っておらず、 不正な JSON で例外で落ちる",
    },
    {
      code: `function safeParseJson(text) {
  if (!text.startsWith("{")) return null;
  return JSON.parse(text);
}
`,
      description: "try/catch を使わず手動チェックで取りこぼしがある",
    },
  ],
  mdnSections: [
    {
      heading: "try...catch",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
  ],
};
