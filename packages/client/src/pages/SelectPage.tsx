/**
 * 問題選択画面 (一覧)。
 *
 * URL `/` に対応するランディング兼一覧。
 * トピックごとにセクション分けし、各課題はカード形式のグリッドで表示する。
 *
 * 機能:
 * - 全体の進捗サマリ (クリア済み / 未クリア)
 * - 状態フィルタ (すべて / 未クリア / クリア済み)
 * - 難易度フィルタ (★1 / ★2 / ★3)
 * - 課題タイトル / トピックラベルでのフリーワード検索
 * - カードクリックで `/problems/:id` へ遷移
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  assignments,
  assignmentsByTopic,
  topics,
} from "@jsreview/shared/assignments";
import type { Assignment, Topic } from "@jsreview/shared/types";

import { ThemeToggle } from "../components/ThemeToggle.js";
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
  "inline-flex cursor-pointer select-none items-center rounded-full border border-transparent bg-transparent px-3 py-[5px] text-[12.5px] font-medium text-muted-foreground hover:bg-white hover:text-foreground dark:hover:bg-secondary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary";
const CHIP_ACTIVE =
  "border-primary bg-primary font-semibold text-white hover:bg-primary hover:text-white dark:text-primary-foreground dark:hover:text-primary-foreground";

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
    };
  }, [clearedSet]);

  // フィルタ判定はカード単位で軽い。トピックセクションは items が空なら畳む。
  const filteredGroups = useMemo(() => {
    return topics
      .map((topic) => {
        const items = assignmentsByTopic(topic.id).filter((a) => {
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
            const haystack = `${a.title} ${topic.label}`.toLowerCase();
            if (!haystack.includes(normalizedQuery)) return false;
          }
          return true;
        });
        return { topic, items };
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
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <h1 className="text-base font-semibold">
            JS自動コードレビュー{" "}
            <span className="ml-2 inline-block rounded-[10px] bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              プロトタイプ
            </span>
          </h1>
        </div>
        <div className="header-controls">
          <ThemeToggle />
        </div>
      </header>

      <main className="overflow-y-auto bg-background px-[clamp(20px,4vw,40px)] pb-12 pt-6">
        <section className="mb-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-border pb-5">
          <div>
            <h2 className="mb-1 text-[22px] font-bold tracking-[-0.01em]">
              問題一覧
            </h2>
            <p className="text-[13px] text-muted-foreground">
              MDN の章立てに沿った全 {summary.total} 問。カードを選んで演習を始めてください。
            </p>
          </div>
          <dl className="m-0 grid grid-cols-[repeat(4,minmax(96px,auto))] tabular-nums max-md:w-full max-md:grid-cols-2 [&>div]:border-l [&>div]:border-border [&>div]:px-[18px] [&>div]:py-1 [&>div]:text-left [&>div:first-child]:border-l-0 [&>div:first-child]:pl-0 max-md:[&>div]:px-3 max-md:[&>div:nth-child(2n+1)]:border-l-0 max-md:[&>div:nth-child(2n+1)]:pl-0">
            <div>
              <dt className="m-0 mb-0.5 text-[11px] uppercase tracking-[0.05em] text-zinc-400">
                クリア済み
              </dt>
              <dd className="m-0 text-sm">
                <strong className="text-[22px] font-bold">
                  {summary.cleared}
                </strong>
                <span className="text-[13px] text-zinc-400">
                  {" "}
                  / {summary.total}
                </span>
              </dd>
            </div>
            <div>
              <dt className="m-0 mb-0.5 text-[11px] uppercase tracking-[0.05em] text-zinc-400">
                未クリア
              </dt>
              <dd className="m-0 text-sm">
                <strong className="text-[22px] font-bold">
                  {summary.uncleared}
                </strong>
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="mb-6 flex flex-wrap items-center gap-x-[18px] gap-y-3"
          aria-label="絞り込み"
        >
          <fieldset className="m-0 inline-flex min-w-0 flex-wrap gap-1.5 rounded-full border border-border bg-muted p-1">
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
          <fieldset className="m-0 inline-flex min-w-0 flex-wrap gap-1.5 rounded-full border border-border bg-muted p-1">
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
          <div className="ml-auto inline-flex min-w-[220px] flex-1 items-center gap-2 max-md:ml-0 max-md:w-full">
            <input
              type="search"
              className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-[13px] focus:-outline-offset-1 focus:border-primary focus:outline-2 focus:outline-primary dark:bg-card"
              placeholder="課題名・トピックを検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="課題を検索"
            />
            {hasActiveFilter && (
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent px-1.5 py-1 text-xs text-primary underline underline-offset-2 hover:text-indigo-600 dark:hover:text-indigo-300"
                onClick={clearFilters}
              >
                条件をクリア
              </button>
            )}
          </div>
        </section>

        {hasNoResult ? (
          <p className="px-5 py-6 text-center text-[13px] italic text-zinc-400">
            条件に合う課題がありません。フィルタを変更してください。
          </p>
        ) : (
          filteredGroups.map(({ topic, items }) => (
            <TopicSection
              key={topic.id}
              topic={topic}
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

interface TopicSectionProps {
  topic: Topic;
  items: Assignment[];
  clearedSet: Set<string>;
  assignmentNumbers: Map<string, number>;
}

function TopicSection({
  topic,
  items,
  clearedSet,
  assignmentNumbers,
}: TopicSectionProps) {
  // フィルタ後の items だけで完了数を出すと「3問中2問完了」のような誤解を生む。
  // ここでは表示中アイテムのクリア状況を素直に出す。
  const clearedCount = items.reduce(
    (n, a) => (clearedSet.has(a.id) ? n + 1 : n),
    0,
  );
  const allDone = clearedCount === items.length && items.length > 0;

  return (
    <section className="mb-8">
      <header className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-foreground">
            {topic.label}
          </h3>
          {topic.description && (
            <p className="mt-0.5 text-xs text-zinc-400">{topic.description}</p>
          )}
        </div>
        <div className="inline-flex shrink-0 items-center gap-3">
          <span
            className={cn(
              "rounded-full border px-2.5 py-[3px] text-[11.5px] font-semibold tabular-nums",
              allDone
                ? "border-ok bg-ok text-white"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {clearedCount}/{items.length}
          </span>
          {topic.mdnUrl && (
            <a
              href={topic.mdnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground no-underline hover:text-primary hover:underline"
            >
              MDN ↗
            </a>
          )}
        </div>
      </header>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 p-0">
        {items.map((a) => {
          const cleared = clearedSet.has(a.id);
          const status = statusOf(cleared);
          const assignmentNumber = assignmentNumbers.get(a.id);
          return (
            <li key={a.id}>
              <Link
                to={`/problems/${a.id}`}
                className={cn(
                  "group flex min-h-[120px] flex-col justify-between gap-3 rounded-[10px] border bg-card px-4 py-3.5 text-foreground no-underline transition-[border-color,transform,box-shadow] duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:-translate-y-px hover:border-primary hover:shadow-[0_4px_12px_-6px_rgba(99,102,241,0.4)]",
                  cleared
                    ? "border-emerald-200 bg-emerald-50 hover:border-ok dark:border-emerald-800 dark:bg-emerald-950"
                    : "border-border",
                )}
                aria-label={`${a.title} (難易度 ${a.difficulty}, ${
                  cleared ? "クリア済み" : "未クリア"
                })`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold tabular-nums tracking-[0.02em] text-zinc-400">
                    #{assignmentNumber}
                  </span>
                  <CardStatusBadge status={status} />
                </div>
                <div className="line-clamp-2 text-sm font-semibold leading-[1.4] text-foreground">
                  {a.title}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[13px] tracking-[-1px] text-warn"
                    aria-label={`難易度 ${a.difficulty}`}
                    title={`難易度 ${a.difficulty}`}
                  >
                    {"★".repeat(a.difficulty)}
                    <span className="text-zinc-400 opacity-40">
                      {"★".repeat(3 - a.difficulty)}
                    </span>
                  </span>
                  <span
                    className="text-[11.5px] font-semibold tracking-[0.01em] text-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-300"
                    aria-hidden
                  >
                    解く →
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
          className="inline-flex items-center rounded-full bg-ok px-2 py-0.5 text-[11px] font-bold tabular-nums text-white"
          aria-label="クリア済み"
        >
          ✓ クリア
        </span>
      );
    case "uncleared":
      return (
        <span
          className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-bold tabular-nums text-zinc-400"
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
