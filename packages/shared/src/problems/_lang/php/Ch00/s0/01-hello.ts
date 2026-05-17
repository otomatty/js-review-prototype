import type { Assignment } from "../../../../../types.js";

/**
 * PHP 教材の動作確認用 入門課題 (#100 / #112)。
 *
 * php-wasm (WebAssembly 上の PHP CLI) で実行される。 採点ランナは課題ごとに学習者ファイルを
 * 仮想 FS (`/jsreview/main.php`) に書き込み、 ラッパスクリプトから require して実行 →
 * 捕捉した stdout を期待値と比較する。
 */
export const s0PhpCh00Hello: Assignment = {
  id: "S0-Php-Ch00-01-hello",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 91,
  title: "PHP: Hello, World! を表示する",
  newConcept: "echo で文字列を標準出力に書き出す",
  estimatedMinutes: 3,
  difficulty: 1,
  testKind: "stdout",
  language: "php",
  entryFile: "main.php",
  starterFiles: [
    {
      path: "main.php",
      content: `<?php
// echo で "Hello, World!" を出力してください。 末尾に改行を 1 つ入れること。

`,
    },
  ],
  description: `## やること

\`main.php\` で **\`Hello, World!\`** という文字列を 1 行だけ出力してください (末尾に改行 1 つ)。

## 期待される標準出力

\`\`\`
Hello, World!
\`\`\`

## ヒント

PHP では \`echo "文字列";\` で標準出力に書き出します。 末尾改行は自動では入らないので、
\`"\\n"\` または改行を含むダブルクォート文字列で明示的に付ける必要があります。
`,
  tests: [
    {
      name: "Hello, World! を出力する",
      expectedStdout: "Hello, World!\n",
    },
  ],
  hints: [
    "`echo \"Hello, World!\\n\";` と書きます。",
    "シングルクォート (`'...'`) では `\\n` がリテラルの 2 文字として出てしまうため、 ダブルクォートを使います。",
  ],
  solution: `<?php
echo "Hello, World!\\n";
`,
};
