import type { Assignment } from "../../../types.js";

export const s4Ch13ValidationError: Assignment = {
  id: "S4-Ch13-01-validation-error",
  stage: "S4",
  chapterId: "Ch13",
  sequence: 1,
  title: "カスタム ValidationError クラスで失敗を構造化する",
  newConcept: "Error を継承したカスタムエラークラスを定義する",
  estimatedMinutes: 25,
  difficulty: 2,
  testKind: "function",
  description: `## やること

1. \`ValidationError extends Error\` というクラスを定義してください。
   - コンストラクタは \`(message, field)\` を受け取り、 親に \`message\` を渡し (\`super(message)\`)、 \`this.name = "ValidationError"\` と \`this.field = field\` をセットする。
2. \`validateUserName(name)\` を実装してください。 以下のいずれかに該当するときは \`ValidationError\` を投げ、 そうでなければ \`name\` をそのまま返します。
   - \`typeof name !== "string"\` のとき: \`new ValidationError("name must be a string", "name")\`
   - \`name.length === 0\` のとき: \`new ValidationError("name is required", "name")\`
   - \`name.length > 20\` のとき: \`new ValidationError("name too long", "name")\`

\`\`\`js
validateUserName("Alice");            // → "Alice"
validateUserName("");                 // throws ValidationError (field: "name")
validateUserName(42);                 // throws ValidationError
validateUserName("a".repeat(30));     // throws ValidationError
\`\`\`

## ポイント

- \`class ValidationError extends Error\` で組み込みの \`Error\` を継承します。
- 親の \`message\` プロパティを正しく初期化するため、 必ず **\`super(message)\` を呼ぶ** こと。 \`super\` を呼ばずに \`this\` に触ると ReferenceError になります。
- \`this.name = "ValidationError"\` をセットしておくと、 ログに \`ValidationError: ...\` と表示されてデバッグが楽になります。
- \`this.field\` のような **追加プロパティ** を持たせると、 catch 側で「どのフィールドが原因か」 を判定しやすくなります。 これがカスタム Error クラスを定義する一番のうれしさです。
- AST で **ClassDeclaration / ThrowStatement / ReturnStatement** を必須にしています。
`,
  starterCode: `class ValidationError extends Error {
  // constructor で super(message) を呼び、 name と field をセット
}

function validateUserName(name) {
  // 不正な入力で ValidationError を投げる
}
`,
  entryPoints: ["ValidationError", "validateUserName"],
  demoCall: `console.log(validateUserName("Alice"));`,
  tests: [
    {
      name: 'validateUserName("Alice") は "Alice"',
      code: `validateUserName("Alice") === "Alice"`,
    },
    {
      name: "境界 20 文字はそのまま返る",
      code: `validateUserName("a".repeat(20)) === "a".repeat(20)`,
    },
    {
      name: "21 文字以上は ValidationError",
      code: `(() => { try { validateUserName("a".repeat(21)); return false; } catch (e) { return e instanceof ValidationError; } })()`,
    },
    {
      name: "空文字列は ValidationError",
      code: `(() => { try { validateUserName(""); return false; } catch (e) { return e instanceof ValidationError; } })()`,
    },
    {
      name: "数値は ValidationError",
      code: `(() => { try { validateUserName(42); return false; } catch (e) { return e instanceof ValidationError; } })()`,
    },
    {
      name: "ValidationError は Error のサブクラス",
      code: `(() => { try { validateUserName(""); return false; } catch (e) { return e instanceof Error; } })()`,
    },
    {
      name: 'error.name は "ValidationError"',
      code: `(() => { try { validateUserName(""); return false; } catch (e) { return e.name === "ValidationError"; } })()`,
    },
    {
      name: 'error.field は "name"',
      code: `(() => { try { validateUserName(""); return false; } catch (e) { return e.field === "name"; } })()`,
    },
    {
      name: "message プロパティもセットされる (super(message) を呼んだ証拠)",
      code: `(() => { try { validateUserName(""); return false; } catch (e) { return typeof e.message === "string" && e.message.length > 0; } })()`,
    },
  ],
  hints: [
    'class ValidationError extends Error { constructor(message, field) { super(message); this.name = "ValidationError"; this.field = field; } }',
    "validateUserName 内で typeof / length を順にチェックし、 違反なら throw new ValidationError(...) します。",
    '解答例:\n```js\nclass ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = "ValidationError";\n    this.field = field;\n  }\n}\n\nfunction validateUserName(name) {\n  if (typeof name !== "string") {\n    throw new ValidationError("name must be a string", "name");\n  }\n  if (name.length === 0) {\n    throw new ValidationError("name is required", "name");\n  }\n  if (name.length > 20) {\n    throw new ValidationError("name too long", "name");\n  }\n  return name;\n}\n```',
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "ValidationError クラスを class で定義する",
        },
        {
          kind: "node",
          nodeType: "ThrowStatement",
          label: "throw で ValidationError を投げる",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "正常系では return で値を返す",
        },
      ],
      forbidden: [{ kind: "var", label: "var を使わない" }],
    },
  },
  solution: `class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateUserName(name) {
  if (typeof name !== "string") {
    throw new ValidationError("name must be a string", "name");
  }
  if (name.length === 0) {
    throw new ValidationError("name is required", "name");
  }
  if (name.length > 20) {
    throw new ValidationError("name too long", "name");
  }
  return name;
}
`,
  badSolutions: [
    {
      code: `function validateUserName(name) {
  if (typeof name !== "string") {
    throw new Error("bad");
  }
  if (name.length === 0) {
    throw new Error("bad");
  }
  if (name.length > 20) {
    throw new Error("bad");
  }
  return name;
}
`,
      description:
        "ValidationError クラスを定義せず汎用 Error を投げている (ClassDeclaration 違反 + instanceof で失敗)",
    },
    {
      code: `class ValidationError extends Error {
  constructor(message, field) {
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateUserName(name) {
  if (typeof name !== "string") {
    throw new ValidationError("name must be a string", "name");
  }
  if (name.length === 0) {
    throw new ValidationError("name is required", "name");
  }
  if (name.length > 20) {
    throw new ValidationError("name too long", "name");
  }
  return name;
}
`,
      description:
        "super(message) を呼んでいないため constructor で ReferenceError になり、 ValidationError として捕まらない",
    },
  ],
  mdnSections: [
    {
      heading: "Error: カスタムエラーで extends",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error",
      pageTitle: "Error",
    },
  ],
};
