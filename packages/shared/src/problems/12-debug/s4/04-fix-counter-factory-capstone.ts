import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s4Ch12FixCounterFactoryCapstone: Assignment = {
  id: "S4-Ch12-04-fix-counter-factory-capstone",
  stage: "S4",
  chapterId: "Ch12",
  sequence: 4,
  title: "[卒業課題][デバッグ] 共有された変数が独立カウンタを壊すバグを直す",
  newConcept: "クロージャが共有変数を捕まえると独立性が崩れる。 変数のスコープをループ内に閉じる",
  estimatedMinutes: 35,
  difficulty: 3,
  testKind: "function",
  isCapstone: true,
  description: `## やること

下記の \`makeCounters(n)\` は **n 個の独立したカウンタ関数** を返すはずです。 各カウンタは「呼び出すたびに 0 から 1 ずつ増えた値を返す」 のが正しい仕様ですが、 現状は **全カウンタが同じ \`count\` を共有してしまい**、 \`counters[0]()\` を呼ぶと \`counters[1]()\` の値まで進んでしまいます。 これを修正してください。

\`\`\`js
const counters = makeCounters(3);
counters[0]();   // → 0
counters[0]();   // → 1
counters[1]();   // → 0   (現状は 2 が返る = counters[0] と共有されている)
counters[1]();   // → 1   (現状は 3)
counters[2]();   // → 0   (現状は 4)
\`\`\`

## ポイント

- 関数式の中で参照されている \`count\` は、 **どの \`count\` 変数を捕まえているか** が重要 (クロージャ)。
- 元のコードでは \`let count = 0;\` が **ループの外** で 1 度だけ宣言されており、 全ての関数が **同じ \`count\` 変数** を見ている。 だから 1 つのカウンタを進めると他のカウンタにも影響する。
- 修正方針 (どちらでも可):
  1. \`let count = 0;\` を **ループの中** に移動し、 イテレーションごとに新しい \`count\` を作る。 \`for (let i = ...)\` の \`let\` で各ループが独立スコープを持つことを利用する。
  2. \`makeCounter()\` のような **カウンタを 1 つ作る関数** を別に用意し、 \`makeCounters\` ではそれを n 回呼んで配列に詰める。
- バグの観察方法は **「最小再現」** が定石: \`n = 2\` で \`counters[0]()\` を 1 回、 \`counters[1]()\` を 1 回呼んで、 期待値とのズレを確認する。

## 制約

- \`makeCounters(0)\` は空配列を返す。
- 各カウンタは呼び出すごとに **その時点での値** を返してから内部で 1 加算する (ポストインクリメントと同じ挙動)。
- カウンタ間で状態が共有されてはいけない。
`,
  starterFiles: singleFile(`function makeCounters(n) {
  const counters = [];
  let count = 0;
  for (let i = 0; i < n; i++) {
    counters.push(function () {
      const current = count;
      count = count + 1;
      return current;
    });
  }
  return counters;
}
`),
  entryPoints: ["makeCounters"],
  demoCall: `console.log(makeCounters(2).map((c) => [c(), c(), c()]));`,
  tests: [
    {
      name: "最初の呼び出しは 0 を返す",
      code: `makeCounters(1)[0]() === 0`,
    },
    {
      name: "同じカウンタを 3 回呼ぶと 0, 1, 2 を返す",
      code: `(() => { const c = makeCounters(1)[0]; return c() === 0 && c() === 1 && c() === 2; })()`,
    },
    {
      name: "別のカウンタは独立して 0 から始まる",
      code: `(() => { const cs = makeCounters(2); cs[0](); cs[0](); return cs[1]() === 0; })()`,
    },
    {
      name: "3 個のカウンタが互いに干渉しない",
      code: `(() => {
        const cs = makeCounters(3);
        cs[0](); cs[0](); cs[0]();
        cs[1]();
        return cs[0]() === 3 && cs[1]() === 1 && cs[2]() === 0;
      })()`,
    },
    {
      name: "makeCounters(0) は空配列",
      code: `(() => { const cs = makeCounters(0); return Array.isArray(cs) && cs.length === 0; })()`,
    },
    {
      name: "個数が要求どおり",
      code: `makeCounters(5).length === 5`,
    },
    {
      name: "各要素は関数である",
      code: `makeCounters(3).every((c) => typeof c === "function")`,
    },
    {
      name: "カウンタを交互に呼んでも独立",
      code: `(() => {
        const cs = makeCounters(2);
        const out = [cs[0](), cs[1](), cs[0](), cs[1](), cs[0]()];
        return JSON.stringify(out) === JSON.stringify([0, 0, 1, 1, 2]);
      })()`,
    },
  ],
  hints: [
    "関数式が参照している `count` がどの宣言かを目で追う。 ループの **外** にあると全カウンタで共有される。",
    "`let count = 0;` を for ループの **中** に移動するのが最小の修正。",
    "解答例 (ループ内に閉じる):\n```js\nfunction makeCounters(n) {\n  const counters = [];\n  for (let i = 0; i < n; i++) {\n    let count = 0;\n    counters.push(function () {\n      const current = count;\n      count = count + 1;\n      return current;\n    });\n  }\n  return counters;\n}\n```",
    "解答例 (カウンタ生成関数を分ける):\n```js\nfunction makeCounter() {\n  let count = 0;\n  return function () {\n    const current = count;\n    count = count + 1;\n    return current;\n  };\n}\nfunction makeCounters(n) {\n  const counters = [];\n  for (let i = 0; i < n; i++) {\n    counters.push(makeCounter());\n  }\n  return counters;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で配列を返す" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function makeCounters(n) {
  const counters = [];
  for (let i = 0; i < n; i++) {
    let count = 0;
    counters.push(function () {
      const current = count;
      count = count + 1;
      return current;
    });
  }
  return counters;
}
`,
  badSolutions: [
    {
      code: `function makeCounters(n) {
  const counters = [];
  let count = 0;
  for (let i = 0; i < n; i++) {
    counters.push(function () {
      const current = count;
      count = count + 1;
      return current;
    });
  }
  return counters;
}
`,
      description: "元のバグのまま (count をループ外で共有している)",
    },
    {
      code: `function makeCounters(n) {
  let count = 0;
  const counter = function () {
    const current = count;
    count = count + 1;
    return current;
  };
  const counters = [];
  for (let i = 0; i < n; i++) {
    counters.push(counter);
  }
  return counters;
}
`,
      description: "全要素が同じ関数 (= 同じクロージャ) を共有している",
    },
    {
      code: `function makeCounters(n) {
  return Array.from({ length: n }, () => 0);
}
`,
      description: "関数ではなく数値の配列を返している",
    },
  ],
  mdnSections: [
    {
      heading: "クロージャ",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Closures",
      pageTitle: "クロージャ",
    },
    {
      heading: "let",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let",
      pageTitle: "let",
    },
  ],
};
