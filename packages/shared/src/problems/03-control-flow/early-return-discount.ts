import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const earlyReturnDiscount: Assignment = {
  id: "early-return-discount",
  topicId: "control-flow",
  title: "早期returnで割引判定をフラットにする",
  difficulty: 1,
  description: `## 早期returnで割引判定をフラットにする

\`{ price, isMember, isWeekend }\` を受け取り、適用後の価格を返す関数 \`finalPrice\` を実装してください。

ルール（**上から順に評価**）:

1. \`price\` が \`0\` 以下 → そのまま返す
2. \`isMember && isWeekend\` → 30% 引き（\`Math.round\` で整数化）
3. \`isMember\` のみ → 10% 引き
4. \`isWeekend\` のみ → 5% 引き
5. それ以外 → 値引きなし

### 入出力例

\`\`\`js
finalPrice({ price: 1000, isMember: true,  isWeekend: true  })  // → 700
finalPrice({ price: 1000, isMember: true,  isWeekend: false })  // → 900
finalPrice({ price: 1000, isMember: false, isWeekend: true  })  // → 950
finalPrice({ price: 1000, isMember: false, isWeekend: false })  // → 1000
finalPrice({ price: 0,    isMember: true,  isWeekend: true  })  // → 0
finalPrice({ price: -50,  isMember: true,  isWeekend: true  })  // → -50
\`\`\`

### 制約

- 早期 \`return\` パターンを使う（\`if\` のネストを 1 段までに抑える）
- \`var\` は使わない
- \`==\` / \`!=\` は使わない
`,
  starterCode: `function finalPrice(input) {
  return 0;
}
`,
  solution: `function finalPrice(input) {
  const { price, isMember, isWeekend } = input;
  if (price <= 0) return price;
  if (isMember && isWeekend) return Math.round(price * 0.7);
  if (isMember) return Math.round(price * 0.9);
  if (isWeekend) return Math.round(price * 0.95);
  return price;
}
`,
  entryPoints: ["finalPrice"],
  tests: [
    {
      name: "会員 × 週末 → 30%off",
      code: "finalPrice({price:1000,isMember:true,isWeekend:true}) === 700",
    },
    {
      name: "会員のみ → 10%off",
      code: "finalPrice({price:1000,isMember:true,isWeekend:false}) === 900",
    },
    {
      name: "週末のみ → 5%off",
      code: "finalPrice({price:1000,isMember:false,isWeekend:true}) === 950",
    },
    {
      name: "通常価格",
      code: "finalPrice({price:1000,isMember:false,isWeekend:false}) === 1000",
    },
    {
      name: "0 円はそのまま",
      code: "finalPrice({price:0,isMember:true,isWeekend:true}) === 0",
    },
    {
      name: "負の価格はそのまま",
      code: "finalPrice({price:-50,isMember:true,isWeekend:true}) === -50",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [
      { kind: "var", label: "var は使わない" },
      { kind: "loose-eq", label: "== / != は使わない" },
    ],
  },
};
