import type { Assignment } from "../../../types.js";

export const s5Ch10FriendsWithinHopsCapstone: Assignment = {
  id: "S5-Ch10-03-friends-within-hops-capstone",
  stage: "S5",
  chapterId: "Ch10",
  sequence: 3,
  title: "[卒業課題] 隣接リストと BFS で N ホップ以内のユーザーを集める",
  newConcept:
    "「辺の配列」 をまず Map<string, Set<string>> の 隣接リスト に変換し、 visited (Set) と キュー (配列) を使った BFS で最短ホップを求める、 Map と Set を両輪で使い分けるグラフ走査の統合演習",
  estimatedMinutes: 80,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

ユーザー同士のフォロー関係を表す辺の配列 \`follows\` (各要素は \`{ from: string, to: string }\` で、 \`from\` が \`to\` を **片方向** にフォローしているという意味) と、 起点ユーザー \`startUser\`、 最大ホップ数 \`maxHops\` を受け取り、 **\`startUser\` から 1 〜 \`maxHops\` ホップ以内 (両端含む) で到達できるユーザー** を返す関数 \`friendsWithinHops\` を実装してください。

戻り値は \`{ user: string, hop: number }\` の配列で、 並びは:

- \`hop\` の **昇順** (距離が短いものが先)
- 同じ \`hop\` のときは \`user\` の **昇順 (文字列の辞書順)**

仕様:

- \`startUser\` 自身は結果に含めない (距離 0 のため除外)
- 同じユーザーへの **最短ホップ数** だけを採用する (複数経路があれば短い方を勝たせる)
- 同じ辺が \`follows\` に複数回登場しても 1 本として扱う (隣接リスト側で重複は自然に潰れる)
- \`maxHops <= 0\`、 \`follows\` が空、 \`startUser\` が誰もフォローしていないなど、 1 ホップ先が無いケースでは \`[]\` を返す
- フォロー関係は **有向**: \`a → b\` が登録されていても \`b → a\` は別に必要

\`\`\`js
friendsWithinHops(
  [
    { from: "u1", to: "u2" },
    { from: "u1", to: "u3" },
    { from: "u2", to: "u4" },
    { from: "u3", to: "u4" },
    { from: "u4", to: "u5" },
  ],
  "u1",
  2,
);
// → [
//     { user: "u2", hop: 1 },
//     { user: "u3", hop: 1 },
//     { user: "u4", hop: 2 },
//   ]   ← u5 は 3 ホップ先なので入らない。 u4 は u2 経由でも u3 経由でも 2 ホップなので 1 件だけ。

friendsWithinHops([], "u1", 5);                                  // → []
friendsWithinHops([{ from: "u1", to: "u2" }], "u9", 5);          // → []   (起点が誰もフォローしていない)
friendsWithinHops([{ from: "u1", to: "u2" }], "u1", 0);          // → []
\`\`\`

## ポイント

これは **S5 卒業課題のひとつ**。 「グラフを辺の配列で渡されたら、 まず隣接リスト (\`Map<string, Set<string>>\`) に変換してから走査する」 という、 グラフ問題の **王道の設計** を 1 問にまとめた統合演習です。

推奨フロー:

1. **隣接リストの構築 (前処理)**
   - \`const adjacency = new Map()\` を用意する
   - \`for (const edge of follows)\` で各辺を見ながら:
     - \`adjacency.has(edge.from)\` が \`false\` なら \`adjacency.set(edge.from, new Set())\` で空集合を入れて初期化
     - \`adjacency.get(edge.from).add(edge.to)\` で隣接ノードを追加 (Set なので重複辺は自動で 1 本にまとまる)
2. **BFS の準備**
   - 訪問済みフラグ用に \`const visited = new Set([startUser])\` (起点を最初から訪問済み扱いにする)
   - 結果用に \`const distance = new Map()\` (\`Map<userId, hop>\`)
   - 探索キュー \`const queue = [{ user: startUser, hop: 0 }]\` (配列を FIFO として使う)
3. **BFS 本体**
   - \`while (queue.length > 0)\` でキューが空になるまで回す
   - \`const { user, hop } = queue.shift()\` で先頭を取り出す
   - \`hop >= maxHops\` ならこれ以上深く進まない (\`continue\`)
   - \`adjacency.get(user)\` で隣接 Set を取得 (無ければスキップ)
   - 各 \`next\` について \`visited.has(next)\` が \`false\` なら、 \`visited.add(next)\` + \`distance.set(next, hop + 1)\` + キューに \`{ user: next, hop: hop + 1 }\` を追加
4. **整形**
   - \`[...distance.entries()]\` を配列化し、 \`.map → .sort\` で \`{ user, hop }\` の形に整え hop 昇順 + user 昇順で並べ替える

学習目標:

- **データ構造の選択判断**: 「辺の配列で渡されたグラフは、 隣接リストに変換してから走査する」 のが定型。 そのとき外側を Map、 内側を Set にすると 「追加」 「重複判定」 「列挙」 がすべて自然な API で書ける
- **Map と Set の役割分担**: 隣接リスト本体 (Map)、 隣接ユーザー集合 (Set)、 訪問済み判定 (Set)、 距離記録 (Map) と、 同じ問題の中で **4 つの用途で使い分ける**
- **BFS の定型**: \`visited\` で再訪を防ぎ、 キューに \`{ ノード, 距離 }\` を入れて FIFO で取り出す
- AST で **\`new Map()\` / \`new Set()\` / \`Map#set\` / \`has\` / \`get\` / \`sort\` / \`while\` の使用** を必須にしています。 隣接リストを作らない実装や、 再帰だけで書いた DFS では通りません。
`,
  starterCode: `function friendsWithinHops(follows, startUser, maxHops) {
  // maxHops <= 0 のときは早期 return []


  // follows から 隣接リスト adjacency = new Map<string, Set<string>>() を組み立てる


  // visited = new Set([startUser])、 distance = new Map()、 queue = [{ user: startUser, hop: 0 }] を用意する


  // while (queue.length > 0) で BFS。 hop が maxHops に達したらこれ以上進まない


  // 隣接ユーザーごとに visited.has で判定し、 未訪問なら visited.add / distance.set / queue.push する


  // distance を [...entries()] で配列化し、 hop 昇順 + user 昇順で sort して return する
}
`,
  entryPoints: ["friendsWithinHops"],
  demoCall: `console.log(friendsWithinHops([
  { from: "u1", to: "u2" },
  { from: "u1", to: "u3" },
  { from: "u2", to: "u4" },
  { from: "u3", to: "u4" },
  { from: "u4", to: "u5" },
], "u1", 2));`,
  tests: [
    {
      name: "問題文の例: 4 人を 2 ホップ以内で集める (u5 は 3 ホップなので除外)",
      code: `JSON.stringify(friendsWithinHops([
        { from: "u1", to: "u2" },
        { from: "u1", to: "u3" },
        { from: "u2", to: "u4" },
        { from: "u3", to: "u4" },
        { from: "u4", to: "u5" },
      ], "u1", 2)) === JSON.stringify([
        { user: "u2", hop: 1 },
        { user: "u3", hop: 1 },
        { user: "u4", hop: 2 },
      ])`,
    },
    {
      name: "1 直線チェーン (u1→u2→u3→u4→u5) を maxHops=2 で 2 件",
      code: `JSON.stringify(friendsWithinHops([
        { from: "u1", to: "u2" },
        { from: "u2", to: "u3" },
        { from: "u3", to: "u4" },
        { from: "u4", to: "u5" },
      ], "u1", 2)) === JSON.stringify([
        { user: "u2", hop: 1 },
        { user: "u3", hop: 2 },
      ])`,
    },
    {
      name: "1 直線チェーンを maxHops=10 にすると全員 (起点以外) を取得",
      code: `friendsWithinHops([
        { from: "u1", to: "u2" },
        { from: "u2", to: "u3" },
        { from: "u3", to: "u4" },
        { from: "u4", to: "u5" },
      ], "u1", 10).length === 4`,
    },
    {
      name: "起点が誰もフォローしていなければ空",
      code: `JSON.stringify(friendsWithinHops([{ from: "u1", to: "u2" }], "u9", 5)) === JSON.stringify([])`,
    },
    {
      name: "follows が空なら空",
      code: `JSON.stringify(friendsWithinHops([], "u1", 5)) === JSON.stringify([])`,
    },
    {
      name: "maxHops = 0 は空 (距離 0 = 自分自身は除外)",
      code: `JSON.stringify(friendsWithinHops([{ from: "u1", to: "u2" }], "u1", 0)) === JSON.stringify([])`,
    },
    {
      name: "maxHops が負でも空配列 (例外を投げない)",
      code: `JSON.stringify(friendsWithinHops([{ from: "u1", to: "u2" }], "u1", -3)) === JSON.stringify([])`,
    },
    {
      name: "起点ユーザー (距離 0) は結果に含めない",
      code: `friendsWithinHops([
        { from: "u1", to: "u2" },
        { from: "u2", to: "u1" },
      ], "u1", 5).every((x) => x.user !== "u1")`,
    },
    {
      name: "サイクル (u1↔u2) があっても無限ループせず、 u2 だけ 1 件",
      code: `JSON.stringify(friendsWithinHops([
        { from: "u1", to: "u2" },
        { from: "u2", to: "u1" },
      ], "u1", 10)) === JSON.stringify([{ user: "u2", hop: 1 }])`,
    },
    {
      name: "自己ループ (u1→u1) は無視される",
      code: `JSON.stringify(friendsWithinHops([{ from: "u1", to: "u1" }], "u1", 5)) === JSON.stringify([])`,
    },
    {
      name: "切断されたサブグラフは到達しない",
      code: `JSON.stringify(friendsWithinHops([
        { from: "u1", to: "u2" },
        { from: "u3", to: "u4" },
      ], "u1", 10)) === JSON.stringify([{ user: "u2", hop: 1 }])`,
    },
    {
      name: "同じユーザーへの複数経路は 最短ホップ を採用 (u4 は 3 ではなく 2)",
      code: `(() => {
        const r = friendsWithinHops([
          { from: "u1", to: "u2" },
          { from: "u1", to: "u3" },
          { from: "u2", to: "u4" },
          { from: "u3", to: "u4" },
        ], "u1", 5);
        const u4 = r.find((x) => x.user === "u4");
        return u4 !== undefined && u4.hop === 2 && r.filter((x) => x.user === "u4").length === 1;
      })()`,
    },
    {
      name: "同距離は user 昇順 (z よりも a が先)",
      code: `JSON.stringify(friendsWithinHops([
        { from: "u1", to: "z" },
        { from: "u1", to: "a" },
        { from: "u1", to: "m" },
      ], "u1", 1)) === JSON.stringify([
        { user: "a", hop: 1 },
        { user: "m", hop: 1 },
        { user: "z", hop: 1 },
      ])`,
    },
    {
      name: "重複辺 ({ u1, u2 } が 2 回) でも 1 本として扱う",
      code: `JSON.stringify(friendsWithinHops([
        { from: "u1", to: "u2" },
        { from: "u1", to: "u2" },
      ], "u1", 5)) === JSON.stringify([{ user: "u2", hop: 1 }])`,
    },
    {
      name: "有向グラフであることを確認 (a→b は b→a を意味しない)",
      code: `JSON.stringify(friendsWithinHops([{ from: "a", to: "b" }], "b", 5)) === JSON.stringify([])`,
    },
  ],
  hints: [
    "まず follows を 1 周して 「from を Map のキー、 to の集合を Set として」 隣接リストを組みます。 adjacency.set(from, new Set()) で初期化してから adjacency.get(from).add(to) する形が定型です。",
    "BFS のキューは普通の配列を queue.push / queue.shift で FIFO として使います。 visited Set に最初から startUser を入れておくと、 サイクルがあっても起点自身を結果に混入させずに済みます。 各反復で hop が maxHops に達していたらそれ以上展開しません。",
    "解答例:\n```js\nfunction friendsWithinHops(follows, startUser, maxHops) {\n  if (maxHops <= 0) {\n    return [];\n  }\n  const adjacency = new Map();\n  for (const edge of follows) {\n    if (!adjacency.has(edge.from)) {\n      adjacency.set(edge.from, new Set());\n    }\n    adjacency.get(edge.from).add(edge.to);\n  }\n  const visited = new Set([startUser]);\n  const distance = new Map();\n  const queue = [{ user: startUser, hop: 0 }];\n  while (queue.length > 0) {\n    const { user, hop } = queue.shift();\n    if (hop >= maxHops) {\n      continue;\n    }\n    const neighbors = adjacency.get(user);\n    if (!neighbors) {\n      continue;\n    }\n    for (const next of neighbors) {\n      if (visited.has(next)) {\n        continue;\n      }\n      visited.add(next);\n      distance.set(next, hop + 1);\n      queue.push({ user: next, hop: hop + 1 });\n    }\n  }\n  return [...distance.entries()]\n    .map(([user, hop]) => ({ user, hop }))\n    .sort((a, b) => a.hop - b.hop || a.user.localeCompare(b.user));\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "NewExpression", label: "new Map() / new Set() で隣接リストと visited を作る" },
        { kind: "method", name: "set", label: "Map#set で隣接リストや距離を記録する" },
        { kind: "method", name: "has", label: "has で 「すでに登録/訪問済みか」 を判定する" },
        { kind: "method", name: "get", label: "Map#get で隣接ユーザー集合を取り出す" },
        { kind: "method", name: "sort", label: "sort で hop 昇順 + user 昇順に並べる" },
        { kind: "node", nodeType: "WhileStatement", label: "while で BFS のキューを処理する" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で結果配列を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function friendsWithinHops(follows, startUser, maxHops) {
  if (maxHops <= 0) {
    return [];
  }
  const adjacency = new Map();
  for (const edge of follows) {
    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, new Set());
    }
    adjacency.get(edge.from).add(edge.to);
  }
  const visited = new Set([startUser]);
  const distance = new Map();
  const queue = [{ user: startUser, hop: 0 }];
  while (queue.length > 0) {
    const { user, hop } = queue.shift();
    if (hop >= maxHops) {
      continue;
    }
    const neighbors = adjacency.get(user);
    if (!neighbors) {
      continue;
    }
    for (const next of neighbors) {
      if (visited.has(next)) {
        continue;
      }
      visited.add(next);
      distance.set(next, hop + 1);
      queue.push({ user: next, hop: hop + 1 });
    }
  }
  return [...distance.entries()]
    .map(([user, hop]) => ({ user, hop }))
    .sort((a, b) => a.hop - b.hop || a.user.localeCompare(b.user));
}
`,
  badSolutions: [
    {
      code: `function friendsWithinHops(follows, startUser, maxHops) {
  if (maxHops <= 0) {
    return [];
  }
  const adjacency = {};
  for (const edge of follows) {
    if (!adjacency[edge.from]) {
      adjacency[edge.from] = [];
    }
    if (!adjacency[edge.from].includes(edge.to)) {
      adjacency[edge.from].push(edge.to);
    }
  }
  const result = [];
  const queue = [{ user: startUser, hop: 0 }];
  while (queue.length > 0) {
    const { user, hop } = queue.shift();
    if (hop >= maxHops) {
      continue;
    }
    const neighbors = adjacency[user] || [];
    for (const next of neighbors) {
      result.push({ user: next, hop: hop + 1 });
      queue.push({ user: next, hop: hop + 1 });
    }
  }
  return result.sort((a, b) => a.hop - b.hop || a.user.localeCompare(b.user));
}
`,
      description: "隣接リストを Object + 配列で組んでおり Map / Set を使っていない (AST required 違反)。 さらに visited を持たないため同じユーザーが複数回 result に積まれ、 サイクルでは無限ループにもなりうる (テスト失敗)",
    },
    {
      code: `function friendsWithinHops(follows, startUser, maxHops) {
  if (maxHops <= 0) {
    return [];
  }
  const adjacency = new Map();
  for (const edge of follows) {
    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, new Set());
    }
    adjacency.get(edge.from).add(edge.to);
  }
  const distance = new Map();
  const queue = [{ user: startUser, hop: 0 }];
  while (queue.length > 0) {
    const { user, hop } = queue.shift();
    if (hop >= maxHops) {
      continue;
    }
    const neighbors = adjacency.get(user);
    if (!neighbors) {
      continue;
    }
    for (const next of neighbors) {
      distance.set(next, hop + 1);
      queue.push({ user: next, hop: hop + 1 });
    }
  }
  return [...distance.entries()]
    .map(([user, hop]) => ({ user, hop }))
    .sort((a, b) => a.hop - b.hop || a.user.localeCompare(b.user));
}
`,
      description: "visited Set を持たずに毎回 distance を上書きしている。 サイクルがある入力では同じユーザーを何度も処理してしまい、 上書きで距離が壊れる + サイクルのテストで起点ユーザー u1 まで distance に入って結果に混入する (テスト失敗)",
    },
    {
      code: `function friendsWithinHops(follows, startUser, maxHops) {
  if (maxHops <= 0) {
    return [];
  }
  const adjacency = new Map();
  for (const edge of follows) {
    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, new Set());
    }
    adjacency.get(edge.from).add(edge.to);
  }
  const visited = new Set([startUser]);
  const distance = new Map();
  const queue = [{ user: startUser, hop: 0 }];
  while (queue.length > 0) {
    const { user, hop } = queue.shift();
    const neighbors = adjacency.get(user);
    if (!neighbors) {
      continue;
    }
    for (const next of neighbors) {
      if (visited.has(next)) {
        continue;
      }
      visited.add(next);
      distance.set(next, hop + 1);
      queue.push({ user: next, hop: hop + 1 });
    }
  }
  return [...distance.entries()]
    .map(([user, hop]) => ({ user, hop }))
    .sort((a, b) => a.hop - b.hop || a.user.localeCompare(b.user));
}
`,
      description: "hop >= maxHops の打ち切りが無く、 maxHops を無視して到達可能な全ユーザーを返してしまう (maxHops 制限のテスト失敗)",
    },
    {
      code: `function friendsWithinHops(follows, startUser, maxHops) {
  if (maxHops <= 0) {
    return [];
  }
  const adjacency = new Map();
  for (const edge of follows) {
    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, new Set());
    }
    adjacency.get(edge.from).add(edge.to);
  }
  const visited = new Set([startUser]);
  const distance = new Map();
  const queue = [{ user: startUser, hop: 0 }];
  while (queue.length > 0) {
    const { user, hop } = queue.shift();
    if (hop >= maxHops) {
      continue;
    }
    const neighbors = adjacency.get(user);
    if (!neighbors) {
      continue;
    }
    for (const next of neighbors) {
      if (visited.has(next)) {
        continue;
      }
      visited.add(next);
      distance.set(next, hop + 1);
      queue.push({ user: next, hop: hop + 1 });
    }
  }
  return [...distance.entries()]
    .map(([user, hop]) => ({ user, hop }))
    .sort((a, b) => a.hop - b.hop);
}
`,
      description: "hop 同数の二段目ソート (user 昇順) が無く、 同じ hop のユーザーが辞書順に並ばない (タイブレークのテスト失敗)",
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
      heading: "Map.prototype.get()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map/get",
      pageTitle: "Map.prototype.get()",
    },
    {
      heading: "Set.prototype.has()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Set/has",
      pageTitle: "Set.prototype.has()",
    },
    {
      heading: "while",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/while",
      pageTitle: "while",
    },
    {
      heading: "Array.prototype.shift()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/shift",
      pageTitle: "Array.prototype.shift()",
    },
  ],
};
