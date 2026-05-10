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
├── s2/   # Phase 7 で追加予定
├── s3/   # Phase 8 で追加予定
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

### 学習ポイント

- バグを探す第一歩は **「期待値と実際値の差」** を切り分けること。 それには `console.log` で中間値を見る
- `TypeError: ... is not a function` はメソッド名の typo が多い
- `ReferenceError: ... is not defined` は変数名の typo / 宣言忘れ
- 配列の添字は **0 から** 始まる (Off-by-One の典型)
- テンプレートリテラルは `${変数名}` (波カッコ必須)

## 状態

S1: 7 問追加済み (Phase 5)。 S0、 S2-S5 は未着手。
