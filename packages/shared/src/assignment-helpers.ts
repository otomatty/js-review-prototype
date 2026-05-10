import type {
  Assignment,
  ASTRequirement,
  ESLintRuleConfig,
  ScaffoldLevel,
} from "./types.js";

export const DEFAULT_SCAFFOLD_LEVEL: ScaffoldLevel = "L2";

export interface StaticAnalysisSettings {
  eslintRules: Record<string, ESLintRuleConfig>;
  ast: ASTRequirement;
  ignoredUnusedNames: string[];
}

export function getScaffoldCode(
  assignment: Assignment,
  level: ScaffoldLevel = DEFAULT_SCAFFOLD_LEVEL,
): string {
  return (
    assignment.scaffolds[level] ??
    assignment.scaffolds.L1 ??
    assignment.scaffolds.L0
  );
}

export function getStaticAnalysisSettings(
  assignment: Assignment,
): StaticAnalysisSettings {
  return {
    eslintRules: assignment.staticAnalysis?.eslint?.rules ?? {},
    ast: assignment.staticAnalysis?.ast ?? {},
    ignoredUnusedNames: assignment.entryPoints ?? [],
  };
}
