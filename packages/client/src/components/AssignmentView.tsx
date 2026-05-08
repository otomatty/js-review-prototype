import type { Assignment } from "@jsreview/shared/types";
import { findTopic } from "@jsreview/shared/assignments";
import { renderMarkdown } from "../lib/markdown.js";

interface Props {
  assignment: Assignment;
}

/**
 * 課題説明を表示するペイン。
 * Markdown を簡易的にHTMLにレンダリングしている (外部依存を避けるため自前)。
 */
export function AssignmentView({ assignment }: Props) {
  const topic = findTopic(assignment.topicId);
  const html = renderMarkdown(assignment.description);
  return (
    <div className="assignment-description">
      {topic && (
        <div className="assignment-topic-tag">
          <a href={topic.mdnUrl} target="_blank" rel="noreferrer">
            {topic.label}
          </a>
          {topic.description ? ` — ${topic.description}` : null}
        </div>
      )}
      <div
        // 入力は packages/shared/src/problems/ のハードコードのみ。XSSリスクなし。
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
