# Ch02. 数値・演算

数値リテラル、 算術演算子、 演算子の優先順位、 `Math` オブジェクト。 「計算して結果を返す」 という最も基本的な処理パターンを S1 から S4 まで広げる。

## 含まれるステージ

- **S1** 文法体験 — `+ - * / %` を 1 文ずつ確かめる。
- **S2** 文法定着 — `Number()` / `parseInt` / `parseFloat` / `Math` 系メソッド。
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
├── s2/   # Phase 7 で追加済み (12 問)
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

### S1 学習ポイント

- 加減乗除の演算子は `+ - * /`、 余りは `%`、 累乗は `**`
- 数学と同じ優先順位 (`*` `/` が `+` `-` より先)。 順序を変えるには `( )`
- `Math.floor` / `Math.round` / `Math.abs` / `Math.max` などのよく使う関数
- 代入と演算を一度に行う `+=` などの複合代入

## S2 で扱う問題 (12 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S2-Ch02-01-number-from-string` | Number() で文字列を数値に |
| 02 | `S2-Ch02-02-parseInt-basic` | parseInt で先頭の整数を取り出す |
| 03 | `S2-Ch02-03-parseInt-radix` | parseInt の基数で 16 進数を読む |
| 04 | `S2-Ch02-04-parseFloat` | parseFloat で小数を取り出す |
| 05 | `S2-Ch02-05-math-pow` | Math.pow で累乗を計算 |
| 06 | `S2-Ch02-06-math-sqrt` | Math.sqrt で平方根 |
| 07 | `S2-Ch02-07-math-min-multi` | Math.min で複数値の最小値 |
| 08 | `S2-Ch02-08-math-floor-divide` | Math.floor で整数の商 |
| 09 | `S2-Ch02-09-number-isnan` | Number.isNaN で NaN 判定 |
| 10 | `S2-Ch02-10-tofixed` | toFixed で小数桁を固定 |
| 11 | `S2-Ch02-11-number-isinteger` | Number.isInteger で整数判定 |
| 12 | `S2-Ch02-12-percent-ones-place` | % で 1 の位を取り出す |

### S2 学習ポイント

- `Number()` は文字列を数値に変換するが、 数字以外が混じると `NaN`。 `parseInt` / `parseFloat` は先頭から読める分だけを取り出す
- `parseInt` の第 2 引数は **基数**。 `parseInt("ff", 16)` で 16 進を読める
- `Math.pow` / `Math.sqrt` / `Math.min` / `Math.floor` などのメソッドで計算を組み立てる
- `Number.isNaN` / `Number.isInteger` などの判定系を使う
- `%` で「1 の位」「下 N 桁」 を取り出すのは定番イディオム

## 状態

S1: 13 問、 S2: 12 問追加済み (Phase 5 / Phase 7)。 S3-S4 は未着手。
