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
├── s4/   # Phase 9 で追加 (5 問、 うち 1 問が卒業課題)
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

## S4 で扱う問題 (5 問、 卒業課題 1 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S4-Ch13-01-validation-error` | `class ValidationError extends Error` を定義して投げる |
| 02 | `S4-Ch13-02-classify-error` | `instanceof` で複数の Error 型を catch 内分岐 |
| 03 | `S4-Ch13-03-retry-with-fallback` | try/catch をループで回すリトライ + フォールバック |
| 04 | `S4-Ch13-04-cleanup-with-finally` | `finally` でクリーンアップを保証する |
| 05 | `S4-Ch13-05-safe-runner-capstone` | [卒業課題] カスタム Error + 振り分け + finally を 1 関数にまとめる |

### S4 学習ポイント

- **カスタム Error クラス** (`extends Error`) は「失敗の種類を呼び出し側で識別する」 ための基本道具。 必ず `super(message)` を呼び、 `this.name` をセットする
- 1 つの `catch` 節の中で **`instanceof` を並べる** ことで複数の Error 型に分岐できる。 並べる順は **継承の具体的な型から先** に
- 失敗を「呼び出し元に伝搬させる」 / 「リトライする」 / 「既定値を返す」 のどれを選ぶかは設計判断。 03 はその「リトライ + フォールバック」 の典型形を扱う
- `finally` は **try / catch のどちらを通っても必ず通る** ブロック。 統計の更新やリソース解放など、 「絶対に走らせたい」 処理に使う
- 05 (卒業課題) はここまでの **カスタム Error / 振り分け / finally** を 1 つの関数で組み合わせる演習

## 状態

S3: 4 問追加済み (Phase 8)。 S4: 5 問追加済み (Phase 9)。 S5 は未着手。
