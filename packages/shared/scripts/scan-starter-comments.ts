/**
 * starter のコメント規約違反を検出する一時スクリプト。
 *
 * `packages/shared/src/problems/README.md` の「スターターのコメント規約」
 * に照らし、 コメント行に JavaScript のリテラル断片が混入している課題を
 * 列挙する。
 *
 * ヒューリスティックなので false positive はあり得る。 検出後は人間が
 * 一件ずつ判断して修正する用途。
 *
 * Usage:
 *   bun run scripts/scan-starter-comments.ts            # 詳細出力
 *   bun run scripts/scan-starter-comments.ts --summary  # 章別件数のみ
 */

import {
  getEntryFile,
  getLanguage,
  getStarterFiles,
} from "../src/assignment-helpers.js";
import type { Assignment } from "../src/types.js";

const JS_KEYWORD_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  {
    pattern: /^\s*\/\/.*\b(const|let|var)\s+[A-Za-z_$][\w$]*\s*=/,
    label: "const/let/var 宣言の見本",
  },
  {
    pattern: /^\s*\/\/.*\bfunction\s+[A-Za-z_$][\w$]*\s*\(/,
    label: "function 宣言の見本",
  },
  {
    pattern: /^\s*\/\/.*=>\s*\{/,
    label: "アロー関数の見本",
  },
  {
    pattern: /^\s*\/\/.*\bconsole\.log\s*\([^)]*[\w"'`]/,
    label: "具体値入りの console.log 見本",
  },
  {
    pattern: /^\s*\/\/.*\bif\s*\(.+\)\s*\{/,
    label: "if 文ブロックの見本",
  },
  {
    pattern: /^\s*\/\/.*\bfor\s*\(.+;.+;.+\)/,
    label: "for 文の見本",
  },
  {
    pattern: /^\s*\/\/.*\bwhile\s*\(.+\)\s*\{/,
    label: "while 文の見本",
  },
  {
    pattern: /^\s*\/\/.*\breturn\s+[\w"'`]/,
    label: "return 文の見本",
  },
  {
    pattern: /^\s*\/\/.*\bclass\s+[A-Za-z_$][\w$]*/,
    label: "class 宣言の見本",
  },
  {
    pattern: /^\s*\/\/.*\b[A-Za-z_$][\w$]*\s*=\s*[{[]/,
    label: "代入リテラルの見本 (foo = {} / foo = [])",
  },
  {
    pattern:
      /^\s*\/\/.*\{\s*[A-Za-z_$][\w$]*\s*(?::|,\s*[A-Za-z_$][\w$]*\s*[,}])/,
    label: "単一行オブジェクトリテラル / プロパティショートハンドの見本",
  },
  {
    pattern: /^\s*\/\/.*\.[A-Za-z_$][\w$]*\s*\(\s*[\w"'`]/,
    label: "引数付きメソッドコールの見本",
  },
];

interface Violation {
  assignmentId: string;
  chapterId: string;
  line: number;
  text: string;
  reasons: string[];
}

async function main(): Promise<void> {
  const summaryOnly = process.argv.includes("--summary");
  const mod = await import("../src/problems/index.js");
  const assignments: Assignment[] = mod.assignments;

  const violations: Violation[] = [];

  for (const a of assignments) {
    // JS 課題のみ走査 (コメント規約は JS スタイル前提)
    if (getLanguage(a) !== "javascript") {
      continue;
    }
    const entryPath = getEntryFile(a);
    const entry =
      getStarterFiles(a).find((f) => f.path === entryPath) ??
      getStarterFiles(a)[0];
    if (!entry) {
      continue;
    }
    const lines = entry.content.split("\n");
    lines.forEach((rawLine, idx) => {
      const reasons: string[] = [];
      for (const { pattern, label } of JS_KEYWORD_PATTERNS) {
        if (pattern.test(rawLine)) {
          reasons.push(label);
        }
      }
      if (reasons.length > 0) {
        violations.push({
          assignmentId: a.id,
          chapterId: a.chapterId,
          line: idx + 1,
          text: rawLine,
          reasons,
        });
      }
    });
  }

  if (violations.length === 0) {
    console.log("[scan-starter-comments] no violations detected");
    return;
  }

  const fileSet = new Set(violations.map((v) => v.assignmentId));
  console.log(
    `[scan-starter-comments] ${violations.length} candidate line(s) across ${fileSet.size} file(s)`,
  );

  const byChapter = new Map<string, { lines: number; files: Set<string> }>();
  for (const v of violations) {
    const entry = byChapter.get(v.chapterId);
    if (entry) {
      entry.lines += 1;
      entry.files.add(v.assignmentId);
    } else {
      byChapter.set(v.chapterId, {
        lines: 1,
        files: new Set([v.assignmentId]),
      });
    }
  }
  console.log("\n## 章別件数");
  const sortedChapters = [...byChapter.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  for (const [ch, { lines, files }] of sortedChapters) {
    console.log(`  ${ch}: ${files.size} file(s), ${lines} line(s)`);
  }

  if (summaryOnly) {
    return;
  }

  console.log("\n## 詳細");
  const grouped = new Map<string, Violation[]>();
  for (const v of violations) {
    const list = grouped.get(v.assignmentId);
    if (list) {
      list.push(v);
    } else {
      grouped.set(v.assignmentId, [v]);
    }
  }
  for (const [id, list] of grouped) {
    console.log(`\n# ${id}`);
    for (const v of list) {
      console.log(`  L${v.line} [${v.reasons.join(", ")}]: ${v.text}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
