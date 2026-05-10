import type {
  Assignment,
  ASTRequirement,
  ESLintRuleConfig,
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
