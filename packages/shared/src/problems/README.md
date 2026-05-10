# 問題作成ガイド (Problem Authoring Guide)

このドキュメントは、本アプリの章ごとの課題（`Assignment`）を **「完全初心者でも順番に進めれば必ず理解できる」 形で作るためのルール** をまとめたものです。 第 2 章以降を新規作成・改訂するときの一次資料として使ってください。

実例は次を参照:

- [`./00-first-function/README.md`](./00-first-function/README.md) — 章 0 「はじめての関数」
- [`./01-variables-and-types/README.md`](./01-variables-and-types/README.md) — 章 1 「変数と型」

---

## 0. 設計の根本原則 (重要)

### 0-1. 想定ユーザー: プログラミング完全初心者

- 「関数とは何か」「return とは何か」も知らない人が、 章 0 から順番にやれば必ず理解できることを目指す。
- 「他言語経験者なら知っているはず」 という前提を **置かない**。
- ただし「全章順にやる」 とは想定していて、 各章は **直前の章までに学んだ構文** を使ってよい。

### 0-2. 章順 = 構文導入順 (MDN 順とは異なる)

| 新# | 章 | この章で初登場する構文 |
|---|---|---|
| 00 | はじめての関数 | `function`, `return`, 引数, リテラル, `+ *` |
| 01 | 変数と型 | `const`, `typeof`, 数値・文字列リテラル各種, テンプレートリテラル |
| 02 | 演算子と比較 | 算術・比較・論理・短絡評価・null合体・optional chaining |
| 03 | 条件分岐 | `if/else`, 三項, `switch`, truthy/falsy |
| 04 | 繰り返し | `for`, `while`, `for...of`, `let` (再代入が必要な場面で初登場) |
| 05 | 配列の基礎 | `[]`, `arr[i]`, `arr.length`, `push/pop`, `slice` |
| 06 | 文字列操作 | `String` メソッド, エスケープシーケンス |
| 07 | 関数の基礎 | 関数式, デフォルト引数, 残余引数 |
| 08 | アロー関数と this | アロー, `this`, コールバック |
| 09 | スコープとクロージャ | クロージャ, ファクトリ, TDZ |
| 10 | 配列のイテレーション | `map / filter / reduce / find / some / every / sort` |
| 11 | 数値・Math・Date | `Number`, `Math`, `Date` |
| 12 | オブジェクトの基礎 | object literal, shorthand, computed key |
| 13 | 分割代入とスプレッド | destructuring, spread, rest |
| 14 | Map / Set | `Map`, `Set` |
| 15 | クラスの基礎 | `class`, `constructor`, メソッド |
| 16 | クラスの応用 | 継承, `static`, `#private` |
| 17 | エラー処理 | `try/catch/throw`, Error 派生 |
| 18 | 正規表現 | `RegExp`, match, replace |
| 19 | 非同期処理 | Promise, async/await |

### 0-3. 「Stage」 ≒ 「直前章までの累積知識」

各課題は **その章 (= Stage) までに学んだ構文だけ** で書ける必要がある。

| Stage | 解禁されるもの (累積) | 該当章 |
|---|---|---|
| 0 | 関数・return・基本式 | 00 |
| 1 | + `const` / `typeof` / リテラル | 01 |
| 2 | + 演算子全般 | 02 |
| 3 | + `if/else` / 三項 / `switch` | 03 |
| 4 | + ループ・`let` | 04 |
| 5 | + 配列の基本操作 | 05 |
| 6 | + 文字列メソッド | 06 |
| 7 | + 関数式・デフォルト引数 | 07 |
| 8 | + アロー関数 | 08 |
| 9 | + クロージャ | 09 |
| 10 | + 配列の高階関数 | 10 |
| 11 | + Number/Math/Date | 11 |
| 12 | + オブジェクトリテラル | 12 |
| 13 | + 分割代入・スプレッド | 13 |
| 14 | + Map/Set | 14 |
| 15-16 | + クラス | 15-16 |
| 17 | + try/catch | 17 |
| 18 | + 正規表現 | 18 |
| 19 | + Promise/async | 19 |

> **設計時の自問**: 「この問題、 章 N までしか学んでいない人が解けるか？」 解けないなら **後ろの章に移すか、 中の構文を簡単にする**。

---

## 1. ディレクトリ構造

