/**
 * 課題カードのグリッド一覧。
 *
 * 章×ステージ詳細ページ (StagePage) と全課題俯瞰 (将来的な検索結果など)
 * から再利用するための共通コンポーネント。
 *
 * 元々 `SelectPage` の `ChapterSection` 内で直接書かれていたカード描画ロジックを
 * 抽出した。 表示順は `assignments` 配列の順 (= shared 側で定義された order) に従う。
 */

import { Link } from "react-router-dom";
import type { Assignment } from "@jsreview/shared/types";

import { cn } from "@/lib/utils";

interface Props {
  items: Assignment[];
  clearedSet: Set<string>;
  /** 「#01」 のようなナンバリングを表示するための番号マップ。 省略可。 */
  assignmentNumbers?: Map<string, number>;
  /** capstone を強調表示するか (StagePage では true)。 */
  highlightCapstone?: boolean;
}

export function AssignmentCardList({
  items,
  clearedSet,
  assignmentNumbers,
  highlightCapstone = false,
}: Props) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 p-0">
      {items.map((a, i) => {
        const cleared = clearedSet.has(a.id);
        const number = assignmentNumbers?.get(a.id) ?? i + 1;
        const isCapstone = highlightCapstone && a.isCapstone === true;
        return (
          <li key={a.id}>
            <Link
              to={`/problems/${a.id}`}
              className={cn(
                "group relative flex min-h-[132px] flex-col justify-between gap-3.5 overflow-hidden rounded-xl border border-border bg-card px-5 py-4 text-foreground no-underline shadow-[var(--shadow-1)] transition-[border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:border-blue-500 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-[var(--shadow-2)] dark:hover:border-ink-600",
                cleared
                  ? "border-emerald-200/60 bg-gradient-to-b from-emerald-50 to-card to-60% hover:border-success dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-card"
                  : "",
                isCapstone && !cleared
                  ? "ring-1 ring-amber-300/60 dark:ring-amber-500/40"
                  : "",
              )}
              aria-label={`${a.title} (難易度 ${a.difficulty}, ${
                cleared ? "クリア済み" : "未クリア"
              }${isCapstone ? ", チャレンジ問題" : ""})`}
            >
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
                  #{String(number).padStart(2, "0")}
                </span>
                <CardStatusBadge cleared={cleared} isCapstone={isCapstone} />
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
  );
}

function CardStatusBadge({
  cleared,
  isCapstone,
}: {
  cleared: boolean;
  isCapstone: boolean;
}) {
  if (cleared) {
    return (
      <span
        className="inline-flex items-center rounded-full bg-success px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tabular-nums tracking-[0.1em] text-white"
        aria-label="クリア済み"
      >
        ✓ Cleared
      </span>
    );
  }
  if (isCapstone) {
    return (
      <span
        className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-[3px] font-sans text-[10.5px] font-bold uppercase tracking-[0.08em] text-amber-700 dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-300"
        aria-label="チャレンジ問題"
      >
        チャレンジ問題
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-[3px] font-sans text-[10.5px] font-bold tabular-nums tracking-[0.06em] text-muted-foreground"
      aria-label="未クリア"
    >
      未クリア
    </span>
  );
}
