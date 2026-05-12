/**
 * AI チャットのメッセージ一覧。
 *
 * - user メッセージは右寄せのバブル、 assistant メッセージは全幅 Markdown。
 * - ストリーミング中の `draftAssistant` は最後尾に「点滅カーソル」付きで仮表示。
 * - 末尾追加時に自動スクロール。ユーザが手動で上スクロールした場合は追従しない。
 */

import { useEffect, useRef } from "react";

import javascript from "highlight.js/lib/languages/javascript";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { Options as RehypeHighlightOptions } from "rehype-highlight";
import remarkGfm from "remark-gfm";

import type { ChatMessage } from "@jsreview/shared/ai/types";

import { cn } from "@/lib/utils";

interface Props {
  messages: ChatMessage[];
  /** ストリーミング中の確定前 assistant 応答。空文字なら描画しない。 */
  draftAssistant: string;
  streaming: boolean;
}

const rehypeHighlightOptions = {
  aliases: { javascript: ["js", "jsx", "mjs", "cjs"] },
  languages: { javascript },
} satisfies RehypeHighlightOptions;

const MARKDOWN_CLASSES = cn(
  "font-jp text-[14px] leading-[1.7] text-ink-800 dark:text-ink-100",
  "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-jp [&_h2]:text-[18px] [&_h2]:font-bold",
  "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-jp [&_h3]:text-[15px] [&_h3]:font-bold",
  "[&_p]:my-2",
  "[&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-[1px] [&_code]:font-mono [&_code]:text-[12.5px]",
  "[&_pre]:my-2 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-ink-900 [&_pre]:p-3 [&_pre]:text-[12.5px] [&_pre]:text-ink-100",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-ink-100",
);

export function ChatMessageList({ messages, draftAssistant, streaming }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  // ユーザがスクロールアップしたら自動追従を止める
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {return;}
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickToBottomRef.current = distance < 80;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // メッセージ更新時に末尾までスクロール (追従中のときだけ)。
  // streaming だけが切り替わるケース (「考え中…」表示開始時) でも追従させる。
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !stickToBottomRef.current) {return;}
    el.scrollTop = el.scrollHeight;
  }, [messages, draftAssistant, streaming]);

  const hasDraft = streaming && draftAssistant.length > 0;
  const isEmpty = messages.length === 0 && !hasDraft;

  return (
    <div
      ref={scrollerRef}
      className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        <ul className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((m, idx) => (
            <li key={idx} className={m.role === "user" ? "self-end" : "self-stretch"}>
              {m.role === "user" ? (
                <UserBubble content={m.content} />
              ) : (
                <AssistantBlock content={m.content} />
              )}
            </li>
          ))}
          {hasDraft ? (
            <li className="self-stretch">
              <AssistantBlock content={draftAssistant} streaming />
            </li>
          ) : null}
          {streaming && !hasDraft ? (
            <li className="self-stretch text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-muted-foreground" />
                考え中…
              </span>
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md text-center text-sm text-muted-foreground">
      まだメッセージはありません。下のフォームから AI に質問してみましょう。
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="max-w-[min(46rem,80vw)] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm border border-border bg-card px-4 py-2.5 font-jp text-[14px] leading-[1.7] text-foreground">
      {content}
    </div>
  );
}

function AssistantBlock({
  content,
  streaming = false,
}: {
  content: string;
  streaming?: boolean;
}) {
  return (
    <div className={MARKDOWN_CLASSES}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, rehypeHighlightOptions]]}
      >
        {content}
      </ReactMarkdown>
      {streaming ? (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-ink-400 align-text-bottom"
        />
      ) : null}
    </div>
  );
}
