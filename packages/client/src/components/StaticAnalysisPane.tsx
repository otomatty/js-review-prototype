/**
 * 静的解析ペイン (左下)。
 *
 * Lint と AST の現在の状態を **常時** 表示する。
 * 編集中に随時更新される。サーバ通信は介さない。
 */

import type {
  ASTResult,
  Assignment,
  LintViolation,
} from "@jsreview/shared/types";

interface Props {
  lint: LintViolation[];
  ast: ASTResult;
  assignment: Assignment;
}

export function StaticAnalysisPane({ lint, ast, assignment }: Props) {
  return (
    <div className="static-pane">
      <h3>
        Lint <span className="architecture-tag client">クライアント</span>
      </h3>
      {lint.length === 0 ? (
        <p className="muted">違反なし</p>
      ) : (
        <ul className="static-list">
          {lint.map((v, i) => (
            <li key={i}>
              <span
                className={
                  v.severity === 2 ? "icon-err" : "icon-warn"
                }
              >
                {v.severity === 2 ? "✗" : "⚠"}
              </span>
              <span>
                <strong>{v.ruleId ?? "lint"}</strong> (line {v.line}):{" "}
                {v.message}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3>
        AST <span className="architecture-tag client">クライアント</span>
      </h3>
      {ast.parseError ? (
        <p className="muted">パースエラー: {ast.parseError}</p>
      ) : (
        <ul className="static-list">
          {/* 必須要件 */}
          {ast.required.map((r, i) => (
            <li key={`req-${i}`}>
              <span className={r.found ? "icon-ok" : "icon-err"}>
                {r.found ? "✓" : "✗"}
              </span>
              <span>
                <strong>必須:</strong> {r.label}
              </span>
            </li>
          ))}

          {/* 禁止要件のうち違反しているものだけ表示 */}
          {ast.forbidden.length > 0 ? (
            ast.forbidden.map((v, i) => (
              <li key={`fb-${i}`}>
                <span className="icon-err">✗</span>
                <span>
                  <strong>禁止違反:</strong> {v.label} (line {v.line})
                </span>
              </li>
            ))
          ) : assignment.ast.forbidden &&
            assignment.ast.forbidden.length > 0 ? (
            <li>
              <span className="icon-ok">✓</span>
              <span>
                <strong>禁止構文:</strong> 違反なし
              </span>
            </li>
          ) : null}

          {ast.required.length === 0 &&
            (assignment.ast.forbidden?.length ?? 0) === 0 && (
              <li className="muted">この課題にAST要件はありません</li>
            )}
        </ul>
      )}
    </div>
  );
}
