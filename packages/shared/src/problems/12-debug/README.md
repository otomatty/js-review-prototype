# Ch12. デバッグ

`console.log`、 エラーの読み方、 切り分け、 検証。 全ステージに `●` が付いた唯一の章で、 各ステージで「自分の手で原因を切り分ける」 訓練を続ける。

## 含まれるステージ

- **S0** セットアップ — エラーが出たときに「どこで止まったか」 を読む。
- **S1** 文法体験 — `console.log` で値を確かめる癖をつける。
- **S2** 文法定着 — 期待値と実際値の差から原因を切り分ける。
- **S3** ロジック入門 — 関数の入出力を分けて検証する。
- **S4** アルゴリズム — 大きいデータで起きるバグを最小再現に縮める。
- **S5** 設計演習 — 統合課題で起きた不具合を仮説 → 検証で詰める。

## MDN 既定ページ

- [制御フローとエラー処理](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

## ディレクトリ構成

```
12-debug/
├── README.md
├── _index.ts
├── s0/   # Phase 3 で追加予定
├── s1/   # Phase 5 で追加済み (7 問)
├── s2/   # Phase 7 で追加済み (8 問)
├── s3/   # Phase 8 で追加済み (4 問)
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S1 で扱う問題 (7 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S1-Ch12-01-log-intermediate` | 中間値を console.log で確認する |
| 02 | `S1-Ch12-02-string-vs-number` | 文字列連結と数値加算の取り違えを直す (Number) |
| 03 | `S1-Ch12-03-typo-method` | tolwerCase → toLowerCase の typo を直す |
| 04 | `S1-Ch12-04-precedence-bug` | 演算子の優先順位を ( ) で直す |
| 05 | `S1-Ch12-05-typo-variable` | usre → user の変数名 typo を直す |
| 06 | `S1-Ch12-06-template-curly` | $name → ${name} の波カッコ忘れを直す |
| 07 | `S1-Ch12-07-array-off-by-one` | fruits[3] → fruits[2] の Off-by-One を直す |

### S1 学習ポイント

- バグを探す第一歩は **「期待値と実際値の差」** を切り分けること。 それには `console.log` で中間値を見る
- `TypeError: ... is not a function` はメソッド名の typo が多い
- `ReferenceError: ... is not defined` は変数名の typo / 宣言忘れ
- 配列の添字は **0 から** 始まる (Off-by-One の典型)
- テンプレートリテラルは `${変数名}` (波カッコ必須)

## S2 で扱う問題 (8 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S2-Ch12-01-off-by-one-for` | for ループの境界バグ (`<=` → `<`) |
| 02 | `S2-Ch12-02-condition-flipped` | 比較演算子の向きを直す |
| 03 | `S2-Ch12-03-missing-return` | 関数の return 抜けを直す |
| 04 | `S2-Ch12-04-undefined-trace` | 変数名タイポを直す (totl → total) |
| 05 | `S2-Ch12-05-loose-eq-bug` | `==` を `===` に直す |
| 06 | `S2-Ch12-06-infinite-loop-fix` | while の `i++` 忘れを直す |
| 07 | `S2-Ch12-07-else-if-order` | else if の条件順を直す |
| 08 | `S2-Ch12-08-mutation-bug` | reverse の破壊的変更を防ぐ |

### S2 学習ポイント

- ループ境界 `<` / `<=` の選択。 配列なら `i < arr.length` が定石
- `==` は型変換するので、 数値と文字列が思わぬところで一致する → `===` を使う
- 関数の `return` 抜けは「呼び出し側で `undefined` が出る」 ことで気付く
- 破壊的メソッド (`sort` / `reverse`) は **元配列を変更する**。 元を残したいなら `slice()` でコピーする
- `else if` の条件は **厳しい順** に並べる (大きい数 → 小さい数)

## S3 で扱う問題 (4 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S3-Ch12-01-fix-sum-range` | for ループの境界 (off-by-one) を直す |
| 02 | `S3-Ch12-02-fix-is-empty` | 比較演算子の方向を直す |
| 03 | `S3-Ch12-03-fix-capitalize` | メソッドチェーンの抜けを直す |
| 04 | `S3-Ch12-04-fix-average` | 最終ステップ (割り算) を補う |

### S3 学習ポイント

- S3 のデバッグは **starterCode が壊れた状態** で始まる。 まず観察して、 どこで結果が崩れるかを推測する
- バグの典型: **境界条件 / 比較方向 / メソッドの抜け / 計算の最終ステップ漏れ**

## 状態

S1: 7 問、 S2: 8 問、 S3: 4 問追加済み (Phase 5 / Phase 7 / Phase 8)。 S0、 S4-S5 は未着手。
