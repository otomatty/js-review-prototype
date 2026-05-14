/**
 * 下部パネル「ターミナル」タブ (Phase 3 placeholder)。
 *
 * Phase 5 (#109) で SQL 課題向けに xterm.js + sql.js による REPL を実装する。
 * それまでは「現状利用不可」 のヒントだけ表示し、 タブも `BottomPanel` 側で
 * `disabled` になっていれば click できないが、 ここはフォールバック表示用。
 */

interface Props {
  enabled: boolean;
}

export function TerminalTab({ enabled }: Props) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-card/60 px-6 py-1.5">
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          ターミナル
        </span>
      </div>
      <div className="bg-background px-6 py-3 font-sans text-[12px] text-muted-foreground">
        {enabled
          ? "ターミナルはまだ実装されていません (#109 で対応)。"
          : "この課題ではターミナルは利用できません。 SQL 課題で有効になります (#109)。"}
      </div>
    </div>
  );
}
