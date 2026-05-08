/**
 * 全トピックを集約して `assignments` / `topics` を公開する。
 *
 * - 各トピックは `NN-topic-id.ts` で定義され、`Assignment[]` を default 名で export する
 * - 並び順は MDN の章順（変数 → 演算子 → 制御 → ループ → 関数 → スコープ → エラー →
 *   文字列 → 数値 → 配列 → 分割代入 → オブジェクト → コレクション → クラス）
 */

import type { Assignment, Topic, TopicId } from "../types.js";

import { variablesAndTypes } from "./01-variables-and-types.js";
import { operators } from "./02-operators.js";
import { controlFlow } from "./03-control-flow.js";
import { loops } from "./04-loops.js";
import { functionsBasics } from "./05-functions-basics.js";
import { functionsArrowThis } from "./06-functions-arrow-this.js";
import { scopeClosure } from "./07-scope-closure.js";
import { errorHandling } from "./08-error-handling.js";
import { strings } from "./09-strings.js";
import { numbersMathDate } from "./10-numbers-math-date.js";
import { arraysBasics } from "./11-arrays-basics.js";
import { arraysIteration } from "./12-arrays-iteration.js";
import { destructuringSpread } from "./13-destructuring-spread.js";
import { objectsBasics } from "./14-objects-basics.js";
import { collections } from "./15-collections.js";
import { classesBasics } from "./16-classes-basics.js";
import { classesAdvanced } from "./17-classes-advanced.js";
import { regex } from "./18-regex.js";

const MDN_BASE = "https://developer.mozilla.org/ja/docs/Web/JavaScript";

export const topics: Topic[] = [
  {
    id: "variables-and-types",
    order: 1,
    label: "01. 変数と型",
    mdnUrl: `${MDN_BASE}/Guide/Grammar_and_types`,
    description: "let / const / var、プリミティブ型、typeof、型変換",
  },
  {
    id: "operators",
    order: 2,
    label: "02. 演算子",
    mdnUrl: `${MDN_BASE}/Guide/Expressions_and_operators`,
    description: "三項・論理・短絡評価・null合体・optional chaining",
  },
  {
    id: "control-flow",
    order: 3,
    label: "03. 制御構文",
    mdnUrl: `${MDN_BASE}/Guide/Control_flow_and_error_handling`,
    description: "if / switch / 早期return / truthy・falsy",
  },
  {
    id: "loops",
    order: 4,
    label: "04. 繰り返し",
    mdnUrl: `${MDN_BASE}/Guide/Loops_and_iteration`,
    description: "for / while / for...of / break・continue",
  },
  {
    id: "functions-basics",
    order: 5,
    label: "05. 関数の基礎",
    mdnUrl: `${MDN_BASE}/Guide/Functions`,
    description: "宣言・式・デフォルト引数・残余引数・純粋関数",
  },
  {
    id: "functions-arrow-this",
    order: 6,
    label: "06. アロー関数と this",
    mdnUrl: `${MDN_BASE}/Reference/Functions/Arrow_functions`,
    description: "アロー関数・this・コールバック・高階関数",
  },
  {
    id: "scope-closure",
    order: 7,
    label: "07. スコープとクロージャ",
    mdnUrl: `${MDN_BASE}/Closures`,
    description: "レキシカルスコープ・クロージャ・ファクトリ",
  },
  {
    id: "error-handling",
    order: 8,
    label: "08. エラー処理",
    mdnUrl: `${MDN_BASE}/Guide/Control_flow_and_error_handling#exception_handling_statements`,
    description: "try / catch / throw / Error 派生",
  },
  {
    id: "strings",
    order: 9,
    label: "09. 文字列",
    mdnUrl: `${MDN_BASE}/Guide/Text_formatting`,
    description: "String メソッド・テンプレートリテラル",
  },
  {
    id: "numbers-math-date",
    order: 10,
    label: "10. 数値・Math・Date",
    mdnUrl: `${MDN_BASE}/Guide/Numbers_and_dates`,
    description: "Number / Math / Date の基本操作",
  },
  {
    id: "arrays-basics",
    order: 11,
    label: "11. 配列の基礎",
    mdnUrl: `${MDN_BASE}/Guide/Indexed_collections`,
    description: "アクセス・push/pop・slice・concat・不変更新",
  },
  {
    id: "arrays-iteration",
    order: 12,
    label: "12. 配列の反復",
    mdnUrl: `${MDN_BASE}/Reference/Global_Objects/Array`,
    description: "map / filter / reduce / find / some / every / sort",
  },
  {
    id: "destructuring-spread",
    order: 13,
    label: "13. 分割代入とスプレッド",
    mdnUrl: `${MDN_BASE}/Reference/Operators/Destructuring`,
    description: "分割代入・スプレッド・残余引数・デフォルト値",
  },
  {
    id: "objects-basics",
    order: 14,
    label: "14. オブジェクトの基礎",
    mdnUrl: `${MDN_BASE}/Guide/Working_with_objects`,
    description: "shorthand / computed key / Object.entries / 不変更新",
  },
  {
    id: "collections",
    order: 15,
    label: "15. Map / Set",
    mdnUrl: `${MDN_BASE}/Guide/Keyed_collections`,
    description: "Set で重複除去・Map で集計",
  },
  {
    id: "classes-basics",
    order: 16,
    label: "16. クラスの基礎",
    mdnUrl: `${MDN_BASE}/Guide/Using_classes`,
    description: "class 構文 / constructor / メソッド",
  },
  {
    id: "classes-advanced",
    order: 17,
    label: "17. クラスの応用",
    mdnUrl: `${MDN_BASE}/Reference/Classes`,
    description: "継承 / static / #private / getter・setter",
  },
  {
    id: "regex",
    order: 18,
    label: "18. 正規表現",
    mdnUrl: `${MDN_BASE}/Guide/Regular_expressions`,
    description: "RegExp リテラル / match / replace / キャプチャグループ",
  },
];

export const assignments: Assignment[] = [
  ...variablesAndTypes,
  ...operators,
  ...controlFlow,
  ...loops,
  ...functionsBasics,
  ...functionsArrowThis,
  ...scopeClosure,
  ...errorHandling,
  ...strings,
  ...numbersMathDate,
  ...arraysBasics,
  ...arraysIteration,
  ...destructuringSpread,
  ...objectsBasics,
  ...collections,
  ...classesBasics,
  ...classesAdvanced,
  ...regex,
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
