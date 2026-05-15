/**
 * Vitest 教材の課題集約 (#100 / #110)。
 *
 * 言語別ディレクトリ `_lang/vitest/` 配下にまとめる (#100 ロードマップの配置方針、 SQL / Python と同じ)。
 * 課題は JS と同じ `Assignment` 型で記述し、 `language: "vitest"` + `testKind: "mutation"` で識別される。
 * `chapterId` は Vitest 課題でも既存の `Ch00`〜`Ch16` を使う (curriculum/chapters.ts の章定義を共有)。
 *
 * 採点は `packages/client/src/lib/runners/vitest-runner.ts` が `mutation` 設定 (referenceImpl + mutants)
 * を読み、 QuickJS Worker で reference + 各 mutant を順に実行 → 学習者の `describe`/`it` 結果を
 * シム経由で集約する。
 */

import type { Assignment } from "../../../types.js";

import { s0VitestCh00Sum } from "./Ch00/s0/01-sum.js";
import { s0VitestCh00FizzBuzz } from "./Ch00/s0/02-fizzbuzz.js";
import { s0VitestCh00ParseDate } from "./Ch00/s0/03-parse-date.js";

export const langVitestAssignments: Assignment[] = [
  s0VitestCh00Sum,
  s0VitestCh00FizzBuzz,
  s0VitestCh00ParseDate,
];
