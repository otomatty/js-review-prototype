import { useMemo, useState } from "react";
import { assignments } from "@jsreview/shared/assignments";
import type { Assignment } from "@jsreview/shared/types";

import { Editor } from "./components/Editor.js";
import { StaticAnalysisPane } from "./components/StaticAnalysisPane.js";
import { ExecutionResultPane } from "./components/ExecutionResultPane.js";
import { AssignmentView } from "./components/AssignmentView.js";

import { useStaticAnalysis } from "./hooks/useStaticAnalysis.js";
import { useGradeRunner } from "./hooks/useGradeRunner.js";

export function App() {
  const [assignmentId, setAssignmentId] = useState<string>(assignments[0].id);
  const assignment: Assignment = useMemo(
    () => assignments.find((a) => a.id === assignmentId) ?? assignments[0],
    [assignmentId],
  );

  // 課題が変わったら starter code に戻す
  const [code, setCode] = useState<string>(assignment.starterCode);

  // ─── 静的解析 (常時、debounce 500ms) ──────────────────
  const { lint, ast } = useStaticAnalysis(code, assignment);

  // ─── テスト実行 (実行ボタン押下時) ──────────────────
  const { running, result, run, reset } = useGradeRunner();

  // 課題切替時のリセット
  const handleSelectAssignment = (id: string) => {
    setAssignmentId(id);
    const next = assignments.find((a) => a.id === id);
    if (next) setCode(next.starterCode);
    reset();
  };

  const handleReset = () => {
    setCode(assignment.starterCode);
    reset();
  };

  const handleRun = () => {
    void run({ code, assignment, lint, ast });
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>
            JS自動コードレビュー <span className="header-tag">プロトタイプ</span>
          </h1>
        </div>
        <div className="header-controls">
          <select
            value={assignmentId}
            onChange={(e) => handleSelectAssignment(e.target.value)}
            aria-label="課題を選択"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {`課題${assignments.indexOf(a) + 1}: ${a.title}`}
                {` (★${a.difficulty})`}
              </option>
            ))}
          </select>
          <button className="btn" onClick={handleReset}>
            リセット
          </button>
        </div>
      </header>

      <div className="body">
        <aside className="left-pane">
          <AssignmentView assignment={assignment} />
          <StaticAnalysisPane lint={lint} ast={ast} assignment={assignment} />
        </aside>

        <section className="right-pane">
          <div className="editor-wrap">
            <Editor
              code={code}
              onChange={setCode}
              eslintRules={assignment.eslint.rules}
              entryPoints={assignment.entryPoints}
            />
          </div>

          <div className="run-bar">
            <span className="hint">
              静的解析は編集中に常時実行。「実行」でサーバ側テストを起動。
            </span>
            <button
              className="btn-primary"
              onClick={handleRun}
              disabled={running}
            >
              {running ? "実行中..." : "▶ 実行"}
            </button>
          </div>

          <ExecutionResultPane
            result={result}
            running={running}
            assignment={assignment}
            lint={lint}
            ast={ast}
          />
        </section>
      </div>
    </div>
  );
}
