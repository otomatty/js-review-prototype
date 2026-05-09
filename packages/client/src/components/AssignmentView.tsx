import type { Assignment } from "@jsreview/shared/types";
import { findTopic } from "@jsreview/shared/assignments";
import javascript from "highlight.js/lib/languages/javascript";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { Options as RehypeHighlightOptions } from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

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

const MARKDOWN_BODY = cn(
  "min-h-0 flex-1 overflow-y-auto px-5 py-4 text-[13.5px] leading-[1.65]",
  "[&_h2]:mb-2 [&_h2]:text-[17px] [&_h2]:font-semibold",
  "[&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-muted-foreground",
  "[&_p]:my-2",
  "[&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_pre]:my-1.5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:px-3 [&_pre]:py-2.5 [&_pre]:text-[12.5px]",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono",
  "[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.92em]",
  "[&_table]:my-2 [&_table]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[12.5px]",
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:align-top [&_th]:font-semibold [&_th]:text-muted-foreground",
  "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-left [&_td]:align-top",
);

/**
 * 課題説明を表示するペイン。
 * GFM テーブルとコードブロックのシンタックスハイライトに対応する。
 */
export function AssignmentView({ assignment }: Props) {
  const topic = findTopic(assignment.topicId);
  return (
    <div className={MARKDOWN_BODY}>
      {topic && (
        <div className="mb-3 text-xs text-muted-foreground">
          <a
            href={topic.mdnUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary hover:underline"
          >
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
