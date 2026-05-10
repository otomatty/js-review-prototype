import type { Assignment } from "../../types.js";

import { lastOf } from "./last-of.js";
import { appendItem } from "./append-item.js";
import { chunk } from "./chunk.js";
import { sortAsc } from "./sort-asc.js";

export const arraysBasics: Assignment[] = [
  lastOf,
  appendItem,
  chunk,
  sortAsc,
];
