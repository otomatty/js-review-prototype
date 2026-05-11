# Ch06. ループ

`for` / `while` / `for...of` と `break` / `continue`。 「同じことを繰り返す」 という発想を生で書く章。 高階関数 (Ch09) の前提となる。

## 含まれるステージ

- **S2** 文法定着 — 単純な `for (let i = 0; ...)` / `while` / `do-while` / `break` / `continue`。 末尾に **チャレンジ** (FizzBuzz)。
- **S3** ロジック入門 — 配列の走査・累積で値を 1 つ返す。
- **S4** アルゴリズム — 二重ループ、 累積、 `break` / `continue` の活用。
- **S5** 設計演習 — ループとデータ構造を組み合わせた処理。

## MDN 既定ページ

- [ループと反復処理](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Loops_and_iteration)

## ディレクトリ構成

```
06-loops/
├── README.md
├── _index.ts
├── s2/   # Phase 7 で追加済み (16 問、 末尾はチャレンジ問題 FizzBuzz)
├── s3/   # Phase 8 で追加予定
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S2 で扱う問題 (16 問、 16 番目がチャレンジ問題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S2-Ch06-01-for-count-up` | for で 0-4 を出す |
| 02 | `S2-Ch06-02-for-count-down` | for で 5-1 を出す |
| 03 | `S2-Ch06-03-while-loop` | while の基本 |
| 04 | `S2-Ch06-04-do-while` | do-while で最低 1 回 |
| 05 | `S2-Ch06-05-sum-1-to-n` | 1〜10 の合計 |
| 06 | `S2-Ch06-06-factorial` | 5! を計算 |
| 07 | `S2-Ch06-07-array-iterate` | 配列要素を順に出す |
| 08 | `S2-Ch06-08-break-first-match` | break で最初の偶数 |
| 09 | `S2-Ch06-09-continue-skip` | continue で偶数をスキップ |
| 10 | `S2-Ch06-10-nested-loop` | 九九の 2 の段 |
| 11 | `S2-Ch06-11-count-even` | 偶数の個数を数える |
| 12 | `S2-Ch06-12-string-iterate` | 文字列を 1 文字ずつ |
| 13 | `S2-Ch06-13-find-max` | 配列の最大値 |
| 14 | `S2-Ch06-14-reverse-print` | 配列を逆順に出力 |
| 15 | `S2-Ch06-15-power-loop` | 2 の 8 乗をループで |
| 16 | `S2-Ch06-16-fizzbuzz-capstone` ⭐ | **[チャレンジ]** FizzBuzz |

### S2 学習ポイント

- `for (let i = 0; i < n; i++) { ... }` の三要素 (初期化・条件・更新) を理解する
- 累積パターン: `let total = 0; for { total += ... }`
- `break` は即終了、 `continue` は今回スキップ。 用途を使い分ける
- 境界条件 `i < arr.length` vs `i <= arr.length - 1`。 off-by-one バグの最頻出
- FizzBuzz では「判定の **順序** が結果を変える」 ことを体感する (15 の倍数を最初にチェック)

## 状態

S2: 16 問追加済み (Phase 7)。 S3-S5 は未着手。
