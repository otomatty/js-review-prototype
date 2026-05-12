import type { Assignment } from "../../../types.js";

export const s5Ch13ChainResult: Assignment = {
  id: "S5-Ch13-01-chain-result",
  stage: "S5",
  chapterId: "Ch13",
  sequence: 1,
  title: "Result 型のコンビネータを設計する (ok / err / chainResult / mapResult / withDefault)",
  newConcept:
    "Result 型 (`{ ok: true, value } | { ok: false, error }`) のコンストラクタと「ok なら次に進める / err ならそのまま伝播する」 という高階関数を 1 セットで設計する。 例外を投げない・受けない純粋関数で失敗を値として扱う",
  estimatedMinutes: 50,
  difficulty: 3,
  testKind: "function",
  description: `## やること

S3 で扱った Result パターン (\`{ ok: true, value } | { ok: false, error }\`) を、 **コンストラクタ** と **チェーン用の高階関数** に分けて再設計します。 例外を投げない・受けない (\`try\` / \`catch\` / \`throw\` を使わない) 純粋関数の世界で、 「失敗を値として持ち回る」 設計を体験します。

### 実装する関数

1. \`ok(value)\` — \`{ ok: true, value }\` を返す **コンストラクタ**。
2. \`err(error)\` — \`{ ok: false, error }\` を返す **コンストラクタ**。
3. \`chainResult(result, fn)\` —
   - \`result.ok === true\` なら、 \`fn(result.value)\` を呼んでその **戻り値 (Result)** をそのまま返す。 \`fn\` は **Result を返す関数**。
   - \`result.ok === false\` なら、 \`result\` をそのまま返す (= 失敗を伝播)。
4. \`mapResult(result, fn)\` —
   - \`result.ok === true\` なら、 \`fn(result.value)\` の戻り値を \`ok(...)\` で包んだ Result を返す。 \`fn\` は **生の値を返す関数** (Result ではない)。
   - \`result.ok === false\` なら、 \`result\` をそのまま返す。
5. \`withDefault(result, defaultValue)\` —
   - \`result.ok === true\` なら \`result.value\` を返す。
   - \`result.ok === false\` なら \`defaultValue\` を返す。

\`\`\`js
ok(42);                                  // → { ok: true, value: 42 }
err("oops");                             // → { ok: false, error: "oops" }

const r1 = chainResult(ok(3), (n) => ok(n * 2));      // → { ok: true, value: 6 }
const r2 = chainResult(err("x"), (n) => ok(n * 2));   // → { ok: false, error: "x" }   (fn は呼ばれない)
const r3 = chainResult(ok(0), (n) =>
  n === 0 ? err("zero!") : ok(10 / n));               // → { ok: false, error: "zero!" }

mapResult(ok(3), (n) => n + 1);          // → { ok: true, value: 4 }
mapResult(err("x"), (n) => n + 1);       // → { ok: false, error: "x" }

withDefault(ok(7), 0);                   // → 7
withDefault(err("x"), 0);                // → 0
\`\`\`

### 守るべき設計

- **\`try\` / \`catch\` / \`throw\` を使わない**。 失敗は Result の \`{ ok: false, error }\` で表現する。 \`chainResult\` / \`mapResult\` / \`withDefault\` のいずれも例外を投げない。
- \`chainResult\` の \`fn\` は **Result を返す**、 \`mapResult\` の \`fn\` は **生の値を返す**。 役割が違うので両方用意する。 これにより 「Result を返す関数同士のチェーン」 と 「ok 時の値だけを変換する」 を書き分けられる。
- \`chainResult(err(e), fn)\` のとき、 \`fn\` は **呼び出さない** こと (= 失敗時は副作用も計算もスキップする)。 \`mapResult\` も同様。
- \`var\` は使わない。 \`==\` / \`!=\` も使わない (\`result.ok === true\` のように厳密比較で書く)。

## ポイント

- これは S5 (設計演習) です。 **「失敗を例外で投げるか、 値として持ち回るか」** という設計判断のうち、 後者を徹底するパターンを練習します。 例外なき設計には次の利点があります:
  - 関数の戻り値の型を見るだけで 「失敗するかもしれない」 ことが分かる (\`try/catch\` で囲み忘れる事故が減る)
  - 純粋関数のまま合成できる (\`chainResult\` を 2 段、 3 段と繋いでも同じ規則)
- \`chainResult\` は **bind / flatMap / >>=** とも呼ばれる、 関数型プログラミングの基本部品です。 「Result を返す関数」 を直列に繋ぐと、 途中に 1 つでも \`err\` が出た瞬間に **以降の処理がすべてスキップ** され、 最初の失敗がそのまま末端まで運ばれます。 これが 「**失敗の伝播**」 の正体です。
- \`mapResult\` は **chainResult の特殊形** ですが、 「fn が常に成功する (Result を返さない単純な変換)」 ことが分かっているケースで使うと、 呼び出し側が \`ok(...)\` で包む手間を省けて読みやすくなります。
- \`withDefault\` は **チェーンの終端**。 「失敗時は既定値で穴埋めして、 ふつうの値に戻す」 ためのコンビネータ。 次の問題で \`validateUser\` のような多段チェーンの最後に使えます。
- AST で **TryStatement / ThrowStatement / CatchClause を禁止** しています。 例外機構に頼らず、 Result の分岐 (\`if (result.ok)\`) だけで設計してください。
`,
  starterCode: `// 1) コンストラクタ
function ok(value) {
  // { ok: true, value } を返す
}

function err(error) {
  // { ok: false, error } を返す
}

// 2) Result を返す関数を繋ぐ高階関数
function chainResult(result, fn) {
  // result.ok なら fn(result.value) を呼んでその戻り値 (Result) を返す
  // そうでなければ result をそのまま返す
}

// 3) ok のときだけ value を変換する (fn は生の値を返す)
function mapResult(result, fn) {
  // result.ok なら ok(fn(result.value)) を返す
  // そうでなければ result をそのまま返す
}

// 4) 失敗時の既定値で「ふつうの値」 に落とす
function withDefault(result, defaultValue) {
  // result.ok なら result.value、 そうでなければ defaultValue
}
`,
  entryPoints: ["ok", "err", "chainResult", "mapResult", "withDefault"],
  demoCall: `console.log(withDefault(chainResult(ok(3), (n) => ok(n * 2)), 0));`,
  tests: [
    {
      name: "ok(42) は { ok: true, value: 42 } を返す",
      code: `(() => { const r = ok(42); return r.ok === true && r.value === 42; })()`,
    },
    {
      name: "err('x') は { ok: false, error: 'x' } を返す",
      code: `(() => { const r = err("x"); return r.ok === false && r.error === "x"; })()`,
    },
    {
      name: "ok は任意の値を保持する (オブジェクトでもそのまま)",
      code: `(() => { const v = { a: 1 }; const r = ok(v); return r.ok === true && r.value === v; })()`,
    },
    {
      name: "chainResult(ok, fn): fn の戻り値 (Result) をそのまま返す",
      code: `(() => { const r = chainResult(ok(3), (n) => ok(n * 2)); return r.ok === true && r.value === 6; })()`,
    },
    {
      name: "chainResult(err, fn): err をそのまま返し fn は呼ばれない",
      code: `(() => { let called = false; const r = chainResult(err("x"), (n) => { called = true; return ok(n); }); return r.ok === false && r.error === "x" && called === false; })()`,
    },
    {
      name: "chainResult(ok, fn): fn が err を返したら err を返す",
      code: `(() => { const r = chainResult(ok(0), (n) => n === 0 ? err("zero") : ok(10 / n)); return r.ok === false && r.error === "zero"; })()`,
    },
    {
      name: "chainResult は 3 段繋いでも最初の err で止まる",
      code: `(() => {
        const r = chainResult(
          chainResult(
            chainResult(ok(1), (n) => ok(n + 1)),
            (n) => err("stop"),
          ),
          (n) => { throw new Error("must not run"); },
        );
        return r.ok === false && r.error === "stop";
      })()`,
    },
    {
      name: "chainResult は全段成功すれば最後の ok を返す",
      code: `(() => {
        const r = chainResult(
          chainResult(
            chainResult(ok(2), (n) => ok(n + 3)),
            (n) => ok(n * 10),
          ),
          (n) => ok(n - 5),
        );
        return r.ok === true && r.value === 45;
      })()`,
    },
    {
      name: "mapResult(ok, fn): ok(fn(value)) を返す",
      code: `(() => { const r = mapResult(ok(3), (n) => n + 1); return r.ok === true && r.value === 4; })()`,
    },
    {
      name: "mapResult(err, fn): err をそのまま返し fn は呼ばれない",
      code: `(() => { let called = false; const r = mapResult(err("x"), (n) => { called = true; return n; }); return r.ok === false && r.error === "x" && called === false; })()`,
    },
    {
      name: "mapResult は fn の戻り値をそのまま value にする (Result で包み直さない)",
      code: `(() => { const r = mapResult(ok(2), (n) => ({ doubled: n * 2 })); return r.ok === true && r.value.doubled === 4; })()`,
    },
    {
      name: "withDefault(ok(7), 0) は 7",
      code: `withDefault(ok(7), 0) === 7`,
    },
    {
      name: "withDefault(err('x'), 0) は 0",
      code: `withDefault(err("x"), 0) === 0`,
    },
    {
      name: "withDefault は ok の value を そのまま (型変換しない)",
      code: `(() => { const obj = { a: 1 }; return withDefault(ok(obj), null) === obj; })()`,
    },
    {
      name: "コンビネータを組み合わせて使える: chainResult → mapResult → withDefault",
      code: `(() => {
        const r = withDefault(
          mapResult(
            chainResult(ok(4), (n) => n > 0 ? ok(n) : err("nonpositive")),
            (n) => n * 100,
          ),
          -1,
        );
        return r === 400;
      })()`,
    },
    {
      name: "err は途中で混ざっても伝播し、 最後の withDefault で既定値に落ちる",
      code: `(() => {
        const r = withDefault(
          mapResult(
            chainResult(ok(-1), (n) => n > 0 ? ok(n) : err("nonpositive")),
            (n) => n * 100,
          ),
          -1,
        );
        return r === -1;
      })()`,
    },
  ],
  hints: [
    "ok / err はオブジェクトリテラルを return するだけの 1 行関数です。 { ok: true, value } と { ok: false, error } を返します。",
    "chainResult は if (result.ok) { return fn(result.value); } return result; の 2 行で書けます。 fn は Result を返す関数なので、 包み直さずそのまま return することがポイント。",
    "mapResult は chainResult の特殊形ですが、 自分で書くと内部の違いがよく分かります: if (result.ok) { return ok(fn(result.value)); } return result;",
    "withDefault は if (result.ok) { return result.value; } return defaultValue; の 2 行。 err の中身 (error) は捨てて defaultValue を返します。",
    "解答例:\n```js\nfunction ok(value) {\n  return { ok: true, value };\n}\n\nfunction err(error) {\n  return { ok: false, error };\n}\n\nfunction chainResult(result, fn) {\n  if (result.ok) {\n    return fn(result.value);\n  }\n  return result;\n}\n\nfunction mapResult(result, fn) {\n  if (result.ok) {\n    return ok(fn(result.value));\n  }\n  return result;\n}\n\nfunction withDefault(result, defaultValue) {\n  if (result.ok) {\n    return result.value;\n  }\n  return defaultValue;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "FunctionDeclaration",
          label: "ok / err / chainResult / mapResult / withDefault を function 宣言する",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "return で Result オブジェクトや既定値を返す",
        },
        {
          kind: "node",
          nodeType: "IfStatement",
          label: "if (result.ok) で成功/失敗を分岐する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない (=== / !== を使う)" },
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
  solution: `function ok(value) {
  return { ok: true, value };
}

function err(error) {
  return { ok: false, error };
}

function chainResult(result, fn) {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}

function mapResult(result, fn) {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

function withDefault(result, defaultValue) {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}
`,
  badSolutions: [
    {
      code: `function ok(value) {
  return { ok: true, value };
}

function err(error) {
  return { ok: false, error };
}

function chainResult(result, fn) {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

function mapResult(result, fn) {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

function withDefault(result, defaultValue) {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}
`,
      description:
        "chainResult が fn の戻り値 (Result) を ok(...) で二重に包んでしまっている。 fn が err を返したケースで err が ok({ ok: false, error: ... }) に化けて、 「fn が err を返したら err を返す」 テストが失敗する",
    },
    {
      code: `function ok(value) {
  return { ok: true, value };
}

function err(error) {
  return { ok: false, error };
}

function chainResult(result, fn) {
  const next = fn(result.value);
  if (result.ok) {
    return next;
  }
  return result;
}

function mapResult(result, fn) {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

function withDefault(result, defaultValue) {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}
`,
      description:
        "chainResult が err のときも fn を呼んでしまっている。 「err のとき fn は呼ばれない」 テストが失敗する。 また、 err.value は undefined なので副作用つきの fn は予期しない挙動を起こす",
    },
    {
      code: `function ok(value) {
  return { ok: true, value };
}

function err(error) {
  return { ok: false, error };
}

function chainResult(result, fn) {
  try {
    if (result.ok) {
      return fn(result.value);
    }
    return result;
  } catch (e) {
    return err(e.message);
  }
}

function mapResult(result, fn) {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

function withDefault(result, defaultValue) {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}
`,
      description:
        "try/catch を使って例外を握っているが、 設計指針は 「例外を投げない・受けない」。 AST forbidden の TryStatement に違反する",
    },
    {
      code: `function ok(value) {
  return { ok: true, value };
}

function err(error) {
  return { ok: false, error };
}

function chainResult(result, fn) {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}

function mapResult(result, fn) {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}

function withDefault(result, defaultValue) {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}
`,
      description:
        "mapResult が fn の戻り値を ok(...) で包んでいない。 「mapResult は ok(fn(value)) を返す」 テストや、 後段との合成テストが失敗する",
    },
  ],
  mdnSections: [
    {
      heading: "Object literal (オブジェクトリテラル)",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Object_initializer",
      pageTitle: "オブジェクト初期化子",
    },
    {
      heading: "Strict equality (===)",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Strict_equality",
      pageTitle: "厳密等価演算子",
    },
  ],
};