```
packages/shared/src/problems/
├── README.md                        # このドキュメント
├── _common.ts                       # 全章共通の Lint ルール
├── index.ts                         # 全章を集約 (assignments / topics)
│
├── 00-first-function/               # 章 0 = 1 フォルダ
│   ├── README.md                    # 章 README (MDN 見出し対応・問題概要)
│   ├── index.ts                     # この章の Assignment[] を集約
│   ├── return-hello.ts              # 1 課題 = 1 ファイル
│   ├── echo.ts
│   └── ...
│
├── 01-variables-and-types/
└── ...
```

### 1-1. 命名規則

| 対象 | ルール | 例 |
|---|---|---|
| 章フォルダ名 | `NN-<topic-id>` (2 桁ゼロパディング + ハイフン区切り) | `01-variables-and-types` |
| 課題ファイル名 | `<assignment-id>.ts` (= `Assignment.id` をそのまま使う) | `const-by-default.ts` |
| 課題変数名 | `Assignment.id` を **kebab → camelCase** | `constByDefault` |
| 課題 ID | 基本は kebab-case (`parse-decimal`)。 既存の camelCase ID (`countChars`) はそのまま | — |
| トピック ID | `Topic.id` 型 (`TopicId`) と一致 | `variables-and-types` |

### 1-2. 課題ファイルの形

```ts
import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const sumTwo: Assignment = {
  id: "sum-two",
  topicId: "variables-and-types",
  title: "const に値を入れて、 その合計を返す",
  difficulty: 1,
  description: `## ...`,
  starterCode: `...`,
  solution: `...`,
  badSolutions: [...],
  entryPoints: ["addAges"],
  tests: [...],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: { forbidden: [...] },
  mdnSections: [          // ← 課題が参照する MDN 見出し (詳細は §2-3)
    { heading: "変数の宣言" },
    { heading: "宣言と初期化" },
  ],
};
```

### 1-3. 章 `index.ts` の形

```ts
import type { Assignment } from "../../types.js";

import { sumTwo } from "./sum-two.js";
import { circleArea } from "./circle-area.js";
// ... 章内の出題順 (易→難 / 基礎→落とし穴) で並べる ...

