/**
 * 下部パネル「採点結果」タブ (Phase 3 placeholder)。
 *
 * Phase 4 (#107) で `RunResultDialog` から抽出する `RunResultBody` をマウントする予定。
 * 現状は採点モーダル (RunResultDialog) を引き続き使うため、 placeholder のままで OK。
 */

export function ResultsTab() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-card/60 px-6 py-1.5">
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          採点結果
        </span>
      </div>
      <div className="bg-background px-6 py-3 font-sans text-[12px] text-muted-foreground">
        採点を実行するとここに結果が表示されます。
      </div>
    </div>
  );
}
