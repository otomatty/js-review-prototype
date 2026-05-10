import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const rangeClass: Assignment = {
  id: "range-class",
  topicId: "classes-basics",
  title: "Range クラスで範囲を扱う",
  difficulty: 2,
  description: `## Range クラスで範囲を扱う

開始値 \`start\` (含む) と終了値 \`end\` (含まない) を持つ **\`Range\` クラス** を実装してください。

- コンストラクタ: \`new Range(start, end)\`
- \`length()\`: 要素数を返す（負や逆順なら \`0\`）
- \`contains(n)\`: \`start <= n < end\` なら \`true\`
- \`toArray()\`: \`[start, start+1, ..., end-1]\` の配列を返す

### 入出力例

\`\`\`js
const r = new Range(1, 5);
r.length()        // → 4
r.contains(1)     // → true
r.contains(5)     // → false
r.contains(0)     // → false
r.toArray()       // → [1, 2, 3, 4]

new Range(3, 3).length()    // → 0
new Range(5, 1).toArray()   // → []  (逆順は空)
new Range(0, 3).toArray()   // → [0, 1, 2]
\`\`\`

### 制約

- **\`class\` 構文** を使う
- \`var\` は使わない
- メソッドは for ループ／\`Array.from\` どちらで実装してもよい
`,
  starterCode: `class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  length() { return 0; }
  contains(n) { return false; }
  toArray() { return []; }
}
`,
  solution: `class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  length() {
    return Math.max(0, this.end - this.start);
  }
  contains(n) {
    return this.start <= n && n < this.end;
  }
  toArray() {
    const result = [];
    for (let i = this.start; i < this.end; i++) {
      result.push(i);
    }
    return result;
  }
}
`,
  entryPoints: ["Range"],
  tests: [
    {
      name: "length 4",
      code: "new Range(1,5).length() === 4",
    },
    {
      name: "contains 境界",
      code: "(() => { const r = new Range(1,5); return r.contains(1) === true && r.contains(5) === false && r.contains(0) === false; })()",
    },
    {
      name: "toArray",
      code: "JSON.stringify(new Range(1,5).toArray()) === JSON.stringify([1,2,3,4])",
    },
    {
      name: "0 から始まる",
      code: "JSON.stringify(new Range(0,3).toArray()) === JSON.stringify([0,1,2])",
    },
    {
      name: "同値は空",
      code: "new Range(3,3).length() === 0 && new Range(3,3).toArray().length === 0",
    },
    {
      name: "逆順は空",
      code: "new Range(5,1).length() === 0 && new Range(5,1).toArray().length === 0",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ClassDeclaration",
        label: "class 構文を使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
