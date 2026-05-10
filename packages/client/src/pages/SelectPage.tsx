/**
 * ステージ選択画面 (URL `/`)。
 *
 * S0 から S5 までの 6 ステージを縦タイムラインで表示する。 各ステージは
 * 「ノード (◯ 印) + 説明カード」 のペアとなり、 ノード間を接続線でつないで
 * スパイラル方式の進行順序を視覚化する。
 *
 * - 解禁済みカードのクリックで `/stages/:stage` へ遷移
 * - 各ステージの解禁状態 / 進捗 / 卒業課題達成数をカード上に出す
 * - 卒業課題クリアによる解禁判定は `App` ルート直下の `StageUnlockDialog` が担当
 */

import { Check, Lock } from "lucide-react";
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

type CardState = "locked" | "ready" | "inProgress" | "completed" | "empty";

function classifyStage(unlocked: boolean, stat: StageStat): CardState {
  if (!unlocked) {return "locked";}
  if (stat.total === 0) {return "empty";}
  if (stat.cleared === stat.total) {return "completed";}
  if (stat.cleared > 0) {return "inProgress";}
  return "ready";
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

  const stageItems = useMemo(() => {
    return stageInfos.map((info) => {
      const stat = statsByStage.get(info.id) ?? {
        total: 0,
        cleared: 0,
        capstones: 0,
        capstonesCleared: 0,
      };
      const isUnlocked = unlockedSet.has(info.id);
      return {
        info,
        stat,
        isUnlocked,
        state: classifyStage(isUnlocked, stat),
      };
    });
  }, [statsByStage, unlockedSet]);

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
              S0 から S5 までを順に登っていくスパイラル方式。
              卒業課題 (3 問) を全 pass で次ステージが解禁されます。
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

        <ol
          className="relative m-0 list-none p-0"
          aria-label="ステージタイムライン"
        >
          {stageItems.map((item, i) => {
            const prev = i > 0 ? stageItems[i - 1] : undefined;
            const isLast = i === stageItems.length - 1;
            return (
              <TimelineItem
                key={item.info.id}
                index={i}
                info={item.info}
                stat={item.stat}
                state={item.state}
                isUnlocked={item.isUnlocked}
                prevCompleted={prev?.state === "completed"}
                isLast={isLast}
              />
            );
          })}
        </ol>
      </main>
    </div>
  );
}

interface TimelineItemProps {
  index: number;
  info: StageInfo;
  stat: StageStat;
  state: CardState;
  isUnlocked: boolean;
  prevCompleted: boolean;
  isLast: boolean;
}

