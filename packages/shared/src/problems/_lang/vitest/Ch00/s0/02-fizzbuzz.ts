import type { Assignment } from "../../../../../types.js";

/**
 * Vitest mutation testing 第 2 問 (#110)。
 *
 * `fizzbuzz(n)` のテストを書く。 mutant は 「3 の倍数」「5 の倍数」「両方の倍数」「数値そのもの」
 * を取り違えるバグ群を 4 つ用意してある。 撃破するには各分岐を網羅したテストが必要。
 */
export const s0VitestCh00FizzBuzz: Assignment = {
  id: "S0-Vt-Ch00-02-fizzbuzz",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 102,
  title: "Vitest: fizzbuzz() のテストを書く",
  newConcept: "条件分岐ごとに別々の it ケースで網羅性を高める",
  estimatedMinutes: 10,
  difficulty: 2,
  testKind: "mutation",
  language: "vitest",
  entryFile: "main.test.js",
  starterFiles: [
    {
      path: "main.test.js",
      content: `// fizzbuzz(n) のテストを書いてください。
//   - 3 の倍数 → "Fizz"
//   - 5 の倍数 → "Buzz"
//   - 15 の倍数 → "FizzBuzz"
//   - それ以外 → 数値を文字列で返す
//
// 各分岐を 1 件以上テストして、 すべての mutant を撃破しましょう。

describe("fizzbuzz", () => {
  it("3 の倍数で Fizz を返す", () => {
    // expect(fizzbuzz(3)).toBe("Fizz");
  });
});
`,
    },
  ],
  description: `## やること

\`fizzbuzz(n)\` のテストを **\`main.test.js\`** に書いてください。

仕様:

- 3 の倍数 → \`"Fizz"\`
- 5 の倍数 → \`"Buzz"\`
- 15 の倍数 → \`"FizzBuzz"\`
- それ以外 → 数値を文字列に変換して返す (例: \`fizzbuzz(1)\` は \`"1"\`)

各分岐を 1 件以上テストして、 すべての mutant を撃破しましょう。

## ヒント

- 15 の倍数 ("FizzBuzz") を忘れがちです。 例えば 15, 30 を試しましょう。
- "Fizz" と "Buzz" を入れ替えた mutant があります。 3 の倍数と 5 の倍数を別々に確認してください。
- "1" のような通常ケースもテストしないと、 数値変換が壊れた mutant を撃破できません。
`,
  tests: [],
  mutation: {
    referenceImpl: `function fizzbuzz(n) {
  if (n % 15 === 0) { return "FizzBuzz"; }
  if (n % 3 === 0) { return "Fizz"; }
  if (n % 5 === 0) { return "Buzz"; }
  return String(n);
}
`,
    mutants: [
      {
        id: "m1",
        description: "Fizz と Buzz を取り違え",
        code: `function fizzbuzz(n) {
  if (n % 15 === 0) { return "FizzBuzz"; }
  if (n % 3 === 0) { return "Buzz"; }
  if (n % 5 === 0) { return "Fizz"; }
  return String(n);
}
`,
      },
      {
        id: "m2",
        description: "FizzBuzz の分岐を忘れている (3 の倍数の判定が先に来る)",
        code: `function fizzbuzz(n) {
  if (n % 3 === 0) { return "Fizz"; }
  if (n % 5 === 0) { return "Buzz"; }
  return String(n);
}
`,
      },
      {
        id: "m3",
        description: "通常の数値を文字列化していない (number のまま返している)",
        code: `function fizzbuzz(n) {
  if (n % 15 === 0) { return "FizzBuzz"; }
  if (n % 3 === 0) { return "Fizz"; }
  if (n % 5 === 0) { return "Buzz"; }
  return n;
}
`,
      },
      {
        id: "m4",
        description: "Buzz の条件が間違っている (n % 5 ではなく n % 2)",
        code: `function fizzbuzz(n) {
  if (n % 15 === 0) { return "FizzBuzz"; }
  if (n % 3 === 0) { return "Fizz"; }
  if (n % 2 === 0) { return "Buzz"; }
  return String(n);
}
`,
      },
    ],
  },
  hints: [
    "`fizzbuzz(15)` が \"FizzBuzz\" を返すかをテストすると、 m2 を撃破できます。",
    "`fizzbuzz(5)` だけでなく `fizzbuzz(10)` も試すと、 5 の倍数判定が壊れた m4 を撃破できます。",
    "`expect(fizzbuzz(1)).toBe(\"1\")` のように文字列で比較すると、 数値変換忘れの m3 を撃破できます。",
  ],
  solution: `describe("fizzbuzz", () => {
  it("3 の倍数で Fizz を返す", () => {
    expect(fizzbuzz(3)).toBe("Fizz");
    expect(fizzbuzz(6)).toBe("Fizz");
  });
  it("5 の倍数で Buzz を返す", () => {
    expect(fizzbuzz(5)).toBe("Buzz");
    expect(fizzbuzz(10)).toBe("Buzz");
  });
  it("15 の倍数で FizzBuzz を返す", () => {
    expect(fizzbuzz(15)).toBe("FizzBuzz");
    expect(fizzbuzz(30)).toBe("FizzBuzz");
  });
  it("それ以外は数値を文字列で返す", () => {
    expect(fizzbuzz(1)).toBe("1");
    expect(fizzbuzz(7)).toBe("7");
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
