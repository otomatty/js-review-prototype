import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const isPalindrome: Assignment = {
  id: "is-palindrome",
  topicId: "strings",
  title: "回文かどうか判定する",
  difficulty: 2,
  description: `## 回文かどうか判定する

文字列を受け取り、**英数字以外の文字を除き、大文字小文字を無視**して回文かどうかを返す関数 \`isPalindrome\` を実装してください。

空文字は \`true\`（空文字は回文とみなす）として扱います。

### 入出力例

\`\`\`js
isPalindrome('racecar')                     // → true
isPalindrome('A man a plan a canal Panama') // → true
isPalindrome('hello')                        // → false
isPalindrome('No lemon, no melon')           // → true
isPalindrome('')                             // → true
isPalindrome('a')                            // → true
isPalindrome('ab')                           // → false
\`\`\`

### 制約

- 文字列メソッドや配列メソッドを駆使する
- \`var\` は使わない
- \`for\` 文や \`while\` 文を使わずに書ける（英数字以外の除去には \`String.prototype.replace\` と正規表現、または \`Array.prototype.filter\` を使ってよい）
`,
  starterCode: `function isPalindrome(input) {
  return false;
}
`,
  solution: `function isPalindrome(input) {
  const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}
`,
  entryPoints: ["isPalindrome"],
  tests: [
    {
      name: "racecar",
      code: "isPalindrome('racecar') === true",
    },
    {
      name: "句読点無視",
      code: "isPalindrome('A man a plan a canal Panama') === true",
    },
    {
      name: "hello は false",
      code: "isPalindrome('hello') === false",
    },
    {
      name: "No lemon, no melon",
      code: "isPalindrome('No lemon, no melon') === true",
    },
    { name: "空文字", code: "isPalindrome('') === true" },
    { name: "1文字", code: "isPalindrome('a') === true" },
    { name: "ab は false", code: "isPalindrome('ab') === false" },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      {
        kind: "node",
        nodeType: "WhileStatement",
        label: "while 文は使わない",
      },
    ],
  },
};
