import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const validateAge: Assignment = {
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
};
