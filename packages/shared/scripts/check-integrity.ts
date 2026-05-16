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
    // 言語 / testKind の整合性検査と mutation 設定検査は、 言語に依らず必ず実行する。
    // (`language: "javascript", testKind: "mutation"` のような不正組み合わせを
    //  非 JS 分岐の中に閉じ込めていると取りこぼすため、 ここで全課題に対して評価する)
    const language = getLanguage(a);
    const isVitestMutation = a.testKind === "mutation";
    const isEslintConfig = a.testKind === "eslint-config";
    // mutation / eslint-config はどちらも `mutation` 設定 (referenceImpl + mutants) を使う共通枠組み。
    const usesMutationConfig = isVitestMutation || isEslintConfig;
    if (language === "vitest" && !isVitestMutation) {
      issues.push({
        assignmentId: a.id,
        message: `vitest assignment must use testKind: "mutation" (got ${a.testKind})`,
      });
    }
    if (isVitestMutation && language !== "vitest") {
      issues.push({
        assignmentId: a.id,
        message: `testKind "mutation" is only supported for language "vitest" (got ${language})`,
      });
    }
    if (language === "eslint" && !isEslintConfig) {
      issues.push({
        assignmentId: a.id,
        message: `eslint assignment must use testKind: "eslint-config" (got ${a.testKind})`,
      });
    }
    if (isEslintConfig && language !== "eslint") {
      issues.push({
        assignmentId: a.id,
        message: `testKind "eslint-config" is only supported for language "eslint" (got ${language})`,
      });
    }
    if (usesMutationConfig) {
      if (!a.mutation) {
        issues.push({
          assignmentId: a.id,
          message: "mutation assignment requires `mutation` config",
        });
      } else {
        if (a.mutation.referenceImpl.trim().length === 0) {
          issues.push({
            assignmentId: a.id,
            message: "mutation.referenceImpl must not be empty",
          });
        }
        if (a.mutation.mutants.length === 0) {
          issues.push({
            assignmentId: a.id,
            message: "mutation.mutants must contain at least one mutant",
          });
        }
        const seenMutantIds = new Set<string>();
        for (const m of a.mutation.mutants) {
          if (m.id.trim().length === 0) {
            issues.push({
              assignmentId: a.id,
              message: "mutant id must not be empty",
            });
          }
          if (seenMutantIds.has(m.id)) {
            issues.push({
              assignmentId: a.id,
              message: `duplicate mutant id "${m.id}"`,
            });
          }
          seenMutantIds.add(m.id);
          if (m.code.trim().length === 0) {
            issues.push({
              assignmentId: a.id,
              message: `mutant "${m.id}" code must not be empty`,
            });
          }
          if (m.description.trim().length === 0) {
            // description は UI で「mutant {id} を撃破: {description}」 として表示される
            // ため、 空のままだと学習者にどんな mutant か伝わらない。
            issues.push({
              assignmentId: a.id,
              message: `mutant "${m.id}" description must not be empty`,
            });
          }
        }
      }
    }

    if (language !== "javascript") {
      // 非 JS 言語のみに適用される最低限チェック (AST 検証は別途下で JS のみに行う)。
      // mutation / eslint-config 課題 (#110 / #111): `tests` は採点側で合成するため空でも良い。
      if (!usesMutationConfig && a.tests.length === 0) {
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
