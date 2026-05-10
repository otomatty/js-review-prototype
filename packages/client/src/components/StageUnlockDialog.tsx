/**
 * 卒業課題クリアによってステージが解禁された瞬間に表示する dialog。
 *
 * `useStageUnlocks` の更新を購読し、 直近で解禁されたステージが queue に積まれて
 * いれば 1 件取り出して表示する。 ユーザが閉じると次の queue を取り出す。
 *
 * App ルート直下に 1 つだけ置く想定。
 */

import { useEffect, useState } from "react";
import { stages } from "@jsreview/shared/curriculum/stages";
import type { Stage, StageInfo } from "@jsreview/shared/types";

import {
  consumeRecentUnlock,
  subscribeStageUnlocks,
} from "../lib/stage-unlock-store.js";
import { Button } from "./ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.js";

const stageInfo: ReadonlyMap<Stage, StageInfo> = new Map(
  stages.map((s) => [s.id, s] as const),
);

export function StageUnlockDialog() {
  const [unlocked, setUnlocked] = useState<Stage | null>(null);

  useEffect(() => {
    const tryConsume = () => {
      // 既に表示中なら何もしない (queue は閉じた後で再消化)
      setUnlocked((current) => current ?? consumeRecentUnlock() ?? null);
    };
    // 初期マウント直後にも 1 件 (アプリ起動中の他タブからの解禁等)
    tryConsume();
    const unsub = subscribeStageUnlocks(tryConsume);
    return unsub;
  }, []);

  function handleOpenChange(open: boolean) {
    if (open) {return;}
    // 閉じるタイミングで次の queue を覗く
    setUnlocked(consumeRecentUnlock() ?? null);
  }

  const open = unlocked !== null;
  const info = unlocked ? stageInfo.get(unlocked) : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-jp">
            🎉 {unlocked} が解禁されました
          </DialogTitle>
          <DialogDescription>
            卒業課題を全てクリアし、 次のステージに進めるようになりました。
          </DialogDescription>
        </DialogHeader>
        {info && (
          <div className="px-6 py-4">
            <div className="mb-2 font-jp text-[15px] font-semibold text-foreground">
              {info.label}
            </div>
            <p className="m-0 text-[13px] leading-[1.7] text-muted-foreground">
              {info.description}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)}>続ける</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
