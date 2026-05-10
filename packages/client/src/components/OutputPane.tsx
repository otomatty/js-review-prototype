import { cn } from "@/lib/utils";

interface Props {
  /** 直近の自由実行で得られた stdout。未実行時は undefined。 */
  stdout?: string;
  /** ランタイムエラー / TIMEOUT / COMPILE_ERROR。 */
  error?: string;
  /** 実行リクエスト中。 */
  running: boolean;
  /** 実行履歴をクリア (未実行状態に戻す)。 */
  onClear: () => void;
}

/**
 * 「実行」ボタンで起動した自由実行の出力を表示するペイン。
 *
 * 採点 (RunResultDialog) とは独立で、エディタ下に常駐する。
 * 1 度も実行していない / クリア済みのときは折りたたんだ案内のみ表示。
 */
export function OutputPane({ stdout, error, running, onClear }: Props) {
  const hasResult = stdout !== undefined || error !== undefined;

  return (
    <div className="border-t border-border bg-card">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            出力 (stdout)
          </span>
          {running ? (
            <span className="font-sans text-[11px] text-muted-foreground">
              実行中...
            </span>
          ) : null}
          {!running && error ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-[2px] font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-destructive">
              ERROR
            </span>
          ) : null}
        </div>
        {hasResult && !running ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md border border-border bg-background px-2 py-[2px] font-sans text-[11px] text-muted-foreground transition-colors hover:border-ink-300 hover:text-foreground dark:hover:border-ink-600"
          >
            クリア
          </button>
        ) : null}
      </div>
      <div
        className={cn(
          "max-h-[28vh] overflow-auto border-t border-border bg-background px-6 py-2.5 font-mono text-[12.5px] leading-[1.55]",
          error ? "text-destructive" : "text-foreground",
        )}
      >
        {!hasResult && !running ? (
          <p className="font-sans text-[12px] text-muted-foreground">
            「実行」ボタンを押すとコードの出力がここに表示されます。
          </p>
        ) : null}
        {running && !hasResult ? (
          <p className="font-sans text-[12px] text-muted-foreground">
            isolated-vm でコードを実行しています...
          </p>
        ) : null}
        {error ? (
          <pre className="m-0 whitespace-pre-wrap break-words">{error}</pre>
        ) : null}
        {!error && stdout !== undefined ? (
          stdout.length === 0 ? (
            <p className="font-sans text-[12px] text-muted-foreground">
              (出力はありません)
            </p>
          ) : (
            <pre className="m-0 whitespace-pre-wrap break-words">{stdout}</pre>
          )
        ) : null}
      </div>
    </div>
  );
}
