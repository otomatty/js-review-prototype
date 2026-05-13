# Ch15. class

`class`、 `constructor`、 メソッド、 継承、 `private`。 オブジェクト (Ch08) の発展として、 「同じ形のものを量産する」 ための型を扱う。

> **🆕 この章は S4 で初めて出ます。** S0-S3 では `class` は登場しません。 S4 で初めて `class` / `constructor` / インスタンスメソッド / `extends` / `static` を扱います。

## 含まれるステージ

- **S4** アルゴリズム — `class` の基本形、 インスタンスメソッド、 `extends` (1 段)、 `static`、 `#privateField` (実装済み)。
- **S5** 設計演習 — 複数 class の連携 (集約 / 委譲)、 値 / 集合 / ユースケースの責務分割、 コンポジション優先 (実装済み)。

## MDN 既定ページ

- [クラスを使用する](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_classes)

## ディレクトリ構成

```
15-class/
├── README.md
├── _index.ts
├── s4/   # class の基本形 / extends / static / #private (実装済み: 5 問 + 卒業課題)
└── s5/   # 多 class 連携 / 集約 / 委譲 / 不変条件 (実装済み: 3 問、 うち 1 問が S5 卒業課題)
```

## S4 問題ラインナップ

| # | タイトル | 主に学ぶ概念 |
|---|---|---|
| 1 | Counter クラスで「数を覚えておく箱」 を作る | `constructor` でフィールド初期化 / インスタンスメソッド |
| 2 | Rectangle クラスで面積と周長を計算する | フィールドから派生する複数メソッド |
| 3 | Stack クラスで配列を包んで使い勝手を整える | 内部状態のカプセル化 |
| 4 | extends と super で挨拶クラスを派生させる | `extends` / `super()` / メソッドのオーバーライド |
| 5 | static メソッドで Temperature の生成口を用意する | `static` ファクトリと `new` の関係 |
| 6 | [卒業課題] BankAccount を `#privateField` + static factory で守る | `#privateField` でカプセル化 + 不変条件の維持 |

## S5 で扱う問題 (3 問、 卒業課題 1 問)

| # | ID | 主題 |
|---|---|---|
| 01 | `S5-Ch15-01-task-list` | `Task` と `TaskList` の 2 class で **集約** を組む。 ID 採番を集合側に置く / 状態遷移は Task に委譲 / `pending()` は内部配列のスナップショットを返す |
| 02 | `S5-Ch15-02-shopping-cart` | `Product` (値オブジェクト) と `Cart` (集約) を **継承ではなくコンポジション** で組む。 同じ Product を 2 回 add したら qty を合算する行設計 |
| 03 | `S5-Ch15-03-shop-capstone` ⭐ | **[S5 卒業課題]** `Product` / `Inventory` / `Shop` の 3 class 連携。 値 / 集合 / ユースケース の責務分割 + 委譲 + 失敗は値で返す |

### S5 学習ポイント

- **値 / 集合 / ユースケースの 3 段で責務を切る**。 1 つの class に詰め込まず、 「1 件の表現 (`Product`)」 「複数を抱える集合 (`Inventory`, `TaskList`, `Cart`)」 「利用者向けの操作 (`Shop`)」 を別の class に分けると、 後から差し替えやすくなる
- **継承よりコンポジション**。 `Cart extends Product` や `Shop extends Inventory` のように 「ちょっと機能を足したいから extends」 はやめて、 内部に **持つ** (集約 / 所有) で組む。 is-a 関係 (`A は B の一種`) になっていないときは継承を選ばない
- **委譲 (delegation)**。 `Shop#buy` は自分で在庫を直接いじらず、 `#inventory.take(...)` に処理を **任せる**。 「同じ in-memory データを 2 箇所で同期しないと壊れる」 状態を避けられる
- **不変条件は class の中で守る**。 「price は 0 以上」 「在庫は負にならない」 「Inventory は Shop の外から見えない」 を、 `#privateField` と constructor の `throw` で **データ構造側に閉じ込める**。 呼び出し側のお行儀に頼らない
- **失敗は値で返す、 例外で抜けない**。 `Shop#buy` は在庫不足や未登録 sku のとき例外を投げず `{ ok: false, total: 0 }` を返す。 Ch13 S5 で扱った 「失敗を値として持ち回る」 発想を、 クラス設計の文脈でも継続する
- **スナップショットを返す**。 `TaskList#pending()` のような抽出メソッドは内部配列の参照ではなく `filter` で作った新しい配列を返す。 呼び出し側が破壊的に触っても元の集合は壊れない

## 状態

S4: 6 問追加済み (Phase 9 前半)。 S5: 3 問追加済み (Phase 9 後半)。 Ch15 class 章は完成。
