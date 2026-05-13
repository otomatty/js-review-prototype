# Ch16. 非同期

`Promise`、 `async` / `await`、 非同期処理の合成。 「結果がすぐには返ってこない処理」 を扱う最後の章。

> **🆕 この章は S4 で初めて出ます。** S0-S3 では登場しない `Promise` / `async` / `await` を S4 から扱います。

## 含まれるステージ

- **S4** アルゴリズム — `Promise` の基本、 `async` 関数と `await`、 `Promise.all` / `Promise.allSettled`、 `try` / `catch` での非同期エラー処理 (実装済み)。
- **S5** 設計演習 — 依存関係のある非同期チェーン、 リトライ、 リトライ付きパイプラインの設計 (実装済み)。

## MDN 既定ページ

- [Promise を使う](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises)

## ディレクトリ構成

```
16-async/
├── README.md
├── _index.ts
├── s4/   # Promise 基本 / async-await / Promise.all / try-catch / Promise.allSettled (実装済み: 5 問 + 卒業課題)
└── s5/   # 依存チェーン / リトライ / リトライ付きパイプライン (実装済み: 2 問 + 卒業課題)
```

## S4 問題ラインナップ

| # | タイトル | 主に学ぶ概念 |
|---|---|---|
| 1 | new Promise で値を解決する | `new Promise((resolve, reject) => ...)` の基本 |
| 2 | async / await で値を取り出す | `async function` と `await` の基本構文 |
| 3 | 2 つの Promise を順番に await する | 逐次 await のコスト感 |
| 4 | Promise.all で並列に待つ | 複数 Promise の並列実行と解決値配列 |
| 5 | try / catch で reject を受け止める | `try` / `catch` を使った非同期エラー処理 |
| 6 | [卒業課題] Promise.allSettled で成功と失敗を分ける | 並列実行 + 全件待機 + 結果集計のパイプライン |

## S5 問題ラインナップ

| # | タイトル | 主に学ぶ概念 |
|---|---|---|
| 1 | 依存関係のある 3 ステップを順に await する | 前ステップの解決値を次に渡す依存チェーン (並列化できないパターン) |
| 2 | Promise を最大 N 回までリトライする | async/await + try/catch + ループで Promise リトライを実装する |
| 3 | [卒業課題] リトライ付き非同期パイプラインを組む | 依存チェーン + リトライ + 結果オブジェクト返却の統合演習 |

## 実装上の注意

- 採点ランナー (`packages/client/api/_lib/quickjs-runner.ts`) は QuickJS-WASM 上で実行され、 **`setTimeout` などのタイマー API は使えません**。 課題は `Promise.resolve` / `Promise.reject` / 同期的に resolve する `new Promise(...)` のみで構成しています。
- このため S5 では **ミリ秒ベースのタイムアウト問題は意図的に省略** しました (リトライで近い学習を済ませています)。 リトライ系の課題は同期的な reject Promise でテストできるため、 ランナー制約と相性が良いです。
- 関数テスト式は `(async () => await fn(...) === expected)()` の形で Promise を返し、 ランナー側で解決値を真偽判定します (`script.run(..., { promise: true })`)。
