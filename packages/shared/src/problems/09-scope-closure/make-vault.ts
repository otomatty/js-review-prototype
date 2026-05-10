import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const makeVault: Assignment = {
  id: "make-vault",
  topicId: "scope-closure",
  title: "クロージャでプライベート変数を作る",
  difficulty: 2,
  description: `## クロージャでプライベート変数を作る

数値の初期残高 \`initial\` を受け取り、以下の3つのメソッドを持つオブジェクトを返す関数 \`makeVault\` を実装してください。

- \`deposit(n)\`: 残高に \`n\` を加える（\`n\` は正の整数のみ。それ以外は無視）
- \`withdraw(n)\`: 残高から \`n\` を引く（残高不足や不正な \`n\` の場合は無視）
- \`balance()\`: 現在の残高を返す

返したオブジェクトの **外部から残高に直接アクセスできてはいけません**（クロージャで保護）。

### 入出力例

\`\`\`js
const v = makeVault(100);
v.balance()       // → 100
v.deposit(50);
v.balance()       // → 150
v.withdraw(30);
v.balance()       // → 120
v.withdraw(9999); // 残高不足、無視
v.balance()       // → 120
v.deposit(-10);   // 不正、無視
v.balance()       // → 120
v.balance        // 関数 (プロパティとしての残高は存在しない)
\`\`\`

### 制約

- **クロージャ**で残高を保護する
- 戻り値オブジェクトに残高そのものを露出させない
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
  starterCode: `function makeVault(initial) {
  return {
    deposit(n) {},
    withdraw(n) {},
    balance() { return 0; },
  };
}
`,
  solution: `function makeVault(initial) {
  let balance = initial;
  return {
    deposit(n) {
      if (Number.isInteger(n) && n > 0) balance += n;
    },
    withdraw(n) {
      if (Number.isInteger(n) && n > 0 && n <= balance) balance -= n;
    },
    balance() {
      return balance;
    },
  };
}
`,
  entryPoints: ["makeVault"],
  tests: [
    {
      name: "初期残高",
      code: "makeVault(100).balance() === 100",
    },
    {
      name: "deposit",
      code: "(() => { const v = makeVault(100); v.deposit(50); return v.balance() === 150; })()",
    },
    {
      name: "withdraw",
      code: "(() => { const v = makeVault(100); v.withdraw(30); return v.balance() === 70; })()",
    },
    {
      name: "残高不足は無視",
      code: "(() => { const v = makeVault(100); v.withdraw(9999); return v.balance() === 100; })()",
    },
    {
      name: "負数 deposit は無視",
      code: "(() => { const v = makeVault(100); v.deposit(-10); return v.balance() === 100; })()",
    },
    {
      name: "balance は関数 (プロパティ非露出)",
      code: "typeof makeVault(100).balance === 'function'",
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
