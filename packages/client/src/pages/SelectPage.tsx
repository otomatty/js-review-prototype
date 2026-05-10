/**
 * ステージ選択画面 (URL `/`)。
 *
 * S0–S5 の 6 枚のカードを表示し、 各ステージの解禁状態 / 進捗 / 卒業課題状況を
 * 一覧する。 解禁済みカードをクリックで `/stages/:stage` へ遷移する。
 *
 * 卒業課題クリアで解禁されるステージのアンロック判定は `StageUnlockDialog` が
 * App ルート直下で担当しているため、 ここではカードの状態表示のみを担う。
 */

import { Lock } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { assignments } from "@jsreview/shared/assignments";
import { stages as stageInfos } from "@jsreview/shared/curriculum/stages";
import type { Stage, StageInfo } from "@jsreview/shared/types";

import { AppHeader } from "../components/AppHeader.js";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { useAllClearedSet } from "../hooks/useAllClearedSet.js";
import { useStageUnlocks } from "../hooks/useStageUnlocks.js";
import { cn } from "@/lib/utils";

interface StageStat {
  total: number;
  cleared: number;
  capstones: number;
  capstonesCleared: number;
}

export function SelectPage() {
  const clearedSet = useAllClearedSet();
  const unlocked = useStageUnlocks();
  const unlockedSet = useMemo(() => new Set(unlocked), [unlocked]);

  const statsByStage = useMemo(() => {
    const m = new Map<Stage, StageStat>();
    for (const s of stageInfos) {
      m.set(s.id, { total: 0, cleared: 0, capstones: 0, capstonesCleared: 0 });
    }
    for (const a of assignments) {
      const e = m.get(a.stage);
      if (!e) {continue;}
      e.total += 1;
      const isCleared = clearedSet.has(a.id);
      if (isCleared) {e.cleared += 1;}
      if (a.isCapstone) {
        e.capstones += 1;
        if (isCleared) {e.capstonesCleared += 1;}
      }
    }
    return m;
  }, [clearedSet]);

  const overall = useMemo(() => {
    let cleared = 0;
    for (const a of assignments) {
      if (clearedSet.has(a.id)) {cleared++;}
    }
    return {
      total: assignments.length,
      cleared,
      uncleared: assignments.length - cleared,
      unlockedStages: unlocked.length,
    };
  }, [clearedSet, unlocked]);

  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <AppHeader right={<ThemeToggle />} />

      <main className="hero-halo overflow-y-auto bg-background px-[clamp(24px,5vw,56px)] pt-10 pb-20">
        <section className="mb-7 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 pb-6">
          <div className="min-w-0">
            <span className="mb-2.5 inline-flex items-center text-overline text-muted-foreground">
              <span
                className="mr-3 inline-block h-[2px] w-6 rounded gradient-bg"
                aria-hidden
              />
              MDN Aligned · Spiral Curriculum
            </span>
            <h2 className="mb-2 font-jp text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground">
              書いて、測って、
              <span className="gradient-text">JavaScript</span>
              を磨く。
            </h2>
            <p className="m-0 max-w-[52ch] text-[14px] leading-[1.7] text-muted-foreground">
              S0 から S5 までの 6 ステージを順に進めるスパイラル方式。
              各ステージの卒業課題 (3 問) を全 pass で次ステージが解禁されます。
            </p>
          </div>
          <dl className="m-0 grid grid-cols-3 gap-0 rounded-xl border border-border bg-card p-1 tabular-nums shadow-[var(--shadow-1)] max-md:w-full">
            <StatCell label="Cleared">
              <strong className="gradient-text font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em]">
                {overall.cleared}
              </strong>
              <span className="font-sans text-[13px] text-ink-400">
                {" "}
                / {overall.total}
              </span>
            </StatCell>
            <StatCell label="Uncleared">
              <strong className="font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                {overall.uncleared}
              </strong>
            </StatCell>
            <StatCell label="Stages">
              <strong className="font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                {overall.unlockedStages}
              </strong>
              <span className="font-sans text-[13px] text-ink-400">
                {" "}
                / 6
              </span>
            </StatCell>
          </dl>
        </section>

        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="ステージ一覧"
        >
          {stageInfos.map((info) => (
            <StageCard
              key={info.id}
              info={info}
              stat={
                statsByStage.get(info.id) ?? {
                  total: 0,
                  cleared: 0,
                  capstones: 0,
                  capstonesCleared: 0,
                }
              }
              unlocked={unlockedSet.has(info.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

function StageCard({
  info,
  stat,
  unlocked,
}: {
  info: StageInfo;
  stat: StageStat;
  unlocked: boolean;
}) {
  const allDone = stat.total > 0 && stat.cleared === stat.total;
  const inProgress = stat.cleared > 0 && !allDone;
  const noContent = stat.total === 0;
  const capstoneDone =
    stat.capstones > 0 && stat.capstonesCleared === stat.capstones;
  const progressPct = stat.total > 0 ? (stat.cleared / stat.total) * 100 : 0;

  const baseClasses =
    "group relative flex min-h-[220px] flex-col gap-4 overflow-hidden rounded-xl border bg-card px-6 py-5 shadow-[var(--shadow-1)] transition-[border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

  const stateClasses = !unlocked
    ? "border-border/60 opacity-75"
    : allDone
      ? "border-success/60 bg-gradient-to-b from-emerald-50 to-card to-60% dark:from-emerald-950/40 dark:to-card"
      : inProgress
        ? "border-blue-300/60 dark:border-blue-700/60"
        : "border-border";

  const interactiveClasses = unlocked
    ? "hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-[var(--shadow-2)] focus-visible:outline-none focus-visible:border-blue-500 focus-visible:shadow-[var(--shadow-focus)] cursor-pointer no-underline text-foreground"
    : "cursor-not-allowed text-muted-foreground";

  const content = (
    <>
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          allDone
            ? "bg-success scale-x-100 opacity-90"
            : unlocked
              ? "gradient-bg scale-x-0 group-hover:scale-x-100"
              : "bg-muted-foreground/30 scale-x-100",
        )}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-jp text-[12px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {info.id}
          </div>
          <div className="mt-0.5 font-jp text-[20px] font-extrabold leading-tight tracking-[-0.01em] text-foreground">
            {info.label.replace(`${info.id} `, "")}
          </div>
          <div className="mt-0.5 font-jp text-[12px] text-muted-foreground">
            {info.shortLabel}
          </div>
        </div>
        <StageStateBadge
          unlocked={unlocked}
          allDone={allDone}
          inProgress={inProgress}
          noContent={noContent}
        />
      </div>

      <p className="m-0 line-clamp-3 text-[12.5px] leading-[1.6] text-muted-foreground">
        {info.description}
      </p>

      <div className="mt-auto">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="font-jp text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            進捗
          </span>
          <span className="font-sans text-[13px] font-bold tabular-nums text-foreground">
            {stat.cleared} <span className="text-muted-foreground">/ {stat.total}</span>
          </span>
        </div>
        <div className="h-[6px] overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              allDone
                ? "bg-success"
                : inProgress
                  ? "bg-blue-500"
                  : "bg-muted-foreground/20",
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {stat.capstones > 0 && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold tabular-nums text-amber-700 dark:text-amber-300">
            <span aria-hidden>🎓</span>
            <span>
              卒業課題 {stat.capstonesCleared}/{stat.capstones}
              {capstoneDone && " ✓"}
            </span>
          </div>
        )}
      </div>
    </>
  );

  if (!unlocked) {
    return (
      <div
        className={cn(baseClasses, stateClasses, interactiveClasses)}
        aria-disabled
        title="前のステージの卒業課題 (3 問) を全てクリアすると解禁されます"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/stages/${info.id}`}
      className={cn(baseClasses, stateClasses, interactiveClasses)}
      aria-label={`${info.label} ${stat.cleared}/${stat.total} クリア`}
    >
      {content}
    </Link>
  );
}

function StageStateBadge({
  unlocked,
  allDone,
  inProgress,
  noContent,
}: {
  unlocked: boolean;
  allDone: boolean;
  inProgress: boolean;
  noContent: boolean;
}) {
  if (!unlocked) {
    return (
      <span
        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
        aria-label="未解禁"
      >
        <Lock className="size-3" aria-hidden />
        Locked
      </span>
    );
  }
  if (allDone) {
    return (
      <span
        className="inline-flex shrink-0 items-center rounded-full bg-success px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-white"
        aria-label="全クリア"
      >
        ✓ Cleared
      </span>
    );
  }
  if (inProgress) {
    return (
      <span
        className="inline-flex shrink-0 items-center rounded-full border border-blue-300 bg-blue-50 px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-blue-700 dark:border-blue-700/60 dark:bg-blue-950/40 dark:text-blue-200"
        aria-label="進行中"
      >
        In Progress
      </span>
    );
  }
  if (noContent) {
    return (
      <span
        className="inline-flex shrink-0 items-center rounded-full border border-border bg-card px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
        aria-label="問題未配置"
      >
        Coming Soon
      </span>
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border border-border bg-card px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-foreground"
      aria-label="解禁済み"
    >
      Ready
    </span>
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
    <div className="border-l border-ink-100 px-6 py-3 first:border-l-0 dark:border-ink-700 max-md:px-3 max-md:py-2">
      <dt className="m-0 mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="m-0 flex items-baseline gap-1 text-[14px] text-ink-700 dark:text-ink-200">
        {children}
      </dd>
    </div>
  );
}
