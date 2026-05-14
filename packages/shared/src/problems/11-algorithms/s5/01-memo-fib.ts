import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s5Ch11MemoFib: Assignment = {
  id: "S5-Ch11-01-memo-fib",
  stage: "S5",
  chapterId: "Ch11",
  sequence: 1,
  title: "メモ化でフィボナッチを高速化する (トップダウン DP)",
  newConcept:
    "Map をキャッシュとして使い、 同じ部分問題を 2 度計算しない — O(2^N) の素朴な再帰を O(N) にするトップダウン DP の入口",
  estimatedMinutes: 45,
  difficulty: 2,
  testKind: "function",
  lintPreset: "S5",
  description: `## やること

**0 以上の整数** \`n\` を受け取り、 \`n\` 番目のフィボナッチ数を返す関数 \`fibMemo\` を、 **再帰 + \`Map\` によるメモ化** で実装してください。 定義は S4 と同じ:

- \`fibMemo(0) === 0\`
- \`fibMemo(1) === 1\`
- \`fibMemo(n) === fibMemo(n - 1) + fibMemo(n - 2)\` (\`n >= 2\` のとき)

\`\`\`js
fibMemo(0);    // → 0
fibMemo(1);    // → 1
fibMemo(10);   // → 55
fibMemo(30);   // → 832040
fibMemo(50);   // → 12586269025  (素朴な再帰だと数十秒〜だが、 メモ化なら一瞬)
\`\`\`

## ポイント — 計算量の比較

| 実装 | 計算量 | \`fib(50)\` の実行時間 (目安) |
|---|---|---|
| S4 の素朴な再帰 | **O(2^N)** | 数十秒〜分 (実用外) |
| **メモ化再帰 (この問題)** | **O(N)** | ミリ秒未満 |
| ボトムアップ DP (次の問題) | O(N) | ミリ秒未満 |

S4 の \`fib\` は \`fib(n - 1)\` と \`fib(n - 2)\` を呼ぶたびに **同じ \`fib(k)\` を何度も計算し直していた** ため指数時間でした。 例えば \`fib(5)\` を計算する過程で \`fib(2)\` は 3 回、 \`fib(1)\` は 5 回計算されます。 \`n\` が大きくなるとこの無駄が爆発します。

**メモ化 (memoization) は** 「一度計算した \`fib(k)\` を \`Map\` に覚えておき、 2 回目以降はそれを返す」 設計です。 こうすると各 \`k\` を最大 1 回しか計算しないため O(N) になります。

## 実装の骨組み

1. 関数の中で **\`const cache = new Map();\`** を用意する (関数が呼ばれるたびに新しい Map を作るのが安全)
2. 内側の **再帰ヘルパ** を用意する。 \`k\` を受け取り次のように動く:
   - ベースケース: \`k < 2\` なら \`k\` を返す
   - **\`cache.has(k)\`** なら **\`cache.get(k)\`** を返す
   - そうでなければ \`helper(k - 1) + helper(k - 2)\` を計算して **\`cache.set(k, value)\`** で保存してから返す
3. 最後に \`helper(n)\` を return する

## 設計強制

- AST で **\`Map\` の \`has\` / \`set\` / \`get\` の使用を必須** にしています。 普通のオブジェクト (\`{}\`) で代用すると required を満たしません。
- **\`for\` / \`while\` / \`for...of\` などのループ構文は禁止** (この問題はあくまで 「再帰 + メモ化」 を学ぶ場です。 ループでの DP は次の問題で扱います)。

## ヒント

- 内側のヘルパは **アロー関数** で書いてもよいし、 デフォルト引数で cache を受け渡してもよい (例: \`function fibMemo(n, cache = new Map()) {...}\`)。
- \`cache.has(k)\` と \`cache.get(k)\` をセットで使うのが定石。 \`cache.get(k)\` だけだと未登録のとき \`undefined\` が返るので分岐が複雑になります。
`,
  starterFiles: singleFile(`function fibMemo(n) {
  // new Map() でキャッシュを用意する


  // 再帰ヘルパを定義する (引数は k)
  //   ベースケース: k < 2 なら k を返す
  //   cache.has(k) なら cache.get(k) を返す
  //   そうでなければ helper(k - 1) + helper(k - 2) を計算
  //   結果を cache.set(k, value) で保存してから返す


  // ヘルパに n を渡して return する
}
`),
  entryPoints: ["fibMemo"],
  demoCall: `console.log(fibMemo(50));`,
  tests: [
    {
      name: "fibMemo(0) は 0",
      code: `fibMemo(0) === 0`,
    },
    {
      name: "fibMemo(1) は 1",
      code: `fibMemo(1) === 1`,
    },
    {
      name: "fibMemo(2) は 1",
      code: `fibMemo(2) === 1`,
    },
    {
      name: "fibMemo(10) は 55",
      code: `fibMemo(10) === 55`,
    },
    {
      name: "fibMemo(20) は 6765",
      code: `fibMemo(20) === 6765`,
    },
    {
      name: "fibMemo(30) は 832040",
      code: `fibMemo(30) === 832040`,
    },
    {
      name: "fibMemo(50) でも O(N) で一瞬で返る (12586269025)",
      code: `fibMemo(50) === 12586269025`,
    },
    {
      name: "連続して呼んでも正しい値が返る (キャッシュが汚れない)",
      code: `fibMemo(10) === 55 && fibMemo(15) === 610 && fibMemo(20) === 6765`,
    },
  ],
  hints: [
    "1) const cache = new Map(); を関数の先頭で作る。 2) 内側に再帰ヘルパ helper(k) を書く。 3) k < 2 なら k を返す。 4) cache.has(k) なら cache.get(k) を返す。 5) そうでなければ helper(k - 1) + helper(k - 2) を計算し、 cache.set(k, value) してから返す。",
    "解答例:\n```js\nfunction fibMemo(n) {\n  const cache = new Map();\n  const helper = (k) => {\n    if (k < 2) {\n      return k;\n    }\n    if (cache.has(k)) {\n      return cache.get(k);\n    }\n    const value = helper(k - 1) + helper(k - 2);\n    cache.set(k, value);\n    return value;\n  };\n  return helper(n);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "function fibMemo を宣言する" },
        { kind: "node", nodeType: "NewExpression", label: "new Map() でキャッシュを作る" },
        { kind: "method", name: "has", label: "Map.has でキャッシュ済みかを判定する" },
        { kind: "method", name: "get", label: "Map.get でキャッシュから取り出す" },
        { kind: "method", name: "set", label: "Map.set で結果をキャッシュする" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
        { kind: "node", nodeType: "ForStatement", label: "for ループを使わない (再帰 + メモ化で書く)" },
        { kind: "node", nodeType: "WhileStatement", label: "while ループを使わない (再帰 + メモ化で書く)" },
        { kind: "node", nodeType: "ForOfStatement", label: "for...of を使わない (再帰 + メモ化で書く)" },
        { kind: "node", nodeType: "ForInStatement", label: "for...in を使わない (再帰 + メモ化で書く)" },
        { kind: "node", nodeType: "DoWhileStatement", label: "do-while を使わない (再帰 + メモ化で書く)" },
      ],
    },
  },
  solution: `function fibMemo(n) {
  const cache = new Map();
  const helper = (k) => {
    if (k < 2) {
      return k;
    }
    if (cache.has(k)) {
      return cache.get(k);
    }
    const value = helper(k - 1) + helper(k - 2);
    cache.set(k, value);
    return value;
  };
  return helper(n);
}
`,
  badSolutions: [
    {
      code: `function fibMemo(n) {
  if (n < 2) {
    return n;
  }
  return fibMemo(n - 1) + fibMemo(n - 2);
}
`,
      description: "メモ化していない素朴な再帰。 Map を使っていないので AST required (has / set / get / new Map) を満たさず、 さらに fibMemo(50) がタイムアウトする (テスト失敗)",
    },
    {
      code: `function fibMemo(n) {
  const cache = {};
  const helper = (k) => {
    if (k < 2) {
      return k;
    }
    if (cache[k] !== undefined) {
      return cache[k];
    }
    cache[k] = helper(k - 1) + helper(k - 2);
    return cache[k];
  };
  return helper(n);
}
`,
      description: "Map ではなく普通のオブジェクト {} をキャッシュにしているため、 .has / .get / .set / new Map が使われず AST required 違反",
    },
  ],
  mdnSections: [
    {
      heading: "Map",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map",
      pageTitle: "Map",
    },
    {
      heading: "function 宣言",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/function",
      pageTitle: "function 宣言",
    },
  ],
};
