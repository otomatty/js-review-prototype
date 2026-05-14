import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s5Ch12FixOrderStateMachine: Assignment = {
  id: "S5-Ch12-01-fix-order-state-machine",
  stage: "S5",
  chapterId: "Ch12",
  sequence: 1,
  title: "[デバッグ] 注文ステータスの状態機械の不整合を直す",
  newConcept:
    "状態機械の正しさは **遷移表 / 終端判定 / 遷移関数** が一致して初めて成立する。 3 つの関数を横断してバグを切り分ける",
  estimatedMinutes: 55,
  difficulty: 2,
  testKind: "function",
  description: `## やること

下記のコードは **注文ステータス** を表す簡易ステートマシンです。 注文は次の 5 状態を取り、 仕様に書かれた遷移**だけ**が許されます。

\`\`\`
pending   → paid | cancelled
paid      → shipped | cancelled
shipped   → delivered          (出荷後はキャンセル不可)
delivered → (終端 / 動かせない)
cancelled → (終端 / 動かせない)
\`\`\`

この仕様を満たすため、 次の 3 関数が用意されています:

- \`canTransition(from, to)\` — \`from\` から \`to\` への遷移が許されるか (boolean)
- \`isFinal(status)\` — \`status\` が終端 (これ以上動かせない) か (boolean)
- \`transition(order, next)\` — \`order\` を \`next\` に進めた新しい order を返す。 終端からの遷移 / 不正な遷移は \`null\` を返す

しかし現状のコードには **遷移表の登録ミス**、 **終端判定の見落とし**、 がいくつか混入しており、 仕様どおりに動きません。 全ての関数を仕様に合わせて修正してください。

\`\`\`js
canTransition("paid", "pending");        // → false (現状は true: 一度支払った注文を未支払いに戻せてしまう)
canTransition("shipped", "cancelled");   // → false (現状は true: 出荷後にキャンセルできてしまう)
isFinal("cancelled");                    // → true  (現状は false: キャンセル済みを「動かせる」 と誤判定)
transition({ id: 1, status: "paid" }, "pending");
// → null (現状は { id: 1, status: "pending" } を返してしまう)
\`\`\`

## ポイント

- バグは **1 個所に集中していない**。 まず \`canTransition\` の遷移表が仕様と一致しているか、 1 行ずつ目で照合する。 \`paid\` の行に \`pending\` が紛れ込んでいる、 \`shipped\` の行に \`cancelled\` が紛れ込んでいる、 など複数。
- \`isFinal\` は **「\`delivered\` だけ」 を終端扱い** にしている。 仕様では \`cancelled\` も終端。
- \`transition\` は \`isFinal\` と \`canTransition\` を呼んでいるだけなので、 ロジック自体は壊れていない。 ただし **呼び出している 2 つの関数のどちらか / 両方** にバグがあるので、 結果的に \`transition\` も間違えた答えを返す。 これが「複数関数にまたがるバグ」 の典型。
- バグ修正の手順は **「期待値 → 実値 → 差を最小再現」**。 例えば \`canTransition("paid", "pending")\` の結果が違うと気付いたら、 まず \`TRANSITIONS["paid"]\` を console.log で覗いてみる。

## 制約

- 関数の名前 (\`canTransition\` / \`isFinal\` / \`transition\`) は変えない。
- \`transition\` の返り値は仕様どおり: 成功時は **新しい order オブジェクト** (\`{ ...order, status: next }\`)、 失敗時は \`null\`。 \`order\` 自体は変更しない (\`order.status = next\` のようなミューテーションは禁止)。
- 5 状態以外の文字列が \`from\` に渡されたら \`canTransition\` は \`false\` を返す。
- \`TRANSITIONS\` というモジュール変数の形は壊さない (オブジェクトリテラルのままにしておく)。 中身の遷移先配列だけ仕様に合わせて直す。
`,
  starterFiles: singleFile(`const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled", "pending"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

function canTransition(from, to) {
  const allowed = TRANSITIONS[from];
  if (!allowed) {
    return false;
  }
  return allowed.includes(to);
}

function isFinal(status) {
  return status === "delivered";
}

function transition(order, next) {
  if (isFinal(order.status)) {
    return null;
  }
  if (!canTransition(order.status, next)) {
    return null;
  }
  return { ...order, status: next };
}
`),
  entryPoints: ["canTransition", "isFinal", "transition"],
  demoCall: `console.log(transition({ id: 1, status: "pending" }, "paid"));`,
  tests: [
    {
      name: "canTransition: pending → paid は許可",
      code: `canTransition("pending", "paid") === true`,
    },
    {
      name: "canTransition: pending → cancelled は許可",
      code: `canTransition("pending", "cancelled") === true`,
    },
    {
      name: "canTransition: pending → delivered は不許可 (途中の状態を飛ばせない)",
      code: `canTransition("pending", "delivered") === false`,
    },
    {
      name: "canTransition: paid → shipped は許可",
      code: `canTransition("paid", "shipped") === true`,
    },
    {
      name: "canTransition: paid → pending は不許可 (逆走しない)",
      code: `canTransition("paid", "pending") === false`,
    },
    {
      name: "canTransition: shipped → delivered は許可",
      code: `canTransition("shipped", "delivered") === true`,
    },
    {
      name: "canTransition: shipped → cancelled は不許可 (出荷後はキャンセル不可)",
      code: `canTransition("shipped", "cancelled") === false`,
    },
    {
      name: "canTransition: delivered からは何処にも遷移できない",
      code: `canTransition("delivered", "cancelled") === false && canTransition("delivered", "shipped") === false`,
    },
    {
      name: "canTransition: 未知の状態は常に false",
      code: `canTransition("unknown", "paid") === false`,
    },
    {
      name: "isFinal: delivered は終端",
      code: `isFinal("delivered") === true`,
    },
    {
      name: "isFinal: cancelled も終端",
      code: `isFinal("cancelled") === true`,
    },
    {
      name: "isFinal: 中間状態は終端ではない",
      code: `isFinal("pending") === false && isFinal("paid") === false && isFinal("shipped") === false`,
    },
    {
      name: "transition: 正しい遷移は新しい order を返す",
      code: `(() => {
        const order = { id: 1, status: "pending" };
        const next = transition(order, "paid");
        return next !== null && next.id === 1 && next.status === "paid";
      })()`,
    },
    {
      name: "transition: 元の order は破壊しない",
      code: `(() => {
        const order = { id: 1, status: "pending" };
        transition(order, "paid");
        return order.status === "pending";
      })()`,
    },
    {
      name: "transition: 逆走 (paid → pending) は null",
      code: `transition({ id: 1, status: "paid" }, "pending") === null`,
    },
    {
      name: "transition: 出荷後キャンセル (shipped → cancelled) は null",
      code: `transition({ id: 1, status: "shipped" }, "cancelled") === null`,
    },
    {
      name: "transition: 終端からの遷移は null (cancelled → 何か)",
      code: `transition({ id: 1, status: "cancelled" }, "paid") === null`,
    },
    {
      name: "transition: 終端からの遷移は null (delivered → cancelled)",
      code: `transition({ id: 1, status: "delivered" }, "cancelled") === null`,
    },
  ],
  hints: [
    "まず仕様 (description 冒頭の遷移図) と `TRANSITIONS` を 1 行ずつ突き合わせる。 余計な遷移先が紛れているはず。",
    "`isFinal` を直すときは「終端 = これ以上動かせない状態」 を仕様から抜き出す。 `delivered` と `cancelled` の 2 つ。",
    "`transition` 自体のロジックは壊れていない。 `isFinal` / `canTransition` の戻り値が直れば、 `transition` も自動的に正しい答えを返すようになる。 これが「複数関数にまたがるバグ」 の修正パターン。",
    "解答例:\n```js\nconst TRANSITIONS = {\n  pending: [\"paid\", \"cancelled\"],\n  paid: [\"shipped\", \"cancelled\"],\n  shipped: [\"delivered\"],\n  delivered: [],\n  cancelled: [],\n};\n\nfunction canTransition(from, to) {\n  const allowed = TRANSITIONS[from];\n  if (!allowed) {\n    return false;\n  }\n  return allowed.includes(to);\n}\n\nfunction isFinal(status) {\n  return status === \"delivered\" || status === \"cancelled\";\n}\n\nfunction transition(order, next) {\n  if (isFinal(order.status)) {\n    return null;\n  }\n  if (!canTransition(order.status, next)) {\n    return null;\n  }\n  return { ...order, status: next };\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "FunctionDeclaration", label: "function 宣言で 3 関数を書く" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で結果を返す" },
        { kind: "method", name: "includes", label: "遷移先配列の判定に includes を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function canTransition(from, to) {
  const allowed = TRANSITIONS[from];
  if (!allowed) {
    return false;
  }
  return allowed.includes(to);
}

function isFinal(status) {
  return status === "delivered" || status === "cancelled";
}

function transition(order, next) {
  if (isFinal(order.status)) {
    return null;
  }
  if (!canTransition(order.status, next)) {
    return null;
  }
  return { ...order, status: next };
}
`,
  badSolutions: [
    {
      code: `const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled", "pending"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

function canTransition(from, to) {
  const allowed = TRANSITIONS[from];
  if (!allowed) {
    return false;
  }
  return allowed.includes(to);
}

function isFinal(status) {
  return status === "delivered";
}

function transition(order, next) {
  if (isFinal(order.status)) {
    return null;
  }
  if (!canTransition(order.status, next)) {
    return null;
  }
  return { ...order, status: next };
}
`,
      description: "元のバグそのまま (遷移表に余計なエントリ + isFinal が cancelled を見ない)",
    },
    {
      code: `const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function canTransition(from, to) {
  const allowed = TRANSITIONS[from];
  if (!allowed) {
    return false;
  }
  return allowed.includes(to);
}

function isFinal(status) {
  return status === "delivered";
}

function transition(order, next) {
  if (isFinal(order.status)) {
    return null;
  }
  if (!canTransition(order.status, next)) {
    return null;
  }
  return { ...order, status: next };
}
`,
      description: "遷移表は直したが isFinal を直し忘れている (cancelled が終端と判定されない)",
    },
    {
      code: `const TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function canTransition(from, to) {
  const allowed = TRANSITIONS[from];
  if (!allowed) {
    return false;
  }
  return allowed.includes(to);
}

function isFinal(status) {
  return status === "delivered" || status === "cancelled";
}

function transition(order, next) {
  if (!canTransition(order.status, next)) {
    return null;
  }
  order.status = next;
  return order;
}
`,
      description: "transition が元の order をミューテーションしている (「元の order は破壊しない」 テストが失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "Array.prototype.includes",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/includes",
      pageTitle: "Array.prototype.includes",
    },
    {
      heading: "スプレッド構文",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
      pageTitle: "スプレッド構文",
    },
    {
      heading: "論理 OR (||)",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Logical_OR",
      pageTitle: "論理 OR (||)",
    },
  ],
};
