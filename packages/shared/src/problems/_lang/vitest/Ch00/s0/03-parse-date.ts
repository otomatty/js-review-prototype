import type { Assignment } from "../../../../../types.js";

/**
 * Vitest mutation testing 第 3 問 (#110)。
 *
 * `parseDate(str)` は `"YYYY-MM-DD"` 形式の文字列を `{ year, month, day }` の
 * オブジェクトに変換するパーサ。 不正入力 (フォーマットが合わない) では例外を投げる。
 *
 * mutant は「型変換忘れ」「month の +1 忘れ」「不正入力時の挙動」 等で構成。
 * `toEqual` (オブジェクトの深い一致) と `toThrow` の使い方も学べる。
 */
export const s0VitestCh00ParseDate: Assignment = {
  id: "S0-Vt-Ch00-03-parse-date",
  stage: "S0",
  chapterId: "Ch00",
  sequence: 103,
  title: "Vitest: parseDate() のテストを書く",
  newConcept: "toEqual と toThrow を使い、 オブジェクト返却と例外送出を確認する",
  estimatedMinutes: 12,
  difficulty: 3,
  testKind: "mutation",
  language: "vitest",
  entryFile: "main.test.js",
  starterFiles: [
    {
      path: "main.test.js",
      content: `// parseDate(str) のテストを書いてください。
//   - "YYYY-MM-DD" を { year, month, day } (すべて数値) に変換する。
//   - 不正な入力では Error を throw する。
//
// 全 mutant を撃破するには toEqual と toThrow の両方を活用しましょう。

describe("parseDate", () => {
  it("基本ケース", () => {
    // expect(parseDate("2024-03-15")).toEqual({ year: 2024, month: 3, day: 15 });
  });
});
`,
    },
  ],
  description: `## やること

\`parseDate(str)\` のテストを **\`main.test.js\`** に書いてください。

仕様:

- 入力: \`"YYYY-MM-DD"\` 形式の文字列 (例: \`"2024-03-15"\`)
- 出力: \`{ year: number, month: number, day: number }\` のオブジェクト
- 不正なフォーマット (パーツ不足や非数値) の場合は \`Error\` を投げる

## 使うべき API

- \`expect(actual).toEqual(expected)\` … オブジェクトの深い一致を確認
- \`expect(() => parseDate("foo")).toThrow()\` … 例外送出を確認

## ヒント

mutant の中には「数値ではなく文字列のまま返す」 ものや、 「不正入力でも throw せず undefined を返す」 ものがあります。
\`toBe\` だけだと取りこぼすので、 \`toEqual\` で型まで含めて比較しましょう。
`,
  tests: [],
  mutation: {
    referenceImpl: `function parseDate(str) {
  if (typeof str !== "string") {
    throw new Error("parseDate: input must be a string");
  }
  const parts = str.split("-");
  if (parts.length !== 3) {
    throw new Error("parseDate: invalid format");
  }
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error("parseDate: invalid number");
  }
  return { year, month, day };
}
`,
    mutants: [
      {
        id: "m1",
        description: "Number 変換忘れ (文字列のまま返している)",
        code: `function parseDate(str) {
  if (typeof str !== "string") {
    throw new Error("parseDate: input must be a string");
  }
  const parts = str.split("-");
  if (parts.length !== 3) {
    throw new Error("parseDate: invalid format");
  }
  return { year: parts[0], month: parts[1], day: parts[2] };
}
`,
      },
      {
        id: "m2",
        description: "不正入力で throw せず undefined を返す",
        code: `function parseDate(str) {
  if (typeof str !== "string") { return undefined; }
  const parts = str.split("-");
  if (parts.length !== 3) { return undefined; }
  return {
    year: Number(parts[0]),
    month: Number(parts[1]),
    day: Number(parts[2]),
  };
}
`,
      },
      {
        id: "m3",
        description: "month と day を取り違え",
        code: `function parseDate(str) {
  if (typeof str !== "string") {
    throw new Error("parseDate: input must be a string");
  }
  const parts = str.split("-");
  if (parts.length !== 3) {
    throw new Error("parseDate: invalid format");
  }
  return {
    year: Number(parts[0]),
    month: Number(parts[2]),
    day: Number(parts[1]),
  };
}
`,
      },
    ],
  },
  hints: [
    "`expect(parseDate(\"2024-03-15\")).toEqual({ year: 2024, month: 3, day: 15 })` のように、 数値型まで含めて期待値を書きましょう。",
    "`expect(() => parseDate(\"not-a-date\")).toThrow()` で不正入力時の挙動を検証できます。",
    "month と day の取り違えを検出するには、 たとえば `\"2024-03-15\"` のように両者が違う値になる入力を使いましょう。",
  ],
  solution: `describe("parseDate", () => {
  it("YYYY-MM-DD を数値オブジェクトに変換する", () => {
    expect(parseDate("2024-03-15")).toEqual({ year: 2024, month: 3, day: 15 });
  });
  it("年・月・日が別々に正しく対応する", () => {
    expect(parseDate("2000-11-05")).toEqual({ year: 2000, month: 11, day: 5 });
  });
  it("不正なフォーマットでは例外を投げる", () => {
    expect(() => parseDate("not-a-date")).toThrow();
    expect(() => parseDate("2024/03/15")).toThrow();
  });
  it("文字列以外の入力でも例外を投げる", () => {
    expect(() => parseDate(20240315)).toThrow();
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
