import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const deepSet: Assignment = {
  id: "deep-set",
  topicId: "objects-basics",
  title: "ネストしたプロパティを不変に更新する",
  difficulty: 3,
  description: `## ネストしたプロパティを不変に更新する

オブジェクト \`obj\`、キー配列 \`path\`、値 \`value\` を受け取り、\`path\` の位置を \`value\` に更新した **新しいオブジェクト** を返す関数 \`deepSet\` を実装してください。

途中のキーが存在しない場合は **新しいオブジェクトを作って** 埋めてください。
**元のオブジェクトおよびネストしたサブオブジェクトを変更してはいけません**。

### 入出力例

\`\`\`js
deepSet({ a: { b: 1 } }, ['a', 'b'], 99)
// → { a: { b: 99 } }

deepSet({}, ['a', 'b', 'c'], 1)
// → { a: { b: { c: 1 } } }

deepSet({ a: { b: { c: 1 }, x: 9 } }, ['a', 'b', 'c'], 2)
// → { a: { b: { c: 2 }, x: 9 } }    (兄弟プロパティを保持)

deepSet({ a: 1 }, [], 'ignore')
// → { a: 1 }   (path が空ならトップレベルでは value を無視し、元のオブジェクトのコピーを返す)
\`\`\`

### 制約

- スプレッド構文で各階層を再構築する
- \`var\` は使わない
- 元のオブジェクトを変更しない（テストで検証）
- 戻り値は **必ず新しい参照** にする（\`return obj\` で済ませない）

### 実装ヒント

トップレベルの呼び出しと再帰の最深部は分けて考えます。

\`\`\`js
function deepSet(obj, path, value) {
  if (path.length === 0) return { ...obj };           // トップレベルだけの保護
  const [head, ...rest] = path;
  const child = obj[head] ?? {};
  const nextChild = rest.length === 0 ? value : deepSet(child, rest, value);
  return { ...obj, [head]: nextChild };
}
\`\`\`
`,
  starterCode: `function deepSet(obj, path, value) {
  return obj;
}
`,
  solution: `function deepSet(obj, path, value) {
  if (path.length === 0) return { ...obj };
  const [head, ...rest] = path;
  const child = obj[head] ?? {};
  const nextChild = rest.length === 0 ? value : deepSet(child, rest, value);
  return { ...obj, [head]: nextChild };
}
`,
  entryPoints: ["deepSet"],
  tests: [
    {
      name: "深さ2",
      code: "JSON.stringify(deepSet({a:{b:1}}, ['a','b'], 99)) === JSON.stringify({a:{b:99}})",
    },
    {
      name: "途中キー欠落で生成",
      code: "JSON.stringify(deepSet({}, ['a','b','c'], 1)) === JSON.stringify({a:{b:{c:1}}})",
    },
    {
      name: "兄弟を保持",
      code: "JSON.stringify(deepSet({a:{b:{c:1},x:9}}, ['a','b','c'], 2)) === JSON.stringify({a:{b:{c:2},x:9}})",
    },
    {
      name: "空 path はコピーを返す (新参照)",
      code: "(() => { const o = {a:1}; const r = deepSet(o, [], 'ignore'); return JSON.stringify(r) === JSON.stringify({a:1}) && r !== o; })()",
    },
    {
      name: "元オブジェクトを変更しない",
      code: "(() => { const o = {a:{b:1}}; deepSet(o, ['a','b'], 99); return o.a.b === 1; })()",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
