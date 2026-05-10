import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const defaultGreeting: Assignment = {
  id: "default-greeting",
  topicId: "functions-basics",
  title: "デフォルト引数で挨拶を作る",
  difficulty: 1,
  description: `## デフォルト引数で挨拶を作る

\`name\` と \`prefix\` を受け取り、\`"{prefix} {name}"\` を返す関数 \`greet\` を実装してください。

- \`prefix\` が省略された場合は \`'Hello,'\` を使う
- \`prefix\` に空文字 \`''\` が**明示的**に渡された場合は **そのまま空文字を使う**（先頭スペースができないように整形）

注意: \`prefix\` が省略された場合（\`undefined\`）と、明示的に \`''\` を渡された場合を区別すること。これは \`||\` を使うと混同しやすい有名な落とし穴です。

### 入出力例

\`\`\`js
greet('Alice')          // → 'Hello, Alice'
greet('Alice', 'やあ')   // → 'やあ Alice'
greet('Alice', '')      // → 'Alice'
greet('Alice', undefined) // → 'Hello, Alice'
\`\`\`

### 制約

- **デフォルト引数構文**（\`function greet(name, prefix = 'Hello,')\`）を使う
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
  starterCode: `function greet(name, prefix) {
  return '';
}
`,
  solution: "function greet(name, prefix = 'Hello,') {\n  if (prefix === '') return name;\n  return `${prefix} ${name}`;\n}\n",
  badSolutions: [
    {
      description: "|| でフォールバックすると空文字を巻き込み 'Hello, Alice' になる",
      code: "function greet(name, prefix) {\n  const p = prefix || 'Hello,';\n  return `${p} ${name}`;\n}\n",
    },
  ],
  entryPoints: ["greet"],
  tests: [
    {
      name: "省略",
      code: "greet('Alice') === 'Hello, Alice'",
    },
    {
      name: "明示プレフィックス",
      code: "greet('Alice', 'やあ') === 'やあ Alice'",
    },
    {
      name: "空文字プレフィックスは保持",
      code: "greet('Alice', '') === 'Alice'",
    },
    {
      name: "undefined はデフォルト",
      code: "greet('Alice', undefined) === 'Hello, Alice'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
