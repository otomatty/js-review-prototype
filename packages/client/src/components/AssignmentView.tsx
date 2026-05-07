import type { Assignment } from "@jsreview/shared/types";
import { renderMarkdown } from "../lib/markdown.js";

interface Props {
  assignment: Assignment;
}

/**
 * 課題説明を表示するペイン。
 * Markdown を簡易的にHTMLにレンダリングしている (外部依存を避けるため自前)。
 */
export function AssignmentView({ assignment }: Props) {
  const html = renderMarkdown(assignment.description);
  return (
    <div
      className="assignment-description"
      // 入力は packages/shared/src/assignments.ts のハードコードのみ。XSSリスクなし。
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
