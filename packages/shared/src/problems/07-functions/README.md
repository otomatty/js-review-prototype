# Ch07. 関数

関数宣言、 引数、 `return`、 スコープの入り口。 ここから採点モデルが S3 で stdout から function へ切り替わるため、 「自分で関数を作って返す」 を本格的に練習する。

## 含まれるステージ

- **S2** 文法定着 — `function` 宣言とアロー関数、 引数 / `return` / デフォルト引数。 末尾に **チャレンジ** (成績判定)。
- **S3** ロジック入門 — 引数を受け取って結果を返す関数 (function 採点)。
- **S4** アルゴリズム — ヘルパ関数を定義してロジックを分割する。
- **S5** 設計演習 — 複数関数を組み合わせて 1 つの仕様を実装する。

## MDN 既定ページ

- [関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions)

## ディレクトリ構成

```
07-functions/
├── README.md
├── _index.ts
├── s2/   # Phase 7 で追加済み (16 問、 末尾はチャレンジ問題 成績判定)
├── s3/   # Phase 8 で追加予定
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S2 で扱う問題 (16 問、 16 番目がチャレンジ問題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S2-Ch07-01-function-greet` | function 宣言の基本 |
| 02 | `S2-Ch07-02-function-add` | 引数と return |
| 03 | `S2-Ch07-03-arrow-basic` | アロー関数の暗黙 return |
| 04 | `S2-Ch07-04-arrow-with-args` | アロー関数で 2 引数 |
| 05 | `S2-Ch07-05-default-args` | デフォルト引数 |
| 06 | `S2-Ch07-06-early-return` | 早期 return |
| 07 | `S2-Ch07-07-no-return-undefined` | return しないと undefined |
| 08 | `S2-Ch07-08-call-twice` | 同じ関数を 2 回呼ぶ |
| 09 | `S2-Ch07-09-pass-string` | 文字列引数を加工 |
| 10 | `S2-Ch07-10-pass-array` | 配列引数で先頭を返す |
| 11 | `S2-Ch07-11-nested-call` | 関数の中から関数を呼ぶ |
| 12 | `S2-Ch07-12-multiple-returns` | 複数の return で分岐 |
| 13 | `S2-Ch07-13-helper-function` | ヘルパー関数で重複を排除 |
| 14 | `S2-Ch07-14-arrow-block` | アロー関数で { } 本体 |
| 15 | `S2-Ch07-15-function-loop-sum` | 関数の中で for ループ |
| 16 | `S2-Ch07-16-grading-capstone` ⭐ | **[チャレンジ]** 成績判定 |

### S2 学習ポイント

- `function 名前() { ... }` で宣言。 宣言しただけでは実行されない。 `名前()` で呼び出して初めて中身が動く
- `return` で値を返す。 書かないと暗黙的に `undefined` が返る
- アロー関数 `() => 値` は暗黙 return、 `() => { return 値; }` は明示 return
- デフォルト引数 `f(x = 既定値)` で省略可能にできる
- 早期 return で if/else のネストを浅く保つ
- 関数を **小さな部品** として分割すれば、 後から組み合わせて複雑な処理を作れる

## 状態

S2: 16 問追加済み (Phase 7)。 S3-S5 は未着手。
