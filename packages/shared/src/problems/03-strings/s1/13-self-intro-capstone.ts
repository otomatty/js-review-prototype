import type { Assignment } from "../../../types.js";

export const s1Ch03SelfIntroCapstone: Assignment = {
  id: "S1-Ch03-13-self-intro-capstone",
  stage: "S1",
  chapterId: "Ch03",
  sequence: 13,
  title: "[チャレンジ] 自己紹介文を組み立てる",
  newConcept: "S1 で習った変数 / 文字列 / テンプレートリテラルを統合する",
  estimatedMinutes: 10,
  difficulty: 2,
  testKind: "stdout",
  isCapstone: true,
  description: `## やること

3 つの変数 \`name\` / \`age\` / \`hobby\` を const で持ち、 テンプレートリテラルで自己紹介文を 2 行で組み立てて出力する **チャレンジ問題** です。

- \`name\`: \`"花子"\`
- \`age\`: \`30\`
- \`hobby\`: \`"読書"\`

## 期待する出力

\`\`\`
こんにちは、 花子 (30) です。
趣味は 読書 です。
\`\`\`

## ポイント

- 1 回の console.log で 2 行を出すには、 バッククォートを使った **複数行のテンプレートリテラル** が便利です。
- \`\${name}\` / \`\${age}\` / \`\${hobby}\` をそれぞれ埋め込みます。
`,
  scaffolds: {
    L0: "",
    L1: "// name / age / hobby を const で持ち、 2 行のテンプレートで自己紹介文を出力\n",
    L2: `// 1. const name = "花子";
// 2. const age = 30;
// 3. const hobby = "読書";
// 4. テンプレートリテラル (複数行) で自己紹介文を console.log

`,
    L3: "const name = ____;\nconst age = ____;\nconst hobby = ____;\nconsole.log(`こんにちは、 ${____} (${____}) です。\n趣味は ${____} です。`);\n",
  },
  tests: [
    {
      name: "stdout が 自己紹介文 (2 行) になる",
      expectedStdout: "こんにちは、 花子 (30) です。\n趣味は 読書 です。",
    },
  ],
  hints: [
    "3 つの const と 1 つのテンプレートリテラルだけで作れます。",
    "テンプレートリテラルの中で改行をそのまま入れれば、 1 回の console.log で 2 行出せます。 数値の `age` もそのまま `${age}` で埋め込めます。",
    "解答例:\n```js\nconst name = \"花子\";\nconst age = 30;\nconst hobby = \"読書\";\nconsole.log(`こんにちは、 ${name} (${age}) です。\n趣味は ${hobby} です。`);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "const-declaration",
          name: "name",
          label: "const name を宣言する",
        },
        {
          kind: "const-declaration",
          name: "age",
          label: "const age を宣言する",
        },
        {
          kind: "const-declaration",
          name: "hobby",
          label: "const hobby を宣言する",
        },
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "テンプレートリテラルで組み立てる",
        },
      ],
    },
  },
  solution: "const name = \"花子\";\nconst age = 30;\nconst hobby = \"読書\";\nconsole.log(`こんにちは、 ${name} (${age}) です。\n趣味は ${hobby} です。`);\n",
  badSolutions: [
    {
      code: `console.log("こんにちは、 花子 (30) です。\\n趣味は 読書 です。");
`,
      description: "変数を作らず文字列を直接書いている",
    },
  ],
  mdnSections: [
    { heading: "テンプレートリテラル" },
  ],
};
