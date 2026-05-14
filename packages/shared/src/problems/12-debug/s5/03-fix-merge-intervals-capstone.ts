import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s5Ch12FixMergeIntervalsCapstone: Assignment = {
  id: "S5-Ch12-03-fix-merge-intervals-capstone",
  stage: "S5",
  chapterId: "Ch12",
  sequence: 3,
  title: "[卒業課題][デバッグ] 数値区間マージの境界バグを 4 箇所まとめて直す",
  newConcept:
    "**入力境界 (空 / 単一 / 隣接 / 包含 / 未ソート)** の処理漏れを全方位で洗い出す。 1 つ修正したら次の境界テストが落ちる、 を 4 周回す統合デバッグ",
  estimatedMinutes: 85,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

\`mergeIntervals(intervals)\` は **数値区間 \`[start, end]\` の配列** を受け取り、 **重なる / 隣接する区間をマージ** して非重複な区間配列を返す関数です。 現状のコードは「典型的なケース」 だけは通りますが、 **入力境界** (空・単一・隣接・包含・未ソート) で軒並み壊れています。 仕様どおりに動くように修正してください。

### 仕様

- \`intervals\` は \`[[start1, end1], [start2, end2], ...]\` の形 (\`start <= end\`)。
- 戻り値は **start の昇順** にソートされた、 **互いに重ならない区間** の配列。
- **重なり / 隣接の定義**: \`current[0] <= last[1]\` をマージ条件とする (両端を含む。 例: \`[1,2]\` と \`[2,3]\` は \`[1,3]\` にマージされる)。
- **入力は未ソートでもよい**。 関数内部でソートして処理する。
- **入力配列・入力区間は破壊しない** (内部で \`slice\` などでコピーしてからソートする)。

### 期待値 vs 現状

\`\`\`js
mergeIntervals([]);
// 期待: []
// 現状: TypeError (空配列に sorted[0] アクセス)

mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]);
// 期待: [[1, 6], [8, 10], [15, 18]]
// 現状: 偶然これだけは正しく見える (typical case)

mergeIntervals([[1, 4], [0, 2], [3, 5]]);
// 期待: [[0, 5]]   (start で並び替えてからマージ)
// 現状: [[1, 4], [0, 2], [3, 5]] のような壊れた結果 (ソートしていない)

mergeIntervals([[1, 2], [2, 3]]);
// 期待: [[1, 3]]   (隣接はマージ)
// 現状: [[1, 2], [2, 3]] (current[0] < last[1] で「等しい」 を弾いている)

mergeIntervals([[1, 10], [2, 3]]);
// 期待: [[1, 10]]  (完全に内側に含まれる)
// 現状: [[1, 3]]   (Math.max を忘れて end を縮めてしまう)
\`\`\`

## ポイント

- バグは **4 箇所** ある: (a) **空配列**、 (b) **未ソート**、 (c) **隣接区間**、 (d) **包含区間**。 1 つ直しても次の境界テストが落ちる構造。 失敗テストを 1 件ずつ潰し、 修正後に他のテストが新たに落ちていないかを毎回確認する。
- **空配列** は「\`length === 0\` なら早期 return \`[]\`」 が定石。 これを忘れると最初の \`sorted[0][0]\` で TypeError。
- **未ソート** は \`intervals.slice().sort((a, b) => a[0] - b[0])\` で対処。 \`slice()\` を入れないと元配列を破壊する (\`Array.prototype.sort\` は破壊的)。 また数値ソートは **比較関数必須** (\`sort()\` だけでは文字列順)。
- **隣接区間** は仕様で「重なり扱い」 と決まっている。 \`<\` を \`<=\` に直すだけ。 仕様書に明記された境界 (\`<=\`) を実装の演算子 (\`<\`) と照らし合わせる。
- **包含区間** は「現在の区間が前の区間に飲み込まれる」 ケース。 \`last[1] = current[1]\` と書くと \`current[1]\` が小さいとき \`last\` の右端が縮む。 \`last[1] = Math.max(last[1], current[1])\` が正解。
- バグの探し方は **「テスト失敗 → 入力をペーパー上でトレース → どの行で結果が崩れるか特定 → 仕様と照合」** の繰り返し。
- 一度に全部直そうとせず、 **空配列 → 未ソート → 隣接 → 包含** の順に潰すと差分が見やすい。

## 制約

- 関数名は \`mergeIntervals\` のまま。 引数は配列 1 つ。
- 入力 \`intervals\` 自体、 および各区間 \`intervals[i]\` を破壊しない。 ソート前に \`slice\` でコピーし、 結果配列に push するときも新しい区間オブジェクト \`[a, b]\` を作る (現状コードも既に \`[current[0], current[1]]\` で push しているのでこれは継承)。
- 計算量は \`O(n log n)\` (ソートが支配)。 二重ループは不要。
- 戻り値は **新しい配列** (元の入力を返さない)。
`,
  starterFiles: singleFile(`function mergeIntervals(intervals) {
  const sorted = intervals;
  const result = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const current = sorted[i];
    if (current[0] < last[1]) {
      last[1] = current[1];
    } else {
      result.push([current[0], current[1]]);
    }
  }
  return result;
}
`),
  entryPoints: ["mergeIntervals"],
  demoCall: `console.log(JSON.stringify(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])));`,
  tests: [
    {
      name: "空配列は空配列を返す",
      code: `JSON.stringify(mergeIntervals([])) === JSON.stringify([])`,
    },
    {
      name: "単一区間はそのまま (新しい配列として)",
      code: `(() => {
        const input = [[1, 5]];
        const result = mergeIntervals(input);
        return result !== input
          && result[0] !== input[0]
          && JSON.stringify(result) === JSON.stringify([[1, 5]]);
      })()`,
    },
    {
      name: "重なる 2 区間はマージされる",
      code: `JSON.stringify(mergeIntervals([[1, 4], [2, 6]])) === JSON.stringify([[1, 6]])`,
    },
    {
      name: "重ならない 2 区間はそのまま 2 件",
      code: `JSON.stringify(mergeIntervals([[1, 3], [5, 8]])) === JSON.stringify([[1, 3], [5, 8]])`,
    },
    {
      name: "隣接区間 [1,2], [2,3] は [1,3] にマージされる",
      code: `JSON.stringify(mergeIntervals([[1, 2], [2, 3]])) === JSON.stringify([[1, 3]])`,
    },
    {
      name: "完全に含まれる [1,10] と [2,3] は [1,10] になる (end を縮めない)",
      code: `JSON.stringify(mergeIntervals([[1, 10], [2, 3]])) === JSON.stringify([[1, 10]])`,
    },
    {
      name: "未ソート入力でも start 昇順にマージできる",
      code: `JSON.stringify(mergeIntervals([[1, 4], [0, 2], [3, 5]])) === JSON.stringify([[0, 5]])`,
    },
    {
      name: "Leetcode 風: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]",
      code: `JSON.stringify(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])) === JSON.stringify([[1, 6], [8, 10], [15, 18]])`,
    },
    {
      name: "全部つながる: [[1,4],[4,5]] → [[1,5]]",
      code: `JSON.stringify(mergeIntervals([[1, 4], [4, 5]])) === JSON.stringify([[1, 5]])`,
    },
    {
      name: "同一区間の重複は 1 件に潰す",
      code: `JSON.stringify(mergeIntervals([[1, 4], [1, 4]])) === JSON.stringify([[1, 4]])`,
    },
    {
      name: "元の入力配列を破壊しない",
      code: `(() => {
        const input = [[3, 5], [1, 2], [4, 8]];
        const before = JSON.stringify(input);
        mergeIntervals(input);
        return JSON.stringify(input) === before;
      })()`,
    },
    {
      name: "元の区間オブジェクトを破壊しない (内側の配列も別インスタンス)",
      code: `(() => {
        const a = [1, 4];
        const b = [2, 6];
        mergeIntervals([a, b]);
        return JSON.stringify(a) === JSON.stringify([1, 4])
          && JSON.stringify(b) === JSON.stringify([2, 6]);
      })()`,
    },
  ],
  hints: [
    "失敗しているテストを 1 件ずつ拾い、 **入力をペーパー上でトレース** して、 どの行で答えが崩れるかを特定する。 4 箇所ある。",
    "**(a) 空配列**: 関数冒頭で `if (intervals.length === 0) return [];` を入れる。 これを入れないと `sorted[0][0]` で TypeError。",
    "**(b) 未ソート**: `intervals.slice().sort((a, b) => a[0] - b[0])` に置き換える。 `slice()` を忘れると入力を破壊する。 `sort()` だけだと文字列順になるので比較関数 `(a, b) => a[0] - b[0]` が必須。",
    "**(c) 隣接**: マージ条件は仕様で `current[0] <= last[1]` (両端を含む)。 `<` を `<=` に直す。",
    "**(d) 包含**: `last[1] = current[1]` は \"飲み込まれる\" ケースで end を縮める。 `last[1] = Math.max(last[1], current[1])` に直す。",
    "解答例:\n```js\nfunction mergeIntervals(intervals) {\n  if (intervals.length === 0) {\n    return [];\n  }\n  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);\n  const result = [[sorted[0][0], sorted[0][1]]];\n  for (let i = 1; i < sorted.length; i++) {\n    const last = result[result.length - 1];\n    const current = sorted[i];\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      result.push([current[0], current[1]]);\n    }\n  }\n  return result;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "FunctionDeclaration", label: "function 宣言で mergeIntervals を書く" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で配列を返す" },
        { kind: "method", name: "sort", label: "未ソート入力に対処するため sort を使う" },
        { kind: "method", name: "slice", label: "入力配列を破壊しないよう slice でコピーする" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function mergeIntervals(intervals) {
  if (intervals.length === 0) {
    return [];
  }
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const result = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const current = sorted[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push([current[0], current[1]]);
    }
  }
  return result;
}
`,
  badSolutions: [
    {
      code: `function mergeIntervals(intervals) {
  const sorted = intervals;
  const result = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const current = sorted[i];
    if (current[0] < last[1]) {
      last[1] = current[1];
    } else {
      result.push([current[0], current[1]]);
    }
  }
  return result;
}
`,
      description: "元のバグそのまま (空 / 未ソート / 隣接 / 包含 の 4 箇所すべて未対応)",
    },
    {
      code: `function mergeIntervals(intervals) {
  if (intervals.length === 0) {
    return [];
  }
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const result = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const current = sorted[i];
    if (current[0] < last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push([current[0], current[1]]);
    }
  }
  return result;
}
`,
      description: "空 / 未ソート / 包含は直したが、 隣接条件を `<=` ではなく `<` のままにしている (`[[1,2],[2,3]] → [[1,3]]` テスト失敗)",
    },
    {
      code: `function mergeIntervals(intervals) {
  if (intervals.length === 0) {
    return [];
  }
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const result = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const current = sorted[i];
    if (current[0] <= last[1]) {
      last[1] = current[1];
    } else {
      result.push([current[0], current[1]]);
    }
  }
  return result;
}
`,
      description: "空 / 未ソート / 隣接は直したが、 包含時に `Math.max` を使わず end を縮めてしまう (`[[1,10],[2,3]] → [[1,10]]` テスト失敗)",
    },
    {
      code: `function mergeIntervals(intervals) {
  if (intervals.length === 0) {
    return [];
  }
  const sorted = intervals.sort((a, b) => a[0] - b[0]);
  const result = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const current = sorted[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push([current[0], current[1]]);
    }
  }
  return result;
}
`,
      description: "slice() を忘れて入力配列を直接 sort しているため、 元の input が並び替わる (「元の入力配列を破壊しない」 テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Array.prototype.sort",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
      pageTitle: "Array.prototype.sort",
    },
    {
      heading: "Array.prototype.slice",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice",
      pageTitle: "Array.prototype.slice",
    },
    {
      heading: "Math.max",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/max",
      pageTitle: "Math.max",
    },
  ],
};
