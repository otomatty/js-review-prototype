/**
 * PHP 教材の課題集約 (#100 / #112)。
 *
 * 言語別ディレクトリ `_lang/php/` 配下にまとめる (#100 ロードマップの配置方針、 SQL / Python と同じ)。
 * 課題は JS と同じ `Assignment` 型で記述し、 `language: "php"` で識別される。
 * `chapterId` は PHP 課題でも既存の `Ch00`〜`Ch16` を使う (curriculum/chapters.ts の章定義を共有)。
 *
 * 現時点では Roadmap (#100) 合意により Composer 等を必要としない単純課題のみ。
 * 採点ランナ (`packages/client/src/lib/runners/php-runner.ts`) は php-wasm (CLI モード) を
 * dynamic import で遅延ロードする。
 */

import type { Assignment } from "../../../types.js";

import { s0PhpCh00Hello } from "./Ch00/s0/01-hello.js";
import { s0PhpCh00FizzBuzz } from "./Ch00/s0/02-fizzbuzz.js";
import { s0PhpCh00ArraySum } from "./Ch00/s0/03-array-sum.js";

export const langPhpAssignments: Assignment[] = [
  s0PhpCh00Hello,
  s0PhpCh00FizzBuzz,
  s0PhpCh00ArraySum,
];
