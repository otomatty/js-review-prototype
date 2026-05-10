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
├── README.md     # 章の概要 + 含まれるステージ + 既定 MDN URL（章 README 内に記載）
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
- [`../curriculum/chapters.ts`](../curriculum/chapters.ts) — 章定義 (`defaultMdnPage` / `mdnPageTitle`)
- [`./_common.ts`](./_common.ts) — 全章共通の Lint ルール骨格

## 問題作成ガイド

### 前提

- **1 課題 = 1 ファイル**。`XX-topic/s{N}/` に `export const xxx: Assignment = { ... }` で置く。
- その章の `_index.ts`（例: [`01-variables/_index.ts`](./01-variables/_index.ts)）から export し、ルート [`./index.ts`](./index.ts) の import に繋がっていること。
- 章単位の説明・問題一覧は当該 [`XX-topic/README.md`](./01-variables/README.md) にも反映すると、ブラウザ外でのレビューが楽になる。

### MDN を軸にする

カリキュラムを組み立てるときの **主な参照元** は次の 2 系統である。

- **Learn（動的スクリプティング）** — チュートリアル・課題が並んだ入門コース。[JavaScript による動的スクリプティング](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Scripting)
- **JavaScript ガイド** — 言語機能の横断的な説明。[JavaScript ガイド](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide)

**章レベル**では [`../curriculum/chapters.ts`](../curriculum/chapters.ts) の `defaultMdnPage` に「その章を代表する 1 ページ」の URL を、`mdnPageTitle` にブラウザタイトルから ` | MDN` や ` | ウェブ開発の学習 | MDN` を除いた **実ページ名** を書く。

**課題レベル**では `Assignment.mdnSections` に **必ず 1 件以上** 入れる（新規・改稿時の方針）。

- **同一ページ内の見出し** — `heading` のみ（省略時、URL の `#` は `heading` と一致する日本語アンカーを想定）。ベース URL は章の `defaultMdnPage`（フラグメントは UI 側で除去してから `#見出し` を付与）。
- **別ページを指すとき** — `pageUrl` に該当ページのベース URL（`#` なし）、**必ず** `pageTitle` にそのページの MDN タイトルも書く。例: [`01-variables/s1/11-template-literal-basic.ts`](./01-variables/s1/11-template-literal-basic.ts)

記号を含む見出しでアンカーが自動生成とずれる場合は `anchor` を明示する（[`../types.ts`](../types.ts) の `MdnSection` 参照）。

### `Assignment` チェックリスト

型定義は [`../types.ts`](../types.ts)。

| 項目 | メモ |
|------|------|
| `id` | `S{stage}-Ch{nn}-{連番}-{slug}` など、リポジトリ内で一意。 |
| `stage` / `chapterId` / `sequence` | 一覧・並び順に直結。 |
| `title` / `newConcept` | UI の見出し・バッジ用。 |
| `estimatedMinutes` / `difficulty` | 目安。 |
| `testKind` | `stdout`（`console.log` 捕捉）か `function`（式評価）か。ステージの [`../curriculum/stages.ts`](../curriculum/stages.ts) と整合させる。 |
| `description` | Markdown。**よく使う見出し**: `## やること` / `## 期待する出力` / `## ポイント`。 |
| `starterCode` | エディタの初期表示コード。 |
| `tests` | `stdout` なら `expectedStdout`（末尾改行は比較時に無視）、`function` なら評価する `code` 式。 |
| `entryPoints` | `function` 採点で抽出する名前。 |
| `solution` | 模範解答。CI の回帰で「全チェック通過」に使う。 |
| `badSolutions` | あえて不正解なコード（テスト / Lint / AST のどれかが必ず失敗すること）。 |
| `staticAnalysis` | ESLint ルールや AST の `required` / `forbidden`。 |
| `mdnSections` | 上記 MDN 方針に従い、**1 件以上** を目標にする。 |

### 章を丸ごと見直す手順（テンプレ）

1. Learn / Guide の該当章を開き、目次と見出しを眺める。
2. 既存の各課題と MDN 見出しの対応表を書く（スプレッドシートやメモでよい）。
3. 抜け・重複・難易度の飛びを洗い出す。
4. 課題ファイルを 1 本ずつ更新（`mdnSections` / 語句 / `tests` / `solution`）。
5. 章の `_index.ts` と [`../curriculum/chapters.ts`](../curriculum/chapters.ts) の URL・タイトルがまだ妥当か確認する。

### 動作確認

リポジトリルートで:

```bash
bun --filter @jsreview/shared typecheck
bun --filter @jsreview/shared test
bun --filter @jsreview/shared check-integrity
bun --filter @jsreview/client typecheck
```

クライアントのビルドまで確認する場合は `bun --filter @jsreview/client build`。
