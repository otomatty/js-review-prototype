/**
 * 全章の Assignment を集約するルートエントリ。
 *
 * Phase 2 では新カリキュラム (Ch00 + Ch01-Ch16) の 17 章フォルダ骨格を import するだけで、
 * 中身の Assignment 配列はすべて空。 各章ファイルは `_index.ts` で命名されており、
 * 問題ファイル本体は Phase 3 以降で `s{N}/` サブフォルダ配下に追加される。
 *
 * `assignmentsByStage` / `assignmentsByChapter` の helper は問題が空の今でも動作し、
 * 各 phase で問題が増えていくにつれて UI 側の章×ステージ matrix で利用される。
 */

import type { Assignment, Chapter, ChapterId, Stage } from "../types.js";
import { chapters } from "../curriculum/chapters.js";

import { ch00Setup } from "./00-setup/_index.js";
import { ch01Variables } from "./01-variables/_index.js";
import { ch02Numbers } from "./02-numbers/_index.js";
import { ch03Strings } from "./03-strings/_index.js";
import { ch04Arrays } from "./04-arrays/_index.js";
import { ch05Conditionals } from "./05-conditionals/_index.js";
import { ch06Loops } from "./06-loops/_index.js";
import { ch07Functions } from "./07-functions/_index.js";
import { ch08Objects } from "./08-objects/_index.js";
import { ch09HigherOrder } from "./09-higher-order/_index.js";
import { ch10DataStructures } from "./10-data-structures/_index.js";
import { ch11Algorithms } from "./11-algorithms/_index.js";
import { ch12Debug } from "./12-debug/_index.js";
import { ch13ErrorHandling } from "./13-error-handling/_index.js";
import { ch14Regex } from "./14-regex/_index.js";
import { ch15Class } from "./15-class/_index.js";
import { ch16Async } from "./16-async/_index.js";
import { langSqlAssignments } from "./_lang/sql/_index.js";
import { langPythonAssignments } from "./_lang/python/_index.js";
import { langPhpAssignments } from "./_lang/php/_index.js";
import { langVitestAssignments } from "./_lang/vitest/_index.js";
import { langEslintAssignments } from "./_lang/eslint/_index.js";

export { chapters };

export const assignments: Assignment[] = [
  ...ch00Setup,
  ...ch01Variables,
  ...ch02Numbers,
  ...ch03Strings,
  ...ch04Arrays,
  ...ch05Conditionals,
  ...ch06Loops,
  ...ch07Functions,
  ...ch08Objects,
  ...ch09HigherOrder,
  ...ch10DataStructures,
  ...ch11Algorithms,
  ...ch12Debug,
  ...ch13ErrorHandling,
  ...ch14Regex,
  ...ch15Class,
  ...ch16Async,
  // 多言語化 roadmap (#100): 言語別課題は `_lang/{lang}/` 配下にまとめて末尾に連結する。
  ...langSqlAssignments,
  ...langPythonAssignments,
  ...langPhpAssignments,
  ...langVitestAssignments,
  ...langEslintAssignments,
];

export function findAssignment(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id);
}

export function findChapter(id: ChapterId): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function assignmentsByChapter(chapterId: ChapterId): Assignment[] {
  return assignments.filter((a) => a.chapterId === chapterId);
}

export function assignmentsByStage(stage: Stage): Assignment[] {
  return assignments.filter((a) => a.stage === stage);
}
