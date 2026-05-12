# Ch13. エラー処理

`try` / `catch`、 `throw`、 `Error` オブジェクト。 「失敗するかもしれない処理を含む関数の書き方」 を S3 から導入する。

## 含まれるステージ

- **S3** ロジック入門 — `try` / `catch` の基本形、 `Error` の投げ方。
- **S4** アルゴリズム — 失敗を伝搬させる/握りつぶすの判断、 入力検証。
- **S5** 設計演習 — Result 型風オブジェクトで失敗を値として持ち回り、 多段の処理を例外なしで合成する。

## MDN 既定ページ

- [制御フローとエラー処理 — 例外処理文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#例外処理文)

## ディレクトリ構成

```
13-error-handling/
├── README.md
├── _index.ts
├── s3/   # Phase 8 で追加済み (4 問)
├── s4/   # Phase 9 で追加済み (5 問、 うち 1 問が卒業課題)
└── s5/   # Phase 9 で追加済み (3 問、 うち 1 問が S5 卒業課題)
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

## S5 で扱う問題 (3 問、 卒業課題 1 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S5-Ch13-01-chain-result` | Result 型 (`ok` / `err`) のコンストラクタと、 「成功なら次に進む / 失敗ならそのまま伝播する」 高階関数 `chainResult` / `mapResult` / `withDefault` を例外なしで設計する |
| 02 | `S5-Ch13-02-validate-user-result` | `parseName` / `parseAge` / `parseEmail` を Result を返す純粋関数に分解し、 `validateUser` で最初の失敗を早期 return で伝播する |
| 03 | `S5-Ch13-03-try-all-capstone` ⭐ | **[S5 卒業課題]** `attempt` で例外を Result に変換、 `tryAll` で複数戦略を順に試し、 `loadConfig` で全失敗時に既定値へフォールバックする多段設計 |

### S5 学習ポイント

- **失敗を 「値」 で持ち回る設計**: 例外を投げずに `{ ok: false, error }` を返す形にすると、 関数の戻り値の型を見るだけで 「失敗しうる」 ことが分かり、 try/catch の書き忘れ事故が減る
- **コンビネータの分業**: 「Result を返す関数を繋ぐ `chainResult`」 と 「ok のときだけ値を変換する `mapResult`」 のように、 役割の違う高階関数を別の関数として用意する。 設計を共通の語彙にしておくと、 後段の `validateUser` / `tryAll` も同じ語彙で組める
- **失敗の早期伝播**: 多段の処理で 「1 つでも失敗が出たら以降をスキップして最初の失敗を返す」 という流れを、 `chainResult` の連鎖や 連続 `if (!r.ok) return r` で書き分ける
- **例外境界の分離**: 例外を投げるレガシーコードと Result の世界を混ぜたいときは、 `attempt(fn)` のような 「**境界 1 関数**」 だけで try/catch を使い、 上位ロジック (`tryAll` / `loadConfig`) は Result だけで動かす。 副作用の境界を 1 か所に集める、 関数型プログラミングのアダプタ層の発想
- **フォールバック戦略**: 同じ関数を N 回 (S4 retry) ではなく、 **違う関数を 1 回ずつ** 順に試して最初の成功を取る形 (`tryAll`)。 リアルなシステム (環境変数 → 設定ファイル → リモート) のロード設計に直結する
- **設計判断**: 「全部失敗時に最初の err か最後の err か」 「成功時に呼ばれていない関数の扱い」 など、 仕様書を書く側の小さな選択肢を意識して決める

## 状態

S3: 4 問追加済み (Phase 8)。 S4: 5 問追加済み (Phase 9)。 S5: 3 問追加済み (Phase 9)。 Ch13 エラー処理 章は完成。
