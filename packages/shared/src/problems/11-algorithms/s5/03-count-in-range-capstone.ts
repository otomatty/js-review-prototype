import type { Assignment } from "../../../types.js";

export const s5Ch11CountInRangeCapstone: Assignment = {
  id: "S5-Ch11-03-count-in-range-capstone",
  stage: "S5",
  chapterId: "Ch11",
  sequence: 3,
  title: "[卒業課題] 二分探索でソート済み配列の範囲内要素数を数える",
  newConcept:
    "二分探索を 「等しい値を 1 つ探す」 から 「下限の境界を探す (lower_bound)」 へ拡張し、 2 回の二分探索で範囲集計を O(log N) で行う設計演習",
  estimatedMinutes: 70,
  difficulty: 3,
  testKind: "function",
  lintPreset: "S5",
  isCapstone: true,
  description: `## やること

**昇順にソート済みの整数配列** \`sortedArr\` と整数 \`lo\`、 \`hi\` (\`lo <= hi\` が前提) を受け取り、 \`sortedArr\` の中で **\`lo <= x <= hi\` を満たす要素の個数** を返す関数 \`countInRange\` を、 **二分探索を使って O(log N) で** 実装してください。

\`\`\`js
countInRange([1, 3, 5, 7, 9], 3, 7);        // → 3   (3, 5, 7)
countInRange([1, 3, 5, 7, 9], 4, 6);        // → 1   (5 のみ)
countInRange([1, 3, 5, 7, 9], 10, 100);     // → 0   (範囲外)
countInRange([1, 3, 5, 7, 9], 0, 10);       // → 5   (全部)
countInRange([], 0, 10);                    // → 0   (空配列)
countInRange([2, 2, 2, 5, 5, 9], 2, 5);     // → 5   (重複あり)
countInRange([1, 3, 5, 7, 9], 5, 5);        // → 1   (単一値)
\`\`\`

## ポイント — S4 の二分探索を 「境界探索」 へ発展させる

S4 の \`binarySearch\` は 「値が **等しい** 添字を 1 つ返す」 ものでした。 S5 では、 これを **「ある条件を満たす最小の添字」** を探す形に拡張します。 これを **lower_bound** と呼びます。

### lower_bound (target 以上の最小の添字)

| 配列 | target | lower_bound の結果 |
|---|---|---|
| \`[1, 3, 5, 7, 9]\` | \`3\` | \`1\` (\`3\` の位置) |
| \`[1, 3, 5, 7, 9]\` | \`4\` | \`2\` (\`5\` の位置 = 4 以上の最初) |
| \`[2, 2, 2, 5, 5, 9]\` | \`2\` | \`0\` (最初の \`2\`) |
| \`[1, 3, 5, 7, 9]\` | \`100\` | \`5\` (= 配列の長さ = どこにもない) |

### 範囲集計のトリック

整数なら、 範囲 \`[lo, hi]\` の個数は次のように **2 回の lower_bound** で求まります:

\`\`\`
countInRange = lowerBound(hi + 1) - lowerBound(lo)
\`\`\`

- \`lowerBound(lo)\` は 「\`lo\` 以上の最小の添字」 = 範囲の **左端**
- \`lowerBound(hi + 1)\` は 「\`hi + 1\` 以上の最小の添字」 = 範囲の **右端の次** (= \`hi\` 以下の最後の添字 + 1)
- その差が個数になる

### 計算量の比較

| 実装 | 計算量 | \`N = 1,000,000\` での比較回数 (目安) |
|---|---|---|
| \`filter\` で線形走査 | **O(N)** | 100 万回 |
| **二分探索 (この問題)** | **O(log N)** | 2 回 × 20 ≒ **40 回** |

S4 ではバブルソート (O(N²)) と組込みソート (O(N log N)) を比べました。 ここでは 「同じ集計問題でも、 ソート済みかどうかで O(N) から O(log N) へ落とせる」 ことを体感してください。

## 設計強制

- AST で **\`while\` と \`Math.floor\` の使用を必須** にしています。 「\`while\` で範囲を半分にする」 二分探索の骨組みを書く練習です。
- **\`Array.filter\` / \`Array.indexOf\` は禁止** しています。 1 行で済む組込みではなく、 自分で境界探索を組み立ててください。

## 実装の骨組み

1. ヘルパ \`lowerBound(target)\` を関数内に書く:
   1. \`let left = 0; let right = sortedArr.length;\` で初期化 (**\`right\` は \`length\`** — \`length - 1\` ではない点に注意。 「target がどこにもない」 とき \`length\` を返したいため)
   2. \`while (left < right)\` の中で、 \`mid = Math.floor((left + right) / 2)\`
   3. \`sortedArr[mid] < target\` なら \`left = mid + 1\`、 そうでなければ \`right = mid\`
   4. ループを抜けたら \`left\` を返す
2. \`countInRange\` 本体は **\`lowerBound(hi + 1) - lowerBound(lo)\`** を返すだけ

## ヒント

- 「等号を含む \`<=\` か、 含まない \`<\` か」 で境界の意味が変わります。 lower_bound は **「target 未満の間は左を動かす」 = \`< target\`** が正しいです。
- 空配列のときは \`left = 0\`、 \`right = 0\` のままループに入らず、 結果は \`0 - 0 === 0\`。 自動的に正しく動きます。
`,
  starterCode: `function countInRange(sortedArr, lo, hi) {
  // ヘルパ lowerBound(target) を関数内に定義する
  //   1) left = 0, right = sortedArr.length で初期化
  //   2) while (left < right) で、 mid = Math.floor((left + right) / 2)
  //   3) sortedArr[mid] < target なら left = mid + 1、 そうでなければ right = mid
  //   4) ループを抜けたら left を返す


  // countInRange 本体は lowerBound(hi + 1) - lowerBound(lo) を返す
}
`,
  entryPoints: ["countInRange"],
  demoCall: `console.log(countInRange([1, 3, 5, 7, 9], 3, 7));`,
  tests: [
    {
      name: "範囲内に 3 個 [1,3,5,7,9] の 3..7",
      code: `countInRange([1, 3, 5, 7, 9], 3, 7) === 3`,
    },
    {
      name: "範囲内に 1 個 (中央だけ) [1,3,5,7,9] の 4..6",
      code: `countInRange([1, 3, 5, 7, 9], 4, 6) === 1`,
    },
    {
      name: "範囲外 (大きすぎ) は 0",
      code: `countInRange([1, 3, 5, 7, 9], 10, 100) === 0`,
    },
    {
      name: "範囲外 (小さすぎ) は 0",
      code: `countInRange([1, 3, 5, 7, 9], -10, -1) === 0`,
    },
    {
      name: "全要素を含む範囲は length",
      code: `countInRange([1, 3, 5, 7, 9], 0, 10) === 5`,
    },
    {
      name: "空配列は常に 0",
      code: `countInRange([], 0, 10) === 0`,
    },
    {
      name: "重複値を含む [2,2,2,5,5,9] の 2..5 は 5",
      code: `countInRange([2, 2, 2, 5, 5, 9], 2, 5) === 5`,
    },
    {
      name: "lo === hi の単一値 [1,3,5,7,9] の 5..5 は 1",
      code: `countInRange([1, 3, 5, 7, 9], 5, 5) === 1`,
    },
    {
      name: "lo === hi で存在しない値は 0",
      code: `countInRange([1, 3, 5, 7, 9], 4, 4) === 0`,
    },
    {
      name: "境界値: lo が配列の最小値ちょうど",
      code: `countInRange([1, 3, 5, 7, 9], 1, 5) === 3`,
    },
    {
      name: "境界値: hi が配列の最大値ちょうど",
      code: `countInRange([1, 3, 5, 7, 9], 5, 9) === 3`,
    },
    {
      name: "大規模配列 (10000 要素) でも正しく O(log N) で動く",
      code: `(() => { const arr = []; for (let i = 0; i < 10000; i++) { arr.push(i); } return countInRange(arr, 100, 5000) === 4901; })()`,
    },
  ],
  hints: [
    "ヘルパ lowerBound(target) は left=0, right=sortedArr.length で始め、 while (left < right) の中で mid=Math.floor((left+right)/2) を取り、 sortedArr[mid] < target なら left=mid+1、 そうでなければ right=mid。 抜けたら left を返す。",
    "範囲集計は lowerBound(hi + 1) - lowerBound(lo) です。 +1 を忘れると hi に一致する要素が数え漏れます (特に重複値ケース)。",
    "解答例:\n```js\nfunction countInRange(sortedArr, lo, hi) {\n  const lowerBound = (target) => {\n    let left = 0;\n    let right = sortedArr.length;\n    while (left < right) {\n      const mid = Math.floor((left + right) / 2);\n      if (sortedArr[mid] < target) {\n        left = mid + 1;\n      } else {\n        right = mid;\n      }\n    }\n    return left;\n  };\n  return lowerBound(hi + 1) - lowerBound(lo);\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で個数を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "function countInRange を宣言する" },
        { kind: "node", nodeType: "WhileStatement", label: "while で探索範囲を半分にする (二分探索)" },
        { kind: "method", name: "floor", label: "Math.floor で真ん中の添字を計算する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
        { kind: "method", name: "filter", label: "filter での線形走査を禁止 (二分探索で書く)" },
        { kind: "method", name: "indexOf", label: "Array.indexOf を使わない (二分探索を自分で書く)" },
      ],
    },
  },
  solution: `function countInRange(sortedArr, lo, hi) {
  const lowerBound = (target) => {
    let left = 0;
    let right = sortedArr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedArr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  };
  return lowerBound(hi + 1) - lowerBound(lo);
}
`,
  badSolutions: [
    {
      code: `function countInRange(sortedArr, lo, hi) {
  return sortedArr.filter((x) => x >= lo && x <= hi).length;
}
`,
      description: "filter で線形走査しており、 二分探索になっていない (AST forbidden 違反 + required の WhileStatement / Math.floor 不足)",
    },
    {
      code: `function countInRange(sortedArr, lo, hi) {
  const lowerBound = (target) => {
    let left = 0;
    let right = sortedArr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedArr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  };
  return lowerBound(hi) - lowerBound(lo);
}
`,
      description: "lowerBound(hi + 1) ではなく lowerBound(hi) を引いており、 hi に一致する要素を数え漏れる (重複値ケースなどで失敗)",
    },
    {
      code: `function countInRange(sortedArr, lo, hi) {
  const lowerBound = (target) => {
    let left = 0;
    let right = sortedArr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedArr[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  };
  return lowerBound(hi + 1) - lowerBound(lo);
}
`,
      description: "境界比較を < ではなく <= にしており、 実装が lower_bound ではなく upper_bound になっている。 範囲集計の式と整合せず、 多くのケースで 1 ずれる (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Math.floor",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/floor",
      pageTitle: "Math.floor",
    },
    {
      heading: "while",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/while",
      pageTitle: "while",
    },
    {
      heading: "function 宣言",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/function",
      pageTitle: "function 宣言",
    },
  ],
};
