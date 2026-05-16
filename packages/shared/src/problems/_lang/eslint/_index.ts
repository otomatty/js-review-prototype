/**
 * ESLint 設定教材の課題集約 (#100 / #111)。
 *
 * 言語別ディレクトリ `_lang/eslint/` 配下にまとめる (#100 ロードマップの配置方針、 SQL / Python / Vitest と同じ)。
 * 課題は JS と同じ `Assignment` 型で記述し、 `language: "eslint"` + `testKind: "eslint-config"` で識別される。
 * `chapterId` は ESLint 課題でも既存の `Ch00`〜`Ch16` を使う (curriculum/chapters.ts の章定義を共有)。
 *
 * 採点は `packages/client/src/lib/runners/eslint-config-runner.ts` が `mutation` 設定 (referenceImpl + mutants)
 * を読み、 学習者の `eslint.config.js` から rules を取り出して、 reference (違反 0 件期待) と
 * 各 mutant (違反 ≥ 1 件期待) を browser ESLint Linter で検査する。
 */

import type { Assignment } from "../../../types.js";

import { s0EslintCh00NoVar } from "./Ch00/s0/01-no-var.js";
import { s0EslintCh00StrictEquality } from "./Ch00/s0/02-strict-equality.js";

export const langEslintAssignments: Assignment[] = [
  s0EslintCh00NoVar,
  s0EslintCh00StrictEquality,
];
