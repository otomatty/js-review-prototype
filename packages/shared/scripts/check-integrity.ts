/**
 * 課題データの整合性チェックスクリプト。
 *
 * CI と手元の両方から `bun run check-integrity` で実行できる。
 * 検査項目:
 *
 *  1. 重複した Assignment ID が存在しないこと
 *  2. 各 Assignment の L2 scaffold が `staticAnalysis.ast.forbidden` を踏んでいないこと
 *     (scaffold がパースエラーにならないことも含む)
 *  3. 全 Assignment の `chapterId` が `chapters` に存在すること
 *
 * 違反は最後にまとめて出力し、ひとつでもあれば exit code 1 で終了する。
 *
 * NOTE: `src/problems/index.ts` は import 時に重複IDで throw するため、
 * 1 については先回りで例外として観測されることがある。本スクリプトでは
 * 失敗箇所を列挙したいので、import を try/catch して個別に集計し直す。
 */

import { analyzeAst } from "../src/grading/ast.js";
import {
  getScaffoldCode,
  getStaticAnalysisSettings,
} from "../src/assignment-helpers.js";

interface IntegrityIssue {
  assignmentId?: string;
  message: string;
}

async function main(): Promise<void> {
  const issues: IntegrityIssue[] = [];

  let assignments: Awaited<typeof import("../src/problems/index.js")>["assignments"];
  let chapters: Awaited<typeof import("../src/problems/index.js")>["chapters"];
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

  // 2. scaffold が ast.forbidden を踏んでいない
  for (const a of assignments) {
    const result = analyzeAst(
      getScaffoldCode(a),
      getStaticAnalysisSettings(a).ast,
    );
    if (result.parseError) {
      issues.push({
        assignmentId: a.id,
        message: `scaffold parse error: ${result.parseError}`,
      });
      continue;
    }
    if (result.forbidden.length > 0) {
      const labels = result.forbidden.map((v) => v.label).join(", ");
      issues.push({
        assignmentId: a.id,
        message: `scaffold violates forbidden patterns: ${labels}`,
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
