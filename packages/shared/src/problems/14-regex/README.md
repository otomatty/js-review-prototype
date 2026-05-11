# Ch14. 正規表現

`RegExp`、 `match` / `replace`、 キャプチャ。 文字列章 (Ch03) では届かない 「パターンで切り出す」 ための専用ツールを学ぶ。

## 含まれるステージ

- **S3** ロジック入門 — リテラル正規表現と `test` / `match` の基本。
- **S4** アルゴリズム — グローバルマッチ・キャプチャグループでの抽出。
- **S5** 設計演習 — 入力検証・整形で正規表現を組み合わせる。

## MDN 既定ページ

- [正規表現](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions)

## ディレクトリ構成

```
14-regex/
├── README.md
├── _index.ts
├── s3/   # Phase 8 で追加済み (4 問)
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S3 で扱う問題 (4 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S3-Ch14-01-contains-digit` | RegExp.test で数字含有判定 |
| 02 | `S3-Ch14-02-extract-numbers` | g フラグ + match で全マッチ取得 |
| 03 | `S3-Ch14-03-is-email-shape` | ^ $ アンカーで完全一致 |
| 04 | `S3-Ch14-04-mask-numbers` | replace + g フラグで全置換 |

### S3 学習ポイント

- 正規表現リテラル `/pattern/flags` の構文。 `/\d/` で 1 文字、 `/\d+/` で 1 文字以上の連続
- フラグ `g` 無しは「最初の 1 件」、 `g` 付きは「すべて」
- アンカー `^` `$` で「文字列全体」 にマッチを限定。 単独のパターンは部分一致になる
- `[^@\s]+` のような文字クラスで「除外したい文字」 を指定する

## 状態

S3: 4 問追加済み (Phase 8)。 S4-S5 は未着手。
