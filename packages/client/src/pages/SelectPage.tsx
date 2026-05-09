/**
 * 問題選択画面 (一覧)。
 *
 * URL `/` に対応するランディング兼一覧。
 * トピックごとにセクション分けし、各課題はカード形式のグリッドで表示する。
 *
 * 機能:
 * - 全体の進捗サマリ (完了数 / 平均ベスト)
 * - 状態フィルタ (すべて / 未着手 / 部分点 / 完了)
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
import { useAllBestScores } from "../hooks/useAllBestScores.js";

type Status = "completed" | "partial" | "untouched";
type StatusFilter = "all" | Status;
type DifficultyFilter = "all" | 1 | 2 | 3;

function statusOf(score: number | undefined): Status {
  if (score == null) return "untouched";
  if (score >= 100) return "completed";
  if (score > 0) return "partial";
  return "untouched";
}

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "untouched", label: "未着手" },
  { id: "partial", label: "部分点" },
  { id: "completed", label: "完了" },
];

const DIFFICULTY_FILTERS: { id: DifficultyFilter; label: string }[] = [
  { id: "all", label: "難易度すべて" },
  { id: 1, label: "★" },
  { id: 2, label: "★★" },
  { id: 3, label: "★★★" },
];

export function SelectPage() {
  const bestScores = useAllBestScores();
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
    let completed = 0;
    let partial = 0;
    let scoreSum = 0;
    let scoredCount = 0;
    for (const a of assignments) {
      const score = bestScores.get(a.id);
      const s = statusOf(score);
      if (s === "completed") completed++;
      else if (s === "partial") partial++;
      if (score != null && score > 0) {
        scoreSum += score;
        scoredCount++;
      }
    }
    return {
      total: assignments.length,
      completed,
      partial,
      untouched: assignments.length - completed - partial,
      avgBest: scoredCount > 0 ? Math.round(scoreSum / scoredCount) : null,
    };
  }, [bestScores]);

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
            const s = statusOf(bestScores.get(a.id));
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
  }, [bestScores, statusFilter, difficultyFilter, normalizedQuery]);

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
    <div className="app">
      <header className="header">
        <div className="header-title">
          <h1>
            JS自動コードレビュー <span className="header-tag">プロトタイプ</span>
          </h1>
        </div>
        <div className="header-controls">
          <ThemeToggle />
        </div>
      </header>

      <main className="select-main">
        <section className="select-summary">
          <div className="summary-headline">
            <h2>問題一覧</h2>
            <p className="summary-sub">
              MDN の章立てに沿った全 {summary.total} 問。カードを選んで演習を始めてください。
            </p>
          </div>
          <dl className="summary-stats">
            <div>
              <dt>完了</dt>
              <dd>
                <strong>{summary.completed}</strong>
                <span className="summary-suffix"> / {summary.total}</span>
              </dd>
            </div>
            <div>
              <dt>部分点</dt>
              <dd>
                <strong>{summary.partial}</strong>
              </dd>
            </div>
            <div>
              <dt>未着手</dt>
              <dd>
                <strong>{summary.untouched}</strong>
              </dd>
            </div>
            <div>
              <dt>平均ベスト</dt>
              <dd>
                {summary.avgBest != null ? (
                  <>
                    <strong>{summary.avgBest}</strong>
                    <span className="summary-suffix"> 点</span>
                  </>
                ) : (
                  <span className="summary-empty">—</span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="select-filters" aria-label="絞り込み">
          <fieldset className="filter-group">
            <legend className="sr-only">状態で絞り込み</legend>
            {STATUS_FILTERS.map((f) => (
              <label
                key={f.id}
                className={`chip${statusFilter === f.id ? " is-active" : ""}`}
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
          <fieldset className="filter-group">
            <legend className="sr-only">難易度で絞り込み</legend>
            {DIFFICULTY_FILTERS.map((f) => (
              <label
                key={String(f.id)}
                className={`chip${difficultyFilter === f.id ? " is-active" : ""}`}
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
          <div className="filter-search">
            <input
              type="search"
              className="search-input"
              placeholder="課題名・トピックを検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="課題を検索"
            />
            {hasActiveFilter && (
              <button
                type="button"
                className="btn-link"
                onClick={clearFilters}
              >
                条件をクリア
              </button>
            )}
          </div>
        </section>

        {hasNoResult ? (
          <p className="empty-state">
            条件に合う課題がありません。フィルタを変更してください。
          </p>
        ) : (
          filteredGroups.map(({ topic, items }) => (
            <TopicSection
              key={topic.id}
              topic={topic}
              items={items}
              bestScores={bestScores}
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
  bestScores: Map<string, number>;
  assignmentNumbers: Map<string, number>;
}

function TopicSection({
  topic,
  items,
  bestScores,
  assignmentNumbers,
}: TopicSectionProps) {
  // フィルタ後の items だけで完了数を出すと「3問中2問完了」のような誤解を生む。
  // ここでは表示中アイテムの完了状況を素直に出す。
  const completedCount = items.reduce(
    (n, a) => (statusOf(bestScores.get(a.id)) === "completed" ? n + 1 : n),
    0,
  );
  const allDone = completedCount === items.length && items.length > 0;

  return (
    <section className="topic-section">
      <header className="topic-section-header">
        <div className="topic-section-titles">
          <h3>{topic.label}</h3>
          {topic.description && (
            <p className="topic-section-desc">{topic.description}</p>
          )}
        </div>
        <div className="topic-section-meta">
          <span
            className={`topic-section-progress${allDone ? " is-complete" : ""}`}
          >
            {completedCount}/{items.length}
          </span>
          {topic.mdnUrl && (
            <a
              href={topic.mdnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="topic-mdn-link"
            >
              MDN ↗
            </a>
          )}
        </div>
      </header>

      <ul className="card-grid">
        {items.map((a) => {
          const score = bestScores.get(a.id);
          const status = statusOf(score);
          const assignmentNumber = assignmentNumbers.get(a.id);
          return (
            <li key={a.id}>
              <Link
                to={`/problems/${a.id}`}
                className={`assignment-card status-${status}`}
                aria-label={`${a.title} (難易度 ${a.difficulty}, ${
                  status === "completed"
                    ? "完了"
                    : status === "partial"
                      ? `${score}点`
                      : "未着手"
                })`}
              >
                <div className="card-top">
                  <span className="card-num">#{assignmentNumber}</span>
                  <CardStatusBadge status={status} score={score} />
                </div>
                <div className="card-title">{a.title}</div>
                <div className="card-bottom">
                  <span
                    className="card-difficulty"
                    aria-label={`難易度 ${a.difficulty}`}
                    title={`難易度 ${a.difficulty}`}
                  >
                    {"★".repeat(a.difficulty)}
                    <span className="card-difficulty-dim">
                      {"★".repeat(3 - a.difficulty)}
                    </span>
                  </span>
                  <span className="card-cta" aria-hidden>
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

function CardStatusBadge({
  status,
  score,
}: {
  status: Status;
  score: number | undefined;
}) {
  switch (status) {
    case "completed":
      return (
        <span
          className="card-status card-status-completed"
          aria-label="完了"
        >
          ✓ 完了
        </span>
      );
    case "partial":
      return (
        <span
          className="card-status card-status-partial"
          aria-label={`部分点 ${score ?? 0}`}
        >
          {score ?? 0} 点
        </span>
      );
    case "untouched":
      return (
        <span className="card-status card-status-untouched" aria-label="未着手">
          未着手
        </span>
      );
  }
}
