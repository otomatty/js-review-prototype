import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const validatePasswords: Assignment = {
  id: "validate-passwords",
  topicId: "arrays-iteration",
  title: "全パスワードの強度を一括判定する",
  difficulty: 2,
  description: `## 全パスワードの強度を一括判定する

文字列の配列 \`passwords\` を受け取り、

- \`{ allStrong: boolean, hasWeak: boolean }\`

を返す関数 \`validatePasswords\` を実装してください。

「**強い**」の定義: 8文字以上、かつ数字を1つ以上含む。
「**弱い**」: それ以外、または **空文字列**。

空配列の場合: \`{ allStrong: true, hasWeak: false }\`（空集合に対する全称は真、存在は偽）。

### 入出力例

\`\`\`js
validatePasswords(['abc12345', 'xyz98765'])
// → { allStrong: true, hasWeak: false }

validatePasswords(['abc12345', 'short'])
// → { allStrong: false, hasWeak: true }

validatePasswords(['abc1234', 'xyz9876'])  // 7文字
// → { allStrong: false, hasWeak: true }

validatePasswords([])
// → { allStrong: true, hasWeak: false }
\`\`\`

### 制約

- **\`every\`** で \`allStrong\` を求める
- **\`some\`** で \`hasWeak\` を求める
- \`for\` 文は使わない
- \`var\` は使わない
`,
  starterCode: `function validatePasswords(passwords) {
  return { allStrong: true, hasWeak: false };
}
`,
  solution: `function validatePasswords(passwords) {
  const isStrong = (p) => p.length >= 8 && /\\d/.test(p);
  return {
    allStrong: passwords.every(isStrong),
    hasWeak: passwords.some((p) => !isStrong(p)),
  };
}
`,
  entryPoints: ["validatePasswords"],
  tests: [
    {
      name: "全強",
      code: "JSON.stringify(validatePasswords(['abc12345','xyz98765'])) === JSON.stringify({allStrong:true,hasWeak:false})",
    },
    {
      name: "弱混在",
      code: "JSON.stringify(validatePasswords(['abc12345','short'])) === JSON.stringify({allStrong:false,hasWeak:true})",
    },
    {
      name: "全て7文字 (弱)",
      code: "JSON.stringify(validatePasswords(['abc1234','xyz9876'])) === JSON.stringify({allStrong:false,hasWeak:true})",
    },
    {
      name: "空配列",
      code: "JSON.stringify(validatePasswords([])) === JSON.stringify({allStrong:true,hasWeak:false})",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      { kind: "method", name: "every", label: "every を使う" },
      { kind: "method", name: "some", label: "some を使う" },
    ],
    forbidden: [
      { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      { kind: "var", label: "var は使わない" },
    ],
  },
};
