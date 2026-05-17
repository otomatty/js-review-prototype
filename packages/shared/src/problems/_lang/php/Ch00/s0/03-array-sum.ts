import type { Assignment } from "../../../../../types.js";

/**
 * PHP 教材: 配列の合計 (#100 / #112)。
 * 組み込み関数 `array_sum` と echo を組み合わせる。
 */
export const s0PhpCh00ArraySum: Assignment = {
  id: "S0-Php-Ch00-03-array-sum",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 93,
  title: "PHP: 配列の合計を求める",
  newConcept: "配列リテラルと組み込み関数 array_sum() で要素を集計する",
  estimatedMinutes: 5,
  difficulty: 1,
  testKind: "stdout",
  language: "php",
  entryFile: "main.php",
  starterFiles: [
    {
      path: "main.php",
      content: `<?php
$numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

// $numbers の合計を 1 行で出力してください (末尾に改行 1 つ)。

`,
    },
  ],
  description: `## やること

\`main.php\` の先頭で定義されている配列:

\`\`\`php
$numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
\`\`\`

について、 **要素の合計値** を 1 行だけ標準出力に書き出してください (末尾に改行 1 つ)。

## 期待される標準出力

\`\`\`
39
\`\`\`
`,
  tests: [
    {
      name: "$numbers の合計 39 を出力する",
      expectedStdout: "39\n",
    },
  ],
  hints: [
    "組み込み関数 `array_sum($配列)` で配列の合計を求められます。",
    "結果に改行を付けて echo します (`echo array_sum($numbers), \"\\n\";`)。",
  ],
  solution: `<?php
$numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
echo array_sum($numbers), "\\n";
`,
};
