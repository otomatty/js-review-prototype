import { useEffect, useMemo, useState } from "react";
import { assignments, topics } from "@jsreview/shared/assignments";
import type { Assignment } from "@jsreview/shared/types";

import { Editor } from "./components/Editor.js";
import { StaticAnalysisPane } from "./components/StaticAnalysisPane.js";
import { ExecutionResultPane } from "./components/ExecutionResultPane.js";
import { AssignmentView } from "./components/AssignmentView.js";

import { useStaticAnalysis } from "./hooks/useStaticAnalysis.js";
import { useGradeRunner } from "./hooks/useGradeRunner.js";
import { useProgress } from "./hooks/useProgress.js";
import { initProgressStore } from "./lib/progress-store.js";

initProgressStore();

export function App() {
  const [assignmentId, setAssignmentId] = useState<string>(assignments[0].id);
  const assignment: Assignment = useMemo(
    () => assignments.find((a) => a.id === assignmentId) ?? assignments[0],
    [assignmentId],
  );

  // localStorage と同期した編集中コード + ベストスコア
  const { code, setCode, bestScore, recordScore, clear } = useProgress({
    assignmentId,
    starterCode: assignment.starterCode,
  });

  // ─── 静的解析 (常時、debounce 500ms) ──────────────────
  const { lint, ast } = useStaticAnalysis(code, assignment);

  // ─── テスト実行 (実行ボタン押下時) ──────────────────
  const { running, result, run, reset } = useGradeRunner();

  // 課題切替時のリセット (結果ペインのみ。コードは useProgress が復元する)
  const handleSelectAssignment = (id: string) => {
    setAssignmentId(id);
    reset();
  };

  // 課題切替時、結果表示は無関係になるのでクリア
  useEffect(() => {
    reset();
  }, [assignmentId, reset]);

  const handleReset = () => {
    // 確認モーダルで「保存も消す」かを確認
    const wipeStorage = window.confirm(
      "編集中のコードと保存済みの進捗 (ベストスコア含む) を消去して、初期コードに戻しますか?\n\n" +
        "[OK] 保存も含めてリセット\n" +
        "[キャンセル] このまま編集を続ける",
    );
    if (!wipeStorage) return;
    clear();
    reset();
  };

  const handleRun = async () => {
    const res = await run({ code, assignment, lint, ast });
    recordScore(res.score.total);
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
            {topics.map((topic) => {
              const items = assignments.filter((a) => a.topicId === topic.id);
              if (items.length === 0) return null;
              return (
                <optgroup key={topic.id} label={topic.label}>
                  {items.map((a, i) => (
                    <option key={a.id} value={a.id}>
                      {`${i + 1}. ${a.title} ★${a.difficulty}`}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          <span
            className="best-score"
            title="この課題のベストスコア (localStorage に保存)"
          >
            {bestScore !== null ? `★ ${bestScore}` : "★ —"}
          </span>
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
