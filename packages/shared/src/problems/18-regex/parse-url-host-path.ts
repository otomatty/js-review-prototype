import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const parseUrlHostPath: Assignment = {
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
      code: "JSON.stringify(parseUrl('https://example.com/foo/bar')) === JSON.stringify({host:'example.com',path:'foo/bar'})",
    },
    {
      name: "末尾スラッシュのみ",
      code: "JSON.stringify(parseUrl('http://example.com/')) === JSON.stringify({host:'example.com',path:''})",
    },
    {
      name: "ホストのみ (パスなし)",
      code: "JSON.stringify(parseUrl('https://example.com')) === JSON.stringify({host:'example.com',path:''})",
    },
    {
      name: "サブドメイン+クエリ",
      code: "JSON.stringify(parseUrl('https://sub.example.co.jp/a/b/c?x=1')) === JSON.stringify({host:'sub.example.co.jp',path:'a/b/c?x=1'})",
    },
    {
      name: "URLでない",
      code: "parseUrl('not a url') === null",
    },
    {
      name: "対応外スキーム",
      code: "parseUrl('ftp://example.com/foo') === null",
    },
    {
      name: "ホスト直後のクエリは無効",
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
};
