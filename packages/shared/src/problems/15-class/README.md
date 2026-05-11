# Ch15. class

`class`、 `constructor`、 メソッド、 継承、 `private`。 オブジェクト (Ch08) の発展として、 「同じ形のものを量産する」 ための型を扱う。

> **🆕 この章は S4 で初めて出ます。** S0-S3 では `class` は登場しません。 S4 で初めて `class` / `constructor` / インスタンスメソッド / `extends` / `static` を扱います。

## 含まれるステージ

- **S4** アルゴリズム — `class` の基本形、 インスタンスメソッド、 `extends` (1 段)、 `static`、 `#privateField` (実装済み)。
- **S5** 設計演習 — 継承を交えた設計、 複数クラスの協調 (Phase 9 後半で追加予定)。

## MDN 既定ページ

- [クラスを使用する](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_classes)

## ディレクトリ構成

```
15-class/
├── README.md
├── _index.ts
├── s4/   # class の基本形 / extends / static / #private (実装済み: 5 問 + 卒業課題)
└── s5/   # Phase 9 後半で追加予定
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
