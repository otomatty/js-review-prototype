/**
 * Phase 1 では既存問題を一時退避し、新スキーマだけを先に確立する。
 * 既存問題ファイルは削除せず、ここからの import を外して空配列にする。
 */

import type { Assignment, Chapter, ChapterId } from "../types.js";
import { chapters } from "../curriculum/chapters.js";

export { chapters };

export const assignments: Assignment[] = [];

export function findAssignment(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id);
}

export function findChapter(id: ChapterId): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function assignmentsByChapter(chapterId: ChapterId): Assignment[] {
  return assignments.filter((a) => a.chapterId === chapterId);
}
