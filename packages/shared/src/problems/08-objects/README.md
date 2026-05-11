# Ch08. オブジェクト

プロパティ、 メソッド、 `Object` 操作、 不変更新。 配列 (Ch04) と並ぶ「データの持ち方」 のもう 1 つの軸。

## 含まれるステージ

- **S3** ロジック入門 — オブジェクトリテラル、 プロパティアクセス、 関数引数として渡す。
- **S4** アルゴリズム — オブジェクトの集合を集計・検索する。
- **S5** 設計演習 — 複数オブジェクトを組み合わせた状態管理・不変更新。

## MDN 既定ページ

- [オブジェクトを利用する](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Working_with_objects)

## ディレクトリ構成

```
08-objects/
├── README.md
├── _index.ts
├── s3/   # Phase 8 で追加済み (8 問、 末尾は S3 卒業課題)
├── s4/   # Phase 9 で追加済み (5 問、 末尾は S4 卒業課題)
└── s5/   # Phase 9 後半で追加予定
```

## S3 で扱う問題 (8 問、 8 番目が S3 卒業課題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S3-Ch08-01-get-name` | ドット記法でプロパティ取得 |
| 02 | `S3-Ch08-02-with-property` | スプレッドで非破壊更新 |
| 03 | `S3-Ch08-03-count-properties` | Object.keys でプロパティ数 |
| 04 | `S3-Ch08-04-sum-values` | Object.values で合計 |
| 05 | `S3-Ch08-05-merge-objects` | スプレッドでマージ (後勝ち) |
| 06 | `S3-Ch08-06-has-property` | Object.hasOwn で存在判定 |
| 07 | `S3-Ch08-07-pick-fields` | 指定キーだけ抜き出す |
| 08 | `S3-Ch08-08-group-by-capstone` ⭐ | **[S3 卒業課題]** カテゴリでグルーピング |

### S3 学習ポイント

- **読む**: `obj.key` / `obj[key]` / `Object.keys` / `Object.values`
- **作る・足す**: スプレッド `{ ...obj, key: value }` で **非破壊** に新オブジェクトを作る
- **判定**: `Object.hasOwn(obj, key)` が安全 (値が undefined でも正しく判定)
- **集計**: 配列 + オブジェクトの組み合わせで「グルーピング」 「カウント」 が書ける

## S4 で扱う問題 (5 問、 5 番目が S4 卒業課題)

商品台帳をテーマに、 オブジェクト配列に対する集計・検索アルゴリズムを `for...of` ループで自分で組み立てる。 `reduce` / `map` / `filter` は Ch09 で導入予定のため、 ここでは AST で禁止して手書きループを練習する。

| # | ID | 主題 |
|---|---|---|
| 01 | `S4-Ch08-01-sum-by-field` | 動的キーで数値フィールドを合計する |
| 02 | `S4-Ch08-02-find-max-by` | 状態保持ループで最大のアイテムを返す (同点先勝ち) |
| 03 | `S4-Ch08-03-average-by-field` | 空配列ガードを置いてから平均を計算する |
| 04 | `S4-Ch08-04-find-low-stock` | 条件を満たすアイテムだけ push する抽出ループ |
| 05 | `S4-Ch08-05-summarize-by-category-capstone` ⭐ | **[S4 卒業課題]** 動的キー初期化 + ネスト集計でカテゴリ別サマリを作る |

### S4 学習ポイント

- **走査の基本**: `for (const item of items)` でオブジェクト配列を 1 周し、 動的キー `item[field]` で値を取り出す
- **状態保持**: `let best = items[0]` のような「現在のベスト」 を持って更新する古典的なループ
- **抽出**: `filter` を使わず `const result = []` + 条件付き `push` で書く
- **動的キー初期化**: `if (!result[key]) result[key] = { ... }` で「未登録なら初期化」 する典型パターン (S3 卒業課題 `groupByCategory` の発展形)
- **非破壊**: 入力配列に手を加えず、 必要なら新しい配列・オブジェクトを返す

## 状態

S3: 8 問追加済み (Phase 8)。 S4: 5 問追加済み (Phase 9)。 S5 は Phase 9 後半で追加予定。
