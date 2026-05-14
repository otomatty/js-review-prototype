import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s3Ch13ValidateAge: Assignment = {
  id: "S3-Ch13-03-validate-age",
  stage: "S3",
  chapterId: "Ch13",
  sequence: 3,
  title: "不正な入力で TypeError / RangeError を投げる",
  newConcept: "事前条件チェックで TypeError / RangeError を投げる",
  estimatedMinutes: 12,
  difficulty: 2,
  testKind: "function",
  description: `## やること

数値 \`age\` を受け取り、 以下のチェックを行う関数 \`validateAge\` を実装してください。

- \`typeof age !== "number"\` または \`!Number.isFinite(age)\` (= NaN / Infinity) のとき: \`throw new TypeError("age must be a finite number")\`
- \`age < 0\` または \`age > 150\` のとき: \`throw new RangeError("age out of range")\`
- それ以外: そのまま \`age\` を返す

\`\`\`js
validateAge(30);    // → 30
validateAge(0);     // → 0
validateAge(150);   // → 150
validateAge("30");  // throws TypeError
validateAge(NaN);   // throws TypeError   (NaN は typeof === "number" だがすり抜けてはいけない)
validateAge(-1);    // throws RangeError
validateAge(200);   // throws RangeError
\`\`\`

## ポイント

- **TypeError** / **RangeError** は組み込みの Error サブクラス。 \`new TypeError(...)\` で作って throw します。
- \`typeof NaN === "number"\` なので、 NaN を弾くには **\`Number.isFinite\`** を併用します。
- AST で **ThrowStatement** を必須にしています。
`,
  starterFiles: singleFile(`function validateAge(age) {
  // 不正なら throw、 正しければそのまま return
}
`),
  entryPoints: ["validateAge"],
  demoCall: `console.log(validateAge(30));`,
  tests: [
    { name: "validateAge(30) は 30", code: `validateAge(30) === 30` },
    { name: "validateAge(0) は 0", code: `validateAge(0) === 0` },
    { name: "validateAge(150) は 150", code: `validateAge(150) === 150` },
    {
      name: "文字列で TypeError",
      code: `(() => { try { validateAge("30"); return false; } catch (e) { return e instanceof TypeError; } })()`,
    },
    {
      name: "負の数で RangeError",
      code: `(() => { try { validateAge(-1); return false; } catch (e) { return e instanceof RangeError; } })()`,
    },
    {
      name: "150 超えで RangeError",
      code: `(() => { try { validateAge(200); return false; } catch (e) { return e instanceof RangeError; } })()`,
    },
    {
      name: "NaN で TypeError",
      code: `(() => { try { validateAge(NaN); return false; } catch (e) { return e instanceof TypeError; } })()`,
    },
    {
      name: "Infinity で TypeError",
      code: `(() => { try { validateAge(Infinity); return false; } catch (e) { return e instanceof TypeError; } })()`,
    },
    { name: "validateAge(99) は 99", code: `validateAge(99) === 99` },
  ],
  hints: [
    "if (typeof age !== \"number\" || !Number.isFinite(age)) throw new TypeError(...);",
    "if (age < 0 || age > 150) throw new RangeError(...);",
    "解答例:\n```js\nfunction validateAge(age) {\n  if (typeof age !== \"number\" || !Number.isFinite(age)) throw new TypeError(\"age must be a finite number\");\n  if (age < 0 || age > 150) throw new RangeError(\"age out of range\");\n  return age;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "ReturnStatement", label: "return で値を返す" },
        { kind: "node", nodeType: "ThrowStatement", label: "throw で例外を発生させる" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
      ],
    },
  },
  solution: `function validateAge(age) {
  if (typeof age !== "number" || !Number.isFinite(age)) {
    throw new TypeError("age must be a finite number");
  }
  if (age < 0 || age > 150) {
    throw new RangeError("age out of range");
  }
  return age;
}
`,
  badSolutions: [
    {
      code: `function validateAge(age) {
  if (typeof age !== "number") return -1;
  if (age < 0 || age > 150) return -1;
  return age;
}
`,
      description: "throw していない (return で代替している)",
    },
    {
      code: `function validateAge(age) {
  if (typeof age !== "number") throw new Error("bad");
  if (age < 0 || age > 150) throw new Error("bad");
  return age;
}
`,
      description: "TypeError / RangeError ではなく汎用 Error を投げている (instanceof で fail)",
    },
  ],
  mdnSections: [
    {
      heading: "TypeError",
      pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/TypeError",
      pageTitle: "TypeError",
    },
  ],
};
