/**
 * ステージ詳細ページ。
 *
 * URL: `/stages/:stage`
 *
 * 当該ステージに属する全章の課題を、章セクション形式 (旧 SelectPage と同じ
 * レイアウト) で一覧表示する。
 *
 * ステージが未解禁ならカードは出さず、 「解禁条件」 を案内する。
 */

import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  assignments,
  chapters,
} from "@jsreview/shared/assignments";
import { stages as stageInfos } from "@jsreview/shared/curriculum/stages";
import type { Assignment, Chapter, Stage } from "@jsreview/shared/types";

import { AppHeader } from "../components/AppHeader.js";
import { AssignmentCardList } from "../components/AssignmentCardList.js";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { useAllClearedSet } from "../hooks/useAllClearedSet.js";
import { useStageUnlocks } from "../hooks/useStageUnlocks.js";
import { STAGE_ORDER } from "../lib/stage-unlock-store.js";
import { cn } from "@/lib/utils";

const STAGE_SET = new Set<Stage>(STAGE_ORDER);

function isStageParam(value: string | undefined): value is Stage {
  return value !== undefined && STAGE_SET.has(value as Stage);
}

export function StagePage() {
  const params = useParams<{ stage: string }>();

  if (!isStageParam(params.stage)) {
    return <Navigate to="/" replace />;
  }
  return <StagePageContent stage={params.stage} />;
}

function StagePageContent({ stage }: { stage: Stage }) {
  const clearedSet = useAllClearedSet();
  const unlocked = useStageUnlocks();
  const stageInfo = stageInfos.find((s) => s.id === stage);

  const stageAssignments = useMemo(
    () => assignments.filter((a) => a.stage === stage),
    [stage],
  );

  // 章内通し番号 (ステージ内の sequence ではなく shared の order に合わせる)
  const assignmentNumbers = useMemo(() => {
    const m = new Map<string, number>();
    const byChapter = new Map<string, number>();
    for (const a of stageAssignments) {
      const next = (byChapter.get(a.chapterId) ?? 0) + 1;
      byChapter.set(a.chapterId, next);
      m.set(a.id, next);
    }
    return m;
  }, [stageAssignments]);

  const chapterGroups = useMemo(() => {
    return chapters
      .map((chapter) => ({
        chapter,
        items: stageAssignments.filter((a) => a.chapterId === chapter.id),
      }))
      .filter((g) => g.items.length > 0);
  }, [stageAssignments]);

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
  const capstoneCleared = capstones.filter((a) => clearedSet.has(a.id)).length;
  const allCapstoneDone =
    capstones.length > 0 && capstoneCleared === capstones.length;

  const isUnlocked = unlocked.includes(stage);

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

      <main className="hero-halo overflow-y-auto bg-background px-[clamp(24px,5vw,56px)] pt-10 pb-20">
        <section className="mb-7 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 pb-6">
          <div className="min-w-0">
            <span className="mb-2.5 inline-flex items-center gap-2 text-overline text-muted-foreground">
              <span
                className="inline-block h-[2px] w-6 rounded gradient-bg"
                aria-hidden
              />
              {stage} · {stageInfo?.shortLabel ?? ""}
            </span>
            <h2 className="mb-2 font-jp text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground">
              {stageInfo?.label ?? stage}
            </h2>
            {stageInfo?.description && (
              <p className="m-0 max-w-[60ch] text-[14px] leading-[1.7] text-muted-foreground">
                {stageInfo.description}
              </p>
            )}
          </div>
          <dl className="m-0 grid grid-cols-3 gap-0 rounded-xl border border-border bg-card p-1 tabular-nums shadow-[var(--shadow-1)] max-md:w-full">
            <StatCell label="Cleared">
              <strong className="gradient-text font-sans text-[26px] font-extrabold leading-none tracking-[-0.02em]">
                {clearedInStage}
              </strong>
              <span className="font-sans text-[12.5px] text-ink-400">
                {" "}
                / {totalInStage}
              </span>
            </StatCell>
            <StatCell label="Capstone">
              <strong className="font-sans text-[26px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                {capstoneCleared}
              </strong>
              <span className="font-sans text-[12.5px] text-ink-400">
                {" "}
                / {capstones.length}
              </span>
            </StatCell>
            <StatCell label="Chapters">
              <strong className="font-sans text-[26px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                {chapterGroups.length}
              </strong>
            </StatCell>
          </dl>
        </section>

        {!isUnlocked ? (
          <LockedNotice stage={stage} />
        ) : totalInStage === 0 ? (
          <EmptyNotice stage={stage} />
        ) : (
          <>
            {capstones.length > 0 && (
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50/80 px-3.5 py-1.5 font-jp text-[12px] font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
                {allCapstoneDone
                  ? "🎉 チャレンジ問題はすべてクリア済みです"
                  : `チャレンジ問題 ${capstones.length} 問を全 pass で次ステージが解禁されます (${capstoneCleared}/${capstones.length})`}
              </p>
            )}

            {chapterGroups.map(({ chapter, items }) => (
              <ChapterSection
                key={chapter.id}
                chapter={chapter}
                items={items}
                clearedSet={clearedSet}
                assignmentNumbers={assignmentNumbers}
              />
            ))}
          </>
        )}
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
    <div className="border-l border-ink-100 px-5 py-3 first:border-l-0 dark:border-ink-700 max-md:px-3 max-md:py-2">
      <dt className="m-0 mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="m-0 flex items-baseline gap-1 text-[14px] text-ink-700 dark:text-ink-200">
        {children}
      </dd>
    </div>
  );
}

