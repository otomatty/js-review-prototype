# Ch01. 変数

`let` / `const`、 代入、 命名、 値の保持。 値に名前を付けて使い回す感覚を S1 から S3 まで段階的に深める。

## 含まれるステージ

- **S1** 文法体験 — 1 文 1 構文で `const` / `let` の宣言と代入を体験する。
- **S2** 文法定着 — 既習構文と組み合わせて再代入・スコープを意識する。
- **S3** ロジック入門 — 関数引数として変数を扱い、 自力で命名する。

## MDN 既定ページ

- [文法とデータ型 — 宣言](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#宣言)

## ディレクトリ構成

```
01-variables/
├── README.md
├── _index.ts
├── s1/   # Phase 5 で追加済み (12 問)
├── s2/   # Phase 7 で追加予定
└── s3/   # Phase 8 で追加予定
```

## S1 で扱う問題 (12 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S1-Ch01-01-const-string` | const で文字列を保持する |
| 02 | `S1-Ch01-02-const-number` | const で数値を保持する |
| 03 | `S1-Ch01-03-let-reassign` | let で再代入する |
| 04 | `S1-Ch01-04-let-vs-const` | const と let を使い分ける |
| 05 | `S1-Ch01-05-naming-camelcase` | camelCase で名前を付ける |
| 06 | `S1-Ch01-06-print-variable` | 変数の中身を console.log で出す |
| 07 | `S1-Ch01-07-multiple-vars` | 複数の変数を順に扱う |
| 08 | `S1-Ch01-08-store-calc-result` | 演算結果を変数に入れる |
| 09 | `S1-Ch01-09-concat-via-vars` | 変数同士を + で連結する |
| 10 | `S1-Ch01-10-copy-value` | 変数の値を別の変数にコピー |
| 11 | `S1-Ch01-11-template-literal-basic` | テンプレートリテラルで埋め込み |
| 12 | `S1-Ch01-12-const-array` | const に配列を入れて添字でアクセス |

### 学習ポイント

- 値が変わらないものは `const`、 変わるものは `let` を使う
- 変数名は **意味が伝わる camelCase** で書く (`userName`, `firstName` 等)
- 変数は **値の入れ物** ではなく **値に付ける名前**。 一度入れた値はそのまま `console.log` に渡せる
- テンプレートリテラル (`` ` ``) を使うと文字列の中に変数を埋め込める

## 状態

S1: 12 問追加済み (Phase 5)。 S2 / S3 は未着手。
