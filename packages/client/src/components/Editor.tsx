/**
 * CodeMirror 6 + ESLint プラグイン。
 * 編集中、ESLint の違反箇所が赤線/黄線でリアルタイム表示される。
 */

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";

import type { ESLintRuleConfig } from "@jsreview/shared/types";
import { lintCode } from "../lib/eslint-runner.js";

interface Props {
  code: string;
  onChange: (code: string) => void;
  eslintRules: Record<string, ESLintRuleConfig>;
  entryPoints: string[];
}

export function Editor({ code, onChange, eslintRules, entryPoints }: Props) {
  const eslintExtension = useMemo(
    () =>
      linter((view) => {
        const text = view.state.doc.toString();
        const violations = lintCode(text, eslintRules, {
          ignoredUnusedNames: entryPoints,
        });

        return violations
          .map((v): Diagnostic | null => {
            // 行番号は1始まり、CodeMirror は doc.line(n).from が0始まりオフセット
            const line = view.state.doc.line(
              Math.min(Math.max(v.line, 1), view.state.doc.lines),
            );
            const from = Math.min(
              line.from + Math.max(0, v.column - 1),
              line.to,
            );
            const to = Math.min(from + 1, line.to);

            return {
              from,
              to,
              severity: v.severity === 2 ? "error" : "warning",
              message: v.message,
              source: v.ruleId ?? undefined,
            };
          })
          .filter((d): d is Diagnostic => d !== null);
      }),
    [entryPoints, eslintRules],
  );

  return (
    <CodeMirror
      value={code}
      onChange={onChange}
      height="100%"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        bracketMatching: true,
        autocompletion: true,
      }}
      extensions={[javascript(), eslintExtension, lintGutter()]}
      theme="light"
    />
  );
}
