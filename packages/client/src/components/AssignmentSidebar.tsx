/**
 * トピック別に折りたためる課題リスト。
 *
 * - 各トピック見出しに `完了/全数` (100点を完了とみなす) を表示
 * - 課題行に状態バッジ (✓ / 部分点 / 未着手) と難易度 ★ を表示
 * - アクティブな課題はハイライトし、見えない位置にあれば自動スクロール
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Assignment, Topic } from "@jsreview/shared/types";

type Status = "completed" | "partial" | "untouched";

function statusOf(score: number | undefined): Status {
  if (score == null) return "untouched";
  if (score >= 100) return "completed";
  if (score > 0) return "partial";
  return "untouched";
}

interface Props {
  topics: Topic[];
  assignments: Assignment[];
  activeAssignmentId: string;
  bestScores: Map<string, number>;
  onSelect: (assignmentId: string) => void;
}

export function AssignmentSidebar({
  topics,
  assignments,
  activeAssignmentId,
  bestScores,
  onSelect,
}: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const activeRef = useRef<HTMLButtonElement | null>(null);

  const groups = useMemo(
    () =>
      topics
        .map((topic) => ({
          topic,
          items: assignments.filter((a) => a.topicId === topic.id),
        }))
        .filter((g) => g.items.length > 0),
    [topics, assignments],
  );

  const activeTopicId = useMemo(
    () => assignments.find((a) => a.id === activeAssignmentId)?.topicId,
    [assignments, activeAssignmentId],
  );

  // 課題が切り替わったら所属トピックを必ず展開する。
  useEffect(() => {
    if (!activeTopicId) return;
    setCollapsed((prev) => {
      if (!prev.has(activeTopicId)) return prev;
      const next = new Set(prev);
      next.delete(activeTopicId);
      return next;
    });
  }, [activeTopicId]);

  // アクティブな課題が画面外なら見える位置までスクロール。
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeAssignmentId]);

  function toggleTopic(topicId: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }

  return (
    <nav className="assignment-sidebar" aria-label="課題リスト">
      {groups.map(({ topic, items }) => {
        const completedCount = items.reduce(
          (n, a) =>
            statusOf(bestScores.get(a.id)) === "completed" ? n + 1 : n,
          0,
        );
        const isCollapsed = collapsed.has(topic.id);
        const allDone =
          completedCount === items.length && items.length > 0;
        return (
          <section key={topic.id} className="sidebar-topic">
            <button
              type="button"
              className="sidebar-topic-header"
              onClick={() => toggleTopic(topic.id)}
              aria-expanded={!isCollapsed}
            >
              <span className="sidebar-topic-caret" aria-hidden>
                {isCollapsed ? "▸" : "▾"}
              </span>
              <span className="sidebar-topic-label">{topic.label}</span>
              <span
                className={`sidebar-topic-progress${allDone ? " is-complete" : ""}`}
                title="100点で完了とみなした件数 / 全課題数"
              >
                {completedCount}/{items.length}
              </span>
            </button>
            {!isCollapsed && (
              <ul className="sidebar-topic-list">
                {items.map((a, i) => {
                  const score = bestScores.get(a.id);
                  const status = statusOf(score);
                  const isActive = a.id === activeAssignmentId;
                  return (
                    <li key={a.id}>
                      <button
                        ref={isActive ? activeRef : null}
                        type="button"
                        className={`sidebar-item status-${status}${isActive ? " is-active" : ""}`}
                        onClick={() => onSelect(a.id)}
                        aria-current={isActive ? "true" : undefined}
                        title={
                          score != null ? `ベスト: ${score} 点` : "未着手"
                        }
                      >
                        <StatusBadge status={status} score={score} />
                        <span className="sidebar-item-num">{i + 1}.</span>
                        <span className="sidebar-item-title">{a.title}</span>
                        <span
                          className="sidebar-item-difficulty"
                          aria-label={`難易度 ${a.difficulty}`}
                        >
                          {"★".repeat(a.difficulty)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </nav>
  );
}

function StatusBadge({
  status,
  score,
}: {
  status: Status;
  score: number | undefined;
}) {
  if (status === "completed") {
    return (
      <span className="sidebar-status sidebar-status-completed" aria-label="完了">
        ✓
      </span>
    );
  }
  if (status === "partial" && score != null) {
    return (
      <span
        className="sidebar-status sidebar-status-partial"
        aria-label={`部分点 ${score}`}
      >
        {score}
      </span>
    );
  }
  return (
    <span className="sidebar-status sidebar-status-untouched" aria-hidden>
      ·
    </span>
  );
}
