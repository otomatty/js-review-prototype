/**
 * CodeMirror 6 + ESLint プラグイン。
 * 編集中、ESLint の違反箇所が赤線/黄線でリアルタイム表示される。
 */

import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";
import type { Extension } from "@codemirror/state";

import type { ESLintRuleConfig, Language } from "@jsreview/shared/types";
import { useTheme } from "../hooks/useTheme.js";
import { getLinter } from "../lib/linters/index.js";

interface Props {
  code: string;
  onChange: (code: string) => void;
  eslintRules: Record<string, ESLintRuleConfig>;
  entryPoints: string[];
  /**
   * 現在表示中のファイルの言語。 省略時は "javascript" 扱い。
   * 非 JS (sql / python / php / ...) のときは ESLint linter を無効化する。
   * SQL / Python / PHP の言語拡張 (`@codemirror/lang-sql` / `@codemirror/lang-python` /
   * `@codemirror/lang-php`) は動的 import で取得し、 該当言語の課題を開いた瞬間にだけ
   * ロードする (#109 / #108 / #112)。
   */
  language?: Language;
  /** 編集を禁止する (readonly ファイル表示用)。 */
  readOnly?: boolean;
}

export function Editor({
  code,
  onChange,
  eslintRules,
  entryPoints,
  language = "javascript",
  readOnly = false,
}: Props) {
  const { theme } = useTheme();
  const eslintExtension = useMemo<Extension | null>(
    () => {
      // 非 JS では CodeMirror の linter 拡張自体を載せない (no-op を毎回回すより軽い)。
      if (language !== "javascript") {return null;}
      const runLint = getLinter(language);
      return linter((view) => {
        const text = view.state.doc.toString();
        const violations = runLint(text, eslintRules, {
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
      });
    },
    [entryPoints, eslintRules, language],
  );

  // SQL の場合は `@codemirror/lang-sql` を動的 import で取得して extension を差し替える (#109)。
  // 初回ロード前は extension なし (plain text 相当) で描画し、 取得後に再 render する。
  const [sqlExtension, setSqlExtension] = useState<Extension | null>(null);
  useEffect(() => {
    if (language !== "sql") {
      setSqlExtension(null);
      return;
    }
    let cancelled = false;
    void import("@codemirror/lang-sql").then((mod) => {
      if (!cancelled) {setSqlExtension(mod.sql());}
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  // Python の場合は `@codemirror/lang-python` を動的 import (vendor-pyodide chunk に同梱、 #108)。
  // ランナー (Pyodide) と同じく Python 課題を開いた瞬間にしか fetch されない。
  const [pythonExtension, setPythonExtension] = useState<Extension | null>(null);
  useEffect(() => {
    if (language !== "python") {
      setPythonExtension(null);
      return;
    }
    let cancelled = false;
    void import("@codemirror/lang-python").then((mod) => {
      if (!cancelled) {setPythonExtension(mod.python());}
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  // PHP の場合は `@codemirror/lang-php` を動的 import (vendor-php chunk に同梱、 #112)。
  // ランナー (php-wasm) と同じく PHP 課題を開いた瞬間にしか fetch されない。
  const [phpExtension, setPhpExtension] = useState<Extension | null>(null);
  useEffect(() => {
    if (language !== "php") {
      setPhpExtension(null);
      return;
    }
    let cancelled = false;
    void import("@codemirror/lang-php").then((mod) => {
      if (!cancelled) {setPhpExtension(mod.php());}
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const extensions = useMemo<Extension[]>(() => {
    const exts: Extension[] = [];
    if (language === "javascript") {
      exts.push(javascript());
    } else if (language === "sql" && sqlExtension) {
      exts.push(sqlExtension);
    } else if (language === "python" && pythonExtension) {
      exts.push(pythonExtension);
    } else if (language === "php" && phpExtension) {
      exts.push(phpExtension);
    }
    if (eslintExtension) {
      exts.push(eslintExtension, lintGutter());
    }
    return exts;
  }, [language, eslintExtension, sqlExtension, pythonExtension, phpExtension]);

  return (
    <CodeMirror
      value={code}
      onChange={onChange}
      height="100%"
      readOnly={readOnly}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        bracketMatching: true,
        autocompletion: true,
      }}
      extensions={extensions}
      theme={theme}
    />
  );
}
