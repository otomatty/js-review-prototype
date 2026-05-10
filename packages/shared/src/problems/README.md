# 問題ファイル ルート

このディレクトリは新カリキュラム (Stage × Chapter の 2 軸) で再設計中。 旧 20 章 (`00-first-function/` 〜 `19-async/`) は Phase 2 (#26) で全削除済み。

## 章フォルダ一覧

各章 README は当該フォルダの `README.md` を参照。

| フォルダ | 章 | 含まれるステージ |
|---|---|---|
| [`00-setup/`](./00-setup/README.md) | Ch00 セットアップ | S0 |
| [`01-variables/`](./01-variables/README.md) | Ch01 変数 | S1, S2, S3 |
| [`02-numbers/`](./02-numbers/README.md) | Ch02 数値・演算 | S1, S2, S3, S4 |
| [`03-strings/`](./03-strings/README.md) | Ch03 文字列 | S1, S2, S3, S4, S5 |
| [`04-arrays/`](./04-arrays/README.md) | Ch04 配列 | S1, S2, S3, S4, S5 |
| [`05-conditionals/`](./05-conditionals/README.md) | Ch05 条件分岐 | S2, S3, S4, S5 |
| [`06-loops/`](./06-loops/README.md) | Ch06 ループ | S2, S3, S4, S5 |
| [`07-functions/`](./07-functions/README.md) | Ch07 関数 | S2, S3, S4, S5 |
| [`08-objects/`](./08-objects/README.md) | Ch08 オブジェクト | S3, S4, S5 |
| [`09-higher-order/`](./09-higher-order/README.md) | Ch09 高階関数 | S3, S4, S5 |
| [`10-data-structures/`](./10-data-structures/README.md) | Ch10 データ構造 | S4, S5 |
| [`11-algorithms/`](./11-algorithms/README.md) | Ch11 アルゴリズム | S4, S5 |
| [`12-debug/`](./12-debug/README.md) | Ch12 デバッグ | S0, S1, S2, S3, S4, S5 |
| [`13-error-handling/`](./13-error-handling/README.md) | Ch13 エラー処理 | S3, S4, S5 |
| [`14-regex/`](./14-regex/README.md) | Ch14 正規表現 | S3, S4, S5 |
| [`15-class/`](./15-class/README.md) | Ch15 class | S4, S5 |
| [`16-async/`](./16-async/README.md) | Ch16 非同期 | S4, S5 |

## 章フォルダの構造

各 `XX-chapter/` の中身:

```
XX-chapter/
├── README.md     # 章の概要 + 含まれるステージ + defaultMdnPage
├── _index.ts     # 当該章の Assignment[] を集約 (現在は空配列)
└── s{N}/         # ステージ別サブフォルダ。 1 ファイル = 1 課題で配置
    ├── ...
```

## ルート集約

[`./index.ts`](./index.ts) が 17 章の `_index.ts` を import して `assignments` / `chapters` を結合する。 章 × ステージ matrix UI 向けに、 以下の helper を提供する:

- `assignments`: 全課題の配列
- `chapters`: 全章の配列 (`packages/shared/src/curriculum/chapters.ts` 由来)
- `findAssignment(id)`: 課題 ID で検索
- `findChapter(id)`: 章 ID で検索
- `assignmentsByChapter(chapterId)`: 指定章の課題のみ
- `assignmentsByStage(stage)`: 指定ステージの課題のみ

## 関連ドキュメント

- [`../types.ts`](../types.ts) — `Assignment` / `Stage` / `Chapter` などの型定義
- [`../curriculum/stages.ts`](../curriculum/stages.ts) — ステージ定義
- [`../curriculum/chapters.ts`](../curriculum/chapters.ts) — 章定義 (`defaultMdnPage` 含む)
- [`./_common.ts`](./_common.ts) — 全章共通の Lint ルール骨格

問題作成のガイド (旧 README に書かれていた `description` / `scaffolds` / `tests` の作り方) は、 新スキーマでの再整備が完了次第、 この README に追記する。
