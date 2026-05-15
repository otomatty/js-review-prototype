import type { Assignment } from "../../../../../types.js";

/**
 * Vitest mutation testing 入門課題 (#110)。
 *
 * 学習者は `main.test.js` に `describe` / `it` / `expect` で `sum(arr)` のテストを書く。
 * 採点では「正解実装ですべての it() が PASS」 + 「各 mutant について 1 件以上の it() が FAIL」
 * を確認する。 mutant を全部撃破するには、 境界値 (空配列・単要素) や符号違いを網羅する必要がある。
 */
export const s0VitestCh00Sum: Assignment = {
  id: "S0-Vt-Ch00-01-sum",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 101,
  title: "Vitest: sum() のテストを書く",
  newConcept: "describe / it / expect で関数の振る舞いを記述する",
  estimatedMinutes: 8,
  difficulty: 2,
  testKind: "mutation",
  language: "vitest",
  entryFile: "main.test.js",
  starterFiles: [
    {
      path: "main.test.js",
      content: `// sum(arr) のテストを describe / it / expect で書いてください。
// 全 mutant を撃破できるよう、 空配列・単要素・複数要素・負数などを網羅しましょう。

describe("sum", () => {
  it("空配列は 0 を返す", () => {
    // expect(sum([])).toBe(0);
  });
});
`,
    },
  ],
  description: `## やること

\`sum(arr)\` という配列の合計を返す関数のテストを **\`main.test.js\`** に書いてください。
正解実装 (referenceImpl) はテストデータには含まれていません — 採点側で結合します。

採点では:

1. **正解実装** に対してあなたの全テストが PASS することを確認
2. **バグ入り実装 (mutant)** に対して各バグごとに 1 件以上の FAIL が出ること (= mutant 撃破) を確認

の両方を満たせばクリアです。 境界値や符号違いを意識して、 すべての mutant を撃破できる
テストを書いてみましょう。

## 使える API

- \`describe(name, fn)\` … テストをグループ化
- \`it(name, fn)\` / \`test(name, fn)\` … 個別のテストケース
- \`expect(actual).toBe(expected)\` … 厳密一致
- \`expect(actual).toEqual(expected)\` … オブジェクト/配列の深い一致
- \`expect(actual).toBeCloseTo(expected, decimals)\` … 小数の近似一致
- \`expect(fn).toThrow()\` … 関数が例外を投げるか
`,
  tests: [],
  mutation: {
    referenceImpl: `function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
`,
    mutants: [
      {
        id: "m1",
        description: "reduce の初期値が 1 (空配列で 0 を返さない)",
        code: `function sum(arr) {
  return arr.reduce((a, b) => a + b, 1);
}
`,
      },
      {
        id: "m2",
        description: "+ を - に取り違え",
        code: `function sum(arr) {
  return arr.reduce((a, b) => a - b, 0);
}
`,
      },
      {
        id: "m3",
        description: "先頭要素しか見ていない (合計ではない)",
        code: `function sum(arr) {
  return arr.length === 0 ? 0 : arr[0];
}
`,
      },
    ],
  },
  hints: [
    "空配列 `sum([])` が 0 を返すかを確認すると、 初期値ズレ系の mutant を撃破できます。",
    "負数を含む配列 (例: `[-1, 1]`) を試すと、 + と - を取り違えた mutant を撃破できます。",
    "複数要素の配列 (例: `[1, 2, 3]`) を試すと、 先頭しか返さない mutant を撃破できます。",
  ],
  solution: `describe("sum", () => {
  it("空配列は 0 を返す", () => {
    expect(sum([])).toBe(0);
  });
  it("単一要素はその値を返す", () => {
    expect(sum([5])).toBe(5);
  });
  it("複数要素を足し合わせる", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });
  it("負数を含む合計", () => {
    expect(sum([-1, 1, 2])).toBe(2);
  });
});
`,
  mdnSections: [
    {
      heading: "ユニットテスト",
      pageUrl: "https://developer.mozilla.org/ja/docs/Glossary/Unit_test",
      pageTitle: "ユニットテスト",
    },
  ],
};
