import type { Assignment } from "../../../../../types.js";

/**
 * Python 教材: リスト操作 (#100 / #108)。
 * 組み込み関数 (`sum`) と print を組み合わせる。
 */
export const s0PyCh00ListOps: Assignment = {
  id: "S0-Py-Ch00-03-list-ops",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 83,
  title: "Python: リストの合計を求める",
  newConcept: "リストと組み込み関数 sum() で要素を集計する",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  language: "python",
  entryFile: "main.py",
  starterFiles: [
    {
      path: "main.py",
      content: `numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

# numbers の合計を 1 行で出力してください。

`,
    },
  ],
  description: `## やること

\`main.py\` の先頭で定義されているリスト:

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
\`\`\`

について、 **要素の合計値** を 1 行だけ標準出力に書き出してください。

## 期待される標準出力

\`\`\`
39
\`\`\`
`,
  tests: [
    {
      name: "numbers の合計 39 を出力する",
      expectedStdout: "39\n",
    },
  ],
  hints: [
    "組み込み関数 `sum(リスト)` でリストの合計を求められます。",
    "結果を `print(...)` に渡すと標準出力に書き出されます。",
  ],
  solution: `numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
print(sum(numbers))
`,
};
