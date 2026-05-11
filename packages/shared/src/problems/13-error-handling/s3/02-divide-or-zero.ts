import type { Assignment } from "../../../types.js";

export const s3Ch13DivideOrZero: Assignment = {
  id: "S3-Ch13-02-divide-or-zero",
  stage: "S3",
  chapterId: "Ch13",
  sequence: 2,
  title: "throw された例外を try/catch で 0 にフォールバック",
  newConcept: "事前条件違反は throw、 呼び出し側は catch で握る",
  estimatedMinutes: 15,
  difficulty: 2,
  testKind: "function",
  description: `## やること

2 つの関数を実装してください。

1. \`divide(a, b)\`: \`b === 0\` のとき \`throw new Error("zero")\` で例外を発生させ、 それ以外は \`a / b\` を返す
2. \`divideOrZero(a, b)\`: 内部で \`divide\` を呼び、 例外が発生したら \`0\` を返す

\`\`\`js
divideOrZero(10, 2);   // → 5
divideOrZero(10, 0);   // → 0      (例外を catch して 0)
divideOrZero(-6, 3);   // → -2
\`\`\`

## ポイント

- **\`throw new Error("メッセージ")\`** で例外を発生させます。
- 呼び出し側で **\`try { ... } catch (e) { return 0; }\`** で握ります。
- AST で **TryStatement と ThrowStatement の両方** を必須にしています。
`,
  starterCode: `function divide(a, b) {
  // b === 0 のときは throw、 それ以外は a / b
}

function divideOrZero(a, b) {
  // divide を try/catch で呼ぶ
}
`,
  entryPoints: ["divide", "divideOrZero"],
  demoCall: `console.log(divideOrZero(10, 0));`,
  tests: [
    { name: "divideOrZero(10, 2) は 5", code: `divideOrZero(10, 2) === 5` },
    { name: "divideOrZero(10, 0) は 0", code: `divideOrZero(10, 0) === 0` },
    { name: "divideOrZero(-6, 3) は -2", code: `divideOrZero(-6, 3) === -2` },
    { name: "divideOrZero(0, 5) は 0", code: `divideOrZero(0, 5) === 0` },
    {
      name: 'divide(10, 0) は Error("zero") を投げる',
      code: `(() => { try { divide(10, 0); return false; } catch (e) { return e instanceof Error && e.message === "zero"; } })()`,
    },
    { name: "divide(10, 2) は 5", code: `divide(10, 2) === 5` },
  ],
  hints: [
    "divide では if (b === 0) throw new Error(\"zero\"); return a / b;",
    "divideOrZero では try { return divide(a, b); } catch (e) { return 0; }",
    "解答例:\n```js\nfunction divide(a, b) {\n  if (b === 0) throw new Error(\"zero\");\n  return a / b;\n}\nfunction divideOrZero(a, b) {\n  try { return divide(a, b); } catch (e) { return 0; }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
        { kind: "node", nodeType: "TryStatement", label: "try/catch を使う" },
        { kind: "node", nodeType: "ThrowStatement", label: "throw で例外を発生させる" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function divide(a, b) {
  if (b === 0) {
    throw new Error("zero");
  }
  return a / b;
}

function divideOrZero(a, b) {
  try {
    return divide(a, b);
  } catch (e) {
    return 0;
  }
}
`,
  badSolutions: [
    {
      code: `function divide(a, b) {
  if (b === 0) return 0;
  return a / b;
}

function divideOrZero(a, b) {
  return divide(a, b);
}
`,
      description: "throw を使っていない (AST required 違反)",
    },
    {
      code: `function divide(a, b) {
  if (b === 0) throw new Error("zero");
  return a / b;
}

function divideOrZero(a, b) {
  return divide(a, b);
}
`,
      description: "try/catch を使っておらず例外が伝搬してテスト失敗",
    },
  ],
  mdnSections: [
    {
      heading: "throw",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/throw",
      pageTitle: "throw",
    },
  ],
};
