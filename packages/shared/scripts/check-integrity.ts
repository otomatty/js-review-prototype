/**
 * 課題データの整合性チェックスクリプト。
 *
 * CI と手元の両方から `bun run check-integrity` で実行できる。
 * 検査項目:
 *
 *  1. 重複した Assignment ID が存在しないこと
 *  2. 各 Assignment の `starterFiles` のエントリファイル (`entryFile` or 最初のファイル) が
 *     `staticAnalysis.ast.forbidden` を踏んでいないこと (パースエラーにならないことも含む)
 *  3. 全 Assignment の `chapterId` が `chapters` に存在すること
 *
 * 違反は最後にまとめて出力し、ひとつでもあれば exit code 1 で終了する。
 *
 * NOTE: `src/problems/index.ts` は import 時に重複IDで throw するため、
 * 1 については先回りで例外として観測されることがある。本スクリプトでは
 * 失敗箇所を列挙したいので、import を try/catch して個別に集計し直す。
 */

import { analyzeAst } from "../src/grading/index.js";
import {
  getEntryFile,
  getLanguage,
  getStaticAnalysisSettings,
} from "../src/assignment-helpers.js";
import type { Assignment, Chapter } from "../src/types.js";

interface IntegrityIssue {
  assignmentId?: string;
  message: string;
}

async function main(): Promise<void> {
  const issues: IntegrityIssue[] = [];

  let assignments: Assignment[];
  let chapters: Chapter[];
  try {
    const mod = await import("../src/problems/index.js");
    assignments = mod.assignments;
    chapters = mod.chapters;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[check-integrity] failed to load problems module: ${msg}`);
    process.exit(1);
  }

  // 1. 重複IDチェック
  const idCount = new Map<string, number>();
  for (const a of assignments) {
    idCount.set(a.id, (idCount.get(a.id) ?? 0) + 1);
  }
  for (const [id, count] of idCount) {
    if (count > 1) {
      issues.push({
        assignmentId: id,
        message: `duplicate assignment id (appears ${count} times)`,
      });
    }
  }

  // 2. 課題定義の整合性検査。
  //    - JS 課題: starterFiles のエントリを Babel パースして ast.forbidden に違反していないか
  //    - 非 JS 課題 (SQL 等): AST 検証は不可だが、 entryFile と tests の最低限の整合性は
  //      ここで CI に通す (coderabbit 対応)
  for (const a of assignments) {
    if (a.starterFiles.length === 0) {
      issues.push({
        assignmentId: a.id,
        message: "starterFiles must contain at least one file",
      });
      continue;
    }
    // 言語に依らず、 明示の entryFile は starterFiles に存在しなければならない。
    // (ここで弾かないと、 タイポした entryFile が CI を素通りして実行時に runGrading で落ちる)
    if (a.entryFile && !a.starterFiles.some((f) => f.path === a.entryFile)) {
      issues.push({
        assignmentId: a.id,
        message: `entryFile "${a.entryFile}" is not found in starterFiles`,
      });
      continue;
    }
    if (getLanguage(a) !== "javascript") {
      // 言語非依存の最低限チェック
      if (a.tests.length === 0) {
        issues.push({
          assignmentId: a.id,
          message: "non-javascript assignment must define at least one test",
        });
      }
      if (!a.entryFile) {
        issues.push({
          assignmentId: a.id,
          message: "non-javascript assignment requires entryFile",
        });
      }
      continue;
    }
    const entryPath = getEntryFile(a);
    const entry = a.starterFiles.find((f) => f.path === entryPath);
    if (!entry) {
      // ここに到達するのは a.starterFiles.length > 0 かつ entryFile 検証も通った後なので想定外。
      // 防御的に整合性違反として明示する。
      issues.push({
        assignmentId: a.id,
        message: `entry file "${entryPath}" is not found in starterFiles`,
      });
      continue;
    }
    const result = analyzeAst(getLanguage(a), entry.content, getStaticAnalysisSettings(a).ast);
    if (result.parseError) {
      issues.push({
        assignmentId: a.id,
        message: `starter (${entry.path}) parse error: ${result.parseError}`,
      });
      continue;
    }
    if (result.forbidden.length > 0) {
      const labels = result.forbidden.map((v) => v.label).join(", ");
      issues.push({
        assignmentId: a.id,
        message: `starter (${entry.path}) violates forbidden patterns: ${labels}`,
      });
    }
  }

  // 3. chapterId が chapters に存在
  const knownChapters = new Set(chapters.map((chapter) => chapter.id));
  for (const a of assignments) {
    if (!knownChapters.has(a.chapterId)) {
      issues.push({
        assignmentId: a.id,
        message: `unknown chapterId: ${a.chapterId}`,
      });
    }
  }

  if (issues.length === 0) {
    console.log(
      `[check-integrity] OK: ${assignments.length} assignments across ${chapters.length} chapters`,
    );
    return;
  }

  console.error(`[check-integrity] FAILED: ${issues.length} issue(s)`);
  for (const issue of issues) {
    const prefix = issue.assignmentId ? `  - ${issue.assignmentId}: ` : "  - ";
    console.error(`${prefix}${issue.message}`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
