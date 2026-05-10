/**
 * 問題選択画面 (一覧)。
 *
 * URL `/` に対応するランディング兼一覧。
 * 章ごとにセクション分けし、各課題はカード形式のグリッドで表示する。
 *
 * 機能:
 * - 全体の進捗サマリ (クリア済み / 未クリア / 章数)
 * - 状態フィルタ (すべて / 未クリア / クリア済み)
 * - 難易度フィルタ (★1 / ★2 / ★3)
 * - 課題タイトル / 章ラベルでのフリーワード検索
 * - カードクリックで `/problems/:id` へ遷移
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  assignments,
  assignmentsByChapter,
  chapters,
} from "@jsreview/shared/assignments";
import type { Assignment, Chapter } from "@jsreview/shared/types";

import { ThemeToggle } from "../components/ThemeToggle.js";
import { AppHeader } from "../components/AppHeader.js";
import { cn } from "@/lib/utils";
import { useAllClearedSet } from "../hooks/useAllClearedSet.js";

type Status = "cleared" | "uncleared";
type StatusFilter = "all" | Status;
type DifficultyFilter = "all" | 1 | 2 | 3;

function statusOf(cleared: boolean): Status {
  return cleared ? "cleared" : "uncleared";
}

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "uncleared", label: "未クリア" },
  { id: "cleared", label: "クリア済み" },
];

const DIFFICULTY_FILTERS: { id: DifficultyFilter; label: string }[] = [
  { id: "all", label: "難易度すべて" },
  { id: 1, label: "★" },
  { id: 2, label: "★★" },
  { id: 3, label: "★★★" },
];

const CHIP_BASE =
  "inline-flex cursor-pointer select-none items-center rounded-full border border-transparent bg-transparent px-3.5 py-[6px] text-[12.5px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring";
const CHIP_ACTIVE =
  "border-foreground bg-foreground text-background hover:bg-foreground hover:text-background dark:hover:bg-foreground dark:hover:text-background";

export function SelectPage() {
  const clearedSet = useAllClearedSet();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [query, setQuery] = useState<string>("");

  const normalizedQuery = query.trim().toLowerCase();
  const assignmentNumbers = useMemo(
    () => new Map(assignments.map((a, i) => [a.id, i + 1])),
    [],
  );

  // 全課題ぶんのサマリは生 `assignments` から計算 (フィルタの影響を受けない)。
  const summary = useMemo(() => {
    let cleared = 0;
    for (const a of assignments) {
      if (clearedSet.has(a.id)) cleared++;
    }
    return {
      total: assignments.length,
      cleared,
      uncleared: assignments.length - cleared,
      chapters: chapters.length,
    };
  }, [clearedSet]);

  // フィルタ判定はカード単位で軽い。トピックセクションは items が空なら畳む。
  const filteredGroups = useMemo(() => {
    return chapters
      .map((chapter) => {
        const items = assignmentsByChapter(chapter.id).filter((a) => {
          if (
            difficultyFilter !== "all" &&
            a.difficulty !== difficultyFilter
          ) {
            return false;
          }
          if (statusFilter !== "all") {
            const s = statusOf(clearedSet.has(a.id));
            if (s !== statusFilter) return false;
          }
          if (normalizedQuery !== "") {
            const haystack = `${a.title} ${chapter.label}`.toLowerCase();
            if (!haystack.includes(normalizedQuery)) return false;
          }
          return true;
        });
        return { chapter, items };
      })
      .filter((g) => g.items.length > 0);
  }, [clearedSet, statusFilter, difficultyFilter, normalizedQuery]);

  const hasNoResult = filteredGroups.length === 0;
  const hasActiveFilter =
    statusFilter !== "all" ||
    difficultyFilter !== "all" ||
    normalizedQuery !== "";

  function clearFilters() {
    setStatusFilter("all");
    setDifficultyFilter("all");
    setQuery("");
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <AppHeader right={<ThemeToggle />} />

      <main className="hero-halo overflow-y-auto bg-background px-[clamp(24px,5vw,56px)] pt-10 pb-20">
        <section className="mb-7 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 pb-8">
          <div className="min-w-0">
            <span className="mb-2.5 inline-flex items-center text-overline text-muted-foreground">
              <span
                className="mr-3 inline-block h-[2px] w-6 rounded gradient-bg"
                aria-hidden
              />
              MDN Aligned · JavaScript Drill
            </span>
            <h2 className="mb-2 font-jp text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground">
              書いて、測って、
              <span className="gradient-text">JavaScript</span>
              を磨く。
            </h2>
            <p className="m-0 max-w-[52ch] text-[14px] leading-[1.7] text-muted-foreground">
              MDN の章立てに沿った全 {summary.total} 問。実行は安全な isolated-vm、
              静的解析はブラウザ側で。コードを書いて、測って、もう一歩前へ。
            </p>
          </div>
          <dl className="m-0 grid grid-cols-3 gap-0 rounded-xl border border-border bg-card p-1 tabular-nums shadow-[var(--shadow-1)] max-md:w-full max-md:grid-cols-3">
            <StatCell label="Cleared">
              <strong className="gradient-text font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em]">
                {summary.cleared}
              </strong>
              <span className="font-sans text-[13px] text-ink-400">
                {" "}
                / {summary.total}
              </span>
            </StatCell>
            <StatCell label="Uncleared">
              <strong className="font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                {summary.uncleared}
              </strong>
            </StatCell>
            <StatCell label="Chapters">
              <strong className="font-sans text-[28px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
                {summary.chapters}
              </strong>
            </StatCell>
          </dl>
        </section>

        <section
          className="mb-9 flex flex-wrap items-center gap-x-4 gap-y-3"
          aria-label="絞り込み"
        >
          <fieldset className="m-0 inline-flex min-w-0 flex-wrap gap-1 rounded-full border border-border bg-card p-1 shadow-[var(--shadow-1)]">
            <legend className="sr-only">状態で絞り込み</legend>
            {STATUS_FILTERS.map((f) => (
              <label
                key={f.id}
                className={cn(
                  CHIP_BASE,
                  statusFilter === f.id && CHIP_ACTIVE,
                )}
              >
                <input
                  type="radio"
                  name="status-filter"
                  className="sr-only"
                  checked={statusFilter === f.id}
                  onChange={() => setStatusFilter(f.id)}
                />
                {f.label}
              </label>
            ))}
          </fieldset>
          <fieldset className="m-0 inline-flex min-w-0 flex-wrap gap-1 rounded-full border border-border bg-card p-1 shadow-[var(--shadow-1)]">
            <legend className="sr-only">難易度で絞り込み</legend>
            {DIFFICULTY_FILTERS.map((f) => (
              <label
                key={String(f.id)}
                className={cn(
                  CHIP_BASE,
                  difficultyFilter === f.id && CHIP_ACTIVE,
                )}
              >
                <input
                  type="radio"
                  name="difficulty-filter"
                  className="sr-only"
                  checked={difficultyFilter === f.id}
                  onChange={() => setDifficultyFilter(f.id)}
                />
                {f.label}
              </label>
            ))}
          </fieldset>
          <div className="ml-auto inline-flex min-w-[240px] flex-1 items-center gap-2 max-md:ml-0 max-md:w-full">
            <input
              type="search"
              className="flex-1 rounded-full border border-border bg-card px-3.5 py-[9px] font-jp text-[13px] text-foreground transition-colors placeholder:text-ink-400 focus:border-blue-500 focus:shadow-[var(--shadow-focus)] focus:outline-none"
              placeholder="課題名・トピックを検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="課題を検索"
            />
            {hasActiveFilter && (
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-sans text-xs font-semibold text-blue-700 underline underline-offset-[3px] hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-100"
                onClick={clearFilters}
              >
                条件をクリア
              </button>
            )}
          </div>
        </section>

        {hasNoResult ? (
          <p className="px-5 py-8 text-center text-[13px] italic text-ink-400">
            条件に合う課題がありません。フィルタを変更してください。
          </p>
        ) : (
          filteredGroups.map(({ chapter, items }) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              items={items}
              clearedSet={clearedSet}
              assignmentNumbers={assignmentNumbers}
            />
          ))
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

interface ChapterSectionProps {
  chapter: Chapter;
  items: Assignment[];
  clearedSet: Set<string>;
  assignmentNumbers: Map<string, number>;
}

function ChapterSection({
  chapter,
  items,
  clearedSet,
  assignmentNumbers,
}: ChapterSectionProps) {
  // フィルタ後の items だけで完了数を出すと「3問中2問完了」のような誤解を生む。
  // ここでは表示中アイテムのクリア状況を素直に出す。
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
              className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-muted-foreground no-underline hover:text-blue-700 hover:underline dark:hover:text-blue-300"
            >
              MDN ↗
            </a>
          )}
        </div>
      </header>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 p-0">
        {items.map((a) => {
          const cleared = clearedSet.has(a.id);
          const status = statusOf(cleared);
          const assignmentNumber = assignmentNumbers.get(a.id);
          return (
            <li key={a.id}>
              <Link
                to={`/problems/${a.id}`}
                className={cn(
                  "group relative flex min-h-[132px] flex-col justify-between gap-3.5 overflow-hidden rounded-xl border border-border bg-card px-5 py-4 text-foreground no-underline shadow-[var(--shadow-1)] transition-[border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:border-blue-500 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-[var(--shadow-2)] dark:hover:border-ink-600",
                  cleared
                    ? "border-emerald-200/60 bg-gradient-to-b from-emerald-50 to-card to-60% hover:border-success dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-card"
                    : "",
                )}
                aria-label={`${a.title} (難易度 ${a.difficulty}, ${
                  cleared ? "クリア済み" : "未クリア"
                })`}
              >
                {/* 上端のグラデーション hairline。hover で scaleX 1 へ。cleared は常時表示 (success 色)。 */}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] gradient-bg",
                    cleared
                      ? "!bg-success !bg-none scale-x-100 opacity-70"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                  aria-hidden
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-[11px] font-bold tabular-nums tracking-[0.06em] text-ink-400">
                    #{String(assignmentNumber).padStart(2, "0")}
                  </span>
                  <CardStatusBadge status={status} />
                </div>
                <div className="line-clamp-2 font-jp text-[14.5px] font-semibold leading-[1.5] tracking-[-0.005em] text-foreground">
                  {a.title}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-sans text-[14px] tracking-[-1px] text-ink-700 dark:text-ink-200"
                    aria-label={`難易度 ${a.difficulty}`}
                    title={`難易度 ${a.difficulty}`}
                  >
                    {"★".repeat(a.difficulty)}
                    <span className="text-ink-200 dark:text-ink-700">
                      {"★".repeat(3 - a.difficulty)}
                    </span>
                  </span>
                  <span
                    className="inline-flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-ink-700 group-hover:text-foreground dark:text-ink-300 dark:group-hover:text-foreground"
                    aria-hidden
                  >
                    解く
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-[3px]">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CardStatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "cleared":
      return (
        <span
          className="inline-flex items-center rounded-full bg-success px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tabular-nums tracking-[0.1em] text-white"
          aria-label="クリア済み"
        >
          ✓ Cleared
        </span>
      );
    case "uncleared":
      return (
        <span
          className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-[3px] font-sans text-[10.5px] font-bold tabular-nums tracking-[0.06em] text-muted-foreground"
          aria-label="未クリア"
        >
          未クリア
        </span>
      );
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
