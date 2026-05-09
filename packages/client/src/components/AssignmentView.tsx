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
  "min-h-0 flex-1 overflow-y-auto px-7 pt-6 pb-8 font-jp text-[14px] leading-[1.7] text-ink-800 dark:text-ink-100",
  // h2: 課題タイトル
  "[&_h2]:m-0 [&_h2]:mb-3 [&_h2]:font-jp [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.015em] [&_h2]:text-foreground",
  // h3: 区切り見出し (uppercase tracked)
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-sans [&_h3]:text-[13px] [&_h3]:font-bold [&_h3]:leading-[1.4] [&_h3]:uppercase [&_h3]:tracking-[0.12em] [&_h3]:text-muted-foreground",
  "[&_p]:my-3",
  "[&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li::marker]:text-ink-400",
  "[&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5",
  // pre: ダーク背景固定 (light/dark 両方で同じ Acial dark surface)
  "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-ink-900 [&_pre]:px-4 [&_pre]:py-3.5 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_pre]:leading-[1.6] [&_pre]:text-ink-200",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
  // inline code
  "[&_code]:rounded [&_code]:bg-ink-100 [&_code]:px-[5px] [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-ink-800 dark:[&_code]:bg-ink-700 dark:[&_code]:text-ink-100",
  // table
  "[&_table]:my-2.5 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-md [&_table]:border [&_table]:border-border [&_table]:text-[12.5px]",
  "[&_th]:border-b [&_th]:border-border [&_th]:bg-ink-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:align-top [&_th]:font-sans [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em] [&_th]:text-muted-foreground dark:[&_th]:bg-ink-800",
  "[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-left [&_td]:align-top",
  "[&_tr:last-child_td]:border-b-0",
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
        <div className="mb-5 border-b border-ink-100 pb-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground dark:border-ink-700">
          <a
            href={topic.mdnUrl}
            target="_blank"
            rel="noreferrer"
            className="border-b border-ink-300 pb-px text-ink-700 no-underline hover:border-blue-500 hover:text-blue-700 dark:border-ink-600 dark:text-ink-200 dark:hover:border-blue-300 dark:hover:text-blue-300"
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
