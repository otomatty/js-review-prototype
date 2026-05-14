import type {
  Assignment,
  AssignmentFile,
  ASTRequirement,
  ESLintRuleConfig,
  Language,
} from "./types.js";
import {
  getDefaultLintPreset,
  LINT_PRESET_RULES,
} from "./lint-presets.js";

export interface StaticAnalysisSettings {
  eslintRules: Record<string, ESLintRuleConfig>;
  ast: ASTRequirement;
  ignoredUnusedNames: string[];
}

export function getStaticAnalysisSettings(
  assignment: Assignment,
): StaticAnalysisSettings {
  const lintPreset = assignment.lintPreset ?? getDefaultLintPreset(assignment.stage);

  return {
    eslintRules: {
      ...LINT_PRESET_RULES[lintPreset],
      ...(assignment.staticAnalysis?.eslint?.rules ?? {}),
    },
    ast: assignment.staticAnalysis?.ast ?? {},
    ignoredUnusedNames: assignment.entryPoints ?? [],
  };
}

/** 言語が未指定なら "javascript" を返す。 */
export function getLanguage(assignment: Assignment): Language {
  return assignment.language ?? "javascript";
}

function defaultEntryPathFor(lang: Language): string {
  return lang === "sql" ? "query.sql" : "main.js";
}

/**
 * 多ファイル UI / 採点で使う starterFiles を取り出す。
 * `starterFiles` が定義されていなければ、 単一ファイル `starterCode` を
 * `[{ path: <entryFile or 既定>, content: starterCode }]` に詰め替えて返す。
 */
export function getStarterFiles(assignment: Assignment): AssignmentFile[] {
  if (assignment.starterFiles && assignment.starterFiles.length > 0) {
    return assignment.starterFiles;
  }
  const path = assignment.entryFile ?? defaultEntryPathFor(getLanguage(assignment));
  return [{ path, content: assignment.starterCode }];
}

/**
 * 採点・実行の入口ファイルパスを取り出す。
 * 明示の `entryFile` → `starterFiles[0].path` → 言語別既定 (`main.js` / `query.sql`) の順で解決する。
 */
export function getEntryFile(assignment: Assignment): string {
  if (assignment.entryFile) {
    return assignment.entryFile;
  }
  if (assignment.starterFiles && assignment.starterFiles.length > 0) {
    return assignment.starterFiles[0].path;
  }
  return defaultEntryPathFor(getLanguage(assignment));
}
