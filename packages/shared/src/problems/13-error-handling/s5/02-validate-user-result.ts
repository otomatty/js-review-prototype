import type { Assignment } from "../../../types.js";

export const s5Ch13ValidateUserResult: Assignment = {
  id: "S5-Ch13-02-validate-user-result",
  stage: "S5",
  chapterId: "Ch13",
  sequence: 2,
  title: "多段検証を Result で繋ぐ — 最初の失敗で止めて伝播する",
  newConcept:
    "「1 ステップ 1 純粋関数」 で複数の検証を分解し、 各ステップが Result を返す。 集約関数は ok を入力に次のステップへ進み、 err が出た瞬間にそれをそのまま返す (= 失敗の早期伝播)。 例外を投げない設計",
  estimatedMinutes: 55,
  difficulty: 3,
  testKind: "function",
  description: `## やること

入力フォームの値 \`{ name, age, email }\` を **3 つの検証ステップ** に分け、 全部通れば整形済みのユーザを、 1 つでも落ちたら **最初の失敗だけ** を返す \`validateUser\` を作ります。 例外は投げません。 すべて Result 型 (\`{ ok: true, value } | { ok: false, error }\`) で表現します。

### 実装する関数

各検証関数は **その項目だけを返り値の \`value\` に入れた Result** を返します。 失敗時は \`{ ok: false, error: <文字列> }\` を返します。

1. \`parseName(input)\` —
   - \`input\` が string で、 \`.trim()\` が空でなければ \`{ ok: true, value: <trim 済み文字列> }\`。
   - そうでなければ \`{ ok: false, error: "name required" }\`。

2. \`parseAge(input)\` —
   - \`input\` が **整数 (\`Number.isInteger\`)** かつ \`0 <= input <= 150\` の範囲なら \`{ ok: true, value: <input> }\`。
   - そうでなければ \`{ ok: false, error: "invalid age" }\`。

3. \`parseEmail(input)\` —
   - \`input\` が string で **\`@\` を含む** なら \`{ ok: true, value: <input> }\`。
   - そうでなければ \`{ ok: false, error: "invalid email" }\`。

4. \`validateUser(input)\` — \`input\` は \`{ name, age, email }\` のオブジェクト。
   - 3 つの \`parseXxx\` を **\`name\` → \`age\` → \`email\` の順に呼ぶ**。
   - **最初に \`ok === false\` を返したステップの結果をそのまま返す** (= 失敗の早期伝播)。
   - すべて成功なら \`{ ok: true, value: { name, age, email } }\` を返す。 \`value\` の中身は **各ステップの \`value\`** (trim 済み name など) を使って組み立てる。

\`\`\`js
parseName("  Alice ");        // → { ok: true, value: "Alice" }
parseName("   ");             // → { ok: false, error: "name required" }
parseName(42);                // → { ok: false, error: "name required" }

parseAge(30);                 // → { ok: true, value: 30 }
parseAge(30.5);               // → { ok: false, error: "invalid age" }
parseAge(-1);                 // → { ok: false, error: "invalid age" }
parseAge("30");               // → { ok: false, error: "invalid age" }

parseEmail("a@example.com");  // → { ok: true, value: "a@example.com" }
parseEmail("noatmark");       // → { ok: false, error: "invalid email" }

validateUser({ name: "Bob", age: 20, email: "b@x.io" });
// → { ok: true, value: { name: "Bob", age: 20, email: "b@x.io" } }

validateUser({ name: "", age: 20, email: "b@x.io" });
// → { ok: false, error: "name required" }    (最初の失敗で止まる)

validateUser({ name: "Bob", age: 200, email: "x" });
// → { ok: false, error: "invalid age" }      (email より先に age が落ちる)
\`\`\`

### 守るべき設計

- **\`try\` / \`catch\` / \`throw\` を使わない**。 失敗は Result の \`{ ok: false, error }\` で表現する。
- 各 \`parseXxx\` は **入力 1 つ・項目 1 つ** だけを見る純粋関数。 入力オブジェクト全体を覗いたり、 他のフィールドを参照したりしない。
- \`validateUser\` は **早期 return** で失敗を伝播する。 \`parseName(...)\` の結果を変数に保持して \`if (!r.ok) { return r; }\` のように、 失敗時はその Result を **そのまま** 返す (新しいオブジェクトに作り直さない)。
- 成功時の \`value\` は **各 \`parseXxx\` の \`value\`** を使って組み立てる (\`parseName\` の \`value\` は trim 済みなので、 \`input.name\` を直接コピーしないこと)。

## ポイント

- これは S5 (設計演習) です。 「**1 つの関数で全部やる**」 のではなく、 **項目ごとに小さな純粋関数に分解** して、 上位関数 \`validateUser\` で **順次合成** します。 こうすると:
  - \`parseAge\` だけテストしたい時にすぐ単独で叩ける
  - ステップを足したい時 (例えば \`parsePhone\`) 上位関数に 1 行追加するだけで済む
  - 「\`age\` だけ検証する別画面」 のように **再利用** できる
- \`validateUser\` の中身は **連続した早期 return** で書くのが定番です:
  \`\`\`js
  const n = parseName(input.name);
  if (!n.ok) {
    return n;
  }
  // 以下、 age, email も同じパターン
  \`\`\`
  これが S4 の早期 return の発展形で、 「失敗の早期伝播」 という多段処理の定石です。
- 失敗時は **新しいオブジェクトに作り直さず**、 受け取った Result を **そのまま return** することで、 「どのステップで落ちたか」 の情報がそのまま呼び出し側に届きます。 作り直すと \`error\` の文字列をコピーし忘れるなどのバグが入りやすい。
- 成功時の \`value\` は **各ステップの \`value\`** を使う点に注意。 例えば \`parseName(" Alice ")\` は \`value: "Alice"\` を返すので、 上位関数では \`input.name\` をそのまま使ってはいけません (\`name: n.value\` のように受け取る)。
- AST で **TryStatement / ThrowStatement を禁止** しています。 例外機構を使わずに、 Result の if 分岐だけで失敗を伝播してください。
`,
  starterCode: `function parseName(input) {
  // typeof input === "string" && input.trim() !== "" なら ok({ value: trim 済み })
  // そうでなければ err("name required")
}

function parseAge(input) {
  // Number.isInteger(input) かつ 0 <= input <= 150 なら ok({ value: input })
  // そうでなければ err("invalid age")
}

function parseEmail(input) {
  // typeof input === "string" && input.includes("@") なら ok({ value: input })
  // そうでなければ err("invalid email")
}

function validateUser(input) {
  // 1) parseName(input.name) を呼び、 失敗ならそのまま return
  // 2) parseAge(input.age) を呼び、 失敗ならそのまま return
  // 3) parseEmail(input.email) を呼び、 失敗ならそのまま return
  // 4) 全部成功なら { ok: true, value: { name, age, email } } を返す
  //    name / age / email は 各 parseXxx の value を使うこと
}
`,
  entryPoints: ["parseName", "parseAge", "parseEmail", "validateUser"],
  demoCall: `console.log(validateUser({ name: "  Alice  ", age: 30, email: "a@example.com" }));`,
  tests: [
    {
      name: "parseName: 通常の文字列を trim して ok を返す",
      code: `(() => { const r = parseName("  Alice "); return r.ok === true && r.value === "Alice"; })()`,
    },
    {
      name: "parseName: trim 後に空文字なら err",
      code: `(() => { const r = parseName("   "); return r.ok === false && r.error === "name required"; })()`,
    },
    {
      name: "parseName: 空文字も err",
      code: `(() => { const r = parseName(""); return r.ok === false && r.error === "name required"; })()`,
    },
    {
      name: "parseName: 数値など 非文字列は err",
      code: `(() => { const r = parseName(42); return r.ok === false && r.error === "name required"; })()`,
    },
    {
      name: "parseName: undefined は err",
      code: `(() => { const r = parseName(undefined); return r.ok === false && r.error === "name required"; })()`,
    },
    {
      name: "parseAge: 範囲内の整数は ok",
      code: `(() => { const r = parseAge(30); return r.ok === true && r.value === 30; })()`,
    },
    {
      name: "parseAge: 0 と 150 は範囲内 (両端を含む)",
      code: `(() => { const a = parseAge(0); const b = parseAge(150); return a.ok === true && a.value === 0 && b.ok === true && b.value === 150; })()`,
    },
    {
      name: "parseAge: -1 は err",
      code: `(() => { const r = parseAge(-1); return r.ok === false && r.error === "invalid age"; })()`,
    },
    {
      name: "parseAge: 151 は err",
      code: `(() => { const r = parseAge(151); return r.ok === false && r.error === "invalid age"; })()`,
    },
    {
      name: "parseAge: 小数は err",
      code: `(() => { const r = parseAge(30.5); return r.ok === false && r.error === "invalid age"; })()`,
    },
    {
      name: "parseAge: 文字列 '30' は err",
      code: `(() => { const r = parseAge("30"); return r.ok === false && r.error === "invalid age"; })()`,
    },
    {
      name: "parseAge: NaN は err",
      code: `(() => { const r = parseAge(NaN); return r.ok === false && r.error === "invalid age"; })()`,
    },
    {
      name: "parseEmail: @ を含む文字列は ok",
      code: `(() => { const r = parseEmail("a@example.com"); return r.ok === true && r.value === "a@example.com"; })()`,
    },
    {
      name: "parseEmail: @ なしは err",
      code: `(() => { const r = parseEmail("noatmark"); return r.ok === false && r.error === "invalid email"; })()`,
    },
    {
      name: "parseEmail: 数値は err",
      code: `(() => { const r = parseEmail(42); return r.ok === false && r.error === "invalid email"; })()`,
    },
    {
      name: "validateUser: 全部成功で 整形済みオブジェクトを返す",
      code: `(() => {
        const r = validateUser({ name: "Bob", age: 20, email: "b@x.io" });
        return r.ok === true
          && r.value.name === "Bob"
          && r.value.age === 20
          && r.value.email === "b@x.io";
      })()`,
    },
    {
      name: "validateUser: name が trim される (parseName の value が使われている)",
      code: `(() => {
        const r = validateUser({ name: "  Alice  ", age: 20, email: "a@x.io" });
        return r.ok === true && r.value.name === "Alice";
      })()`,
    },
    {
      name: "validateUser: name 不正なら最初に name エラーを返す",
      code: `(() => {
        const r = validateUser({ name: "", age: 20, email: "b@x.io" });
        return r.ok === false && r.error === "name required";
      })()`,
    },
    {
      name: "validateUser: name OK で age 不正なら age エラー (email より先に止まる)",
      code: `(() => {
        const r = validateUser({ name: "Bob", age: 200, email: "noatmark" });
        return r.ok === false && r.error === "invalid age";
      })()`,
    },
    {
      name: "validateUser: name / age OK で email 不正なら email エラー",
      code: `(() => {
        const r = validateUser({ name: "Bob", age: 20, email: "noatmark" });
        return r.ok === false && r.error === "invalid email";
      })()`,
    },
    {
      name: "validateUser: 複数項目が同時に不正でも 最初 (name) のエラーだけを返す",
      code: `(() => {
        const r = validateUser({ name: "", age: "not-a-number", email: 999 });
        return r.ok === false && r.error === "name required";
      })()`,
    },
    {
      name: "validateUser: 例外を投げない (input が想定外でも throw しない)",
      code: `(() => {
        try {
          const r = validateUser({ name: null, age: null, email: null });
          return r.ok === false && r.error === "name required";
        } catch (e) {
          return false;
        }
      })()`,
    },
  ],
  hints: [
    "各 parseXxx は 1 つの if で ok / err を分岐します。 例: function parseName(input) { if (typeof input === 'string' && input.trim() !== '') { return { ok: true, value: input.trim() }; } return { ok: false, error: 'name required' }; }",
    "parseAge の整数判定は Number.isInteger(input) を使うのが安全です。 NaN や 文字列 '30' は false になります。 範囲は 0 <= input && input <= 150。",
    "parseEmail は input.includes('@') で十分。 ただし input が string でないと includes が無いので、 typeof input === 'string' を先に確認すること。",
    "validateUser では const n = parseName(input.name); if (!n.ok) { return n; } のように、 失敗を そのまま return して伝播します。 全部 ok まで通ったら { ok: true, value: { name: n.value, age: a.value, email: e.value } } を返します。",
    "解答例:\n```js\nfunction parseName(input) {\n  if (typeof input === 'string' && input.trim() !== '') {\n    return { ok: true, value: input.trim() };\n  }\n  return { ok: false, error: 'name required' };\n}\n\nfunction parseAge(input) {\n  if (Number.isInteger(input) && input >= 0 && input <= 150) {\n    return { ok: true, value: input };\n  }\n  return { ok: false, error: 'invalid age' };\n}\n\nfunction parseEmail(input) {\n  if (typeof input === 'string' && input.includes('@')) {\n    return { ok: true, value: input };\n  }\n  return { ok: false, error: 'invalid email' };\n}\n\nfunction validateUser(input) {\n  const n = parseName(input.name);\n  if (!n.ok) {\n    return n;\n  }\n  const a = parseAge(input.age);\n  if (!a.ok) {\n    return a;\n  }\n  const e = parseEmail(input.email);\n  if (!e.ok) {\n    return e;\n  }\n  return { ok: true, value: { name: n.value, age: a.value, email: e.value } };\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "FunctionDeclaration",
          label: "parseName / parseAge / parseEmail / validateUser を function 宣言する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "return で Result オブジェクトを返す",
        },
        {
          kind: "node",
          nodeType: "IfStatement",
          label: "if で ok / err を分岐する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
        {
          kind: "node",
          nodeType: "TryStatement",
          label: "try/catch を使わず、 Result の値で失敗を表現する",
        },
        {
          kind: "node",
          nodeType: "ThrowStatement",
          label: "throw を使わず、 Result の err を返す",
        },
      ],
    },
  },
  solution: `function parseName(input) {
  if (typeof input === "string" && input.trim() !== "") {
    return { ok: true, value: input.trim() };
  }
  return { ok: false, error: "name required" };
}

function parseAge(input) {
  if (Number.isInteger(input) && input >= 0 && input <= 150) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid age" };
}

function parseEmail(input) {
  if (typeof input === "string" && input.includes("@")) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid email" };
}

function validateUser(input) {
  const n = parseName(input.name);
  if (!n.ok) {
    return n;
  }
  const a = parseAge(input.age);
  if (!a.ok) {
    return a;
  }
  const e = parseEmail(input.email);
  if (!e.ok) {
    return e;
  }
  return { ok: true, value: { name: n.value, age: a.value, email: e.value } };
}
`,
  badSolutions: [
    {
      code: `function parseName(input) {
  if (typeof input === "string" && input.trim() !== "") {
    return { ok: true, value: input.trim() };
  }
  return { ok: false, error: "name required" };
}

function parseAge(input) {
  if (Number.isInteger(input) && input >= 0 && input <= 150) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid age" };
}

function parseEmail(input) {
  if (typeof input === "string" && input.includes("@")) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid email" };
}

function validateUser(input) {
  const n = parseName(input.name);
  if (!n.ok) {
    return n;
  }
  const a = parseAge(input.age);
  if (!a.ok) {
    return a;
  }
  return { ok: true, value: { name: n.value, age: a.value, email: input.email } };
}
`,
      description:
        "validateUser が parseEmail を呼び忘れている (email の検証ステップを丸ごとスキップ)。 「name / age OK で email 不正なら email エラー」 のテストで、 期待値 'invalid email' ではなく ok: true が返って失敗する",
    },
    {
      code: `function parseName(input) {
  if (typeof input === "string" && input.trim() !== "") {
    return { ok: true, value: input.trim() };
  }
  return { ok: false, error: "name required" };
}

function parseAge(input) {
  if (Number.isInteger(input) && input >= 0 && input <= 150) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid age" };
}

function parseEmail(input) {
  if (typeof input === "string" && input.includes("@")) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid email" };
}

function validateUser(input) {
  const n = parseName(input.name);
  if (!n.ok) {
    return n;
  }
  const a = parseAge(input.age);
  if (!a.ok) {
    return a;
  }
  const e = parseEmail(input.email);
  if (!e.ok) {
    return e;
  }
  return { ok: true, value: { name: input.name, age: input.age, email: input.email } };
}
`,
      description:
        "成功時の value で 各 parseXxx の value ではなく、 元の input をそのまま使ってしまう。 parseName が trim 済みの値を返しているのにそれを使わないため、 「name が trim される」 テストが失敗する",
    },
    {
      code: `function parseName(input) {
  if (typeof input === "string" && input.trim() !== "") {
    return { ok: true, value: input.trim() };
  }
  throw new Error("name required");
}

function parseAge(input) {
  if (Number.isInteger(input) && input >= 0 && input <= 150) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid age" };
}

function parseEmail(input) {
  if (typeof input === "string" && input.includes("@")) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid email" };
}

function validateUser(input) {
  try {
    const n = parseName(input.name);
    const a = parseAge(input.age);
    const e = parseEmail(input.email);
    if (!a.ok) {
      return a;
    }
    if (!e.ok) {
      return e;
    }
    return { ok: true, value: { name: n.value, age: a.value, email: e.value } };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
`,
      description:
        "parseName が throw して、 validateUser が try/catch で受けている。 AST forbidden の ThrowStatement / TryStatement に違反する。 失敗を 「値として持ち回る」 という設計に反する",
    },
    {
      code: `function parseName(input) {
  if (typeof input === "string" && input.trim() !== "") {
    return { ok: true, value: input.trim() };
  }
  return { ok: false, error: "name required" };
}

function parseAge(input) {
  if (typeof input === "number" && input >= 0 && input <= 150) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid age" };
}

function parseEmail(input) {
  if (typeof input === "string" && input.includes("@")) {
    return { ok: true, value: input };
  }
  return { ok: false, error: "invalid email" };
}

function validateUser(input) {
  const n = parseName(input.name);
  if (!n.ok) {
    return n;
  }
  const a = parseAge(input.age);
  if (!a.ok) {
    return a;
  }
  const e = parseEmail(input.email);
  if (!e.ok) {
    return e;
  }
  return { ok: true, value: { name: n.value, age: a.value, email: e.value } };
}
`,
      description:
        "parseAge の整数判定が typeof === 'number' になっていて、 小数 30.5 や NaN が ok と判定されてしまう。 「parseAge: 小数は err」 / 「parseAge: NaN は err」 のテストが失敗する",
    },
  ],
  mdnSections: [
    {
      heading: "Number.isInteger",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger",
      pageTitle: "Number.isInteger",
    },
    {
      heading: "String.prototype.includes",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/includes",
      pageTitle: "String.prototype.includes",
    },
    {
      heading: "String.prototype.trim",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/trim",
      pageTitle: "String.prototype.trim",
    },
  ],
};
