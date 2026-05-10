import type { Assignment } from "../../../types.js";

export const s2Ch12MutationBug: Assignment = {
  id: "S2-Ch12-08-mutation-bug",
  stage: "S2",
  chapterId: "Ch12",
  sequence: 8,
  title: "破壊的メソッドで元配列が変わるバグを直す",
  newConcept: "sort / reverse は元配列を変えてしまうので、 コピーしてから呼ぶ",
  estimatedMinutes: 10,
  difficulty: 3,
  testKind: "stdout",
  description: `## やること

下のコードは「降順に並べた配列」 と「元の配列」 を **2 行** で出力するつもりですが、 \`reverse\` が **元配列を破壊** してしまい、 両方とも降順になっています。

\`\`\`js
const original = [1, 2, 3];
const reversed = original.reverse();
console.log(\`reversed: \${JSON.stringify(reversed)}\`);
console.log(\`original: \${JSON.stringify(original)}\`);
\`\`\`

\`reverse\` を呼ぶ前に \`slice()\` でコピーしておき、 元配列が \`[1, 2, 3]\` のままになるよう修正してください。

## 期待する出力

\`\`\`
reversed: [3,2,1]
original: [1,2,3]
\`\`\`

## ポイント

- \`reverse\` と \`sort\` は **破壊的メソッド** (元の配列を変更する)。
- 元を残したいときは \`arr.slice().reverse()\` のように **コピーしてから** 呼びます。
`,
  starterCode: `const original = [1, 2, 3];
const reversed = original.reverse();
console.log(\`reversed: \${JSON.stringify(reversed)}\`);
console.log(\`original: \${JSON.stringify(original)}\`);
`,
  tests: [
    {
      name: "stdout が reversed/original の 2 行になる",
      expectedStdout: "reversed: [3,2,1]\noriginal: [1,2,3]",
    },
  ],
  hints: [
    "`original.reverse()` を直接呼ぶと元の配列が変わります。",
    "`original.slice().reverse()` のようにコピーしてから reverse を呼びます。",
    "解答例:\n```js\nconst original = [1, 2, 3];\nconst reversed = original.slice().reverse();\nconsole.log(`reversed: ${JSON.stringify(reversed)}`);\nconsole.log(`original: ${JSON.stringify(original)}`);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "method", name: "slice", label: "slice() でコピーする" },
        { kind: "method", name: "reverse", label: "reverse で逆順にする" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: "const original = [1, 2, 3];\nconst reversed = original.slice().reverse();\nconsole.log(`reversed: ${JSON.stringify(reversed)}`);\nconsole.log(`original: ${JSON.stringify(original)}`);\n",
  badSolutions: [
    {
      code: `console.log("reversed: [3,2,1]");
console.log("original: [1,2,3]");
`,
      description: "結果を直接出力している (破壊的変更の修正が目的)",
    },
  ],
  mdnSections: [
    { heading: "Array.prototype.reverse()", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse", pageTitle: "Array.prototype.reverse()" },
    { heading: "Array.prototype.slice()", pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice", pageTitle: "Array.prototype.slice()" },
  ],
};
