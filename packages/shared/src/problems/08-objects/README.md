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
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
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

## 状態

S3: 8 問追加済み (Phase 8)。 S4-S5 は未着手。
