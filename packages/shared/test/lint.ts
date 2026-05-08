/**
 * 採点回帰テスト用の Lint runner。
 *
 * 本番 (クライアント) は `packages/client/src/lib/eslint-runner.ts` で
 * `eslint-linter-browserify` の `Linter` を呼んで lintViolations を計算するが、
 * このファイルは CI 側で同等の処理を再現する。両者ともライブラリは共通なので
 * 結果はほぼ一致する (globals だけは独自に最低限のものを定義)。
 */

import { Linter } from "eslint-linter-browserify";

import type { ESLintRuleConfig, LintViolation } from "../src/types.js";

interface RawMessage {
  ruleId: string | null;
  severity: 1 | 2;
  message: string;
  line: number;
  column: number;
}

const linter = new Linter();

// 課題コードが利用しがちなグローバル一式 (no-undef を有効化したくても落ちないように)。
// 本番側 (client/src/lib/eslint-runner.ts) と意図的にスーパーセットにしてある。
const GLOBALS: Record<string, "readonly"> = {
  Math: "readonly",
  JSON: "readonly",
  console: "readonly",
  Object: "readonly",
  Array: "readonly",
  Number: "readonly",
  String: "readonly",
  Boolean: "readonly",
  Map: "readonly",
  Set: "readonly",
  WeakMap: "readonly",
  WeakSet: "readonly",
  Date: "readonly",
  RegExp: "readonly",
  Error: "readonly",
  Symbol: "readonly",
  Promise: "readonly",
  Infinity: "readonly",
  NaN: "readonly",
  undefined: "readonly",
};

export interface LintCodeOptions {
  /**
   * これらの名前はトップレベル宣言として現れても `no-unused-vars` の対象外にする。
   * 通常は Assignment.entryPoints を渡す (採点用に評価コードから参照される関数群)。
   * クライアント側の eslint-runner.ts と挙動を揃えてある。
   */
  ignoredUnusedNames?: string[];
}

export function lintCode(
  code: string,
  rules: Record<string, ESLintRuleConfig>,
  options: LintCodeOptions = {},
): LintViolation[] {
  const ignored = new Set(options.ignoredUnusedNames ?? []);
  const configuredRules = withUnusedVarsOptions(rules, ignored);

  let messages: RawMessage[];
  try {
    messages = linter.verify(code, {
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
        globals: GLOBALS,
      },
      rules: configuredRules,
    }) as RawMessage[];
  } catch {
    return [];
  }

  return messages
    .filter((m) => {
      if (m.ruleId !== "no-unused-vars") return true;
      const unusedName = m.message.match(/'([^']+)'/)?.[1];
      return !unusedName || !ignored.has(unusedName);
    })
    .map((m) => ({
      ruleId: m.ruleId,
      severity: m.severity,
      message: m.message,
      rawMessage: m.message,
      line: m.line,
      column: m.column,
    }));
}

function withUnusedVarsOptions(
  rules: Record<string, ESLintRuleConfig>,
  ignoredNames: Set<string>,
): Record<string, unknown> {
  const configured: Record<string, unknown> = { ...rules };
  const noUnusedVars = rules["no-unused-vars"];
  if (
    noUnusedVars === undefined ||
    noUnusedVars === "off" ||
    noUnusedVars === 0
  ) {
    return configured;
  }

  const severity = Array.isArray(noUnusedVars) ? noUnusedVars[0] : noUnusedVars;
  const existing =
    Array.isArray(noUnusedVars) && isRecord(noUnusedVars[1])
      ? noUnusedVars[1]
      : {};
  const rest =
    Array.isArray(noUnusedVars) && isRecord(noUnusedVars[1])
      ? noUnusedVars.slice(2)
      : [];
  const pattern =
    ignoredNames.size > 0
      ? `^(?:${[...ignoredNames].map(escapeRegExp).join("|")})$`
      : undefined;

  configured["no-unused-vars"] = [
    severity,
    {
      ...existing,
      args: "none",
      ...(pattern ? { varsIgnorePattern: pattern } : {}),
    },
    ...rest,
  ];

  return configured;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
