/**
 * AI チャットの入力フォーム。
 *
 * - Enter で送信 / Shift+Enter で改行。
 * - `streaming` 中は送信ボタンを無効化。
 */

import { useCallback, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSubmit, disabled, placeholder }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0 || disabled) {return;}
    onSubmit(trimmed);
    setValue("");
  }, [value, disabled, onSubmit]);

  return (
    <form
      className="flex items-end gap-2 border-t border-border bg-card px-6 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <textarea
        aria-label="AI への質問入力"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        rows={1}
        placeholder={placeholder ?? "追加で質問する… (Enter で送信 / Shift+Enter で改行)"}
        className="min-h-[40px] max-h-[160px] flex-1 resize-y rounded-md border border-border bg-background px-3 py-2 font-jp text-[14px] leading-[1.6] text-foreground outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-200 dark:focus:ring-ink-700"
      />
      <Button
        type="submit"
        size="lg"
        variant="acial"
        disabled={disabled || value.trim().length === 0}
        className="gap-1.5"
      >
        <Send className="size-4 shrink-0" />
        送信
      </Button>
    </form>
  );
}