export const variablesAndTypes: Assignment[] = [
  sumTwo,
  circleArea,
  // ...
];
```

### 1-4. root `index.ts` への登録

新しい章フォルダを作ったら `problems/index.ts` の以下 3 か所を更新:

1. `import { ... } from "./NN-<topic-id>/index.js";` を追加
2. `export const topics` 配列に `Topic` オブジェクトを追加（`order` は **新章順** = `00-first-function` 起点で連番）
3. `export const assignments` の `...` スプレッドに章順で追加

---

## 2. MDN 参照ルール

### 2-1. 章 ≒ MDN ページ (ただし完全 1:1 ではない)

- 各章は概ね MDN ガイドの 1 ページに対応する (`Topic.mdnUrl`)。
- **ただし初心者動線を優先するため、 章順 ≠ MDN 章順** にしてある (例: 配列基礎を関数より先に置く)。
- 章ラベル (`Topic.label`) は **新章番号** + 内容名。 例: `05. 配列の基礎`
- `Topic.mdnUrl` は **JA 版** の URL を使う。
- 章 0 「はじめての関数」 は対応する単一 MDN ページがないので、 各課題の `mdnSections.pageUrl` で個別に参照する。

### 2-2. 問題 = MDN の見出し（セクション）

- 各課題は **MDN ページ内の特定の見出し（H2 / H3 / H4）** を学習対象にする。
- 章 README には課題ごとに `[§ 見出し名](URL#見出し名)` の形式で MDN セクションへのリンクを必ず書く。
- 1 つの課題が 2〜3 のセクションを統合的に扱う場合は、複数のリンクを並べてよい。

JA MDN の anchor は **見出し日本語をそのまま使う**（クライアントが URL エンコードする）:

```
https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#変数のスコープ
```

### 2-3. `mdnSections` フィールド

各 `Assignment` に `mdnSections?: MdnSection[]` を **必ず付ける**。 これは UI（問題演習ページの説明ペイン上部）に **「参考: §<見出し> · §<見出し>」** という形でクリック可能な MDN セクションリンクとして自動的に表示される。

```ts
mdnSections: [
  { heading: "変数の宣言" },           // → topic.mdnUrl#変数の宣言
  { heading: "宣言と初期化" },         // → topic.mdnUrl#宣言と初期化
];
```

#### `MdnSection` の各フィールド

| フィールド | 必須 | 説明 |
|---|---|---|
| `heading` | ✅ | UI に表示する見出しテキスト。MDN の見出しをそのまま書く。 |
| `anchor` | — | URL フラグメント部分。**省略時は `heading` をそのまま使う**。 JA MDN は日本語見出しがそのまま anchor になるため、ほとんどのケースで省略可能。 |
| `pageUrl` | — | 参照先ページ URL の上書き。**省略時は `topic.mdnUrl` を使う**。 別ページのセクションを参照したい時にだけ指定する。 |

#### `anchor` を明示する必要があるケース

見出しに **記号（`'`、`+`、`(`、`)` 等）** が含まれる場合、 MDN のスラグ生成器がそれらを除去するため、`heading` と実際の anchor が一致しなくなる。 こうしたときだけ `anchor` を明示する:

```ts
mdnSections: [
  // MDN 見出し: "数値と '+' 演算子" / 実際の anchor: "数値と_演算子"
  { heading: "数値と '+' 演算子", anchor: "数値と_演算子" },
  { heading: "データ型の変換" },
];
```

#### 別ページを参照するケース

「主トピックは A だが、関連知識として B ページの 1 セクションも紹介したい」場合は `pageUrl` を併用:

```ts
mdnSections: [
  { heading: "クロージャ" },                     // 主トピックのページ
  {
    heading: "let の TDZ",
    pageUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let",
    anchor: "一時的なデッドゾーン_tdz",
  },
];
```

#### 章 README との整合

章 README に書く `[§ 見出し](URL#anchor)` と `mdnSections[].heading` / `anchor` は **必ず一致させる**。 README は人間向けの目次、`mdnSections` は UI 描画用データ、という二重管理になるが、 編集箇所が並ぶので差分レビューしやすい。

### 2-4. 章内の出題順

- **やさしい → 難しい** の順、 または **基礎 → 落とし穴** の順で並べる。
- MDN ページ内の節順を完全には踏襲しなくてよい。 教育的な順を優先する。

### 2-5. 別トピックに任せる論点

MDN 1 ページがカバーする論点でも、 アプリの章立て上 **他章の担当範囲なら入れない**。 章順自体が初心者動線で並んでいるため、 **「その論点は何章で初登場か」を §0-2 の表で確認** する。

章 README の最後に「この章では扱わない論点（他章に任せる）」を明記しておくと迷わない。 [`01-variables-and-types/README.md`](./01-variables-and-types/README.md) の末尾に実例があります。

---

## 3. 問題のタイプ

問題は次の **3 タイプ** から最も学習効果の高いものを選ぶ。 1 つの章で全タイプを混ぜると緩急がついて飽きにくい。

| タイプ | 用途 | starterCode の作り |
|---|---|---|
| **A. 実装系** | 概念を能動的に組み立てさせたい時 | スタブ (`return 0;`) + JSDoc 仕様 + `// TODO 1, 2, 3` で手順を示す |
| **B. 修正系** | 落とし穴・アンチパターンを体感させたい時 | 「動くがバグがある」コード + コメントでバグの正体と修正方針を示す |
| **C. 不変系** | 与えられたデータを変えずに新しい結果を作る練習 | データのサンプルをコメントで示し、関数シグネチャだけ書く |

### 修正系の落とし穴

修正系は **starter にあえて違反コード（`var` など）を含める** ため、 AST `forbidden` を強くしすぎると starter が CI の「starterCode は AST forbidden に違反しない」テストで落ちます。

**回避策**: そのパターンは AST `forbidden` から外し、 **Lint ルール（`no-var: error` など）に任せる**。 Lint は submission に対してのみ走るので、 starter に `var` が残っていても CI を通せます。

例（`var-leaks` の AST 設定）:

```ts
ast: {
  // starter に意図的に var を含むため、AST forbidden には var を入れない。
  // submission の var は Lint (no-var: error) で弾く。
  forbidden: [],
},
```

---

## 4. 問題文 (`description`) のルール

`description` は **クライアントで Markdown としてレンダリング** されます。

### 4-1. 構成

```md
## <H2 タイトル：何を作るか 1 行で>

<関数の役割を 1〜2 行で要約>

### 学習ポイント

- 箇条書きで 2〜4 個。MDN の表現を可能な限り引用する。
- 重要キーワードは **太字** にする。

### (修正系のみ) 現在のバグ

starter のコードは ... というバグがあります。修正方針: ...

### 入出力例

\`\`\`js
foo("a")  // → 1
foo("")   // → 0
\`\`\`

### 制約

- やる: テンプレートリテラルを使う
- やらない: `+` 連結 / `var`
```

### 4-2. 表記ルール

- 用語は初出時に **「（〜のこと）」** で補足する。
  - 例: 「**真偽値 (boolean)**」「**ブロックスコープ**（波括弧 `{}` の中だけのスコープ）」
- 入出力は **表または `// →` 形式** で書き、テキストでだらだら書かない。
- 重要なキーワード（**太字**）と コード (`` ` ``) を使い分ける。
- 落とし穴は **「重要な落とし穴:」** のような明示的なリードで切り出す。

### 4-3. ヒントの粒度

- D1 (★): 手順を具体的に示してよい（`Number.isFinite` を使う、など）
- D2 (★★): 概念ヒント止まり。実装方針は学習者に任せる。
- D3 (★★★): ほぼノーヒント。シグネチャと制約だけ。

---

## 5. `starterCode` のルール

「採点を実行」を押した瞬間に学習者の目に入るコードなので、 **問題文と同じくらい丁寧に作る**。

### 5-1. 共通ルール

- **何も書き換えなくても throw しない** 状態にする。安全な戻り値（`return 0;` / `return null;` / `return [];` / `return '';`）を必ず置く。
- 関数シグネチャ（引数名）は問題文と一致させる。
- 関数の **直前** に複数行コメントで「何をする関数か / 入出力例 / ヒント」を書く。 JSDoc 風 `/** */` または連続する `// ` のどちらでも可。
- 関数本体に `// TODO 1: ... // TODO 2: ...` で手順を示す（D1 のみ）。

### 5-2. 実装系 (タイプ A) のテンプレート

```js
// <関数の役割>
//
// 例:
//   foo("a") → 1
//   foo("")  → 0
//
// ヒント:
//   - <概念ヒント>
//   - <使うかもしれない API>
function foo(s) {
  // TODO 1: ...
  // TODO 2: ...
  return 0;
}
```

### 5-3. 修正系 (タイプ B) のテンプレート

```js
// <関数の役割>
//
// 例:
//   foo([1,2]) → 3
//   foo([])    → null   ← starter ではここが間違う
//
// バグの正体:
//   <バグの構造を 2〜3 行で説明>
//
// 修正:
//   <修正方針を箇条書きで 1〜3 個>
function foo(arr) {
  // バグありの動く実装
  ...
}
```

### 5-4. テンプレートリテラルでの注意

`description` や `starterCode` は **TypeScript のテンプレートリテラル** で書きます。中で `` ` `` や `${}` を使う場合のエスケープ:

| 書きたい文字 | TS ソース |
|---|---|
| バッククォート `` ` `` | `` \` `` |
| ドル記法 `${...}` | `\${...}` |
| バックスラッシュ 1 文字 `\` | `\\` |

**バッククォートと `${...}` の両方を含む文字列**（テンプレート文字列を含むコード）は、`"..." + "..."` の文字列連結で書くと安全です（`format-greeting.ts` / `quote-string.ts` がこのパターン）。

```ts
solution:
  "function greet(profile) {\n" +
  "  const { name, age, sport } = profile;\n" +
  "  return `私は${name} (${age}歳)。種目は${sport}です。`;\n" +
  "}\n",
```

---

## 6. `solution` のルール

- **必ず定義する**。 `solution` 未定義の課題は CI (`problems.spec.ts` の「全課題に solution が付与されている」) で落ちる。
- `solution` は **Lint・AST・テストの 3 軸すべてを通過** する必要がある（CI で全 solution に対して検証）。
- アプリ UI ではクリア後に「解答例を表示」アコーディオンから閲覧できるので、 **読みやすい・素直な実装** を選ぶ。最短コードよりも教育的なコードを優先。
- 学習者がそのままコピペすればクリアできる完成形にする（`// TODO` を残さない）。

---

## 7. `badSolutions` のルール

- 各課題に **最低 1 件、できれば 2〜3 件** 用意する。「クリアしてはいけない実装パターン」を CI で検証することで、テストの抜けを発見できる。
- `description` には **「何を間違えているか・どのチェックで弾かれるべきか」** を書く。
- バリエーションの目安:
  1. **要件未満**: テストの 1 つを落とすロジックの抜け（例: `null` チェック忘れ）
  2. **アンチパターン**: AST `forbidden` または Lint で弾かれるべき書き方（例: `var` を使う）
  3. **副作用**: 元データを破壊するなど、不変性に違反する書き方

CI (`problems.spec.ts`) は各 `badSolution` に対して `report.evaluation.cleared === false` を期待します。 もし bad なのに通ってしまったら、テスト or AST or Lint のチェックが甘いということ。

---

## 8. AST と Lint の選び方

### 8-1. 役割分担

| チェック | 走るタイミング | 主な用途 |
|---|---|---|
| AST `required` | submission のみ | 「テンプレートリテラルを使う」「reduce を使う」など、**特定の構文・呼び出しを必須** にしたい時 |
| AST `forbidden` | submission **+ starterCode** | 「`var` を使わない」「`for` を使わない」など、 **構文レベルで禁止** したい時 |
| Lint rules | submission のみ | スタイル系・型強制系（`eqeqeq` / `prefer-const` / `radix` など） |

### 8-2. AST `forbidden` を使うときの注意

CI は **starterCode が `forbidden` に違反していない** ことを検証します。 修正系問題で starter にバグを残したい場合は、そのパターンを `forbidden` から外して **Lint で代替** してください（[3. 問題のタイプ § 修正系の落とし穴](#修正系の落とし穴) 参照）。

### 8-3. 利用できる AST パターン

`packages/shared/src/types.ts` の `ASTPattern` を参照。

```ts
type ASTPattern =
  | { kind: "method"; name: string; label?: string }   // x.NAME(...) 形式の呼び出し
  | { kind: "node"; nodeType: ASTNodeType; label?: string }
  | { kind: "var"; label?: string }                    // var 宣言
  | { kind: "loose-eq"; label?: string }               // == / !=
  | { kind: "async-fn"; label?: string };              // async 関数
```

`kind: "method"` は **`x.NAME(...)`** にしかマッチしないので、`parseInt(...)` のような **フリー関数呼び出し** は検出できません。フリー関数の使用強制は **Lint や入出力テストで担保** してください。

### 8-4. このプロジェクトで採用済みの ESLint ルール

`eslint-linter-browserify` (= ESLint v9 本体) のすべての core ルールが使えます。これまでに採用したもの:

| ルール | 用途 |
|---|---|
| `eqeqeq` | `==` / `!=` 禁止 |
| `no-var` | `var` 禁止 |
| `prefer-const` | 再代入されない `let` を警告 |
| `prefer-template` | `+` 連結を禁止し、テンプレートリテラルを促す |
| `radix` | `parseInt` の基数省略を検出 |
| `no-use-before-define` | TDZ 違反 |
| `no-restricted-syntax` | 任意の AST セレクタで禁止構文を定義 |
| `no-unused-vars` | 未使用変数（`entryPoints` の関数は自動で除外される） |

新しいルールを追加する時は、 [ESLint 公式ルールリスト](https://eslint.org/docs/latest/rules/) から選び、 ブラウザの `eslint-linter-browserify` でも動くもの（= core ルール）を選んでください。プラグインルールは使えません。

---

## 9. テストケースの書き方

### 9-1. 基本

`tests[i].code` は **真偽値を返す JS 式** として評価されます (`truthy` で pass)。

```ts
tests: [
  { name: "通常", code: "foo(3) === 6" },
  { name: "空配列", code: "foo([]) === 0" },
],
```

### 9-2. 配列・オブジェクト比較

`===` は参照比較なので、 `JSON.stringify` で文字列化して比較します。

```ts
{ name: "通常", code: "JSON.stringify(foo([1,2])) === '[1,2,3]'" },
```

オブジェクトのプロパティ順は **整数キーが先、その他は挿入順**。 `{r, g, b}` の順で作ったオブジェクトは `JSON.stringify` でも `{"r":...,"g":...,"b":...}` の順になるので安定して比較できます。

### 9-3. 副作用テスト（不変性確認）

「元の配列を変更しない」のような副作用検証は **IIFE で 1 行式** にします。

```ts
{
  name: "元の配列が変わらない",
  code: "(() => { const a = [1, 2]; foo(a, 3); return a.length === 2 && a[0] === 1; })()",
},
```

### 9-4. テストの粒度

- **テストケース 1 つ = 観点 1 つ** にする（複数観点を `&&` で詰めない）。 `tests[i].name` がそのまま UI の「失敗したテスト一覧」に出るので、何を確認しているか見て分かるようにする。
- 1 課題あたり **3〜8 ケース** が目安。 境界（空配列・0・null・型違い）と通常ケースを混ぜる。

### 9-5. 非同期テスト

`tests[i].code` が `Promise` を返した場合、 runner は自動で await します。 async/await を使う問題（第 19 章など）はそのまま `await foo()` 等を書けます。

---

## 10. CI による品質保証

新しい課題を追加したら、最低この 3 つを通します。

```bash
cd packages/shared
bun run check-integrity   # ID 重複・starter の forbidden 違反・topicId 整合
bun run typecheck         # tsc --noEmit
bun test                  # problems.spec.ts (全 solution クリア / 全 badSolution 失敗)
```

ワークスペース全体の typecheck:

```bash
# repo root から
bun --filter '*' typecheck
```

### `problems.spec.ts` が見ているもの

1. **ID 重複なし**
2. **`starterCode` が AST `forbidden` に違反していない**（パースエラーも含む）
3. **`solution` が `cleared === true`** （Lint・AST・Tests すべて通過）
4. **各 `badSolution` が `cleared === false`** （何かしら 1 つ以上のチェックで失敗）

これらが落ちた時のエラーメッセージには `failedTests` / `missingRequired` / `forbiddenViolations` / `lintViolations` が JSON で出るので、原因を特定しやすくなっています。

---

## 11. 課題追加時のチェックリスト

新しい課題を 1 つ追加するときの作業チェックリスト:

- [ ] 学習対象とする MDN ページの **見出し** を 1〜3 個決めた
- [ ] その見出しが **既存の他章に被っていない** ことを確認した
- [ ] 課題タイプ（実装 / 修正 / 不変）を選んだ
- [ ] `id` を決めた（既存と被らない、kebab-case 推奨）
- [ ] `<id>.ts` を作り、 `Assignment` を export した
- [ ] 章フォルダの `index.ts` に **MDN 章順の位置** で import & 配列追加した
- [ ] `description` に学習ポイント・入出力例・制約を書いた
- [ ] `starterCode` を「触ってもエラーにならない」状態で書いた
- [ ] `solution` を素直な完成形で書いた
- [ ] `badSolutions` を 1 件以上書き、それぞれに `description` を付けた
- [ ] `tests` を 3〜8 ケース書き、 観点 1 つ = ケース 1 つにした
- [ ] `eslint.rules` と `ast` を整合させた（修正系で starter にバグがあるなら AST forbidden を緩める）
- [ ] **`mdnSections`** を設定した（記号入り見出しなら `anchor` も明示）
- [ ] **章 README** に新しい課題の節を追加した（MDN セクションへのリンク付き、`mdnSections` と一致）
- [ ] `bun run check-integrity` 通過
- [ ] `bun run typecheck` 通過
- [ ] `bun test` 通過

---

## 12. 章新設時のチェックリスト

新しい章を **新規作成** するときは上記に加えて:

- [ ] 対応する MDN ページの URL を確認した（必ず JA 版）
- [ ] MDN ページの **目次（H2 / H3）を全部書き出して**、どこを問題化するか・他章に任せるかを整理した
- [ ] フォルダ `NN-<topic-id>/` を作成
- [ ] `Topic` を `problems/index.ts` の `topics` 配列に MDN 順序で追加
- [ ] `assignments` のスプレッド配列にも追加
- [ ] **章 README** を `01-variables-and-types/README.md` のフォーマットに従って作成
- [ ] root ガイド（このファイル）の例として参照する場合、必要に応じて追記

---

## 13. 関連ドキュメント

- [`./_common.ts`](./_common.ts) — 全章共通の Lint ルール
- [`../types.ts`](../types.ts) — `Assignment` / `ASTPattern` / `EvaluationResult` の型定義
- [`../grading/ast.ts`](../grading/ast.ts) — AST 解析（`required` / `forbidden` の判定）
- [`../grading/evaluate.ts`](../grading/evaluate.ts) — 三軸統合判定
- [`../../test/problems.spec.ts`](../../test/problems.spec.ts) — CI 検証
- [`../../scripts/check-integrity.ts`](../../scripts/check-integrity.ts) — 整合性チェック
