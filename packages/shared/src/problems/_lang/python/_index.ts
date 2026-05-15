/**
 * Python 教材の課題集約 (#100 / #108)。
 *
 * 言語別ディレクトリ `_lang/python/` 配下にまとめる (#100 ロードマップの配置方針、 SQL と同じ)。
 * 課題は JS と同じ `Assignment` 型で記述し、 `language: "python"` で識別される。
 * `chapterId` は Python 課題でも既存の `Ch00`〜`Ch16` を使う (curriculum/chapters.ts の章定義を共有)。
 */

import type { Assignment } from "../../../types.js";

import { s0PyCh00Hello } from "./Ch00/s0/01-hello.js";
import { s0PyCh00FizzBuzz } from "./Ch00/s0/02-fizzbuzz.js";
import { s0PyCh00ListOps } from "./Ch00/s0/03-list-ops.js";

export const langPythonAssignments: Assignment[] = [
  s0PyCh00Hello,
  s0PyCh00FizzBuzz,
  s0PyCh00ListOps,
];
