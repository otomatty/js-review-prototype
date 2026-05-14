import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s1Ch12TemplateCurly: Assignment = {
  id: "S1-Ch12-06-template-curly",
  stage: "S1",
  chapterId: "Ch12",
  sequence: 6,
  title: "テンプレートリテラルの ${} を直す",
  newConcept: "テンプレートで変数を埋め込むには $ ではなく ${ } で囲む",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  description: `## やること

下のコードはテンプレートリテラルで変数を埋め込もうとしていますが、 \`$name\` のように **波カッコを忘れている** ため、 そのまま \`$name\` という文字列が出てしまっています。

\`\${name}\` の形に直して、 \`name\` の値が埋め込まれるようにしてください。

## 期待する出力

\`\`\`
Hello, Taro
\`\`\`

## ポイント

- テンプレートで変数を埋め込むには \`\$\` だけでは足りず、 **\`\${変数名}\`** の形にする必要があります。
- \`\${ }\` の波カッコを忘れると、 ただの文字として出力されてしまいます。
`,
  starterFiles: singleFile(`// バグ: $name は変数として展開されず、 そのまま "$name" と出てしまう
// \${name} の形に修正する

const name = "Taro";
console.log(\`Hello, $name\`);
`),
  tests: [
    {
      name: "stdout が Hello, Taro になる",
      expectedStdout: "Hello, Taro",
    },
  ],
  hints: [
    "テンプレートで変数を埋め込むには `${ }` で囲みます。 `$` だけではダメです。",
    "`` `Hello, ${name}` `` の形に直します。",
    "解答例:\n```js\nconst name = \"Taro\";\nconsole.log(`Hello, ${name}`);\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "TemplateLiteral",
          label: "テンプレートリテラルを使う",
        },
      ],
    },
  },
  solution: "const name = \"Taro\";\nconsole.log(`Hello, ${name}`);\n",
  mdnSections: [
    { heading: "テンプレートリテラル" },
  ],
};
