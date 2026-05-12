import type { Assignment } from "../../../types.js";

export const s5Ch11ClimbStairs: Assignment = {
  id: "S5-Ch11-02-climb-stairs",
  stage: "S5",
  chapterId: "Ch11",
  sequence: 2,
  title: "階段の登り方を DP テーブルで数える (ボトムアップ DP)",
  newConcept:
    "漸化式を 「小さい i から順に配列を埋める」 ことで解く、 ボトムアップ動的計画法 (DP) の入口",
  estimatedMinutes: 50,
  difficulty: 2,
  testKind: "function",
  lintPreset: "S5",
  description: `## やること

\`n\` 段の階段を **1 段ずつ** か **2 段ずつ** で登るとき、 \`n\` 段目にちょうど到達する登り方の総数を返す関数 \`climbStairs\` を実装してください。

例: \`n = 3\` の場合は \`1+1+1\`、 \`1+2\`、 \`2+1\` の **3 通り** です。

\`\`\`js
climbStairs(0);   // → 1   (0 段 = 何もしない 1 通り)
climbStairs(1);   // → 1
climbStairs(2);   // → 2   (1+1, 2)
climbStairs(3);   // → 3   (1+1+1, 1+2, 2+1)
climbStairs(4);   // → 5
climbStairs(5);   // → 8
climbStairs(10);  // → 89
climbStairs(30);  // → 1346269  (素朴な再帰だと数秒〜だが、 DP なら一瞬)
\`\`\`

## ポイント — 漸化式と DP テーブル

\`n\` 段目に到達する直前は **\`n - 1\` 段目** (そこから 1 段) か **\`n - 2\` 段目** (そこから 2 段) のどちらかです。 だから:

\`\`\`
climbStairs(n) = climbStairs(n - 1) + climbStairs(n - 2)  (n >= 2)
climbStairs(0) = 1
climbStairs(1) = 1
\`\`\`

漸化式の形は前の問題のフィボナッチと **そっくり** ですが、 ベースケース (\`(0) = 1\`、 \`(1) = 1\`) が違います。

### ボトムアップで埋める

前の問題は 「上から潜って Map に覚える」 トップダウンでした。 今回は逆に **「下から順に DP テーブル (配列) を埋める」 ボトムアップ** で書きます。

1. \`const dp = [1, 1];\` のように、 \`dp[0]\` と \`dp[1]\` を初期化する
2. \`for (let i = 2; i <= n; i++) { dp[i] = dp[i - 1] + dp[i - 2]; }\` で順に埋める
3. \`return dp[n];\`

これだけで O(N) になります。 \`n = 30\` でも一瞬で返ります。

| 実装 | 計算量 | \`climbStairs(30)\` の実行時間 (目安) |
|---|---|---|
| 素朴な再帰 (メモなし) | O(2^N) | 1 秒以上 (テストでタイムアウト) |
| **DP テーブル (この問題)** | **O(N)** | ミリ秒未満 |

## 設計強制

- AST で **\`for\` 文の使用を必須** にしています。 「素朴な再帰だけ」 では required を満たしません。
- これは S5 (設計演習) なので 「漸化式をどう実装に落とすか」 を問います。 ループの中で **配列の前の要素を参照しながら埋める** 流れを身につけてください。

## ヒント

- 配列ではなく **「2 つの変数を使い回す」** 書き方 (O(N) 時間 / O(1) 空間) もありますが、 この問題では **配列を使う DP の典型形** をまず練習します (より高次元の DP へ自然に拡張できる)。
- ベースケースを \`n === 0\` や \`n === 1\` のときに早期 return してから for に入っても問題ありません。 \`const dp = [1, 1];\` で長さ 2 の初期配列を作り、 \`n < 2\` のときは \`dp[n]\` を返せばよいです。
`,
  starterCode: `function climbStairs(n) {
  // dp テーブルを [1, 1] で初期化する (dp[0] と dp[1])


  // for で i = 2 から n まで順に dp[i] = dp[i - 1] + dp[i - 2] を埋める


  // dp[n] を return する
}
`,
  entryPoints: ["climbStairs"],
  demoCall: `console.log(climbStairs(10));`,
  tests: [
    {
      name: "climbStairs(0) は 1",
      code: `climbStairs(0) === 1`,
    },
    {
      name: "climbStairs(1) は 1",
      code: `climbStairs(1) === 1`,
    },
    {
      name: "climbStairs(2) は 2",
      code: `climbStairs(2) === 2`,
    },
    {
      name: "climbStairs(3) は 3",
      code: `climbStairs(3) === 3`,
    },
    {
      name: "climbStairs(4) は 5",
      code: `climbStairs(4) === 5`,
    },
    {
      name: "climbStairs(5) は 8",
      code: `climbStairs(5) === 8`,
    },
    {
      name: "climbStairs(10) は 89",
      code: `climbStairs(10) === 89`,
    },
    {
      name: "climbStairs(30) でも O(N) で一瞬で返る (1346269)",
      code: `climbStairs(30) === 1346269`,
    },
  ],
  hints: [
    "1) const dp = [1, 1]; を用意する (dp[0]=1, dp[1]=1)。 2) for (let i = 2; i <= n; i++) { dp[i] = dp[i - 1] + dp[i - 2]; }。 3) return dp[n]; だけ。",
    "解答例:\n```js\nfunction climbStairs(n) {\n  const dp = [1, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n  }\n  return dp[n];\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で総数を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "function climbStairs を宣言する" },
        { kind: "node", nodeType: "ForStatement", label: "for で DP テーブルを順に埋める" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function climbStairs(n) {
  const dp = [1, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
`,
  badSolutions: [
    {
      code: `function climbStairs(n) {
  if (n < 2) {
    return 1;
  }
  return climbStairs(n - 1) + climbStairs(n - 2);
}
`,
      description: "素朴な再帰 (メモなし) で O(2^N)。 AST required (ForStatement) を満たさず、 さらに climbStairs(30) がタイムアウトする (テスト失敗)",
    },
    {
      code: `function climbStairs(n) {
  const dp = [1, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n - 1];
}
`,
      description: "最後に dp[n] ではなく dp[n - 1] を返しており、 全ケースで 1 つずれる (テスト失敗)",
    },
    {
      code: `function climbStairs(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
`,
      description: "ベースケースを dp[0]=0, dp[1]=1 (フィボナッチと混同) にしてしまい、 climbStairs(0)/(1)/(2) が合わない (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "配列",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array",
      pageTitle: "Array",
    },
    {
      heading: "for 文",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for",
      pageTitle: "for",
    },
  ],
};
