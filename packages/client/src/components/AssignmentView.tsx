import type { Assignment } from "@jsreview/shared/types";
import { findTopic } from "@jsreview/shared/assignments";
import javascript from "highlight.js/lib/languages/javascript";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { Options as RehypeHighlightOptions } from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface Props {
  assignment: Assignment;
}

const rehypeHighlightOptions = {
  aliases: {
    javascript: ["js", "jsx", "mjs", "cjs"],
  },
  languages: {
    javascript,
  },
} satisfies RehypeHighlightOptions;

/**
 * 課題説明を表示するペイン。
 * GFM テーブルとコードブロックのシンタックスハイライトに対応する。
 */
export function AssignmentView({ assignment }: Props) {
  const topic = findTopic(assignment.topicId);
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
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, rehypeHighlightOptions]]}
      >
        {assignment.description}
      </ReactMarkdown>
    </div>
  );
}
