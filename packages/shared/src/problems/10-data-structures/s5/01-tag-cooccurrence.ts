import type { Assignment } from "../../../types.js";

export const s5Ch10TagCooccurrence: Assignment = {
  id: "S5-Ch10-01-tag-cooccurrence",
  stage: "S5",
  chapterId: "Ch10",
  sequence: 1,
  title: "Map と Set でタグの共起ランキングを作る",
  newConcept:
    "「カウンタ = Map」「重複除去 = Set」 と役割を分けて 2 つのデータ構造を同時に使い、 上位 N 件を抽出する設計",
  estimatedMinutes: 50,
  difficulty: 2,
  testKind: "function",
  description: `## やること

各投稿が \`{ id: string, tags: string[] }\` の形をしている投稿配列 \`posts\` と注目タグ \`targetTag\`、 上位件数 \`topN\` を受け取り、 **\`targetTag\` と同じ投稿に登場した他のタグ** を共起回数の多い順に集計して返す関数 \`tagCooccurrence\` を実装してください。

戻り値は \`{ tag: string, count: number }\` の配列で、 並びは:

- \`count\` の **降順**
- 同数なら \`tag\` の **昇順 (文字列の辞書順)**

仕様:

- 1 つの投稿の \`tags\` に **同じタグが複数回出てきても 1 件** として数える (重複除去は \`Set\` で行う)
- \`targetTag\` 自身は結果に含めない
- \`targetTag\` を含まない投稿は無視する
- \`topN <= 0\` または共起タグが 1 つも無いときは \`[]\` を返す
- 入力 \`posts\` が空のときは \`[]\` を返す

\`\`\`js
tagCooccurrence(
  [
    { id: "p1", tags: ["js", "frontend", "css"] },
    { id: "p2", tags: ["js", "backend", "node"] },
    { id: "p3", tags: ["js", "frontend", "react"] },
    { id: "p4", tags: ["python", "backend"] },
  ],
  "js",
  2,
);
// → [
//     { tag: "frontend", count: 2 },
//     { tag: "backend",  count: 1 },
//   ]

tagCooccurrence([{ id: "p1", tags: ["js", "js", "frontend"] }], "js", 5);
// → [{ tag: "frontend", count: 1 }]   (同じ投稿の "js" は 2 回出ても 1 件扱い)

tagCooccurrence([], "js", 5);                                 // → []
tagCooccurrence([{ id: "p1", tags: ["js"] }], "js", 5);       // → []   (共起タグなし)
\`\`\`

## ポイント

- **データ構造の選択が S5 の目的です**。 共起回数の集計には \`Map<string, number>\`、 同じ投稿内のタグ重複除去には \`Set<string>\` を使い分けます。 Object でも一応書けますが、 「キーが動的な文字列で挿入順を保ちたい」 のは Map の本領です。
- 推奨フロー:
  1. 集計用に \`const counts = new Map()\` を用意する
  2. \`for...of\` で各 \`post\` を見る
  3. \`const uniqueTags = new Set(post.tags)\` でタグを **その投稿内で重複除去**
  4. \`uniqueTags.has(targetTag)\` が \`false\` なら \`continue\` でスキップ
  5. それ以外の各タグについて \`counts.set(tag, (counts.get(tag) ?? 0) + 1)\` で +1 する (\`targetTag\` 自身は除く)
  6. \`[...counts.entries()]\` で配列化し、 \`.map → .sort → .slice\` のパイプラインで成形する
- AST で **\`new Map()\` / \`new Set()\` / \`Map#set\` / \`sort\` / \`slice\` の使用** を必須にしています。 Object だけで書く実装や Set を使わない実装は通りません。
`,
  starterCode: `function tagCooccurrence(posts, targetTag, topN) {
  // 共起カウンタとして Map を用意する


  // 各 post について、 post.tags を Set にして同じ投稿内のタグを重複除去する


  // その Set に targetTag が含まれていなければスキップする


  // それ以外のタグについて、 Map にカウントを +1 する (targetTag 自身は除外)


  // Map を [...entries()] で配列化し、 map / sort / slice で上位 topN 件に整える
}
`,
  entryPoints: ["tagCooccurrence"],
  demoCall: `console.log(tagCooccurrence([{ id: "p1", tags: ["js", "frontend"] }, { id: "p2", tags: ["js", "backend"] }, { id: "p3", tags: ["js", "frontend"] }], "js", 2));`,
  tests: [
    {
      name: "基本: 共起の多い順 → 同数は tag 昇順 で上位 2 件",
      code: `JSON.stringify(tagCooccurrence([
        { id: "p1", tags: ["js", "frontend", "css"] },
        { id: "p2", tags: ["js", "backend", "node"] },
        { id: "p3", tags: ["js", "frontend", "react"] },
        { id: "p4", tags: ["python", "backend"] },
      ], "js", 2)) === JSON.stringify([{ tag: "frontend", count: 2 }, { tag: "backend", count: 1 }])`,
    },
    {
      name: "同じ投稿内に同じタグが複数あっても 1 件として数える",
      code: `JSON.stringify(tagCooccurrence([{ id: "p1", tags: ["js", "js", "frontend", "frontend"] }], "js", 5)) === JSON.stringify([{ tag: "frontend", count: 1 }])`,
    },
    {
      name: "targetTag を含まない投稿は無視する",
      code: `JSON.stringify(tagCooccurrence([{ id: "p1", tags: ["python", "backend"] }, { id: "p2", tags: ["go", "backend"] }], "js", 5)) === JSON.stringify([])`,
    },
    {
      name: "targetTag 自身は結果に含めない",
      code: `tagCooccurrence([{ id: "p1", tags: ["js", "frontend"] }, { id: "p2", tags: ["js", "frontend"] }], "js", 10).every((x) => x.tag !== "js")`,
    },
    {
      name: "空配列は空",
      code: `JSON.stringify(tagCooccurrence([], "js", 5)) === JSON.stringify([])`,
    },
    {
      name: "topN = 0 は空",
      code: `JSON.stringify(tagCooccurrence([{ id: "p1", tags: ["js", "frontend"] }], "js", 0)) === JSON.stringify([])`,
    },
    {
      name: "topN が負でも空配列 (例外を投げない)",
      code: `JSON.stringify(tagCooccurrence([{ id: "p1", tags: ["js", "frontend"] }], "js", -3)) === JSON.stringify([])`,
    },
    {
      name: "topN が共起タグ数より大きいなら全件返る",
      code: `tagCooccurrence([{ id: "p1", tags: ["js", "a", "b", "c"] }], "js", 100).length === 3`,
    },
    {
      name: "同数のタイブレークは tag 昇順 (z より a が先)",
      code: `JSON.stringify(tagCooccurrence([{ id: "p1", tags: ["js", "z", "a"] }], "js", 5)) === JSON.stringify([{ tag: "a", count: 1 }, { tag: "z", count: 1 }])`,
    },
    {
      name: "共起タグなしの単独 targetTag は空",
      code: `JSON.stringify(tagCooccurrence([{ id: "p1", tags: ["js"] }, { id: "p2", tags: ["js"] }], "js", 5)) === JSON.stringify([])`,
    },
    {
      name: "戻り値の各要素は { tag, count } のキー構造",
      code: `(() => { const r = tagCooccurrence([{ id: "p1", tags: ["js", "x"] }], "js", 1)[0]; return typeof r.tag === "string" && typeof r.count === "number"; })()`,
    },
    {
      name: "count は 「targetTag と同居した投稿数」 と一致 (重複排除済み)",
      code: `(() => { const r = tagCooccurrence([{ id: "p1", tags: ["js", "x", "x"] }, { id: "p2", tags: ["js", "x"] }, { id: "p3", tags: ["js", "x"] }], "js", 1); return r[0].tag === "x" && r[0].count === 3; })()`,
    },
  ],
  hints: [
    "外側のループで各 post を見ながら、 内側でその post の tags を new Set(post.tags) に変換すると 「同じ投稿内に同じタグが何度出ても 1 件」 を自然に表現できます。",
    "uniqueTags.has(targetTag) で 「この投稿に注目タグが入っているか」 を判定し、 入っていなければ continue。 入っていれば uniqueTags の各タグ (targetTag 自身は除く) について counts.set(tag, (counts.get(tag) ?? 0) + 1) でカウントを +1 します。",
    "解答例:\n```js\nfunction tagCooccurrence(posts, targetTag, topN) {\n  const counts = new Map();\n  for (const post of posts) {\n    const uniqueTags = new Set(post.tags);\n    if (!uniqueTags.has(targetTag)) {\n      continue;\n    }\n    for (const tag of uniqueTags) {\n      if (tag === targetTag) {\n        continue;\n      }\n      counts.set(tag, (counts.get(tag) ?? 0) + 1);\n    }\n  }\n  return [...counts.entries()]\n    .map(([tag, count]) => ({ tag, count }))\n    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))\n    .slice(0, Math.max(0, topN));\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "NewExpression", label: "new Map() / new Set() を使う" },
        { kind: "method", name: "set", label: "Map#set でカウントを更新する" },
        { kind: "method", name: "has", label: "Set#has で targetTag の有無を判定する" },
        { kind: "method", name: "sort", label: "sort で並べ替える" },
        { kind: "method", name: "slice", label: "slice で上位 N 件を切り出す" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で結果配列を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function tagCooccurrence(posts, targetTag, topN) {
  const counts = new Map();
  for (const post of posts) {
    const uniqueTags = new Set(post.tags);
    if (!uniqueTags.has(targetTag)) {
      continue;
    }
    for (const tag of uniqueTags) {
      if (tag === targetTag) {
        continue;
      }
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, Math.max(0, topN));
}
`,
  badSolutions: [
    {
      code: `function tagCooccurrence(posts, targetTag, topN) {
  const counts = {};
  for (const post of posts) {
    if (!post.tags.includes(targetTag)) {
      continue;
    }
    for (const tag of post.tags) {
      if (tag === targetTag) {
        continue;
      }
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, Math.max(0, topN));
}
`,
      description: "Map / Set を使わず Object と Array#includes だけで書いている (AST required 違反 + 重複タグのテスト失敗)",
    },
    {
      code: `function tagCooccurrence(posts, targetTag, topN) {
  const counts = new Map();
  for (const post of posts) {
    if (!post.tags.includes(targetTag)) {
      continue;
    }
    for (const tag of post.tags) {
      if (tag === targetTag) {
        continue;
      }
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, Math.max(0, topN));
}
`,
      description: "Set による投稿内の重複除去を省いており、 同じ投稿に同じタグが複数回出ると過剰にカウントされる (AST required 違反 + 重複タグのテスト失敗)",
    },
    {
      code: `function tagCooccurrence(posts, targetTag, topN) {
  const counts = new Map();
  for (const post of posts) {
    const uniqueTags = new Set(post.tags);
    if (!uniqueTags.has(targetTag)) {
      continue;
    }
    for (const tag of uniqueTags) {
      if (tag === targetTag) {
        continue;
      }
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, Math.max(0, topN));
}
`,
      description: "tag 昇順のタイブレークが無く、 同数のときに辞書順にならない (タイブレークのテスト失敗)",
    },
    {
      code: `function tagCooccurrence(posts, targetTag, topN) {
  const counts = new Map();
  for (const post of posts) {
    const uniqueTags = new Set(post.tags);
    if (!uniqueTags.has(targetTag)) {
      continue;
    }
    for (const tag of uniqueTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, Math.max(0, topN));
}
`,
      description: "targetTag 自身を除外しておらず、 結果配列の先頭に targetTag が居座る (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Map",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map",
      pageTitle: "Map",
    },
    {
      heading: "Set",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Set",
      pageTitle: "Set",
    },
    {
      heading: "Array.prototype.sort()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
      pageTitle: "Array.prototype.sort()",
    },
    {
      heading: "Array.prototype.slice()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice",
      pageTitle: "Array.prototype.slice()",
    },
  ],
};
