# Ch05. 条件分岐

`if` / `else`、 比較、 論理演算、 `switch`。 「場合分けして違う処理をする」 ことを S2 から導入し、 後続全ステージで使い続ける。

## 含まれるステージ

- **S2** 文法定着 — `if` / `else if` / `else` の基本形、 比較演算子、 `switch`、 三項演算子。
- **S3** ロジック入門 — 三項演算子・短絡評価、 関数内での分岐。
- **S4** アルゴリズム — 複数条件の組み合わせ、 早期 return。
- **S5** 設計演習 — 状態遷移・パターンマッチに近い分岐の整理。

## MDN 既定ページ

- [制御フローとエラー処理](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

## ディレクトリ構成

```
05-conditionals/
├── README.md
├── _index.ts
├── s2/   # Phase 7 で追加済み (15 問)
├── s3/   # Phase 8 で追加予定
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S2 で扱う問題 (15 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S2-Ch05-01-if-positive` | if で正数判定 |
| 02 | `S2-Ch05-02-if-else-even-odd` | if/else で偶奇判定 |
| 03 | `S2-Ch05-03-else-if-grade` | else if で 3 段階成績判定 |
| 04 | `S2-Ch05-04-and-operator` | && で AND 連結 |
| 05 | `S2-Ch05-05-or-operator` | `\|\|` で OR 連結 |
| 06 | `S2-Ch05-06-not-operator` | ! で真偽値反転 |
| 07 | `S2-Ch05-07-ternary-basic` | 三項演算子で値選択 |
| 08 | `S2-Ch05-08-strict-equal` | === で厳密等価 |
| 09 | `S2-Ch05-09-not-equal` | !== で不等価 |
| 10 | `S2-Ch05-10-truthy-falsy` | 空文字は falsy |
| 11 | `S2-Ch05-11-switch-day` | switch で曜日判定 |
| 12 | `S2-Ch05-12-ternary-chain` | 三項を 2 段で連結 |
| 13 | `S2-Ch05-13-range-check` | && で範囲チェック |
| 14 | `S2-Ch05-14-default-fallback` | `\|\|` でデフォルト値 |
| 15 | `S2-Ch05-15-switch-default` | switch の default 分岐 |

### S2 学習ポイント

- `if (条件) { ... }` の `条件` には **真偽値になる式** を書く
- `==` ではなく `===` を使う (型まで比較。 lint プリセットでも `eqeqeq` を error にしている)
- `&&` / `||` は短絡評価。 `||` はデフォルト値の指定として 1 行で書ける
- `switch` は値の一致を複数候補と比較。 各 case の末尾に `break;` を忘れない
- 三項演算子 `条件 ? 真 : 偽` は **値を選ぶ式**。 ネストは 2 段までに留める

## 状態

S2: 15 問追加済み (Phase 7)。 S3-S5 は未着手。
