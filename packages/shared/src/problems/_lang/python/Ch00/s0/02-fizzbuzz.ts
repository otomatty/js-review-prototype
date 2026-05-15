import type { Assignment } from "../../../../../types.js";

/**
 * Python 教材: FizzBuzz (#100 / #108)。
 * 条件分岐 + ループ + print の組み合わせを確認する典型課題。
 */
export const s0PyCh00FizzBuzz: Assignment = {
  id: "S0-Py-Ch00-02-fizzbuzz",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 82,
  title: "Python: FizzBuzz (1〜15)",
  newConcept: "if / elif / else と for ループで条件分岐を出力する",
  estimatedMinutes: 8,
  difficulty: 1,
  testKind: "stdout",
  language: "python",
  entryFile: "main.py",
  starterFiles: [
    {
      path: "main.py",
      content: `# 1 から 15 までの整数 n に対して、 以下のルールで 1 行ずつ出力してください。
# - n が 3 と 5 の両方で割り切れる: FizzBuzz
# - n が 3 でだけ割り切れる: Fizz
# - n が 5 でだけ割り切れる: Buzz
# - それ以外: n そのもの

`,
    },
  ],
  description: `## やること

1 から 15 までの整数を順に処理し、 次のルールで **1 行ずつ** 標準出力に書き出してください:

- 3 と 5 の両方で割り切れる数 → \`FizzBuzz\`
- 3 でだけ割り切れる数 → \`Fizz\`
- 5 でだけ割り切れる数 → \`Buzz\`
- それ以外 → 数値そのもの

## 期待される標準出力

\`\`\`
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
\`\`\`
`,
  tests: [
    {
      name: "1〜15 を FizzBuzz ルールで出力する",
      expectedStdout:
        "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n",
    },
  ],
  hints: [
    "`for n in range(1, 16):` で 1〜15 のループになります (右端は含まれない点に注意)。",
    "両方で割り切れる判定 (`n % 15 == 0` または `n % 3 == 0 and n % 5 == 0`) を先に書きます。",
    "数値を print するときも自動で文字列に変換されます (`print(n)`)。",
  ],
  solution: `for n in range(1, 16):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)
`,
};
