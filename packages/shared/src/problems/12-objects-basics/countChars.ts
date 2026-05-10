import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const countChars: Assignment = {
  id: "countChars",
  topicId: "objects-basics",
  title: "文字頻度カウント",
  difficulty: 3,
  description: `## 文字頻度カウント

文字列を受け取り、各文字の出現回数を表すオブジェクトを返す関数 \`countChars\` を実装してください。

### 入出力例

\`\`\`js
countChars('aabbc')     // → { a: 2, b: 2, c: 1 }
countChars('')          // → {}
countChars('あああ')     // → { 'あ': 3 }
\`\`\`

### 制約

- \`var\` は使わないこと (実装方針は自由)
`,
  starterCode: `function countChars(str) {
  // ここに実装してください
  return {};
}
`,
  solution: `function countChars(str) {
  const counts = {};
  for (const ch of str) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}
`,
  entryPoints: ["countChars"],
  tests: [
    {
      name: "英字 'aabbc'",
      code: `JSON.stringify(countChars('aabbc')) === JSON.stringify({a:2,b:2,c:1})`,
    },
    {
      name: "空文字 ''",
      code: `JSON.stringify(countChars('')) === JSON.stringify({})`,
    },
    {
      name: "単一文字 'aaaa'",
      code: `JSON.stringify(countChars('aaaa')) === JSON.stringify({a:4})`,
    },
    {
      name: "日本語 'あああ'",
      code: `JSON.stringify(countChars('あああ')) === JSON.stringify({'あ':3})`,
    },
    {
      name: "数字混在 'a1a1'",
      code: `JSON.stringify(countChars('a1a1')) === JSON.stringify({a:2,'1':2})`,
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
