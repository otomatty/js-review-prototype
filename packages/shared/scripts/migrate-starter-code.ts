/**
 * 一時 codemod: `starterCode: ...` → `starterFiles: singleFile(...)` 移行スクリプト (issue #102 / ML2).
 *
 * 全 JS 問題ファイルを `@babel/parser` でパースし、 `starterCode` プロパティを
 * `starterFiles: singleFile(<expr>)` に書き換える。 既に `starterFiles` を持つ
 * 多ファイル / SQL 課題では、 legacy `starterCode` プロパティ (と直前のコメント) のみ削除する。
 *
 * Usage:
 *   bun run packages/shared/scripts/migrate-starter-code.ts
 *
 * 実行後はこのスクリプト自体を削除する (PR で commit 2 として一括投入)。
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import type {
  ImportDeclaration,
  ObjectExpression,
  ObjectProperty,
} from "@babel/types";

// `@babel/traverse` の ESM/CJS 相互運用 (grading/ast.ts と同じパターン)
const traverseModule = _traverse as typeof _traverse & {
  default?: typeof _traverse;
};
const traverse = traverseModule.default ?? _traverse;

const PROBLEMS_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "src",
  "problems",
);

interface MigrationResult {
  filePath: string;
  changed: boolean;
  reason: string;
}

function listProblemFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.startsWith("_") &&
        entry.name !== "index.ts"
      ) {
        out.push(full);
      }
    }
  };
  walk(PROBLEMS_DIR);
  return out.sort();
}

function findAssignmentObject(source: string): ObjectExpression | null {
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript"],
    ranges: true,
  });
  let found: ObjectExpression | null = null;
  traverse(ast, {
    VariableDeclarator(p) {
      if (found) return;
      const init = p.node.init;
      if (!init) return;
      // 形: const xxx: Assignment = { ... } または const xxx = { ... } satisfies Assignment
      if (init.type === "ObjectExpression") {
        found = init;
      } else if (
        init.type === "TSSatisfiesExpression" &&
        init.expression.type === "ObjectExpression"
      ) {
        found = init.expression;
      } else if (
        init.type === "TSAsExpression" &&
        init.expression.type === "ObjectExpression"
      ) {
        found = init.expression;
      }
    },
  });
  return found;
}

function findProperty(
  obj: ObjectExpression,
  name: string,
): ObjectProperty | null {
  for (const p of obj.properties) {
    if (
      p.type === "ObjectProperty" &&
      !p.computed &&
      ((p.key.type === "Identifier" && p.key.name === name) ||
        (p.key.type === "StringLiteral" && p.key.value === name))
    ) {
      return p;
    }
  }
  return null;
}

function findCommonImport(source: string): ImportDeclaration | null {
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript"],
    ranges: true,
  });
  let found: ImportDeclaration | null = null;
  traverse(ast, {
    ImportDeclaration(p) {
      if (found) return;
      const v = p.node.source.value;
      if (v.endsWith("/_common.js") || v === "../_common.js") {
        found = p.node;
      }
    },
  });
  return found;
}

function lineStart(source: string, offset: number): number {
  let i = offset;
  while (i > 0 && source[i - 1] !== "\n") i--;
  return i;
}

function lineEnd(source: string, offset: number): number {
  let i = offset;
  while (i < source.length && source[i] !== "\n") i++;
  if (i < source.length) i++;
  return i;
}

function migrateFile(filePath: string): MigrationResult {
  const original = fs.readFileSync(filePath, "utf8");

  let obj: ObjectExpression | null;
  try {
    obj = findAssignmentObject(original);
  } catch (e) {
    return {
      filePath,
      changed: false,
      reason: `parse error: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
  if (!obj) {
    return { filePath, changed: false, reason: "no Assignment object found" };
  }

  const starterCodeProp = findProperty(obj, "starterCode");
  const starterFilesProp = findProperty(obj, "starterFiles");

  if (!starterCodeProp) {
    return { filePath, changed: false, reason: "no starterCode" };
  }

  const propStart = starterCodeProp.start;
  const propEnd = starterCodeProp.end;
  if (propStart == null || propEnd == null) {
    return { filePath, changed: false, reason: "missing node ranges" };
  }

  // 行全体を削除/置換するため、 行頭〜次行頭の範囲を取得
  const removeStart = lineStart(original, propStart);
  const removeEnd = lineEnd(original, propEnd);

  // 直前のコメント行が「互換のため」 系なら一緒に削除 (multifile-demo, SQL)
  let trailingRemoveStart = removeStart;
  if (starterFilesProp) {
    // 直前の連続するコメント行を巻き戻して削除対象に
    let i = removeStart;
    while (i > 0) {
      const prevLineEnd = i - 1; // points to '\n'
      const prevLineStart = lineStart(original, prevLineEnd);
      const line = original.slice(prevLineStart, prevLineEnd);
      const trimmed = line.trim();
      // 互換コメントかどうか判定: "互換" を含む // コメント、もしくは starterFiles 言及
      if (
        trimmed.startsWith("//") &&
        (trimmed.includes("互換") ||
          trimmed.includes("starterFiles") ||
          trimmed.includes("旧 UI") ||
          trimmed.includes("旧UI"))
      ) {
        i = prevLineStart;
        continue;
      }
      break;
    }
    trailingRemoveStart = i;
  }

  let updated: string;
  if (starterFilesProp) {
    // starterFiles 既に存在: starterCode プロパティ行を削除
    updated =
      original.slice(0, trailingRemoveStart) + original.slice(removeEnd);
    return writeAndReturn(filePath, updated, original, "remove-only");
  }

  // starterFiles が無い: starterCode: <expr> を starterFiles: singleFile(<expr>) に置換
  const valueStart = starterCodeProp.value.start;
  const valueEnd = starterCodeProp.value.end;
  if (valueStart == null || valueEnd == null) {
    return { filePath, changed: false, reason: "missing value ranges" };
  }
  const valueText = original.slice(valueStart, valueEnd);

  // プロパティ全体を置換 (key:value の範囲のみ。 末尾の `,` は触らない)
  const replacement = `starterFiles: singleFile(${valueText})`;
  let next =
    original.slice(0, propStart) + replacement + original.slice(propEnd);

  // singleFile import を確保
  next = ensureSingleFileImport(next, filePath);

  return writeAndReturn(filePath, next, original, "migrate-to-singleFile");
}

function ensureSingleFileImport(source: string, filePath: string): string {
  // 既に singleFile を import 済みならスキップ
  if (/\bsingleFile\b/.test(source)) {
    // 厳密チェック: 名前空間 or import で実際に取り込まれているか
    if (/import\s*\{[^}]*\bsingleFile\b[^}]*\}\s*from/.test(source)) {
      return source;
    }
  }

  const existing = findCommonImport(source);
  if (existing) {
    // 既存の _common.js import に singleFile を追加
    if (
      existing.specifiers.some(
        (s) => s.type === "ImportSpecifier" && (s.imported.type === "Identifier" ? s.imported.name : s.imported.value) === "singleFile",
      )
    ) {
      return source;
    }
    const declStart = existing.start;
    const declEnd = existing.end;
    if (declStart == null || declEnd == null) return source;
    const declText = source.slice(declStart, declEnd);
    // `{ Foo, Bar }` の最後の identifier の直後に `, singleFile` を挿入
    const newDeclText = declText.replace(
      /\{\s*([^}]*?)\s*\}/,
      (_m, inner: string) => `{ ${inner.trim().replace(/,?\s*$/, "")}, singleFile }`,
    );
    return source.slice(0, declStart) + newDeclText + source.slice(declEnd);
  }

  // _common.js から import がなければ新規追加
  // JS 問題は packages/shared/src/problems/XX/sN/file.ts に居るので "../../_common.js" 固定
  // ただし depth を実測しておく
  const rel = path.relative(PROBLEMS_DIR, filePath);
  const depth = rel.split(path.sep).length - 1; // 例: 00-setup/s0/file.ts → depth 2
  const up = "../".repeat(depth);
  const importLine = `import { singleFile } from "${up}_common.js";\n`;

  // 既存の最後の import の直後に追加 (見当たらない場合は先頭)
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript"],
    ranges: true,
  });
  let lastImportEnd = 0;
  traverse(ast, {
    ImportDeclaration(p) {
      const e = p.node.end;
      if (e != null && e > lastImportEnd) lastImportEnd = e;
    },
  });
  if (lastImportEnd > 0) {
    // 改行の後ろに挿入
    const insertAt = lineEnd(source, lastImportEnd);
    return source.slice(0, insertAt) + importLine + source.slice(insertAt);
  }
  return importLine + source;
}

function writeAndReturn(
  filePath: string,
  next: string,
  original: string,
  reason: string,
): MigrationResult {
  if (next === original) {
    return { filePath, changed: false, reason: `${reason} (no diff)` };
  }
  fs.writeFileSync(filePath, next, "utf8");
  return { filePath, changed: true, reason };
}

function main(): void {
  const files = listProblemFiles();
  const results: MigrationResult[] = [];
  for (const f of files) {
    results.push(migrateFile(f));
  }
  const changed = results.filter((r) => r.changed);
  const skipped = results.filter((r) => !r.changed);
  console.log(`migrated: ${changed.length}`);
  console.log(`skipped : ${skipped.length}`);
  const byReason = new Map<string, number>();
  for (const r of results) {
    byReason.set(r.reason, (byReason.get(r.reason) ?? 0) + 1);
  }
  for (const [reason, count] of [...byReason.entries()].sort(
    (a, b) => b[1] - a[1],
  )) {
    console.log(`  ${reason}: ${count}`);
  }
  // 詳細出力 (no Assignment object found 等の異常)
  const anomalies = skipped.filter(
    (r) =>
      r.reason !== "no starterCode" &&
      !r.reason.includes("(no diff)") &&
      r.reason !== "remove-only",
  );
  if (anomalies.length > 0) {
    console.log("\nanomalies:");
    for (const a of anomalies) {
      console.log(`  ${a.filePath}: ${a.reason}`);
    }
  }
}

main();
