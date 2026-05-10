import type { Assignment } from "../../../types.js";

export const s1Ch01LetReassign: Assignment = {
  id: "S1-Ch01-03-let-reassign",
  stage: "S1",
  chapterId: "Ch01",
  sequence: 3,
  title: "let で再代入する",
  newConcept: "let で宣言した変数は後から値を入れ直せる",
  estimatedMinutes: 7,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

\`let\` で **\`count\`** を作り、 最初は \`0\` を入れます。 その値を \`console.log\` で出力した後、 \`count\` に \`1\` を入れ直して、 もう一度 \`console.log\` で出力してください。

## 期待する出力

\`\`\`
0
1
\`\`\`

## ポイント

- \`let\` で作った変数は **後から値を入れ直せます** (= 再代入)。
- 入れ直すときは \`let\` を **2 回目には書きません**。 \`count = 1;\` のように変数名と値だけを書きます。
`,
  scaffolds: {
    L0: "",
    L1: `// let で count を 0 で作り、 出力 → 1 を再代入 → もう一度出力
`,
    L2: `// 1. let count = 0; で初期値を入れる
// 2. console.log(count) で 0 を出す
// 3. count = 1; で値を入れ直す (let は書かない)
// 4. もう一度 console.log(count) で 1 を出す

`,
    L3: `let count = ____;
console.log(count);
count = ____;
console.log(count);
`,
  },
  tests: [
    {
      name: "stdout が 0 と 1 の 2 行になる",
      expectedStdout: "0\n1",
    },
  ],
  hints: [
    "再代入したいときは `const` ではなく `let` を使います。",
    "2 回目に値を入れるときは `let` を書かず、 `count = 1;` のように **変数名と値だけ** を書きます。",
    "解答例:\n```js\nlet count = 0;\nconsole.log(count);\ncount = 1;\nconsole.log(count);\n```",
  ],
  staticAnalysis: {
    ast: {
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `let count = 0;
console.log(count);
count = 1;
console.log(count);
`,
  badSolutions: [
    {
      code: `const count = 0;
console.log(count);
count = 1;
console.log(count);
`,
      description: "const で宣言してから再代入しようとしている",
    },
  ],
  mdnSections: [
    { heading: "let" },
    { heading: "let と const の違い" },
  ],
};
