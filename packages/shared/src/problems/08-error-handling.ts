import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES } from "./_common.js";

export const errorHandling: Assignment[] = [
  // ────────────────────────────────────────────────
  // 8-1: throw / Error
  // ────────────────────────────────────────────────
  {
    id: "safe-divide",
    topicId: "error-handling",
    title: "0除算をエラーにする",
    difficulty: 1,
    description: `## 0除算をエラーにする

数値 \`a\` と \`b\` を受け取り \`a / b\` を返す関数 \`safeDivide\` を実装してください。
ただし \`b === 0\` の場合は **\`Error\`** を \`throw\` してください（メッセージは任意）。

### 入出力例

\`\`\`js
safeDivide(10, 2)    // → 5
safeDivide(7, 0)     // → throw Error
safeDivide(0, 5)     // → 0
safeDivide(-10, 4)   // → -2.5
\`\`\`

### 制約

- \`b === 0\` のとき必ず **\`throw\`** する（戻り値で表現しない）
- \`Error\` インスタンスを投げる（\`throw 'msg'\` のような文字列ではダメ）
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
    starterCode: `function safeDivide(a, b) {
  return a / b;
}
`,
    solution: `function safeDivide(a, b) {
  if (b === 0) throw new Error('division by zero');
  return a / b;
}
`,
    badSolutions: [
      {
        description: "throw を string で行うと Error インスタンスにならない",
        code: `function safeDivide(a, b) {
  if (b === 0) throw 'division by zero';
  return a / b;
}
`,
      },
    ],
    entryPoints: ["safeDivide"],
    tests: [
      { name: "10/2", code: "safeDivide(10, 2) === 5" },
      { name: "0/5", code: "safeDivide(0, 5) === 0" },
      {
        name: "-10/4",
        code: "Math.abs(safeDivide(-10, 4) - (-2.5)) < 1e-9",
      },
      {
        name: "0除算で throw",
        code: "(() => { try { safeDivide(7, 0); return false; } catch(e) { return e instanceof Error; } })()",
      },
      {
        name: "throw されたものが Error インスタンス",
        code: "(() => { try { safeDivide(1, 0); return false; } catch(e) { return e instanceof Error && typeof e.message === 'string'; } })()",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ThrowStatement",
          label: "throw 文を使う",
        },
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "new Error(...) を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
  },

  // ────────────────────────────────────────────────
  // 8-2: try/catch で結果ラッパ
  // ────────────────────────────────────────────────
  {
    id: "try-parse-json",
    topicId: "error-handling",
    title: "JSONパースを Result 型で包む",
    difficulty: 2,
    description: `## JSONパースを Result 型で包む

文字列を受け取り、\`JSON.parse\` の結果を **Result 型風オブジェクト** で返す関数 \`tryParseJson\` を実装してください。

成功時: \`{ ok: true, value: <パース結果> }\`
失敗時: \`{ ok: false, error: <Errorのmessage文字列> }\`

### 入出力例

\`\`\`js
tryParseJson('{"a":1}')
// → { ok: true, value: { a: 1 } }

tryParseJson('[1,2,3]')
// → { ok: true, value: [1,2,3] }

tryParseJson('not-json')
// → { ok: false, error: '<エラーメッセージ>' }

tryParseJson('')
// → { ok: false, error: '<エラーメッセージ>' }

tryParseJson('null')
// → { ok: true, value: null }
\`\`\`

### 制約

- **\`try / catch\`** で例外を捕捉する
- 例外が出ても呼び出し側に \`throw\` し直さない
- \`var\` は使わない
`,
    starterCode: `function tryParseJson(text) {
  return { ok: false, error: 'unimplemented' };
}
`,
    solution: `function tryParseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
`,
    entryPoints: ["tryParseJson"],
    tests: [
      {
        name: "object",
        code: "JSON.stringify(tryParseJson('{\"a\":1}')) === JSON.stringify({ok:true,value:{a:1}})",
      },
      {
        name: "array",
        code: "JSON.stringify(tryParseJson('[1,2,3]')) === JSON.stringify({ok:true,value:[1,2,3]})",
      },
      {
        name: "invalid",
        code: "(() => { const r = tryParseJson('not-json'); return r.ok === false && typeof r.error === 'string' && r.error.length > 0; })()",
      },
      {
        name: "empty string",
        code: "(() => { const r = tryParseJson(''); return r.ok === false && typeof r.error === 'string'; })()",
      },
      {
        name: "null literal",
        code: "JSON.stringify(tryParseJson('null')) === JSON.stringify({ok:true,value:null})",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try / catch を使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
  },

  // ────────────────────────────────────────────────
  // 8-3: カスタムErrorクラス
  // ────────────────────────────────────────────────
  {
    id: "validate-age",
    topicId: "error-handling",
    title: "カスタムエラーで年齢を検証する",
    difficulty: 3,
    description: `## カスタムエラーで年齢を検証する

\`Error\` を継承した \`ValidationError\` クラスと、年齢を検証する関数 \`assertAge(value)\` を実装してください。

\`assertAge(value)\` は:

- \`value\` が **整数で 0〜150 の範囲** であれば、何もせずに \`value\` を返す
- それ以外（小数・負数・150 超・型違い・\`NaN\` 等）の場合、**\`ValidationError\`** を \`throw\` する

\`ValidationError\` は \`Error\` を継承し、\`name\` プロパティが \`'ValidationError'\` であること。

### 入出力例

\`\`\`js
assertAge(0)    // → 0
assertAge(30)   // → 30
assertAge(150)  // → 150

try { assertAge(-1) } catch(e) {
  e instanceof ValidationError   // → true
  e instanceof Error             // → true
  e.name                          // → 'ValidationError'
}
\`\`\`

### 制約

- \`ValidationError\` は \`class ValidationError extends Error\` で定義する
- \`assertAge\` の中で **\`throw new ValidationError(...)\`** する
- \`var\` は使わない
- \`==\` / \`!=\` は使わない

注意: テストから \`ValidationError\` を参照するため、グローバル名前空間（\`function\` 宣言と同等のトップレベル \`class\`）に出してください。
`,
    starterCode: `class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function assertAge(value) {
  return value;
}
`,
    solution: "class ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = 'ValidationError';\n  }\n}\n\nfunction assertAge(value) {\n  if (!Number.isInteger(value) || value < 0 || value > 150) {\n    throw new ValidationError(`invalid age: ${value}`);\n  }\n  return value;\n}\n",
    entryPoints: ["assertAge", "ValidationError"],
    tests: [
      { name: "0", code: "assertAge(0) === 0" },
      { name: "30", code: "assertAge(30) === 30" },
      { name: "150", code: "assertAge(150) === 150" },
      {
        name: "負数で throw",
        code: "(() => { try { assertAge(-1); return false; } catch(e) { return e instanceof ValidationError; } })()",
      },
      {
        name: "150超で throw",
        code: "(() => { try { assertAge(151); return false; } catch(e) { return e instanceof ValidationError; } })()",
      },
      {
        name: "小数で throw",
        code: "(() => { try { assertAge(3.14); return false; } catch(e) { return e instanceof ValidationError; } })()",
      },
      {
        name: "Error 継承 & name",
        code: "(() => { try { assertAge('a'); return false; } catch(e) { return e instanceof Error && e.name === 'ValidationError'; } })()",
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
        {
          kind: "node",
          nodeType: "ThrowStatement",
          label: "throw 文を使う",
        },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "loose-eq", label: "== / != は使わない" },
      ],
    },
  },
];
