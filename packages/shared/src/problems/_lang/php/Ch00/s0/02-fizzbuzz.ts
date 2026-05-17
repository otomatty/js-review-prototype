import type { Assignment } from "../../../../../types.js";

/**
 * PHP 教材: FizzBuzz (#100 / #112)。
 * 条件分岐 + ループ + echo の組み合わせを確認する典型課題。
 */
export const s0PhpCh00FizzBuzz: Assignment = {
  id: "S0-Php-Ch00-02-fizzbuzz",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 92,
  title: "PHP: FizzBuzz (1〜15)",
  newConcept: "if / elseif / else と for ループで条件分岐を出力する",
  estimatedMinutes: 8,
  difficulty: 1,
  testKind: "stdout",
  language: "php",
  entryFile: "main.php",
  starterFiles: [
    {
      path: "main.php",
      content: `<?php
// 1 から 15 までの整数 $n に対して、 以下のルールで 1 行ずつ出力してください。
// - $n が 3 と 5 の両方で割り切れる: FizzBuzz
// - $n が 3 でだけ割り切れる: Fizz
// - $n が 5 でだけ割り切れる: Buzz
// - それ以外: $n そのもの
// 各行の末尾には改行 ("\\n") を付けること。

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
    "`for ($n = 1; $n <= 15; $n++) { ... }` で 1〜15 のループになります。",
    "両方で割り切れる判定 (`$n % 15 === 0` または `$n % 3 === 0 && $n % 5 === 0`) を先に書きます。",
    "数値の echo は自動で文字列化されます (`echo $n, \"\\n\";`)。",
  ],
  solution: `<?php
for ($n = 1; $n <= 15; $n++) {
    if ($n % 15 === 0) {
        echo "FizzBuzz\\n";
    } elseif ($n % 3 === 0) {
        echo "Fizz\\n";
    } elseif ($n % 5 === 0) {
        echo "Buzz\\n";
    } else {
        echo $n, "\\n";
    }
}
`,
};
