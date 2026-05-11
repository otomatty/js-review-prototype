import type { Assignment } from "../../../types.js";

export const s4Ch12FixMergeSorted: Assignment = {
  id: "S4-Ch12-03-fix-merge-sorted",
  stage: "S4",
  chapterId: "Ch12",
  sequence: 3,
  title: "[デバッグ] マージ処理でループ終了後の残りを取りこぼすバグを直す",
  newConcept: "AND 終了の while は片側に余りが残る。 終了後に **両方** の残りを処理する",
  estimatedMinutes: 30,
  difficulty: 2,
  testKind: "function",
  description: `## やること

下記の \`mergeSorted\` 関数は、 **昇順にソート済みの 2 つの配列** \`a\` / \`b\` を 1 本のソート済み配列に統合するはずですが、 ループが終わった時点で **片側に残った要素を結果に入れ忘れて** います。 これを修正してください。

\`\`\`js
mergeSorted([1, 3, 5], [2, 4, 6]);   // → [1, 2, 3, 4, 5, 6]   (現状は [1, 2, 3, 4, 5])
mergeSorted([1, 2], [3, 4, 5]);       // → [1, 2, 3, 4, 5]      (現状は [1, 2, 3])
mergeSorted([], [1, 2]);              // → [1, 2]                (現状は [])
mergeSorted([1, 2], []);              // → [1, 2]                (現状は [])
\`\`\`

## ポイント

- \`while (i < a.length && j < b.length)\` は **どちらかが尽きた瞬間に終了** するので、 もう片方の残りは結果に入っていない。
- 終了後に \`while (i < a.length) result.push(a[i++])\` と \`while (j < b.length) result.push(b[j++])\` の **両方** を流して、 残りを順に積む必要がある。
- 「\`a\` または \`b\` のどちらかしか残らない」 ので 2 本の while を並べても両方を実行することはなく、 計算量は \`O(a.length + b.length)\` のまま。
- 配列のスライス + concat (\`result.concat(a.slice(i), b.slice(j))\`) でも書ける。 ただし \`concat\` は **元の配列を変更せず新しい配列を返す** ので、 戻り値を受け取らないと結果が捨てられる点に注意 (\`push\` のような破壊的メソッドと混同しやすい)。 計算量・可読性は好みで選ぶ。
`,
  starterCode: `function mergeSorted(a, b) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++;
    }
  }
  return result;
}
`,
  entryPoints: ["mergeSorted"],
  demoCall: `console.log(mergeSorted([1, 3, 5], [2, 4, 6]));`,
  tests: [
    {
      name: "両方に要素があり末尾が b 側",
      code: `JSON.stringify(mergeSorted([1, 3, 5], [2, 4, 6])) === JSON.stringify([1, 2, 3, 4, 5, 6])`,
    },
    {
      name: "両方に要素があり末尾が a 側",
      code: `JSON.stringify(mergeSorted([1, 4, 6], [2, 3])) === JSON.stringify([1, 2, 3, 4, 6])`,
    },
    {
      name: "a が空なら b そのまま",
      code: `JSON.stringify(mergeSorted([], [1, 2, 3])) === JSON.stringify([1, 2, 3])`,
    },
    {
      name: "b が空なら a そのまま",
      code: `JSON.stringify(mergeSorted([1, 2, 3], [])) === JSON.stringify([1, 2, 3])`,
    },
    {
      name: "両方空なら空",
      code: `JSON.stringify(mergeSorted([], [])) === JSON.stringify([])`,
    },
    {
      name: "長さに差があるケース (b 側に残り)",
      code: `JSON.stringify(mergeSorted([1, 2], [3, 4, 5, 6])) === JSON.stringify([1, 2, 3, 4, 5, 6])`,
    },
    {
      name: "同じ値が混ざっても安定にマージ",
      code: `JSON.stringify(mergeSorted([1, 3, 3], [2, 3, 5])) === JSON.stringify([1, 2, 3, 3, 3, 5])`,
    },
  ],
  hints: [
    "メインの while のあとに、 a 側の残り・b 側の残りをそれぞれ while で流し込む。",
    "解答例:\n```js\nfunction mergeSorted(a, b) {\n  const result = [];\n  let i = 0;\n  let j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) {\n      result.push(a[i]);\n      i++;\n    } else {\n      result.push(b[j]);\n      j++;\n    }\n  }\n  while (i < a.length) {\n    result.push(a[i]);\n    i++;\n  }\n  while (j < b.length) {\n    result.push(b[j]);\n    j++;\n  }\n  return result;\n}\n```",
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
  solution: `function mergeSorted(a, b) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++;
    }
  }
  while (i < a.length) {
    result.push(a[i]);
    i++;
  }
  while (j < b.length) {
    result.push(b[j]);
    j++;
  }
  return result;
}
`,
  badSolutions: [
    {
      code: `function mergeSorted(a, b) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++;
    }
  }
  return result;
}
`,
      description: "元のバグのまま (片側の残りを取りこぼす)",
    },
    {
      code: `function mergeSorted(a, b) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++;
    }
  }
  while (i < a.length) {
    result.push(a[i]);
    i++;
  }
  return result;
}
`,
      description: "片側 (a) の残りだけを処理しており、 b 側の残りが落ちる",
    },
    {
      code: `function mergeSorted(a, b) {
  return a.concat(b);
}
`,
      description: "ソートを考えず単純に連結している (順序が崩れる)",
    },
  ],
  mdnSections: [
    {
      heading: "while",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/while",
      pageTitle: "while",
    },
    {
      heading: "Array.prototype.push()",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
      pageTitle: "Array.prototype.push()",
    },
  ],
};
