# Ch13. エラー処理

`try` / `catch`、 `throw`、 `Error` オブジェクト。 「失敗するかもしれない処理を含む関数の書き方」 を S3 から導入する。

## 含まれるステージ

- **S3** ロジック入門 — `try` / `catch` の基本形、 `Error` の投げ方。
- **S4** アルゴリズム — 失敗を伝搬させる/握りつぶすの判断、 入力検証。
- **S5** 設計演習 — エラー型を独自定義して責務を整理する。

## MDN 既定ページ

- [制御フローとエラー処理 — 例外処理文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#例外処理文)

## ディレクトリ構成

```
13-error-handling/
├── README.md
├── _index.ts
├── s3/   # Phase 8 で追加済み (4 問)
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S3 で扱う問題 (4 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S3-Ch13-01-safe-parse-json` | try/catch で安全にパース |
| 02 | `S3-Ch13-02-divide-or-zero` | throw + try/catch でフォールバック |
| 03 | `S3-Ch13-03-validate-age` | TypeError / RangeError を投げる |
| 04 | `S3-Ch13-04-attempt-result` | Result パターンで成功/失敗を返す |

### S3 学習ポイント

- 例外は **「処理を止めて呼び出し元に伝える」 仕組み**。 `throw` で送り、 `try/catch` で受ける
- 02 / 04 は **AST で TryStatement を強制**、 02 / 03 は **ThrowStatement を強制** している
- 組み込みエラー型 (`TypeError` / `RangeError`) を選んで使い分けると、 catch 側で `instanceof` で振り分けられる

## 状態

S3: 4 問追加済み (Phase 8)。 S4-S5 は未着手。
