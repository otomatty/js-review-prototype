/**
 * 全トピックを集約して `assignments` / `topics` を公開する。
 *
 * - 各トピックは `NN-topic-id/` フォルダの中に「1 課題 = 1 ファイル」で配置する
 * - 各フォルダの `index.ts` がそのトピックの `Assignment[]` を集約する
 * - 並び順は **初心者推奨学習順**:
 *     はじめての関数 → 変数と型 → 演算子 → 制御 → ループ →
 *     配列基礎 → 文字列 → 関数の基礎 → アロー関数 → スコープ・クロージャ →
 *     配列イテレーション → 数値・Math・Date → オブジェクト → 分割代入 →
 *     Map/Set → クラス → エラー処理 → 正規表現 → 非同期
 *
 * 各章で「ここまでに学んだ構文」だけが使えるよう問題が組み立てられている。
 * 設計指針は `./README.md` を参照。
 */

import type { Assignment, Topic, TopicId } from "../types.js";

import { firstFunction } from "./00-first-function/index.js";
import { variablesAndTypes } from "./01-variables-and-types/index.js";
import { operators } from "./02-operators/index.js";
import { controlFlow } from "./03-control-flow/index.js";
import { loops } from "./04-loops/index.js";
import { arraysBasics } from "./05-arrays-basics/index.js";
import { strings } from "./06-strings/index.js";
import { functionsBasics } from "./07-functions-basics/index.js";
import { functionsArrowThis } from "./08-functions-arrow-this/index.js";
import { scopeClosure } from "./09-scope-closure/index.js";
import { arraysIteration } from "./10-arrays-iteration/index.js";
import { numbersMathDate } from "./11-numbers-math-date/index.js";
import { objectsBasics } from "./12-objects-basics/index.js";
import { destructuringSpread } from "./13-destructuring-spread/index.js";
import { collections } from "./14-collections/index.js";
import { classesBasics } from "./15-classes-basics/index.js";
import { classesAdvanced } from "./16-classes-advanced/index.js";
import { errorHandling } from "./17-error-handling/index.js";
import { regex } from "./18-regex/index.js";
import { asyncTopic } from "./19-async/index.js";

const MDN_BASE = "https://developer.mozilla.org/ja/docs/Web/JavaScript";