function TimelineItem({
  index,
  info,
  stat,
  state,
  isUnlocked,
  prevCompleted,
  isLast,
}: TimelineItemProps) {
  const progressPct = stat.total > 0 ? (stat.cleared / stat.total) * 100 : 0;
  const capstoneDone =
    stat.capstones > 0 && stat.capstonesCleared === stat.capstones;

  const cardBase =
    "group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-card px-5 py-4 shadow-[var(--shadow-1)] transition-[border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

  const cardStateClasses = !isUnlocked
    ? "border-border/60 opacity-75"
    : state === "completed"
      ? "border-success/60 bg-gradient-to-b from-emerald-50 to-card to-60% dark:from-emerald-950/40 dark:to-card"
      : state === "inProgress"
        ? "border-blue-300/60 dark:border-blue-700/60"
        : "border-border";

  const cardInteractiveClasses = isUnlocked
    ? "hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-[var(--shadow-2)] focus-visible:outline-none focus-visible:border-blue-500 focus-visible:shadow-[var(--shadow-focus)] cursor-pointer no-underline text-foreground"
    : "cursor-not-allowed text-muted-foreground";

  const cardContent = (
    <>
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          state === "completed"
            ? "bg-success scale-x-100 opacity-90"
            : isUnlocked
              ? "gradient-bg scale-x-0 group-hover:scale-x-100"
              : "bg-muted-foreground/20 scale-x-100",
        )}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-jp text-[18px] font-extrabold leading-tight tracking-[-0.01em] text-foreground">
            {info.label.replace(`${info.id} `, "")}
          </div>
          <div className="mt-0.5 font-jp text-[12px] text-muted-foreground">
            {info.shortLabel}
            <span className="mx-2 text-ink-300 dark:text-ink-600">·</span>
            <span className="tabular-nums">
              想定 {info.estimatedMinutesRange[0]}–
              {info.estimatedMinutesRange[1]} 分 / 問
            </span>
          </div>
        </div>
        <StageStateBadge state={state} />
      </div>

      <p className="m-0 line-clamp-3 text-[12.5px] leading-[1.6] text-muted-foreground">
        {info.description}
      </p>

      {state !== "empty" && (
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <span className="font-jp text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              進捗
            </span>
            <span className="font-sans text-[13px] font-bold tabular-nums text-foreground">
              {stat.cleared}{" "}
              <span className="text-muted-foreground">/ {stat.total}</span>
            </span>
          </div>
          <div className="h-[6px] overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                state === "completed"
                  ? "bg-success"
                  : state === "inProgress"
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
      )}
    </>
  );

  return (
    <li className="relative pl-[68px] pb-8 last:pb-0 max-md:pl-14">
      {/* connector line: 上半分 (前ステージから) */}
      {index > 0 && (
        <span
          aria-hidden
          className={cn(
            "absolute left-[23px] top-0 h-[28px] w-[2px] max-md:left-[19px]",
            prevCompleted ? "bg-success" : "bg-border",
          )}
        />
      )}
      {/* connector line: 下半分 (次ステージへ) */}
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute left-[23px] top-[28px] bottom-0 w-[2px] max-md:left-[19px]",
            state === "completed" ? "bg-success" : "bg-border",
          )}
        />
      )}

      {/* node (timeline 上の ◯) */}
      <TimelineNode info={info} state={state} />

      {/* card */}
      {isUnlocked ? (
        <Link
          to={`/stages/${info.id}`}
          className={cn(cardBase, cardStateClasses, cardInteractiveClasses)}
          aria-label={`${info.label} ${stat.cleared}/${stat.total} クリア`}
        >
          {cardContent}
        </Link>
      ) : (
        <div
          className={cn(cardBase, cardStateClasses, cardInteractiveClasses)}
          aria-disabled
          title="前のステージの卒業課題 (3 問) を全てクリアすると解禁されます"
        >
          {cardContent}
        </div>
      )}
    </li>
  );
}

function TimelineNode({
  info,
  state,
}: {
  info: StageInfo;
  state: CardState;
}) {
  const baseClasses =
    "absolute left-0 top-[6px] flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 font-jp text-[12.5px] font-extrabold tracking-tight transition-colors max-md:h-[40px] max-md:w-[40px] max-md:text-[11px]";

  const stateClasses =
    state === "completed"
      ? "border-success bg-success text-white shadow-[0_0_0_4px_rgba(34,197,94,0.18)]"
      : state === "inProgress"
        ? "border-blue-500 bg-background text-blue-700 shadow-[0_0_0_4px_rgba(59,130,246,0.18)] dark:text-blue-200"
        : state === "ready"
          ? "border-foreground bg-background text-foreground shadow-[0_0_0_4px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]"
          : state === "empty"
            ? "border-border bg-background text-muted-foreground"
            : "border-border bg-muted text-muted-foreground";

  return (
    <div className={cn(baseClasses, stateClasses)} aria-hidden>
      {state === "completed" ? (
        <Check className="size-5" />
      ) : state === "locked" ? (
        <Lock className="size-4" />
      ) : (
        <span>{info.id}</span>
      )}
    </div>
  );
}

function StageStateBadge({ state }: { state: CardState }) {
  switch (state) {
    case "locked":
      return (
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
          aria-label="未解禁"
        >
          <Lock className="size-3" aria-hidden />
          Locked
        </span>
      );
    case "completed":
      return (
        <span
          className="inline-flex shrink-0 items-center rounded-full bg-success px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-white"
          aria-label="全クリア"
        >
          ✓ Cleared
        </span>
      );
    case "inProgress":
      return (
        <span
          className="inline-flex shrink-0 items-center rounded-full border border-blue-300 bg-blue-50 px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-blue-700 dark:border-blue-700/60 dark:bg-blue-950/40 dark:text-blue-200"
          aria-label="進行中"
        >
          In Progress
        </span>
      );
    case "empty":
      return (
        <span
          className="inline-flex shrink-0 items-center rounded-full border border-border bg-card px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
          aria-label="問題未配置"
        >
          Coming Soon
        </span>
      );
    case "ready":
      return (
        <span
          className="inline-flex shrink-0 items-center rounded-full border border-border bg-card px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-foreground"
          aria-label="解禁済み"
        >
          Ready
        </span>
      );
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
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
