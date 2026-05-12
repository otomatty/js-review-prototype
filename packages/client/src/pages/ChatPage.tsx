/**
 * AI 質問チャット画面 (`/problems/:assignmentId/chat`)。
 *
 * `PracticePage` の「AIに質問する」ボタンから遷移し、 navigation state で
 * `{ userCode, gradingSummary }` を受け取る。履歴が空ならコンテキスト付きの
 * 初回 user メッセージを自動投稿し、 AI 解説の生成を開始する。
 *
 * ルーティングのガードは `PracticePage` のパターンを踏襲。
 */

import { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { findAssignment } from "@jsreview/shared/assignments";
import type { GradingSummary } from "@jsreview/shared/ai/types";
import { buildContextUserMessage } from "@jsreview/shared/ai/prompt";

import { AppHeader } from "../components/AppHeader.js";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { Button } from "../components/ui/button.js";
import { ChatInput } from "../components/chat/ChatInput.js";
import { ChatMessageList } from "../components/chat/ChatMessageList.js";
import { useAiChat } from "../hooks/useAiChat.js";
import { clearHistory } from "../lib/chat-store.js";
import { useStageUnlocks } from "../hooks/useStageUnlocks.js";

interface BootstrapState {
  userCode?: string;
  gradingSummary?: GradingSummary;
}

export function ChatPage() {
  const { assignmentId = "" } = useParams<{ assignmentId: string }>();
  const assignment = findAssignment(assignmentId);
  const unlockedStages = useStageUnlocks();
  const location = useLocation();

  if (!assignment) {
    return <Navigate to="/" replace />;
  }
  if (!unlockedStages.includes(assignment.stage)) {
    return <Navigate to={`/stages/${assignment.stage}`} replace />;
  }

  const state = (location.state ?? null) as BootstrapState | null;

  return (
    <ChatPageInner
      assignmentId={assignment.id}
      assignmentTitle={assignment.title}
      bootstrapState={state}
      assignment={assignment}
    />
  );
}

interface InnerProps {
  assignmentId: string;
  assignmentTitle: string;
  bootstrapState: BootstrapState | null;
  assignment: ReturnType<typeof findAssignment>;
}

function ChatPageInner({
  assignmentId,
  assignmentTitle,
  bootstrapState,
  assignment,
}: InnerProps) {
  const { messages, draftAssistant, streaming, error, send, bootstrapIfEmpty } =
    useAiChat({ assignmentId });

  // navigation state があれば 1 度だけ初回投稿を実行
  useEffect(() => {
    if (!bootstrapState || !assignment) {return;}
    const { userCode, gradingSummary } = bootstrapState;
    if (typeof userCode !== "string" || !gradingSummary) {return;}
    const initial = buildContextUserMessage(assignment, userCode, gradingSummary);
    bootstrapIfEmpty(initial);
  }, [bootstrapState, assignment, bootstrapIfEmpty]);

  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "この問題の AI チャット履歴を削除しますか?\n\n[OK] 削除\n[キャンセル] そのまま",
    );
    if (!confirmed) {return;}
    clearHistory(assignmentId);
    // 表示を即座に空にするため再読み込み (シンプル実装)
    window.location.reload();
  };

  return (
    <div className="grid h-screen grid-rows-[auto_auto_1fr_auto] bg-background">
      <AppHeader
        backLink={{
          to: `/problems/${assignmentId}`,
          label: "← 問題に戻る",
          ariaLabel: "問題画面に戻る",
        }}
        right={
          <>
            {messages.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="gap-1.5"
                title="この問題のチャット履歴を削除"
              >
                <Trash2 className="size-3.5" />
                履歴を削除
              </Button>
            ) : null}
            <ThemeToggle />
          </>
        }
      />

      <div className="border-b border-border bg-card px-6 py-3">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            AI に質問
          </p>
          <h2 className="m-0 font-jp text-[18px] font-bold leading-tight tracking-[-0.01em] text-foreground">
            {assignmentTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            問題情報と提出コードを AI が参照しています。Markdown で回答します。
          </p>
        </div>
      </div>

      <ChatMessageList
        messages={messages}
        draftAssistant={draftAssistant}
        streaming={streaming}
      />

      {error ? (
        <div className="border-t border-destructive/30 bg-destructive/5 px-6 py-3">
          <div className="mx-auto max-w-3xl text-sm text-destructive">
            <strong className="mr-2">エラー:</strong>
            {error}
            {!bootstrapState ? (
              <span className="ml-2">
                <Link
                  to={`/problems/${assignmentId}`}
                  className="underline hover:no-underline"
                >
                  問題画面に戻る
                </Link>
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <ChatInput
        onSubmit={send}
        disabled={streaming}
        placeholder={
          messages.length === 0
            ? "AI への最初の質問を入力… (Enter で送信)"
            : undefined
        }
      />
    </div>
  );
}