function ChapterSection({
  chapter,
  items,
  clearedSet,
  assignmentNumbers,
}: {
  chapter: Chapter;
  items: Assignment[];
  clearedSet: Set<string>;
  assignmentNumbers: Map<string, number>;
}) {
  const clearedCount = items.reduce(
    (n, a) => (clearedSet.has(a.id) ? n + 1 : n),
    0,
  );
  const allDone = clearedCount === items.length && items.length > 0;

  return (
    <section className="mb-11">
      <header className="relative mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3.5 after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-9 after:rounded after:bg-gradient-to-br after:from-blue-500 after:to-red-500 after:content-['']">
        <div className="min-w-0">
          <h3 className="m-0 font-jp text-[18px] font-bold leading-[1.3] tracking-[-0.01em] text-foreground">
            {chapter.label}
          </h3>
          {chapter.description && (
            <p className="mt-1 text-[12.5px] leading-[1.55] text-muted-foreground">
              {chapter.description}
            </p>
          )}
        </div>
        <div className="inline-flex shrink-0 items-center gap-3.5">
          <span
            className={cn(
              "rounded-full border px-3 py-[5px] font-sans text-[12px] font-semibold tabular-nums",
              allDone
                ? "border-success bg-success text-white"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {clearedCount}/{items.length}
          </span>
          {chapter.defaultMdnPage && (
            <a
              href={chapter.defaultMdnPage}
              target="_blank"
              rel="noopener noreferrer"
              title={chapter.mdnPageTitle}
              className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-muted-foreground no-underline hover:text-blue-700 hover:underline dark:hover:text-blue-300"
            >
              MDN ↗
            </a>
          )}
        </div>
      </header>

      <AssignmentCardList
        items={items}
        clearedSet={clearedSet}
        assignmentNumbers={assignmentNumbers}
        highlightCapstone
      />
    </section>
  );
}

function LockedNotice({ stage }: { stage: Stage }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
      <div className="mb-2 font-jp text-[16px] font-bold text-foreground">
        🔒 {stage} はまだ解禁されていません
      </div>
      <p className="m-0 mx-auto max-w-[44ch] text-[13px] leading-[1.7] text-muted-foreground">
        前のステージのチャレンジ問題を全てクリアすると解禁されます。
      </p>
      <div className="mt-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 font-jp text-[12.5px] font-semibold text-foreground no-underline transition-colors hover:bg-muted"
        >
          ← Stages に戻る
        </Link>
      </div>
    </div>
  );
}

function EmptyNotice({ stage }: { stage: Stage }) {
  return (
    <p className="px-5 py-8 text-center text-[13px] italic text-muted-foreground">
      このステージにはまだ問題が配置されていません ({stage})。
    </p>
  );
}
