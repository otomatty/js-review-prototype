# Ch04. 配列

配列の作成、 参照、 更新、 基本メソッド。 後続のループ・高階関数・アルゴリズムすべての基礎になる、 もう 1 つの「重い章」。

## 含まれるステージ

- **S1** 文法体験 — `[]` リテラル、 添字アクセス、 `length`。
- **S2** 文法定着 — `push` / `pop` / `slice` などの基本操作。
- **S3** ロジック入門 — 配列を引数に取り、 値を 1 つ返す関数。
- **S4** アルゴリズム — 走査・集計・二重ループでの処理。
- **S5** 設計演習 — 複数の配列・データ構造を組み合わせて整形する。

## MDN 既定ページ

- [インデックス付きコレクション](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Indexed_collections)

## ディレクトリ構成

```
04-arrays/
├── README.md
├── _index.ts
├── s1/   # Phase 5 で追加済み (12 問、 末尾はチャレンジ問題)
├── s2/   # Phase 7 で追加済み (13 問、 末尾はチャレンジ問題)
├── s3/   # Phase 8 で追加予定
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S1 で扱う問題 (12 問、 12 番目がチャレンジ問題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S1-Ch04-01-array-literal` | [ ] で配列を作る |
| 02 | `S1-Ch04-02-index-access` | 添字 [i] で要素を取り出す |
| 03 | `S1-Ch04-03-length` | .length で要素数を取る |
| 04 | `S1-Ch04-04-push` | push で末尾に追加 |
| 05 | `S1-Ch04-05-pop` | pop で末尾を取り除く |
| 06 | `S1-Ch04-06-unshift` | unshift で先頭に追加 |
| 07 | `S1-Ch04-07-shift` | shift で先頭を取り除く |
| 08 | `S1-Ch04-08-print-array` | 配列をそのまま console.log で出す |
| 09 | `S1-Ch04-09-nested-access` | matrix[i][j] でネスト配列にアクセス |
| 10 | `S1-Ch04-10-update-element` | letters[i] = 値 で要素を上書き |
| 11 | `S1-Ch04-11-array-of-strings` | 添字と length を組み合わせる |
| 12 | `S1-Ch04-12-cart-total-capstone` ⭐ | **[チャレンジ]** 商品リストの合計額を出す |

### S1 学習ポイント

- 添字は **0 から数える**。 最後は `arr.length - 1`
- ループは S2 以降。 S1 では添字を 0, 1, 2 と並べて書く範囲に絞る
- `push` / `pop` (末尾)、 `unshift` / `shift` (先頭) の対比
- `const` で宣言した配列の **中身は書き換え可能** (要素更新・push 可)

## S2 で扱う問題 (13 問、 13 番目がチャレンジ問題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S2-Ch04-01-indexOf` | indexOf で要素位置を取得 |
| 02 | `S2-Ch04-02-includes` | includes で要素の有無 |
| 03 | `S2-Ch04-03-slice-basic` | slice(start, end) で部分配列 |
| 04 | `S2-Ch04-04-slice-negative` | 負の引数で末尾を取る |
| 05 | `S2-Ch04-05-concat` | concat で結合 |
| 06 | `S2-Ch04-06-join` | join で区切り文字列に |
| 07 | `S2-Ch04-07-reverse` | reverse で逆順 (破壊的) |
| 08 | `S2-Ch04-08-array-isarray` | Array.isArray で判定 |
| 09 | `S2-Ch04-09-copy-via-slice` | slice() でコピーを作る |
| 10 | `S2-Ch04-10-flat` | flat で二重配列を平らに |
| 11 | `S2-Ch04-11-fill` | new Array(n).fill(v) |
| 12 | `S2-Ch04-12-at-negative` | at(-1) で末尾要素 |
| 13 | `S2-Ch04-13-sum-capstone` ⭐ | **[チャレンジ]** for ループで配列合計 |

### S2 学習ポイント

- `indexOf` / `includes` で要素の検索。 `includes` は真偽値、 `indexOf` は位置 (見つからないと -1)
- `slice` は **破壊しない**、 `reverse` / `sort` は **破壊する**。 元配列を残したいときは `slice()` でコピーしてから呼ぶ
- `Array.isArray` で型判定 (`typeof` だと "object" になる)
- `at(-1)` で末尾要素を読みやすく取得
- チャレンジでは for ループ (Ch06 で詳しく扱う) と配列を組み合わせる

## 状態

S1: 12 問、 S2: 13 問追加済み (Phase 5 / Phase 7)。 S3-S5 は未着手。
