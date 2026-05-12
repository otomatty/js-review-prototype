import type { Assignment } from "../../../types.js";

export const s5Ch13TryAllCapstone: Assignment = {
  id: "S5-Ch13-03-try-all-capstone",
  stage: "S5",
  chapterId: "Ch13",
  sequence: 3,
  title:
    "[卒業課題] tryAll / attempt / loadConfig — 例外を Result に変換し、 複数戦略を順に試して既定値にフォールバックする",
  newConcept:
    "「例外を投げる関数」 と 「Result で失敗を表す関数」 を橋渡しする \`attempt\`、 複数の戦略を順に試す \`tryAll\`、 ぜんぶ失敗したら既定値で穴埋めする \`loadConfig\` を 1 セットで設計する。 例外あり / 例外なしの世界を 1 か所 (attempt) に閉じ込め、 上位ロジックは Result だけで動かす Ch13 S5 卒業課題",
  estimatedMinutes: 75,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

これは **Ch13 S5 卒業課題** です。 Ch13 で学んだ try/catch / カスタム Error / Result 型を 「**実用的な多段フォールバック設計**」 にまとめます。

設定値のロードを想定します。 「環境変数を読む」 「設定ファイルを読む」 「リモート API から取る」 などの **複数のソース** を順に試して、 1 つでも値が取れたらそれを使い、 全部失敗したら **既定値** にフォールバックする、 というよくある形を設計します。

### 実装する関数

1. \`attempt(fn)\` —
   - 引数なしの関数 \`fn\` を 1 度呼ぶ。
   - 成功 (例外が出ない) 時は \`{ ok: true, value: <戻り値> }\`。
   - 例外時は \`{ ok: false, error: <e.message があれば e.message、 そうでなければ String(e)> }\`。
   - **唯一 try/catch を使ってよい関数**。 ここで 「例外あり」 の世界を 「Result の世界」 に変換し、 以降のロジックを純粋にする。

2. \`tryAll(fns)\` —
   - 関数の配列 \`fns\` (各要素は \`() => Result\` の形。 \`attempt\` でラップ済みでも、 自前で Result を返すものでも可) を **左から順に** 呼ぶ。
   - **最初に \`ok === true\` を返した時点でその Result を返し**、 残りは呼ばない。
   - すべて \`ok === false\` だった場合は **最後に評価した Result** をそのまま返す。
   - \`fns\` が空配列なら \`{ ok: false, error: "no attempts" }\` を返す。
   - この関数は **\`try\` / \`catch\` / \`throw\` を使わない** (各 \`fn\` がすでに Result を返している前提)。

3. \`loadConfig(sources, fallback)\` —
   - \`sources\` は **値を返す (が例外を投げる可能性がある) 関数の配列** \`[() => any, () => any, ...]\`。
   - \`fallback\` は何でも良い既定値。
   - \`sources\` を \`attempt\` でラップして \`tryAll\` に渡し、 最初に成功した値を返す。
   - すべて失敗したら \`fallback\` を返す。
   - \`sources\` が空配列なら \`fallback\` を返す。
   - この関数は **\`try\` / \`catch\` / \`throw\` を使わない** (例外処理は \`attempt\` の中に閉じ込めるため)。

\`\`\`js
// attempt
attempt(() => 42);                                  // → { ok: true, value: 42 }
attempt(() => { throw new Error("boom"); });        // → { ok: false, error: "boom" }
attempt(() => { throw new TypeError("bad"); });     // → { ok: false, error: "bad" }
attempt(() => { throw "string-throw"; });           // → { ok: false, error: "string-throw" }  (e.message が無いケース)

// tryAll
tryAll([
  () => ({ ok: false, error: "1st failed" }),
  () => ({ ok: true,  value: "2nd ok" }),
  () => { throw new Error("must not run"); },       // ← 呼ばれない
]);
// → { ok: true, value: "2nd ok" }

tryAll([
  () => ({ ok: false, error: "a" }),
  () => ({ ok: false, error: "b" }),
  () => ({ ok: false, error: "c" }),
]);
// → { ok: false, error: "c" }    (最後に評価した Result)

tryAll([]);
// → { ok: false, error: "no attempts" }

// loadConfig
loadConfig([
  () => { throw new Error("env missing"); },        // 失敗
  () => "from-file",                                // 成功
  () => { throw new Error("never reached"); },      // 呼ばれない
], "default");
// → "from-file"

loadConfig([
  () => { throw new Error("a"); },
  () => { throw new Error("b"); },
], "default");
// → "default"

loadConfig([], "default");
// → "default"
\`\`\`

### 守るべき設計

- **\`try\` / \`catch\` は \`attempt\` の中だけ** に書く (= 例外処理を 1 箇所に閉じ込める)。 \`tryAll\` / \`loadConfig\` には書かない。
- \`tryAll\` は **早期離脱**: 成功した瞬間に return する。 「全部呼んでから結果を集める」 のではない。
- \`loadConfig\` は **\`attempt\` と \`tryAll\` を組み合わせて作る**。 「例外を投げる関数の配列」 から 「Result を返す関数の配列」 を作るのが \`attempt\` の役割。
- \`var\` は使わない。 \`==\` / \`!=\` も使わない。

## ポイント

- これは **Ch13 S5 卒業課題**。 ここまでの学習を 1 つの設計に統合します:
  - **S3-Ch13-04 (attempt-result)** で習った Result 型を、 設計の根幹に据える
  - **S4-Ch13-03 (retry)** で習ったフォールバック戦略を、 「同じ関数を N 回」 ではなく 「**違う関数を 1 回ずつ**」 に一般化する
  - **S5-Ch13-01 (chain-result)** の Result 型コンビネータの考え方を、 配列のループに乗せる
- ポイントは **「例外を投げる世界」 と 「Result の世界」 の境界を 1 か所 (\`attempt\`) に閉じ込める** こと。 これは関数型プログラミングで言う 「FFI 境界」 や 「アダプタ層」 の発想です。 内側を全部 Result にしてしまえば、 上位のロジック (\`tryAll\` / \`loadConfig\`) は純粋関数だけで書けます。 純粋にできれば、 副作用が起きるタイミングが明確になり、 テストもしやすくなります。
- \`tryAll\` で 「最後に評価した Result を返す」 のは設計判断です。 「最初の err を返す」 「すべての err を集める」 など他の選択もあり得ますが、 「最新の失敗理由が一番ヒントになる」 と考えるなら 「最後の err」 が自然。 ここで設計判断を意識して書いてみてください。
- \`loadConfig\` の中身は \`sources.map((fn) => () => attempt(fn))\` のように \`attempt\` を 1 段噛ませた配列を作ると、 そのまま \`tryAll\` に渡せて綺麗にまとまります。 これが S5 の高階関数の応用です。
- AST で **TryStatement / ReturnStatement / FunctionDeclaration** を必須にしています (\`attempt\` で 1 個 \`try\` が必要)。 \`tryAll\` の早期離脱用に for ループも前提です。
- \`tryAll\` / \`loadConfig\` で **\`try\` / \`catch\` を使わない** ことは厳密にはチェックしませんが、 設計指針として 「例外処理は \`attempt\` の中だけ」 を守ってください。 「失敗を値として持ち回る」 のが Result 設計の利点です。
`,
  starterCode: `// 1) 例外を Result に変換する境界
function attempt(fn) {
  // try { return { ok: true, value: fn() }; }
  // catch (e) { return { ok: false, error: e?.message ?? String(e) }; }
}

// 2) Result を返す関数の配列を順に試す。 最初の ok で打ち切る
function tryAll(fns) {
  // 空配列なら { ok: false, error: "no attempts" }
  // for で 1 つずつ呼ぶ。 ok ならその結果を return
  // 全部失敗なら 最後に評価した Result を return
}

// 3) attempt と tryAll を組み合わせ、 全失敗なら fallback で穴埋め
function loadConfig(sources, fallback) {
  // sources の各 fn を attempt でラップし、 tryAll に渡す
  // 結果が ok なら value を、 そうでなければ fallback を返す
}
`,
  entryPoints: ["attempt", "tryAll", "loadConfig"],
  demoCall: `console.log(loadConfig([
  () => { throw new Error("env missing"); },
  () => "from-file",
], "default"));`,
  tests: [
    {
      name: "attempt: 成功時 ok: true, value: 戻り値",
      code: `(() => { const r = attempt(() => 42); return r.ok === true && r.value === 42; })()`,
    },
    {
      name: "attempt: 例外時 ok: false, error: e.message",
      code: `(() => { const r = attempt(() => { throw new Error("boom"); }); return r.ok === false && r.error === "boom"; })()`,
    },
    {
      name: "attempt: TypeError など派生 Error でも e.message",
      code: `(() => { const r = attempt(() => { throw new TypeError("bad"); }); return r.ok === false && r.error === "bad"; })()`,
    },
    {
      name: "attempt: 文字列 throw は String(e) で error に入る",
      code: `(() => { const r = attempt(() => { throw "string-throw"; }); return r.ok === false && r.error === "string-throw"; })()`,
    },
    {
      name: "attempt: 戻り値 0 / false / null も成功扱い (例外じゃないので)",
      code: `(() => {
        const a = attempt(() => 0);
        const b = attempt(() => false);
        const c = attempt(() => null);
        return a.ok === true && a.value === 0
          && b.ok === true && b.value === false
          && c.ok === true && c.value === null;
      })()`,
    },
    {
      name: "tryAll: 最初の ok を返す",
      code: `(() => {
        const r = tryAll([
          () => ({ ok: false, error: "1st" }),
          () => ({ ok: true, value: "won" }),
          () => ({ ok: true, value: "later" }),
        ]);
        return r.ok === true && r.value === "won";
      })()`,
    },
    {
      name: "tryAll: 1 番目で成功すれば 残りは呼ばれない",
      code: `(() => {
        let calls = 0;
        const r = tryAll([
          () => { calls += 1; return { ok: true, value: "first" }; },
          () => { calls += 1; return { ok: true, value: "second" }; },
        ]);
        return r.ok === true && r.value === "first" && calls === 1;
      })()`,
    },
    {
      name: "tryAll: 途中で成功したら 以降は呼ばれない",
      code: `(() => {
        let calls = 0;
        const r = tryAll([
          () => { calls += 1; return { ok: false, error: "a" }; },
          () => { calls += 1; return { ok: false, error: "b" }; },
          () => { calls += 1; return { ok: true, value: "ok-here" }; },
          () => { calls += 1; return { ok: true, value: "never" }; },
        ]);
        return r.ok === true && r.value === "ok-here" && calls === 3;
      })()`,
    },
    {
      name: "tryAll: 全部失敗したら 最後に評価した Result を返す",
      code: `(() => {
        const r = tryAll([
          () => ({ ok: false, error: "a" }),
          () => ({ ok: false, error: "b" }),
          () => ({ ok: false, error: "c" }),
        ]);
        return r.ok === false && r.error === "c";
      })()`,
    },
    {
      name: "tryAll: 空配列なら { ok: false, error: 'no attempts' }",
      code: `(() => {
        const r = tryAll([]);
        return r.ok === false && r.error === "no attempts";
      })()`,
    },
    {
      name: "tryAll: 各 fn は順番に呼ばれる",
      code: `(() => {
        const order = [];
        tryAll([
          () => { order.push("a"); return { ok: false, error: "a" }; },
          () => { order.push("b"); return { ok: false, error: "b" }; },
          () => { order.push("c"); return { ok: true, value: 1 }; },
          () => { order.push("d"); return { ok: true, value: 2 }; },
        ]);
        return order.join(",") === "a,b,c";
      })()`,
    },
    {
      name: "loadConfig: 最初の成功した source の値を返す",
      code: `(() => {
        const v = loadConfig([
          () => { throw new Error("env missing"); },
          () => "from-file",
          () => "never",
        ], "default");
        return v === "from-file";
      })()`,
    },
    {
      name: "loadConfig: 1 番目で成功すれば そのまま返す",
      code: `(() => {
        let calls = 0;
        const v = loadConfig([
          () => { calls += 1; return "first"; },
          () => { calls += 1; return "second"; },
        ], "default");
        return v === "first" && calls === 1;
      })()`,
    },
    {
      name: "loadConfig: 全 source 失敗なら fallback を返す",
      code: `(() => {
        const v = loadConfig([
          () => { throw new Error("a"); },
          () => { throw new Error("b"); },
        ], "default");
        return v === "default";
      })()`,
    },
    {
      name: "loadConfig: sources が空なら fallback",
      code: `(() => {
        const v = loadConfig([], "default");
        return v === "default";
      })()`,
    },
    {
      name: "loadConfig: 0 / false / null のような falsy な戻り値も 成功扱い (例外じゃないので)",
      code: `(() => {
        const a = loadConfig([() => 0], "fallback");
        const b = loadConfig([() => false], "fallback");
        const c = loadConfig([() => null], "fallback");
        return a === 0 && b === false && c === null;
      })()`,
    },
    {
      name: "loadConfig: 任意の値 (オブジェクト) も 返す",
      code: `(() => {
        const obj = { host: "x", port: 80 };
        const v = loadConfig([
          () => { throw new Error("nope"); },
          () => obj,
        ], { host: "default" });
        return v === obj;
      })()`,
    },
    {
      name: "loadConfig: fallback は値そのまま (関数として呼ばない)",
      code: `(() => {
        const fb = () => "called?";
        const v = loadConfig([() => { throw new Error("x"); }], fb);
        return v === fb;
      })()`,
    },
    {
      name: "loadConfig: 失敗時に後続を試す (フォールバックの逐次性)",
      code: `(() => {
        const order = [];
        const v = loadConfig([
          () => { order.push("a"); throw new Error("a"); },
          () => { order.push("b"); throw new Error("b"); },
          () => { order.push("c"); return "ok"; },
          () => { order.push("d"); return "never"; },
        ], "default");
        return v === "ok" && order.join(",") === "a,b,c";
      })()`,
    },
  ],
  hints: [
    "attempt は try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: e instanceof Error ? e.message : String(e) }; } のように 1 行ずつ。 e.message が無いケース (文字列を throw されたなど) でも壊れないようにする。",
    "tryAll は if (fns.length === 0) で空配列を最初に弾き、 for ループで 1 つずつ呼んで ok なら即 return、 最後まで通ったら 最後の Result を return します。 last という変数を更新しながら for で回すのが楽です。",
    "loadConfig は const wrapped = sources.map((fn) => () => attempt(fn)); で 「Result を返す関数の配列」 に変換し、 tryAll(wrapped) で結果を取り、 ok なら value、 そうでなければ fallback を返します。 例外処理を attempt の中に押し込めるのがポイント。",
    "解答例:\n```js\nfunction attempt(fn) {\n  try {\n    return { ok: true, value: fn() };\n  } catch (e) {\n    return { ok: false, error: e instanceof Error ? e.message : String(e) };\n  }\n}\n\nfunction tryAll(fns) {\n  if (fns.length === 0) {\n    return { ok: false, error: 'no attempts' };\n  }\n  let last = { ok: false, error: 'no attempts' };\n  for (const fn of fns) {\n    last = fn();\n    if (last.ok) {\n      return last;\n    }\n  }\n  return last;\n}\n\nfunction loadConfig(sources, fallback) {\n  const wrapped = sources.map((fn) => () => attempt(fn));\n  const result = tryAll(wrapped);\n  if (result.ok) {\n    return result.value;\n  }\n  return fallback;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "FunctionDeclaration",
          label: "attempt / tryAll / loadConfig を function 宣言する",
        },
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "attempt で try/catch を使い 例外を Result に変換する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "return で結果や fallback を返す",
        },
        {
          kind: "node",
          nodeType: "ForOfStatement",
          label: "tryAll で各 fn を 順番に呼ぶループを書く (for...of)",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function attempt(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function tryAll(fns) {
  if (fns.length === 0) {
    return { ok: false, error: "no attempts" };
  }
  let last = { ok: false, error: "no attempts" };
  for (const fn of fns) {
    last = fn();
    if (last.ok) {
      return last;
    }
  }
  return last;
}

function loadConfig(sources, fallback) {
  const wrapped = sources.map((fn) => () => attempt(fn));
  const result = tryAll(wrapped);
  if (result.ok) {
    return result.value;
  }
  return fallback;
}
`,
  badSolutions: [
    {
      code: `function attempt(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function tryAll(fns) {
  if (fns.length === 0) {
    return { ok: false, error: "no attempts" };
  }
  const results = fns.map((fn) => fn());
  const found = results.find((r) => r.ok);
  if (found) {
    return found;
  }
  return results[results.length - 1];
}

function loadConfig(sources, fallback) {
  const wrapped = sources.map((fn) => () => attempt(fn));
  const result = tryAll(wrapped);
  if (result.ok) {
    return result.value;
  }
  return fallback;
}
`,
      description:
        "tryAll が fns.map で 先に全部呼んでしまっている。 「成功したら以降は呼ばない」 という早期離脱が破れており、 「1 番目で成功すれば 残りは呼ばれない」 「途中で成功したら 以降は呼ばれない」 系のテストが失敗する。 また、 各 fn が副作用を持つケースで予期しない実行が起きる",
    },
    {
      code: `function attempt(fn) {
  return { ok: true, value: fn() };
}

function tryAll(fns) {
  if (fns.length === 0) {
    return { ok: false, error: "no attempts" };
  }
  let last = { ok: false, error: "no attempts" };
  for (const fn of fns) {
    last = fn();
    if (last.ok) {
      return last;
    }
  }
  return last;
}

function loadConfig(sources, fallback) {
  const wrapped = sources.map((fn) => () => attempt(fn));
  const result = tryAll(wrapped);
  if (result.ok) {
    return result.value;
  }
  return fallback;
}
`,
      description:
        "attempt が try/catch を使っていない (Try ステートメント無し)。 例外を捕まえずそのまま投げてしまうので、 loadConfig の 「最初の source が throw する → 2 番目を試す」 という動きが壊れて 「最初の成功した source の値を返す」 テストが失敗する。 AST required の TryStatement も未充足",
    },
    {
      code: `function attempt(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function tryAll(fns) {
  if (fns.length === 0) {
    return { ok: false, error: "no attempts" };
  }
  let first = null;
  for (const fn of fns) {
    const r = fn();
    if (r.ok) {
      return r;
    }
    if (first === null) {
      first = r;
    }
  }
  return first;
}

function loadConfig(sources, fallback) {
  const wrapped = sources.map((fn) => () => attempt(fn));
  const result = tryAll(wrapped);
  if (result.ok) {
    return result.value;
  }
  return fallback;
}
`,
      description:
        "tryAll が 全部失敗したときに 「最初の err」 を返してしまっている。 仕様は 「最後に評価した Result を返す」 なので、 「全部失敗したら error: 'c' が返る」 テストで error: 'a' になり失敗する",
    },
    {
      code: `function attempt(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function tryAll(fns) {
  if (fns.length === 0) {
    return { ok: false, error: "no attempts" };
  }
  let last = { ok: false, error: "no attempts" };
  for (const fn of fns) {
    last = fn();
    if (last.ok) {
      return last;
    }
  }
  return last;
}

function loadConfig(sources, fallback) {
  const wrapped = sources.map((fn) => () => attempt(fn));
  const result = tryAll(wrapped);
  if (result.ok) {
    return result;
  }
  return fallback;
}
`,
      description:
        "loadConfig が ok 時に result.value ではなく result (= Result オブジェクトそのもの) を返してしまっている。 期待される 'from-file' などの素の値ではなく { ok: true, value: 'from-file' } が返るため、 loadConfig の成功系テストがすべて失敗する",
    },
  ],
  mdnSections: [
    {
      heading: "try...catch",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch",
      pageTitle: "try...catch",
    },
    {
      heading: "Error.prototype.message",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/message",
      pageTitle: "Error.prototype.message",
    },
    {
      heading: "Array.prototype.map",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
      pageTitle: "Array.prototype.map",
    },
  ],
};
