import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const weekdayJp: Assignment = {
  id: "weekday-jp",
  topicId: "control-flow",
  title: "switch で曜日番号を日本語に変換する",
  difficulty: 1,
  description: `## switch で曜日番号を日本語に変換する

\`0\` 〜 \`6\` の整数を受け取り、

| 入力 | 戻り値 |
|---|---|
| \`0\` | \`'日'\` |
| \`1\` | \`'月'\` |
| \`2\` | \`'火'\` |
| \`3\` | \`'水'\` |
| \`4\` | \`'木'\` |
| \`5\` | \`'金'\` |
| \`6\` | \`'土'\` |
| その他 | \`'不明'\` |

を返す関数 \`weekdayJa\` を実装してください。

### 入出力例

\`\`\`js
weekdayJa(0)    // → '日'
weekdayJa(3)    // → '水'
weekdayJa(7)    // → '不明'
weekdayJa(-1)   // → '不明'
weekdayJa('0')  // → '不明'  (型違いも不明)
\`\`\`

### 制約

- **\`switch\` 文** で実装する
- \`var\` は使わない
- 配列やオブジェクトを使った辞書引きは禁止（\`switch\` の練習）
`,
  starterCode: `function weekdayJa(n) {
  return '不明';
}
`,
  solution: `function weekdayJa(n) {
  switch (n) {
    case 0: return '日';
    case 1: return '月';
    case 2: return '火';
    case 3: return '水';
    case 4: return '木';
    case 5: return '金';
    case 6: return '土';
    default: return '不明';
  }
}
`,
  entryPoints: ["weekdayJa"],
  tests: [
    { name: "0 → 日", code: "weekdayJa(0) === '日'" },
    { name: "1 → 月", code: "weekdayJa(1) === '月'" },
    { name: "2 → 火", code: "weekdayJa(2) === '火'" },
    { name: "3 → 水", code: "weekdayJa(3) === '水'" },
    { name: "4 → 木", code: "weekdayJa(4) === '木'" },
    { name: "5 → 金", code: "weekdayJa(5) === '金'" },
    { name: "6 → 土", code: "weekdayJa(6) === '土'" },
    {
      name: "範囲外は 不明",
      code: "weekdayJa(7) === '不明' && weekdayJa(-1) === '不明'",
    },
    {
      name: "型違いは 不明",
      code: "weekdayJa('0') === '不明'",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "SwitchStatement",
        label: "switch 文を使う",
      },
    ],
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
