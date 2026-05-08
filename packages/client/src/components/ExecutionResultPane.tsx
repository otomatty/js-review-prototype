/**
 * 実行結果ペイン (画面下部)。
 *
 * 「実行」ボタン押下後にのみ表示される。
 * テスト結果 (サーバから返却) と スコア集計 (クライアント計算) を並べる。
 */

import type {
  ASTResult,
  Assignment,
  LintViolation,
} from "@jsreview/shared/types";
import type { ExecutionResult } from "../hooks/useGradeRunner.js";
import { SolutionAccordion } from "./SolutionAccordion.js";

interface Props {
  result: ExecutionResult | null;
  running: boolean;
  assignment: Assignment;
  lint: LintViolation[];
  ast: ASTResult;
  bestScore: number | null;
}

export function ExecutionResultPane({
  result,
  running,
  assignment,
  bestScore,
}: Props) {
  if (running && !result) {
    return (
      <div className="result-pane">
        <div className="empty-state">
          サーバ (isolated-vm) にてテスト実行中...
        </div>
      </div>
    );
  }
  if (!result) {
    return (
      <div className="result-pane">
        <div className="empty-state">
          ▶ 実行ボタンでテストを実行するとここに結果が表示されます。
        </div>
        <SolutionAccordion
          solution={assignment.solution}
          bestScore={bestScore}
        />
      </div>
    );
  }

  const { testResults, serverDurationMs, score, errorMessage } = result;
  const passedCount = testResults.filter((t) => t.passed).length;

  return (
    <div className="result-pane">
      {/* ─── テスト結果 ──────────────────────────────────────── */}
      <div className="result-section">
        <div className="result-header">
          <span>
            テスト結果{" "}
            <span className="architecture-tag server">
              サーバ isolated-vm
            </span>
          </span>
          <span>
            {passedCount}/{testResults.length} PASS · {serverDurationMs}ms
          </span>
        </div>

        {errorMessage && (
          <p className="empty-state" style={{ color: "var(--err)" }}>
            {errorMessage}
          </p>
        )}

        <ul className="test-list">
          {testResults.map((t, i) => (
            <li key={i}>
              <span className={t.passed ? "icon-ok" : "icon-err"}>
                {t.passed ? "✓" : "✗"}
              </span>
              <span>{t.name}</span>
              <span className="weight">重み {t.weight}</span>
              {t.error && (
                <span className="err-detail">{t.error}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ─── スコア集計 ─────────────────────────────────────── */}
      <div className="result-section">
        <div className="result-header">
          <span>スコア集計 (クライアント計算)</span>
          <span>合計100点満点</span>
        </div>
        <div className="score-grid">
          <span className="label">Test</span>
          <div className="score-bar">
            <div
              style={{
                width: `${pct(score.breakdown.test, assignment.weights.test)}%`,
              }}
            />
          </div>
          <span>
            {score.breakdown.test} / {assignment.weights.test}
          </span>

          <span className="label">Lint</span>
          <div className="score-bar">
            <div
              style={{
                width: `${pct(score.breakdown.lint, assignment.weights.lint)}%`,
              }}
            />
          </div>
          <span>
            {score.breakdown.lint} / {assignment.weights.lint}
          </span>

          <span className="label">AST</span>
          <div className="score-bar">
            <div
              style={{
                width: `${pct(score.breakdown.ast, assignment.weights.ast)}%`,
              }}
            />
          </div>
          <span>
            {score.breakdown.ast} / {assignment.weights.ast}
          </span>
        </div>

        <div className="score-total">
          <span className="label">Total</span>
          <span className="value">{score.total} / 100</span>
        </div>
      </div>

      <SolutionAccordion
        solution={assignment.solution}
        bestScore={Math.max(bestScore ?? 0, score.total)}
      />
    </div>
  );
}

function pct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, (value / max) * 100);
}
