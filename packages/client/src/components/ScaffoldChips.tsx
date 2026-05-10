import type { Assignment, ScaffoldLevel } from "@jsreview/shared/types";
import { getScaffoldCode } from "@jsreview/shared/assignment-helpers";

import { cn } from "@/lib/utils";

interface Props {
  assignment: Assignment;
  /** 現在エディタに表示しているコード (編集状態の検知に使う)。 */
  currentCode: string;
  /** 現在アクティブなスカフォールドレベル (UI ハイライト用)。 */
  activeLevel: ScaffoldLevel;
  /** ユーザがレベルを切替えるとコールされる。エディタの差し替えと state 更新は親が行う。 */
  onSelect: (level: ScaffoldLevel) => void;
}

const LEVELS: ReadonlyArray<{
  id: ScaffoldLevel;
  label: string;
  hint: string;
}> = [
  { id: "L0", label: "L0", hint: "L0: 何もないところから書く" },
  { id: "L1", label: "L1", hint: "L1: コメントだけのヒント" },
  { id: "L2", label: "L2", hint: "L2: 詳細なコメント (既定)" },
  { id: "L3", label: "L3", hint: "L3: 穴埋め型" },
];

/**
 * スカフォールド (L0-L3) を切り替える chip 群。
 *
 * 切替時、現在のコードがアクティブレベルの初期コードと異なる (= ユーザが編集している) 場合は
 * 確認ダイアログを挟む。確認後にエディタ内容が当該レベルの scaffold に置換される。
 */
export function ScaffoldChips({
  assignment,
  currentCode,
  activeLevel,
  onSelect,
}: Props) {
  function handleClick(level: ScaffoldLevel) {
    if (level === activeLevel) {return;}
    const baseline = getScaffoldCode(assignment, activeLevel);
    if (currentCode !== baseline) {
      const ok = window.confirm(
        `スカフォールドを ${level} に切替えると、現在の編集内容は失われます。続行しますか?`,
      );
      if (!ok) {return;}
    }
    onSelect(level);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-6 py-2">
      <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        スカフォールド
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {LEVELS.map(({ id, label, hint }) => {
          const active = id === activeLevel;
          return (
            <button
              key={id}
              type="button"
              title={hint}
              aria-pressed={active}
              onClick={() => handleClick(id)}
              className={cn(
                "rounded-full border px-3 py-[3px] font-sans text-[12px] font-semibold transition-colors",
                active
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                  : "border-border bg-background text-muted-foreground hover:border-ink-300 hover:text-foreground dark:hover:border-ink-600",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
