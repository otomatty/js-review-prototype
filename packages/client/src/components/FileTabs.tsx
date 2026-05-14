/**
 * エディタ上部の VSCode 風ファイルタブ。
 *
 * - `files` の `path` 一覧をタブとして表示
 * - クリックで `activeFile` を切り替える
 * - `readonly` ファイルには小さなバッジを出す (例: `utils.js` (読取専用))
 * - 単一ファイルでも 1 タブだけ表示 (UI 回帰なし)
 *
 * `[` / `]` キーで前後の課題に飛ぶ既存ナビと衝突しないよう、 ルート要素には
 * `data-bottom-panel` … ではなく VSCode 風のタブを示す `data-file-tabs` を付与。
 * `PracticePage` の除外セレクタで参照する。
 */

import { cn } from "@/lib/utils";
import type { AssignmentFile } from "@jsreview/shared/types";

interface Props {
  files: AssignmentFile[];
  activeFile: string;
  onSelect: (path: string) => void;
}

export function FileTabs({ files, activeFile, onSelect }: Props) {
  return (
    <div
      data-file-tabs
      role="tablist"
      aria-label="エディタファイルタブ"
      className="flex items-stretch gap-px overflow-x-auto border-b border-border bg-muted/30 px-2 pt-1.5 text-[12px] font-sans"
    >
      {files.map((file) => {
        const isActive = file.path === activeFile;
        return (
          <button
            key={file.path}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(file.path)}
            className={cn(
              "group relative inline-flex items-center gap-1.5 rounded-t-md border border-b-0 border-transparent px-3 py-1.5 transition-colors",
              "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "border-border bg-background text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <span className="font-mono">{file.path}</span>
            {file.readonly ? (
              <span
                className="inline-flex items-center rounded-sm bg-muted px-1 py-[1px] text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
                title="読み取り専用 (採点対象外)"
              >
                ro
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
