import type { Assignment } from "../types.js";
import { COMMON_LINT_RULES, DEFAULT_WEIGHTS } from "./_common.js";

export const regex: Assignment[] = [
  // ────────────────────────────────────────────────
  // 18-1: 電話番号を全件抽出
  // ────────────────────────────────────────────────
  {
    id: "extract-phones",
    topicId: "regex",
    title: "電話番号を全件抽出する",
    difficulty: 1,
    description: `## 電話番号を全件抽出する

任意の文字列を受け取り、\`123-4567\` のような **「3桁-4桁」形式** の電話番号を **全件** 配列で返す関数 \`extractPhones\` を実装してください。

該当がない場合は空配列 \`[]\` を返します。

### 入出力例

\`\`\`js
extractPhones('連絡先: 090-1234 または 080-5678 まで')
// → ['090-1234', '080-5678']

extractPhones('TEL 090-1234, FAX 03-5678')
// → ['090-1234']   (※ '03-5678' は 2-4 形式なので拾わない)

extractPhones('内線1090-1234 は社内のみ')
// → []             (※ 直前に数字が続くものは拾わない)

extractPhones('電話番号はありません')
// → []

extractPhones('')
// → []
\`\`\`

### 制約

- 正規表現リテラル (\`/.../g\`) を使う
- \`String.prototype.match\` を使う
- マッチがない場合に \`null\` を返さず、必ず配列を返す
- 単語境界 (\`\\b\`) などを使い、長い数字列の途中を拾わないようにする
- \`var\` は使わない
`,
    starterCode: `function extractPhones(text) {
  return [];
}
`,
    solution: `function extractPhones(text) {
  return text.match(/\\b\\d{3}-\\d{4}\\b/g) ?? [];
}
`,
    entryPoints: ["extractPhones"],
    tests: [
      {
        name: "2件抽出",
        weight: 20,
        code: "JSON.stringify(extractPhones('連絡先: 090-1234 または 080-5678 まで')) === JSON.stringify(['090-1234','080-5678'])",
      },
      {
        name: "桁数違いは無視",
        weight: 20,
        code: "JSON.stringify(extractPhones('TEL 090-1234, FAX 03-5678')) === JSON.stringify(['090-1234'])",
      },
      {
        name: "長い数字列の途中は拾わない",
        weight: 20,
        code: "JSON.stringify(extractPhones('内線1090-1234 は社内のみ')) === JSON.stringify([])",
      },
      {
        name: "該当なしは空配列",
        weight: 20,
        code: "JSON.stringify(extractPhones('電話番号はありません')) === JSON.stringify([])",
      },
      {
        name: "空文字も空配列",
        weight: 20,
        code: "JSON.stringify(extractPhones('')) === JSON.stringify([])",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "RegExpLiteral",
          label: "正規表現リテラルを使う",
        },
        { kind: "method", name: "match", label: "match を使う" },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 18-2: URL からホストとパスを取り出す
  // ────────────────────────────────────────────────
  {
    id: "parse-url-host-path",
    topicId: "regex",
    title: "URL からホストとパスを取り出す",
    difficulty: 2,
    description: `## URL からホストとパスを取り出す

\`http://\` または \`https://\` で始まる URL を受け取り、**キャプチャグループ** を使ってホスト名とパスを取り出し、\`{ host, path }\` を返す関数 \`parseUrl\` を実装してください。

URL 形式に合致しない場合は \`null\` を返します。

### 入出力例

\`\`\`js
parseUrl('https://example.com/foo/bar')
// → { host: 'example.com', path: 'foo/bar' }

parseUrl('http://example.com/')
// → { host: 'example.com', path: '' }

parseUrl('https://example.com')
// → { host: 'example.com', path: '' }

parseUrl('https://sub.example.co.jp/a/b/c?x=1')
// → { host: 'sub.example.co.jp', path: 'a/b/c?x=1' }

parseUrl('not a url')
// → null

parseUrl('ftp://example.com/foo')
// → null
\`\`\`

### 制約

- 正規表現リテラルとキャプチャグループを使う (\`https?://([^/]+)(?:/(.*))?\` のような形)
- \`String.prototype.match\` を使う
- 末尾スラッシュやパスがない場合 (\`https://example.com\`) も受け付け、\`path\` は \`''\` とする
- \`var\` は使わない
`,
    starterCode: `function parseUrl(url) {
  return null;
}
`,
    solution: `function parseUrl(url) {
  const m = url.match(/^https?:\\/\\/([^/?#]+)(?:\\/(.*))?$/);
  if (!m) return null;
  return { host: m[1], path: m[2] ?? '' };
}
`,
    entryPoints: ["parseUrl"],
    tests: [
      {
        name: "通常",
        weight: 14,
        code: "JSON.stringify(parseUrl('https://example.com/foo/bar')) === JSON.stringify({host:'example.com',path:'foo/bar'})",
      },
      {
        name: "末尾スラッシュのみ",
        weight: 14,
        code: "JSON.stringify(parseUrl('http://example.com/')) === JSON.stringify({host:'example.com',path:''})",
      },
      {
        name: "ホストのみ (パスなし)",
        weight: 14,
        code: "JSON.stringify(parseUrl('https://example.com')) === JSON.stringify({host:'example.com',path:''})",
      },
      {
        name: "サブドメイン+クエリ",
        weight: 15,
        code: "JSON.stringify(parseUrl('https://sub.example.co.jp/a/b/c?x=1')) === JSON.stringify({host:'sub.example.co.jp',path:'a/b/c?x=1'})",
      },
      {
        name: "URLでない",
        weight: 14,
        code: "parseUrl('not a url') === null",
      },
      {
        name: "対応外スキーム",
        weight: 14,
        code: "parseUrl('ftp://example.com/foo') === null",
      },
      {
        name: "ホスト直後のクエリは無効",
        weight: 15,
        code: "parseUrl('https://example.com?x=1') === null",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "RegExpLiteral",
          label: "正規表現リテラルを使う",
        },
        { kind: "method", name: "match", label: "match を使う" },
      ],
      forbidden: [{ kind: "var", label: "var は使わない" }],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 18-3: メールアドレスを伏せ字にする
  // ────────────────────────────────────────────────
  {
    id: "mask-emails",
    topicId: "regex",
    title: "メールアドレスを伏せ字にする",
    difficulty: 2,
    description: `## メールアドレスを伏せ字にする

任意の文字列に含まれるメールアドレスを、**全て \`[email]\`** に置き換える関数 \`maskEmails\` を実装してください。

メールアドレスは、ここでは「**英数字・\`.\`・\`_\`・\`%\`・\`+\`・\`-\` のいずれか1文字以上 + \`@\` + 英数字・\`.\`・\`-\` のいずれか1文字以上 + \`.\` + 2文字以上の英字**」として扱います。

### 入出力例

\`\`\`js
maskEmails('連絡先は alice@example.com です')
// → '連絡先は [email] です'

maskEmails('a@x.co と b.c+d@sub.example.co.jp の2件')
// → '[email] と [email] の2件'

maskEmails('メールはありません')
// → 'メールはありません'

maskEmails('')
// → ''
\`\`\`

### 制約

- 正規表現リテラル (\`g\` フラグ付き) と \`String.prototype.replace\` を使う
- \`var\` は使わない
- \`for\` 文は使わない
`,
    starterCode: `function maskEmails(text) {
  return text;
}
`,
    solution: `function maskEmails(text) {
  return text.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/g, '[email]');
}
`,
    entryPoints: ["maskEmails"],
    tests: [
      {
        name: "1件置換",
        weight: 25,
        code: "maskEmails('連絡先は alice@example.com です') === '連絡先は [email] です'",
      },
      {
        name: "2件置換",
        weight: 25,
        code: "maskEmails('a@x.co と b.c+d@sub.example.co.jp の2件') === '[email] と [email] の2件'",
      },
      {
        name: "メールなし",
        weight: 25,
        code: "maskEmails('メールはありません') === 'メールはありません'",
      },
      {
        name: "空文字",
        weight: 25,
        code: "maskEmails('') === ''",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "RegExpLiteral",
          label: "正規表現リテラルを使う",
        },
        { kind: "method", name: "replace", label: "replace を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },

  // ────────────────────────────────────────────────
  // 18-4: テキストの正規化
  // ────────────────────────────────────────────────
  {
    id: "normalize-text",
    topicId: "regex",
    title: "テキストを正規化する",
    difficulty: 3,
    description: `## テキストを正規化する

任意の文字列に対して、次の処理を **1関数** \`normalizeText\` で行ってください。

1. **全角英数 (\`Ａ-Ｚ\` / \`ａ-ｚ\` / \`０-９\`) を半角** に変換する
2. **連続する空白文字を 1 個の半角スペース** にまとめる (タブ・改行・全角スペース U+3000 もまとめて空白とみなす)
3. **前後の空白をトリム** する

### 入出力例

\`\`\`js
normalizeText('  Ｈｅｌｌｏ Ｗｏｒｌｄ  ')
// → 'Hello World'

normalizeText('a\\u3000\\u3000b')
// → 'a b'                  (全角スペースも空白として扱う)

normalizeText('a   b\\t\\nc')
// → 'a b c'

normalizeText('Ａ１-Ｂ２')
// → 'A1-B2'

normalizeText('   ')
// → ''

normalizeText('')
// → ''
\`\`\`

### 制約

- 正規表現リテラルを使う (全角→半角の変換と空白まとめの両方)
- \`String.prototype.replace\` と \`String.prototype.trim\` を使う
- \`var\` は使わない
- \`for\` 文と \`while\` 文は使わない
`,
    starterCode: `function normalizeText(input) {
  return input;
}
`,
    solution: `function normalizeText(input) {
  const halfWidth = input.replace(/[\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF10-\\uFF19]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xFEE0),
  );
  return halfWidth.replace(/\\s+/g, ' ').trim();
}
`,
    entryPoints: ["normalizeText"],
    tests: [
      {
        name: "全角英字+前後空白",
        weight: 17,
        code: "normalizeText('  Ｈｅｌｌｏ Ｗｏｒｌｄ  ') === 'Hello World'",
      },
      {
        name: "全角スペースの連続",
        weight: 17,
        code: "normalizeText('a\\u3000\\u3000b') === 'a b'",
      },
      {
        name: "タブ・改行を含む空白",
        weight: 17,
        code: "normalizeText('a   b\\t\\nc') === 'a b c'",
      },
      {
        name: "全角英数の混在",
        weight: 16,
        code: "normalizeText('Ａ１-Ｂ２') === 'A1-B2'",
      },
      {
        name: "空白のみ",
        weight: 17,
        code: "normalizeText('   ') === ''",
      },
      {
        name: "空文字",
        weight: 16,
        code: "normalizeText('') === ''",
      },
    ],
    eslint: { rules: { ...COMMON_LINT_RULES } },
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "RegExpLiteral",
          label: "正規表現リテラルを使う",
        },
        { kind: "method", name: "replace", label: "replace を使う" },
        { kind: "method", name: "trim", label: "trim を使う" },
      ],
      forbidden: [
        { kind: "var", label: "var は使わない" },
        { kind: "node", nodeType: "ForStatement", label: "for 文は使わない" },
        {
          kind: "node",
          nodeType: "WhileStatement",
          label: "while 文は使わない",
        },
      ],
    },
    weights: DEFAULT_WEIGHTS,
  },
];
