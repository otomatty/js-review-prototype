import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const varLeaks: Assignment = {
  id: "var-leaks",
  topicId: "loops",
  title: "for ループの var を let に直す",
  difficulty: 2,
  description: `## for ループの var を let に直す

スコアの配列から、\`threshold\` 以上を取った最初の人の **順位（1 始まり）** を返す関数 \`firstWinnerRank\` を完成させてください。誰もクリアしていなければ \`null\` を返します。

### 学習ポイント

- \`for (var i ...)\` の \`i\` は **関数全体に漏れる** (var は関数スコープ)。
- \`for (let i ...)\` の \`i\` は **そのループの中だけで生きる** (let はブロックスコープ)。
- ループ内で結果を入れる変数は、 ループの **外で \`let\` で初期化** しておくのが定石。

### 現在のバグ

starter のコードは \`var rank = i + 1;\` と書いており、\`if\` を一度も通らないと \`rank\` は宣言すらされません。それなのに最後の \`return rank;\` が \`undefined\` を返してしまい、本来 \`null\` を返したいケースで失敗します。

### 入出力例

\`\`\`js
firstWinnerRank([60, 70, 80], 75)   // → 3
firstWinnerRank([60, 70, 80], 100)  // → null   ← starter ではここが undefined
firstWinnerRank([], 50)             // → null
firstWinnerRank([100], 50)          // → 1
\`\`\`

### 制約

- \`var\` を使わずに修正する（\`let\` / \`const\` を使う）
- \`rank\` はループの外で \`let rank = null;\` のように初期化する
`,
  starterCode: `// スコアの配列から、threshold 以上を取った最初の人の順位 (1 始まり) を返す。
// 誰もクリアしていなければ null。
//
// 例:
//   firstWinnerRank([60, 70, 80], 75)  → 3
//   firstWinnerRank([60, 70, 80], 100) → null   ← ここが undefined になってしまう
//
// バグの正体:
//   var で宣言された rank は、 if ブロックを抜けても関数全体に
//   生き残ります (= var は関数スコープ)。一方、誰もクリアしないと
//   そもそも var rank の行が一度も実行されず、rank は undefined のまま。
//   そのため return rank が null ではなく undefined になります。
//
// 修正:
//   - var をやめて let / const に置き換える。
//   - rank は「ループの外」で let rank = null; と初期化しておく。
function firstWinnerRank(scores, threshold) {
  for (var i = 0; i < scores.length; i++) {
    if (scores[i] >= threshold) {
      var rank = i + 1;
      break;
    }
  }
  return rank;
}
`,
  solution: `function firstWinnerRank(scores, threshold) {
  let rank = null;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] >= threshold) {
      rank = i + 1;
      break;
    }
  }
  return rank;
}
`,
  badSolutions: [
    {
      description: "var を残したまま return rank ?? null で帳尻合わせした",
      code: `function firstWinnerRank(scores, threshold) {
  for (var i = 0; i < scores.length; i++) {
    if (scores[i] >= threshold) {
      var rank = i + 1;
      break;
    }
  }
  return rank ?? null;
}
`,
    },
    {
      description: "誰もクリアしないとき undefined を返してしまう (修正不足)",
      code: `function firstWinnerRank(scores, threshold) {
  let rank;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] >= threshold) {
      rank = i + 1;
      break;
    }
  }
  return rank;
}
`,
    },
  ],
  entryPoints: ["firstWinnerRank"],
  tests: [
    {
      name: "途中でクリア",
      code: "firstWinnerRank([60, 70, 80], 75) === 3",
    },
    {
      name: "誰もクリアしない (null)",
      code: "firstWinnerRank([60, 70, 80], 100) === null",
    },
    {
      name: "空配列 (null)",
      code: "firstWinnerRank([], 50) === null",
    },
    {
      name: "先頭でクリア",
      code: "firstWinnerRank([100], 50) === 1",
    },
  ],
  eslint: {
    rules: { ...COMMON_LINT_RULES },
  },
  ast: {
    // starter に意図的に var を含むため、AST forbidden には var を入れない。
    // submission の var は Lint (no-var: error) で弾く。
    forbidden: [],
  },
  mdnSections: [
    {
      heading: "for 文",
      // for ループそのものの仕様
    },
    {
      heading: "変数のスコープ",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types",
      // 「var は関数スコープ、let はブロックスコープ」の解説
    },
  ],
};