export const topics: Topic[] = [
  {
    id: "first-function",
    order: 0,
    label: "00. はじめての関数",
    mdnUrl: `${MDN_BASE}/Guide/Functions`,
    description:
      "関数の宣言・return・引数・基本式。すべての章の前提となる最小の操作",
  },
  {
    id: "variables-and-types",
    order: 1,
    label: "01. 変数と型",
    mdnUrl: `${MDN_BASE}/Guide/Grammar_and_types`,
    description:
      "let / const と typeof、 プリミティブ型、 数値・テンプレート・エスケープのリテラル",
  },
  {
    id: "operators",
    order: 2,
    label: "02. 演算子と比較",
    mdnUrl: `${MDN_BASE}/Guide/Expressions_and_operators`,
    description: "算術・比較・論理・短絡評価・null合体・optional chaining",
  },
  {
    id: "control-flow",
    order: 3,
    label: "03. 条件分岐",
    mdnUrl: `${MDN_BASE}/Guide/Control_flow_and_error_handling`,
    description: "if / else / 三項 / switch / 早期 return / truthy・falsy",
  },
  {
    id: "loops",
    order: 4,
    label: "04. 繰り返し",
    mdnUrl: `${MDN_BASE}/Guide/Loops_and_iteration`,
    description: "for / while / for...of / break・continue",
  },
  {
    id: "arrays-basics",
    order: 5,
    label: "05. 配列の基礎",
    mdnUrl: `${MDN_BASE}/Guide/Indexed_collections`,
    description:
      "配列リテラル・添字アクセス・push / pop / slice・不変更新の入り口",
  },
  {
    id: "strings",
    order: 6,
    label: "06. 文字列操作",
    mdnUrl: `${MDN_BASE}/Guide/Text_formatting`,
    description: "String メソッド・テンプレートリテラル応用",
  },
  {
    id: "functions-basics",
    order: 7,
    label: "07. 関数の基礎",
    mdnUrl: `${MDN_BASE}/Guide/Functions`,
    description: "関数式・デフォルト引数・残余引数・純粋関数",
  },
  {
    id: "functions-arrow-this",
    order: 8,
    label: "08. アロー関数と this",
    mdnUrl: `${MDN_BASE}/Reference/Functions/Arrow_functions`,
    description: "アロー関数・this・コールバック・高階関数の入り口",
  },
  {
    id: "scope-closure",
    order: 9,
    label: "09. スコープとクロージャ",
    mdnUrl: `${MDN_BASE}/Closures`,
    description: "レキシカルスコープ・クロージャ・関数ファクトリ",
  },
  {
    id: "arrays-iteration",
    order: 10,
    label: "10. 配列のイテレーション",
    mdnUrl: `${MDN_BASE}/Reference/Global_Objects/Array`,
    description: "map / filter / reduce / find / some / every / sort",
  },
  {
    id: "numbers-math-date",
    order: 11,
    label: "11. 数値・Math・Date",
    mdnUrl: `${MDN_BASE}/Guide/Numbers_and_dates`,
    description: "Number / Math / Date の基本操作",
  },
  {
    id: "objects-basics",
    order: 12,
    label: "12. オブジェクトの基礎",
    mdnUrl: `${MDN_BASE}/Guide/Working_with_objects`,
    description:
      "shorthand / computed key / Object.entries / 不変更新",
  },
  {
    id: "destructuring-spread",
    order: 13,
    label: "13. 分割代入とスプレッド",
    mdnUrl: `${MDN_BASE}/Reference/Operators/Destructuring`,
    description: "分割代入・スプレッド・残余引数・デフォルト値",
  },
  {
    id: "collections",
    order: 14,
    label: "14. Map / Set",
    mdnUrl: `${MDN_BASE}/Guide/Keyed_collections`,
    description: "Set で重複除去・Map で集計",
  },
  {
    id: "classes-basics",
    order: 15,
    label: "15. クラスの基礎",
    mdnUrl: `${MDN_BASE}/Guide/Using_classes`,
    description: "class 構文 / constructor / メソッド",
  },
  {
    id: "classes-advanced",
    order: 16,
    label: "16. クラスの応用",
    mdnUrl: `${MDN_BASE}/Reference/Classes`,
    description: "継承 / static / #private / getter・setter",
  },
  {
    id: "error-handling",
    order: 17,
    label: "17. エラー処理",
    mdnUrl: `${MDN_BASE}/Guide/Control_flow_and_error_handling#exception_handling_statements`,
    description: "try / catch / throw / Error 派生",
  },
  {
    id: "regex",
    order: 18,
    label: "18. 正規表現",
    mdnUrl: `${MDN_BASE}/Guide/Regular_expressions`,
    description: "RegExp リテラル / match / replace / キャプチャグループ",
  },
  {
    id: "async",
    order: 19,
    label: "19. 非同期処理",
    mdnUrl: `${MDN_BASE}/Guide/Using_promises`,
    description: "Promise / async-await / Promise.allSettled",
  },
];

export const assignments: Assignment[] = [
  ...firstFunction,
  ...variablesAndTypes,
  ...operators,
  ...controlFlow,
  ...loops,
  ...arraysBasics,
  ...strings,
  ...functionsBasics,
  ...functionsArrowThis,
  ...scopeClosure,
  ...arraysIteration,
  ...numbersMathDate,
  ...objectsBasics,
  ...destructuringSpread,
  ...collections,
  ...classesBasics,
  ...classesAdvanced,
  ...errorHandling,
  ...regex,
  ...asyncTopic,
];

// 重複ID検出は CI の `check-integrity` スクリプトと `problems.spec.ts` で一括検証する。
// (以前はここで import 時 throw していたが、整合性スクリプトが全違反を集約するために
//  load-time エラーを出さない方針に変更。)

export function findAssignment(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id);
}

export function findTopic(id: TopicId): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function assignmentsByTopic(topicId: TopicId): Assignment[] {
  return assignments.filter((a) => a.topicId === topicId);
}
