import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const omitKey: Assignment = {
  id: "omit-key",
  topicId: "destructuring-spread",
  title: "指定キーを除いたオブジェクトを返す",
  difficulty: 2,
  description: `## 指定キーを除いたオブジェクトを返す

オブジェクト \`obj\` とキー文字列 \`key\` を受け取り、\`key\` を除いた **新しいオブジェクト** を返す関数 \`omit\` を実装してください。
**元のオブジェクトを変更してはいけません**。

### 入出力例

\`\`\`js
omit({ a: 1, b: 2, c: 3 }, 'b')
// → { a: 1, c: 3 }

omit({ a: 1 }, 'a')
// → {}

omit({ a: 1, b: 2 }, 'z')   // 存在しないキー
// → { a: 1, b: 2 }

omit({}, 'a')
// → {}
\`\`\`

### 制約

- **計算プロパティ名による分割代入 + 残余 (\`{ [key]: _, ...rest }\`)** を使う
- **\`delete\` 演算子は禁止**（破壊的）
- \`var\` は使わない
`,
  starterCode: `function omit(obj, key) {
  return obj;
}
`,
  solution: `function omit(obj, key) {
  const { [key]: _omitted, ...rest } = obj;
  return rest;
}
`,
  entryPoints: ["omit"],
  tests: [
    {
      name: "中央のキーを除く",
      code: "JSON.stringify(omit({a:1,b:2,c:3}, 'b')) === JSON.stringify({a:1,c:3})",
    },
    {
      name: "唯一のキーを除く",
      code: "JSON.stringify(omit({a:1}, 'a')) === JSON.stringify({})",
    },
    {
      name: "存在しないキー",
      code: "JSON.stringify(omit({a:1,b:2}, 'z')) === JSON.stringify({a:1,b:2})",
    },
    {
      name: "空オブジェクト",
      code: "JSON.stringify(omit({}, 'a')) === JSON.stringify({})",
    },
    {
      name: "元オブジェクトを変更しない",
      code: "(() => { const o = {a:1,b:2}; omit(o, 'a'); return JSON.stringify(o) === JSON.stringify({a:1,b:2}); })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
