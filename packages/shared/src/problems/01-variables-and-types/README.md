# 01. 変数と型

対応 MDN ページ: [JavaScript ガイド > 文法とデータ型](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types)

## この章までに学んだ構文

[`00-first-function`](../00-first-function/README.md) で学んだ:

- `function 名前(引数1, 引数2) { ... }` で関数を宣言する
- `return 値;` で関数から値を返す
- 数値リテラル ( `42`, `1.5`, `-3` ) と文字列リテラル ( `'hi'` )
- 算術演算子 `+` と `*`

## この章で学ぶこと

- `const` で「あとで変えない変数」を宣言する
- `typeof` で値の型名を調べる
- 文字列を `Number()` で数値に変換する
- 数値リテラルの 16 進表記 (`0xFF`) と `parseInt(s, 16)`
- テンプレートリテラル (`` `${name}さん` ``) で文字列を組み立てる

## 厳密な制約 (Stage 1: Foundation)

この章ではまだ次の構文を **使いません** (= 後の章で初めて出る):

- ❌ `let` (変わる変数 — 04 ループで初めて必要になる)
- ❌ `if` / `else` / 三項演算子 (03 条件分岐)
- ❌ `for` / `while` ループ (04 繰り返し)
- ❌ 配列リテラル `[]` / `arr[i]` / `arr.length` (05 配列の基礎)
- ❌ オブジェクトリテラル `{}` / 分割代入 (12, 13)
- ❌ `arr.map` などの配列メソッド (10)
- ❌ 正規表現 (18)

これらを **持ち込まなくても解ける問題** を選んでいるので、 順番にやれば必ず理解できます。

## 課題一覧

| # | 課題 | 難易度 | 形式 | 学習ポイント |
|---|---|---|---|---|
| 1 | [`sum-two`](./sum-two.ts) | ★ | 実装 | `const` で中間変数を作る |
| 2 | [`circle-area`](./circle-area.ts) | ★ | 実装 | `const PI = 3.14159;` などの定数 |
| 3 | [`celsius-to-fahrenheit`](./celsius-to-fahrenheit.ts) | ★ | 実装 | 計算を段階に分けて意味のある名前を付ける |
| 4 | [`type-name-of`](./type-name-of.ts) | ★ | 実装 | `typeof` で型名を返すだけ |
| 5 | [`is-typeof-null-object`](./is-typeof-null-object.ts) | ★ | 実装 | `typeof null === 'object'` の落とし穴を式で確かめる |
| 6 | [`string-to-number`](./string-to-number.ts) | ★ | 実装 | `Number(s)` で文字列を数値に |
| 7 | [`hex-to-decimal`](./hex-to-decimal.ts) | ★ | 実装 | `parseInt(s, 16)` で 16 進数を 10 進数に |
| 8 | [`template-greeting`](./template-greeting.ts) | ★ | 実装 | テンプレートリテラル `` `私は${name}` `` |

## 各問題の MDN セクション参照

各課題は MDN 「文法とデータ型」 ページの特定の見出しを学習対象にしています。

| 課題 | MDN 参照セクション |
|---|---|
| `sum-two` | [§ 変数の宣言](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#変数の宣言) / [§ 宣言と初期化](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#宣言と初期化) |
| `circle-area` | [§ 定数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#定数) / [§ 数値リテラル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#数値リテラル) |
| `celsius-to-fahrenheit` | [§ 宣言と初期化](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#宣言と初期化) / [§ 定数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#定数) |
| `type-name-of` | [§ データ型](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#データ型) |
| `is-typeof-null-object` | [§ データ型](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#データ型) |
| `string-to-number` | [§ 文字列から数値への変換](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#文字列から数値への変換) |
| `hex-to-decimal` | [§ 整数リテラル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#整数リテラル) / [§ 文字列から数値への変換](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#文字列から数値への変換) |
| `template-greeting` | [§ 文字列リテラル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#文字列リテラル) |

## 採点ルール（共通）

すべての課題で「**Lint・AST・テストの 3 軸すべて通過 = クリア**」の二値判定です。

- **Lint**: ESLint v9 (`eslint-linter-browserify`) で `severity === 2` (error) が 0 件
- **AST**: Babel パーサで `ast.required` が全充足、 `ast.forbidden` 違反 0 件
- **Tests**: サーバの isolated-vm（CI では Node `vm`）で全テストケース pass

## このトピックで使っている ESLint ルール

| ルール | 用途 | 採用問題 |
|---|---|---|
| `eqeqeq` | `==` / `!=` 禁止 | 全問（`COMMON_LINT_RULES`） |
| `no-var` | `var` 禁止 | 全問（`COMMON_LINT_RULES`） |
| `prefer-const` | 再代入されない `let` を警告 | 全問 (`warn`) |
| `prefer-template` | `+` 連結禁止 | `template-greeting` |
| `radix` | `parseInt` の基数省略禁止 | `hex-to-decimal` |
| `no-implicit-coercion` | `+text` のような暗黙数値変換を禁止 | `string-to-number` (明示的 `Number()` を促す) |
| `no-restricted-syntax` | 真偽値直接 return 禁止 | `is-typeof-null-object` |

## この章で扱わない論点（他章へ移動）

第 1 章 (旧構成) で扱っていた論点のうち、 構文的にこの章では成立しないものは下記の章で扱います:

| 論点 | 移動先 | 理由 |
|---|---|---|
| `let` の必要性 (再代入が必要な場面) | 04 繰り返し | ループの中で初めて自然に必要になる |
| `var` の関数スコープ問題 (`var-leaks`) | 04 繰り返し | for ループで `for (var i ...)` が出てくる |
| `const` 配列の中身が変えられる落とし穴 | 05 配列の基礎 | 配列を扱える章で初めて意味を持つ |
| TDZ（一時的デッドゾーン） | 09 スコープとクロージャ | `let` を使い始める章で扱う |
| `if/else if` チェーン (`describe-type`) | 03 条件分岐 | if 文が出てから |
| `+` の暗黙変換バグ | 02 演算子 / 10 イテレーション | reduce での合計問題 |
| エスケープシーケンス | 06 文字列 | 文字列メソッドと一緒に |

## 関連リンク

- 上位ドキュメント: [問題作成ガイド (`../README.md`)](../README.md)
- 前の章: [`../00-first-function/README.md`](../00-first-function/README.md)
- スキーマ: [`../../types.ts`](../../types.ts)
- 採点ロジック: [`../../grading/evaluate.ts`](../../grading/evaluate.ts)
