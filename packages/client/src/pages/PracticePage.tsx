/**
 * 問題演習画面。
 *
 * URL `/problems/:assignmentId` に対応し、1 課題の演習に集中するためのページ。
 * 一覧画面 (`/`) と機能を切り分けるため、サイドバー・課題セレクトは持たない。
 *
 * - URL の `assignmentId` が無効なら一覧へリダイレクト
 * - `[` / `]` で前後課題に移動 (`navigate()` で URL ごと切替)
 * - 「一覧へ戻る」ボタンで `/` へ
 */

import { useCallback, useEffect, useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { assignments, findAssignment } from "@jsreview/shared/assignments";
import type { Assignment } from "@jsreview/shared/types";

import { Editor } from "../components/Editor.js";
import { ExecutionResultPane } from "../components/ExecutionResultPane.js";
import { AssignmentView } from "../components/AssignmentView.js";

import { useStaticAnalysis } from "../hooks/useStaticAnalysis.js";
import { useGradeRunner } from "../hooks/useGradeRunner.js";
import { useProgress } from "../hooks/useProgress.js";

/**
 * URL から課題を解決し、不正な ID なら一覧へリダイレクトするガード。
 * 解決済みの課題を子コンポーネントへ渡すことで、Hooks の順序条件を
 * 「常に有効な assignment を持つ」に統一できる。
 */
export function PracticePage() {
  const { assignmentId = "" } = useParams<{ assignmentId: string }>();
  const assignment = useMemo(
    () => findAssignment(assignmentId),
    [assignmentId],
  );

  if (!assignment) {
    return <Navigate to="/" replace />;
  }
  return <PracticePageInner assignment={assignment} />;
}

interface InnerProps {
  assignment: Assignment;
}

function PracticePageInner({ assignment }: InnerProps) {
  const navigate = useNavigate();

  const { code, setCode, bestScore, recordScore, clear } = useProgress({
    assignmentId: assignment.id,
    starterCode: assignment.starterCode,
  });

  const { lint, ast } = useStaticAnalysis(code, assignment);
  const { running, result, run, reset } = useGradeRunner();

  // 課題切替時、結果表示は無関係になるのでクリア
  useEffect(() => {
    reset();
  }, [assignment.id, reset]);

  // `[` / `]` で前後の課題に移動 (両端は循環)。
  // CodeMirror など編集可能要素にフォーカス中は通常の文字入力を優先する。
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "[" && e.key !== "]") return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        t.closest(
          "input, textarea, select, [contenteditable=''], [contenteditable='true'], .cm-editor",
        )
      ) {
        return;
      }
      const idx = assignments.findIndex((a) => a.id === assignment.id);
      if (idx === -1) return;
      const len = assignments.length;
      const nextIdx =
        e.key === "[" ? (idx - 1 + len) % len : (idx + 1) % len;
      e.preventDefault();
      navigate(`/problems/${assignments[nextIdx].id}`);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [assignment.id, navigate]);

  const handleReset = useCallback(() => {
    const wipeStorage = window.confirm(
      "編集中のコードと保存済みの進捗 (ベストスコア含む) を消去して、初期コードに戻しますか?\n\n" +
        "[OK] 保存も含めてリセット\n" +
        "[キャンセル] このまま編集を続ける",
    );
    if (!wipeStorage) return;
    clear();
    reset();
  }, [clear, reset]);

  const handleRun = useCallback(async () => {
    // await 中に課題が切り替わっても元の課題に紐付ける必要があるため、
    // 採点対象のコードはローカル変数に固定しておく。
    const submittedCode = code;
    const res = await run({
      code: submittedCode,
      assignment,
      lint,
      ast,
    });
    recordScore(res.score.total, submittedCode);
  }, [code, assignment, lint, ast, run, recordScore]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <Link to="/" className="back-link" aria-label="問題一覧へ戻る">
            ← 問題一覧
          </Link>
          <h1>
            JS自動コードレビュー <span className="header-tag">プロトタイプ</span>
          </h1>
        </div>
        <div className="header-controls">
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

      <div className="body body-practice">
        <aside className="left-pane">
          <AssignmentView assignment={assignment} />
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
