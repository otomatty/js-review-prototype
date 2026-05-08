import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const collections: Assignment[] = [
  // ────────────────────────────────────────────────
  // 15-1: Set で重複除去
  // ────────────────────────────────────────────────
  {
    id: "unique",
    topicId: "collections",
    title: "Set で重複を除去する",
    difficulty: 1,
    description: `## Set で重複を除去する

配列を受け取り、\`===\` で判定した重複を除いた **新しい配列** を返す関数 \`unique\` を実装してください。
**最初に出現した順序を保持**します。

### 入出力例

\`\`\`js
unique([1, 2, 2, 3, 1])         // → [1, 2, 3]
unique(['a', 'b', 'a', 'c'])    // → ['a', 'b', 'c']
unique([])                       // → []
unique([NaN, NaN])               // → [NaN]   (Setでは NaN は等価扱い)
unique([1, '1', 1])              // → [1, '1']  (型が違えば別)
\`\`\`

### 制約

- **\`new Set(...)\`** を使う
- スプレッドまたは \`Array.from\` で配列に戻す
- \`for\` 文は使わない
- \`var\` は使わない
- 元の配列を変更しない
`,
    starterCode: `function unique(arr) {
  return [];
}
`,
    solution: `function unique(arr) {
  return [...new Set(arr)];
}
`,
    entryPoints: ["unique"],
    tests: [
      {
        name: "数値",
        weight: 20,
        code: "JSON.stringify(unique([1,2,2,3,1])) === JSON.stringify([1,2,3])",
      },
      {
        name: "文字列",
        weight: 20,
        code: "JSON.stringify(unique(['a','b','a','c'])) === JSON.stringify(['a','b','c'])",
      },
      {
        name: "空配列",
        weight: 20,
        code: "JSON.stringify(unique([])) === JSON.stringify([])",
      },
      {
        name: "NaN は等価",
        weight: 20,
        code: "(() => { const r = unique([NaN, NaN]); return r.length === 1 && Number.isNaN(r[0]); })()",
      },
      {
        name: "型違いは別物",
        weight: 20,
        code: "JSON.stringify(unique([1,'1',1])) === JSON.stringify([1,'1'])",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "new Set(...) を使う",
        },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 15-2: Map で頻度集計
  // ────────────────────────────────────────────────
  {
    id: "tally",
    topicId: "collections",
    title: "Map で要素の出現回数を集計する",
    difficulty: 2,
    description: `## Map で要素の出現回数を集計する

配列を受け取り、各要素の出現回数を持つ **\`Map\`** を返す関数 \`tally\` を実装してください。
要素の順序は **最初に出現した順** を維持します。

### 入出力例

\`\`\`js
const m = tally(['a','b','a','c','a','b']);
m instanceof Map     // → true
m.get('a')           // → 3
m.get('b')           // → 2
m.get('c')           // → 1
[...m.keys()]        // → ['a','b','c']

tally([]).size       // → 0
tally([1,1,1]).get(1)  // → 3
\`\`\`

### 制約

- **\`new Map()\`** を使う
- \`for\` または \`for...of\` で要素を処理する
- 戻り値は \`Map\` インスタンス（オブジェクトリテラルではない）
- \`var\` は使わない
`,
    starterCode: `function tally(arr) {
  return new Map();
}
`,
    solution: `function tally(arr) {
  const m = new Map();
  for (const item of arr) {
    m.set(item, (m.get(item) || 0) + 1);
  }
  return m;
}
`,
    entryPoints: ["tally"],
    tests: [
      {
        name: "Map インスタンス",
        weight: 20,
        code: "tally(['a']) instanceof Map",
      },
      {
        name: "頻度",
        weight: 20,
        code: "(() => { const m = tally(['a','b','a','c','a','b']); return m.get('a') === 3 && m.get('b') === 2 && m.get('c') === 1; })()",
      },
      {
        name: "順序保持",
        weight: 20,
        code: "JSON.stringify([...tally(['a','b','a','c']).keys()]) === JSON.stringify(['a','b','c'])",
      },
      {
        name: "空配列",
        weight: 20,
        code: "tally([]).size === 0",
      },
      {
        name: "数値要素",
        weight: 20,
        code: "tally([1,1,1]).get(1) === 3",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "new Map() を使う",
        },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 15-3: 2配列の交差
  // ────────────────────────────────────────────────
  {
    id: "intersect",
    topicId: "collections",
    title: "Set で2配列の交差を求める",
    difficulty: 2,
    description: `## Set で2配列の交差を求める

配列 \`a\`、\`b\` を受け取り、両方に含まれる要素 (\`===\` 一致) のみを **重複なし** で並べた配列を返す関数 \`intersect\` を実装してください。
順序は \`a\` における最初の出現順。

### 入出力例

\`\`\`js
intersect([1,2,3,4], [2,4,6])     // → [2, 4]
intersect(['a','b','c'], ['c','d'])  // → ['c']
intersect([1,1,2,2], [2,1])        // → [1, 2]   (重複は除く、a の順序)
intersect([], [1,2])               // → []
intersect([1,2], [3,4])            // → []
\`\`\`

### 制約

- **\`Set\`** を使って高速に判定する（ネストした for ループ禁止）
- \`for\` 文は使わない
- \`var\` は使わない
- 元の配列を変更しない
`,
    starterCode: `function intersect(a, b) {
  return [];
}
`,
    solution: `function intersect(a, b) {
  const setB = new Set(b);
  const seen = new Set();
  const result = [];
  for (const x of a) {
    if (setB.has(x) && !seen.has(x)) {
      result.push(x);
      seen.add(x);
    }
  }
  return result;
}
`,
    entryPoints: ["intersect"],
    tests: [
      {
        name: "数値",
        weight: 22,
        code: "JSON.stringify(intersect([1,2,3,4],[2,4,6])) === JSON.stringify([2,4])",
      },
      {
        name: "文字列",
        weight: 22,
        code: "JSON.stringify(intersect(['a','b','c'],['c','d'])) === JSON.stringify(['c'])",
      },
      {
        name: "重複は除く",
        weight: 22,
        code: "JSON.stringify(intersect([1,1,2,2],[2,1])) === JSON.stringify([1,2])",
      },
      {
        name: "片方空",
        weight: 17,
        code: "JSON.stringify(intersect([],[1,2])) === JSON.stringify([])",
      },
      {
        name: "交差なし",
        weight: 17,
        code: "JSON.stringify(intersect([1,2],[3,4])) === JSON.stringify([])",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "new Set(...) を使う",
        },
      ],
      forbidden: [
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        { kind: "var", label: "var は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
