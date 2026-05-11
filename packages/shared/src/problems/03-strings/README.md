# Ch03. 文字列

文字列リテラル、 連結、 テンプレートリテラル、 基本メソッド。 全ステージを通じて 「文字列を作る・調べる・組み立てる」 を繰り返す重い章。

## 含まれるステージ

- **S1** 文法体験 — シングル / ダブル / テンプレートの違い、 `+` 連結。
- **S2** 文法定着 — `length` / `slice` / `includes` などのよく使うメソッド。
- **S3** ロジック入門 — 入力文字列を受け取って整形・抽出する関数。
- **S4** アルゴリズム — 走査、 集計、 文字単位の解析。
- **S5** 設計演習 — 複数行入力のパースや書式整形などの統合課題。

## MDN 既定ページ

- [テキスト処理](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Text_formatting)

## ディレクトリ構成

```
03-strings/
├── README.md
├── _index.ts
├── s1/   # Phase 5 で追加済み (13 問、 末尾はチャレンジ問題)
├── s2/   # Phase 7 で追加済み (12 問)
├── s3/   # Phase 8 で追加予定
├── s4/   # Phase 9 で追加予定
└── s5/   # Phase 9 で追加予定
```

## S1 で扱う問題 (13 問、 13 番目がチャレンジ問題)

| # | ID | 主題 |
|---|---|---|
| 01 | `S1-Ch03-01-string-literal` | "..." と '...' で文字列を書く |
| 02 | `S1-Ch03-02-concat-plus` | + で文字列を連結する |
| 03 | `S1-Ch03-03-template-literal` | テンプレートリテラルで埋め込み |
| 04 | `S1-Ch03-04-escape-newline` | \n で改行を入れる |
| 05 | `S1-Ch03-05-length` | .length で文字数を取る |
| 06 | `S1-Ch03-06-to-upper-case` | toUpperCase で大文字化 |
| 07 | `S1-Ch03-07-to-lower-case` | toLowerCase で小文字化 |
| 08 | `S1-Ch03-08-slice-basic` | slice(開始) で末尾までを取る |
| 09 | `S1-Ch03-09-slice-range` | slice(開始, 終了) で範囲を取る |
| 10 | `S1-Ch03-10-replace-simple` | replace で文字列を置き換える |
| 11 | `S1-Ch03-11-multiline-template` | テンプレートで複数行を書く |
| 12 | `S1-Ch03-12-number-in-template` | テンプレートに数値を埋め込む |
| 13 | `S1-Ch03-13-self-intro-capstone` ⭐ | **[チャレンジ]** 自己紹介文を組み立てる |

### S1 学習ポイント

- 文字列リテラルは `"..."` / `'...'` / バッククォートの 3 通り
- 連結は `+` でも書けるが、 変数を埋め込むときは **テンプレートリテラル** が読みやすい
- `length` は **プロパティ** (カッコ無し)、 `toUpperCase` などは **メソッド** (カッコあり)
- `slice` の終了位置は **含まれない**

## S2 で扱う問題 (12 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S2-Ch03-01-split-comma` | split で CSV を分割 |
| 02 | `S2-Ch03-02-split-join` | split + join で区切り変換 |
| 03 | `S2-Ch03-03-replace-basic` | replace で 1 箇所置換 |
| 04 | `S2-Ch03-04-replaceAll` | replaceAll で全置換 |
| 05 | `S2-Ch03-05-includes` | includes で部分一致 |
| 06 | `S2-Ch03-06-startsWith` | startsWith で先頭一致 |
| 07 | `S2-Ch03-07-endsWith` | endsWith で末尾一致 |
| 08 | `S2-Ch03-08-trim` | trim で前後空白を除去 |
| 09 | `S2-Ch03-09-indexOf-string` | indexOf で位置を取得 |
| 10 | `S2-Ch03-10-padStart` | padStart で 0 埋め |
| 11 | `S2-Ch03-11-repeat` | repeat で文字列を繰り返す |
| 12 | `S2-Ch03-12-charAt` | charAt で 1 文字取り出す |

### S2 学習ポイント

- `split` で文字列を配列に、 `join` で配列を文字列に。 区切り文字の入れ替えは `split → join` の定番イディオム
- `replace` は最初の 1 箇所、 `replaceAll` ですべて。 区別を意識する
- `includes` / `startsWith` / `endsWith` で 「ある文字を含むか」 系の判定が簡潔に書ける
- `padStart` / `repeat` は文字列を「整形する」 系のメソッド

## 状態

S1: 13 問、 S2: 12 問追加済み (Phase 5 / Phase 7)。 S3-S5 は未着手。
