import type { Assignment } from "../../../types.js";

export const s5Ch14ParseLogLines: Assignment = {
  id: "S5-Ch14-02-parse-log-lines",
  stage: "S5",
  chapterId: "Ch14",
  sequence: 2,
  title: "複数行のログを構造化オブジェクトの配列にパースする",
  newConcept:
    "**1 行を見る純粋関数** `parseLogLine` と **複数行を集約する関数** `parseLogLines` を 2 段に分け、 上段が下段を呼ぶ形で組み立てる多段パイプライン。 `text.split('\\n')` で行ごとに分解 → 各行を名前付きキャプチャでパース → null をフィルタする責務分離の設計",
  estimatedMinutes: 55,
  difficulty: 3,
  testKind: "function",
  lintPreset: "S5",
  description: `## やること

\`12:34:56 [INFO] message body\` のような形式の **アプリケーションログの文字列** を、 構造化オブジェクトの配列にパースする 2 つの関数を実装してください。

### 実装する関数

1. \`parseLogLine(line)\` — **1 行だけ** を受け取って 1 件の Result を返す純粋関数。
   - 形式に一致 → \`{ time, level, message }\` のオブジェクトを返す
   - 形式に一致しない → **\`null\` を返す**
   - 形式は: \`HH:MM:SS<空白>[LEVEL]<空白>MESSAGE\` (LEVEL は \`INFO\` / \`WARN\` / \`ERROR\` のいずれか)
   - 名前付きキャプチャ \`(?<time>...)\` \`(?<level>...)\` \`(?<message>...)\` を使う

2. \`parseLogLines(text)\` — **複数行の文字列** を受け取り、 各行を \`parseLogLine\` でパースし、 \`null\` (= 形式違反) を捨てた配列を返す集約関数。
   - \`text.split("\\n")\` で行ごとに分解
   - 各行を \`parseLogLine\` に渡し、 \`null\` でない結果だけを残す
   - **\`parseLogLine\` を再利用すること**。 同じ正規表現をもう一度書かない

\`\`\`js
parseLogLine("12:34:56 [INFO] server started");
// → { time: "12:34:56", level: "INFO", message: "server started" }

parseLogLine("00:00:00 [ERROR] disk full");
// → { time: "00:00:00", level: "ERROR", message: "disk full" }

parseLogLine("invalid line");                         // → null
parseLogLine("12:34:56 [DEBUG] not allowed level");   // → null   (DEBUG は対象外)
parseLogLine("");                                     // → null

parseLogLines("12:34:56 [INFO] a\\nbroken\\n12:34:57 [WARN] b");
// → [
//     { time: "12:34:56", level: "INFO",  message: "a" },
//     { time: "12:34:57", level: "WARN",  message: "b" },
//   ]                                                       (途中の "broken" 行はスキップ)

parseLogLines("");                                    // → []
parseLogLines("only invalid lines here");             // → []
\`\`\`

## ポイント

これは S5 (設計演習) です。 ログのような **複数行の入力** を扱うとき、 「**1 行を見る関数**」 と 「**全体を集約する関数**」 を **2 段に分けて書く** のが定石です。 こうすると:

- \`parseLogLine\` だけ単体テストできる (異常系の網羅がしやすい)
- 別の場所 (例えば 1 行ずつストリーム的に処理する WebSocket ハンドラ) で \`parseLogLine\` を再利用できる
- 集約のロジック (\`split\` する / \`null\` を捨てる) と 「行の解釈」 のロジックが分離される

### 正規表現のひな型

\`\`\`
/^(?<time>\\d{2}:\\d{2}:\\d{2})\\s+\\[(?<level>INFO|WARN|ERROR)\\]\\s+(?<message>.+)$/
\`\`\`

- \`^\` ... \`$\` … 行頭・行末アンカー (= 「行全体」 がこの形でなければマッチさせない)
- \`(?<time>\\d{2}:\\d{2}:\\d{2})\` … 名前付きキャプチャで \`HH:MM:SS\` を厳密に
- \`\\s+\` … 空白 1 文字以上 (タブ・複数空白に耐える)
- \`\\[(?<level>INFO|WARN|ERROR)\\]\` … \`[\`/\`]\` は **正規表現の特殊文字** なのでエスケープが必要。 \`|\` (OR) で 3 種類のレベルを並べる
- \`(?<message>.+)\` … 残りすべてを message として 1 文字以上キャプチャ

### マッチ失敗時の戻り値

\`String#match\` は **マッチしないと \`null\` を返します** (\`undefined\` ではない)。 そこをそのまま \`return\` してしまえば、 \`parseLogLines\` 側で \`!== null\` のフィルタが書けます。

### 守るべき設計

- \`parseLogLines\` は **必ず \`parseLogLine\` を呼ぶ**。 同じ正規表現をコピーしないこと (将来形式が変わったとき 2 箇所修正することになるバグ温床)。
- 正規表現は **アンカー (\`^\`/\`$\`)** を必ず付ける。 アンカー無しだと \`"prefix 12:34:56 [INFO] hi suffix"\` のような行が誤って通る。
- \`var\` は使わない。 \`==\` / \`!=\` も使わない。 マッチ判定は \`m === null\` / \`m !== null\` で書く。
`,
  starterCode: `function parseLogLine(line) {
  // 1) /^(?<time>\\d{2}:\\d{2}:\\d{2})\\s+\\[(?<level>INFO|WARN|ERROR)\\]\\s+(?<message>.+)$/ を line.match に渡す
  // 2) マッチしなかった (= null) なら null を返す
  // 3) m.groups から { time, level, message } を組み立てて返す
}

function parseLogLines(text) {
  // 1) text.split("\\n") で行に分解
  // 2) 各行を parseLogLine に渡す
  // 3) null でない結果だけを残した配列を return する
  //    (for...of + push でも、 map + filter でも、 どちらでも良い)
}
`,
  entryPoints: ["parseLogLine", "parseLogLines"],
  demoCall: `console.log(parseLogLines("12:34:56 [INFO] hello\\nbroken\\n12:34:57 [ERROR] oops"));`,
  tests: [
    {
      name: "parseLogLine: 通常の INFO 行を { time, level, message } に分解",
      code: `JSON.stringify(parseLogLine("12:34:56 [INFO] server started")) === JSON.stringify({ time: "12:34:56", level: "INFO", message: "server started" })`,
    },
    {
      name: "parseLogLine: ERROR レベルも識別する",
      code: `JSON.stringify(parseLogLine("00:00:00 [ERROR] disk full")) === JSON.stringify({ time: "00:00:00", level: "ERROR", message: "disk full" })`,
    },
    {
      name: "parseLogLine: WARN レベルも識別する",
      code: `JSON.stringify(parseLogLine("23:59:59 [WARN] almost midnight")) === JSON.stringify({ time: "23:59:59", level: "WARN", message: "almost midnight" })`,
    },
    {
      name: "parseLogLine: 形式に合わない行は null",
      code: `parseLogLine("not a log line") === null`,
    },
    {
      name: "parseLogLine: 空文字は null",
      code: `parseLogLine("") === null`,
    },
    {
      name: "parseLogLine: DEBUG など対象外のレベルは null",
      code: `parseLogLine("12:34:56 [DEBUG] hello") === null`,
    },
    {
      name: "parseLogLine: タブ/複数空白でも区切れる (\\s+ の効果)",
      code: `JSON.stringify(parseLogLine("12:34:56\\t[INFO]  spaced out")) === JSON.stringify({ time: "12:34:56", level: "INFO", message: "spaced out" })`,
    },
    {
      name: "parseLogLine: アンカーで「行全体」 を要求 (前後にゴミがあると null)",
      code: `parseLogLine("prefix 12:34:56 [INFO] hi") === null`,
    },
    {
      name: "parseLogLines: 3 行入りの文字列を全部パース",
      code: `JSON.stringify(parseLogLines("12:34:56 [INFO] a\\n00:00:01 [WARN] b\\n23:59:59 [ERROR] c")) === JSON.stringify([
        { time: "12:34:56", level: "INFO",  message: "a" },
        { time: "00:00:01", level: "WARN",  message: "b" },
        { time: "23:59:59", level: "ERROR", message: "c" },
      ])`,
    },
    {
      name: "parseLogLines: 形式違反の行はスキップする",
      code: `JSON.stringify(parseLogLines("12:34:56 [INFO] a\\nbroken\\n12:34:57 [WARN] b")) === JSON.stringify([
        { time: "12:34:56", level: "INFO", message: "a" },
        { time: "12:34:57", level: "WARN", message: "b" },
      ])`,
    },
    {
      name: "parseLogLines: 空文字は空配列",
      code: `JSON.stringify(parseLogLines("")) === JSON.stringify([])`,
    },
    {
      name: "parseLogLines: 全部形式違反なら空配列",
      code: `JSON.stringify(parseLogLines("foo\\nbar\\nbaz")) === JSON.stringify([])`,
    },
    {
      name: "parseLogLines: 末尾の改行で生まれる空行も スキップ",
      code: `JSON.stringify(parseLogLines("12:34:56 [INFO] a\\n")) === JSON.stringify([
        { time: "12:34:56", level: "INFO", message: "a" },
      ])`,
    },
  ],
  hints: [
    "1) parseLogLine: line.match(re) でマッチを取り、 null なら null を返す。 2) マッチしたら m.groups から time/level/message を組み立てる。",
    "正規表現の [ や ] は **特殊文字** なので、 文字そのものを表現したいときは \\\\[ \\\\] とエスケープします。 \\\\s は空白文字 (スペース・タブ等)、 \\\\d は数字、 {n} は 「ちょうど n 回」 の量指定子です。",
    "parseLogLines は parseLogLine を **必ず呼んで** ください。 同じ正規表現を 2 箇所に書くと、 形式変更時に片方しか直さず壊れる典型的なバグになります (DRY 原則)。",
    "解答例:\n```js\nfunction parseLogLine(line) {\n  const m = line.match(/^(?<time>\\d{2}:\\d{2}:\\d{2})\\s+\\[(?<level>INFO|WARN|ERROR)\\]\\s+(?<message>.+)$/);\n  if (m === null) {\n    return null;\n  }\n  return { time: m.groups.time, level: m.groups.level, message: m.groups.message };\n}\n\nfunction parseLogLines(text) {\n  const result = [];\n  for (const line of text.split('\\n')) {\n    const parsed = parseLogLine(line);\n    if (parsed !== null) {\n      result.push(parsed);\n    }\n  }\n  return result;\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "node", nodeType: "RegExpLiteral", label: "正規表現リテラルを使う" },
        { kind: "node", nodeType: "ReturnStatement", label: "return で結果や null を返す" },
        { kind: "node", nodeType: "FunctionDeclaration", label: "parseLogLine / parseLogLines を function 宣言する" },
        { kind: "method", name: "split", label: "text.split(...) で行に分解する" },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `function parseLogLine(line) {
  const m = line.match(/^(?<time>\\d{2}:\\d{2}:\\d{2})\\s+\\[(?<level>INFO|WARN|ERROR)\\]\\s+(?<message>.+)$/);
  if (m === null) {
    return null;
  }
  return { time: m.groups.time, level: m.groups.level, message: m.groups.message };
}

function parseLogLines(text) {
  const result = [];
  for (const line of text.split("\\n")) {
    const parsed = parseLogLine(line);
    if (parsed !== null) {
      result.push(parsed);
    }
  }
  return result;
}
`,
  badSolutions: [
    {
      code: `function parseLogLine(line) {
  const m = line.match(/(?<time>\\d{2}:\\d{2}:\\d{2})\\s+\\[(?<level>INFO|WARN|ERROR)\\]\\s+(?<message>.+)/);
  if (m === null) {
    return null;
  }
  return { time: m.groups.time, level: m.groups.level, message: m.groups.message };
}

function parseLogLines(text) {
  const result = [];
  for (const line of text.split("\\n")) {
    const parsed = parseLogLine(line);
    if (parsed !== null) {
      result.push(parsed);
    }
  }
  return result;
}
`,
      description:
        "正規表現の ^ / $ アンカーを外している。 「行全体」 ではなく 「行のどこか」 にマッチすれば通ってしまうため、 \"prefix 12:34:56 [INFO] hi\" のような行も誤って通る。 「アンカーで行全体を要求」 テストが失敗する",
    },
    {
      code: `function parseLogLine(line) {
  const m = line.match(/^(?<time>\\d{2}:\\d{2}:\\d{2})\\s+\\[(?<level>\\w+)\\]\\s+(?<message>.+)$/);
  if (m === null) {
    return null;
  }
  return { time: m.groups.time, level: m.groups.level, message: m.groups.message };
}

function parseLogLines(text) {
  const result = [];
  for (const line of text.split("\\n")) {
    const parsed = parseLogLine(line);
    if (parsed !== null) {
      result.push(parsed);
    }
  }
  return result;
}
`,
      description:
        "level の正規表現が \\\\w+ になっており、 INFO / WARN / ERROR の 3 値に絞れていない。 DEBUG / TRACE など任意のレベル名が通ってしまうため、 「DEBUG など対象外のレベルは null」 テストが失敗する。 「許可するものを | で並べる」 ホワイトリスト型の入力検証が S5 演習の要点",
    },
    {
      code: `function parseLogLine(line) {
  const m = line.match(/^(?<time>\\d{2}:\\d{2}:\\d{2})\\s+\\[(?<level>INFO|WARN|ERROR)\\]\\s+(?<message>.+)$/);
  return m === null ? null : { time: m.groups.time, level: m.groups.level, message: m.groups.message };
}

function parseLogLines(text) {
  return text.split("\\n").map(parseLogLine);
}
`,
      description:
        "parseLogLines が null を filter で除外していない。 形式違反の行で null が結果配列に混ざるため、 「形式違反の行はスキップする」 「全部形式違反なら空配列」 などのテストで配列に null が入り JSON 比較が失敗する",
    },
  ],
  mdnSections: [
    {
      heading: "名前付きキャプチャグループ",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group",
      pageTitle: "名前付きキャプチャグループ",
    },
    {
      heading: "String.prototype.match()",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/match",
      pageTitle: "String.prototype.match()",
    },
  ],
};
