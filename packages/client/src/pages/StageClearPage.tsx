/**
 * ステージクリア演出ページ。
 *
 * URL: `/stages/:stage/clear`
 *
 * - ステージ内の全問題が cleared 状態の場合のみ表示し、 そうでなければ
 *   ステージ詳細 (`/stages/:stage`) にリダイレクトする
 * - マウント時に `markClearPageShown(stage)` を呼び、 再訪問時は PracticePage
 *   からの自動遷移対象から外れる
 * - S0〜S4: 「次のステージへ進む」 ボタン
 * - S5 (最終):「全コース完了」 バナーと「ステージ一覧へ」 ボタン
 *
 * `StageUnlockDialog` との二重発火回避はダイアログ側の route 判定で行うため、
 * このページ自体は queue を触らない (StageUnlockDialog 参照)。
 */

import { useEffect, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { assignmentsByStage } from "@jsreview/shared/assignments";
import { stages as stageInfos } from "@jsreview/shared/curriculum/stages";
import type { Stage } from "@jsreview/shared/types";

import { AppHeader } from "../components/AppHeader.js";
import { Button } from "../components/ui/button.js";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { useAllClearedSet } from "../hooks/useAllClearedSet.js";
import { markClearPageShown } from "../lib/stage-clear-store.js";
import { STAGE_ORDER } from "../lib/stage-unlock-store.js";

const STAGE_SET = new Set<Stage>(STAGE_ORDER);

function isStageParam(value: string | undefined): value is Stage {
  return value !== undefined && STAGE_SET.has(value as Stage);
}

export function StageClearPage() {
  const params = useParams<{ stage: string }>();

  if (!isStageParam(params.stage)) {
    return <Navigate to="/" replace />;
  }
  return <StageClearPageContent stage={params.stage} />;
}

function StageClearPageContent({ stage }: { stage: Stage }) {
  const navigate = useNavigate();
  const clearedSet = useAllClearedSet();
  const stageInfo = stageInfos.find((s) => s.id === stage);

  const stageAssignments = useMemo(() => assignmentsByStage(stage), [stage]);

  const totalInStage = stageAssignments.length;
  const clearedInStage = useMemo(
    () =>
      stageAssignments.reduce(
        (n, a) => (clearedSet.has(a.id) ? n + 1 : n),
        0,
      ),
    [stageAssignments, clearedSet],
  );
  const capstones = useMemo(
    () => stageAssignments.filter((a) => a.isCapstone === true),
    [stageAssignments],
  );
  const chapterCount = useMemo(
    () => new Set(stageAssignments.map((a) => a.chapterId)).size,
    [stageAssignments],
  );

  const allCleared = totalInStage > 0 && clearedInStage === totalInStage;

  // 初回マウントで「表示済み」 フラグを永続化。
  // (allCleared でなくても呼んで構わないが、 直アクセスでまだ未完了の場合は
  //  下のガードで redirect されるため、 ここでは allCleared のときだけ立てる)
  useEffect(() => {
    if (allCleared) {
      markClearPageShown(stage);
    }
  }, [allCleared, stage]);

  if (totalInStage === 0 || !allCleared) {
    return <Navigate to={`/stages/${stage}`} replace />;
  }

  const stageIdx = STAGE_ORDER.indexOf(stage);
  const nextStage =
    stageIdx >= 0 && stageIdx < STAGE_ORDER.length - 1
      ? STAGE_ORDER[stageIdx + 1]
      : null;
  const isFinalStage = nextStage === null;

  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <AppHeader
        backLink={{
          to: "/",
          label: "← Stages",
          ariaLabel: "ステージ選択へ戻る",
        }}
        right={<ThemeToggle />}
      />

      <main className="hero-halo overflow-y-auto bg-background px-[clamp(24px,5vw,56px)] pt-16 pb-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div
            className="celebrate-pop mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full text-[56px] shadow-[var(--shadow-1)] gradient-bg"
            aria-hidden
          >
            <span>🏆</span>
          </div>

          <span className="mb-3 inline-flex items-center gap-2 text-overline text-muted-foreground">
            <span
              className="inline-block h-[2px] w-6 rounded gradient-bg"
              aria-hidden
            />
            {stage} · {stageInfo?.shortLabel ?? ""}
          </span>
          <h1 className="mb-3 font-jp text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground">
            {stageInfo?.label ?? stage} クリア!
          </h1>
          <p className="m-0 mb-10 max-w-[52ch] text-[14px] leading-[1.7] text-muted-foreground">
            {isFinalStage
              ? "全 6 ステージを踏破しました。 ここまで積み上げた手応えを大切に、 次は自分の作りたいものへ。"
              : `${stageInfo?.label ?? stage} の全問題をクリアしました。 引き続き次のステージで腕試しを。`}
          </p>

          <div className="relative mb-10 w-full overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-[var(--shadow-1)]">
            <div
              className="celebrate-shimmer pointer-events-none"
              aria-hidden
            />
            <dl className="grid grid-cols-3 gap-0 tabular-nums">
              <StatCell label="Cleared">
                <strong className="gradient-text font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em]">
                  {clearedInStage}
                </strong>
                <span className="font-sans text-[12.5px] text-ink-400">
                  {" "}
                  / {totalInStage}
                </span>
              </StatCell>
              <StatCell label="Capstone">
                <strong className="font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                  {capstones.length}
                </strong>
              </StatCell>
              <StatCell label="Chapters">
                <strong className="font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                  {chapterCount}
                </strong>
              </StatCell>
            </dl>
          </div>

          {isFinalStage ? (
            <div className="mb-8 w-full rounded-2xl border border-amber-300/60 bg-amber-50/80 px-6 py-5 font-jp text-[15px] font-bold text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
              🎉 全コース完了 — おめでとうございます!
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3">
            {nextStage ? (
              <Button
                variant="acial"
                size="lg"
                onClick={() => navigate(`/stages/${nextStage}`)}
              >
                次のステージ ({nextStage}) へ進む →
              </Button>
            ) : (
              <Button
                variant="acial"
                size="lg"
                onClick={() => navigate("/")}
              >
                ステージ一覧へ
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l border-ink-100 px-5 py-4 first:border-l-0 dark:border-ink-700">
      <dt className="m-0 mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="m-0 flex items-baseline justify-center gap-1 text-[14px] text-ink-700 dark:text-ink-200">
        {children}
      </dd>
    </div>
  );
}
