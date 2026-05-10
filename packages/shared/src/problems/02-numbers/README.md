# Ch02. 数値・演算

数値リテラル、 算術演算子、 演算子の優先順位、 `Math` オブジェクト。 「計算して結果を返す」 という最も基本的な処理パターンを S1 から S4 まで広げる。

## 含まれるステージ

- **S1** 文法体験 — `+ - * / %` を 1 文ずつ確かめる。
- **S2** 文法定着 — 演算子の優先順位や代入演算子と組み合わせる。
- **S3** ロジック入門 — `Math.floor` / `Math.max` などを使った関数を組み立てる。
- **S4** アルゴリズム — 累積・割り算・剰余を使った計算ロジック。

## MDN 既定ページ

- [式と演算子](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Expressions_and_operators)

## ディレクトリ構成

```
02-numbers/
├── README.md
├── _index.ts
├── s1/   # Phase 5 で追加済み (13 問、 末尾はチャレンジ問題)
├── s2/   # Phase 7 で追加予定
├── s3/   # Phase 8 で追加予定
└── s4/   # Phase 9 で追加予定
```

## S1 で扱う問題 (13 問、 13 番目がチャレンジ問題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S1-Ch02-01-add` | + で加算する |
| 02 | `S1-Ch02-02-subtract` | - で減算する |
| 03 | `S1-Ch02-03-multiply` | * で乗算する |
| 04 | `S1-Ch02-04-divide` | / で除算する |
| 05 | `S1-Ch02-05-modulo` | % で剰余を求める |
| 06 | `S1-Ch02-06-exponent` | ** で累乗を計算する |
| 07 | `S1-Ch02-07-precedence` | () で計算順序を制御する |
| 08 | `S1-Ch02-08-math-floor` | Math.floor で切り捨てる |
| 09 | `S1-Ch02-09-math-round` | Math.round で四捨五入 |
| 10 | `S1-Ch02-10-math-abs` | Math.abs で絶対値 |
| 11 | `S1-Ch02-11-math-max` | Math.max で最大値 |
| 12 | `S1-Ch02-12-compound-assign` | += で値を増やす |
| 13 | `S1-Ch02-13-bmi-capstone` ⭐ | **[チャレンジ]** BMI を計算する |

### 学習ポイント

- 加減乗除の演算子は `+ - * /`、 余りは `%`、 累乗は `**`
- 数学と同じ優先順位 (`*` `/` が `+` `-` より先)。 順序を変えるには `( )`
- `Math.floor` / `Math.round` / `Math.abs` / `Math.max` などのよく使う関数
- 代入と演算を一度に行う `+=` などの複合代入

## 状態

S1: 13 問追加済み (Phase 5)。 S2-S4 は未着手。
