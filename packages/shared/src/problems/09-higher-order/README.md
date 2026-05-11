# Ch09. 高階関数

コールバック、 `map` / `filter` / `reduce` などの配列処理。 Ch06 ループの「同じことを繰り返す」 を、 関数を渡す形で抽象化し直す章。

## 含まれるステージ

- **S3** ロジック入門 — `map` / `filter` / `reduce` / `find` を使い分ける。
- **S4** アルゴリズム — `reduce` での集計、 高階関数の合成。
- **S5** 設計演習 — 複数の高階関数を組み合わせたデータ変換パイプライン。

## MDN 既定ページ

- [Array](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array)

## ディレクトリ構成

```
09-higher-order/
├── README.md
├── _index.ts
├── s3/   # Phase 8 で追加済み (8 問、 末尾は S3 卒業課題)
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S3 で扱う問題 (8 問、 8 番目が S3 卒業課題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S3-Ch09-01-double-all` | map で要素を変換 |
| 02 | `S3-Ch09-02-only-positive` | filter で条件抽出 |
| 03 | `S3-Ch09-03-sum-with-reduce` | reduce で合計 (初期値必須) |
| 04 | `S3-Ch09-04-names-of` | map でプロパティを取り出す |
| 05 | `S3-Ch09-05-adults` | filter でオブジェクト条件抽出 |
| 06 | `S3-Ch09-06-count-true` | reduce で集計値を作る |
| 07 | `S3-Ch09-07-find-by-name` | find で最初の一致を取り出す |
| 08 | `S3-Ch09-08-pipeline-capstone` ⭐ | **[S3 卒業課題]** filter → map → reduce パイプライン |

### S3 学習ポイント

- S3 は高階関数の **使う側**。 自作する側 (`myMap` / `myFilter`) は S4-S5 で扱う
- `reduce` は **初期値を必ず指定** する (空配列で TypeError を防ぐ)
- メソッドチェーンで filter → map → reduce のパイプラインを書くと宣言的になる

## 状態

S3: 8 問追加済み (Phase 8)。 S4-S5 は未着手。
