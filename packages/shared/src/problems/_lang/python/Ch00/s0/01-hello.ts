import type { Assignment } from "../../../../../types.js";

/**
 * Python 教材の動作確認用 入門課題 (#100 / #108)。
 *
 * Pyodide (WebAssembly 上の CPython) で実行される。 採点ランナは課題ごとに fresh な
 * Python グローバル名前空間を作成し、 `entryFile` 内容を実行 → 捕捉した stdout を
 * 期待値と比較する。
 */
export const s0PyCh00Hello: Assignment = {
  id: "S0-Py-Ch00-01-hello",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 81,
  title: "Python: Hello, World! を表示する",
  newConcept: "print で文字列を標準出力に書き出す",
  estimatedMinutes: 3,
  difficulty: 1,
  testKind: "stdout",
  language: "python",
  entryFile: "main.py",
  starterFiles: [
    {
      path: "main.py",
      content: `# print() で "Hello, World!" を出力してください。

`,
    },
  ],
  description: `## やること

\`main.py\` で **\`Hello, World!\`** という文字列を 1 行だけ出力してください。

## 期待される標準出力

\`\`\`
Hello, World!
\`\`\`

## ヒント

Python では \`print("文字列")\` で標準出力に書き出します。 末尾には自動で改行が入ります。
`,
  tests: [
    {
      name: "Hello, World! を出力する",
      expectedStdout: "Hello, World!\n",
    },
  ],
  hints: [
    "`print(\"Hello, World!\")` と書きます。",
    "ダブルクォートとシングルクォートのどちらでも文字列を作れます。",
  ],
  solution: `print("Hello, World!")\n`,
};
