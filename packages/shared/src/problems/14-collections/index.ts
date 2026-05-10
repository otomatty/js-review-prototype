import type { Assignment } from "../../types.js";

import { unique } from "./unique.js";
import { tally } from "./tally.js";
import { intersect } from "./intersect.js";

export const collections: Assignment[] = [
  unique,
  tally,
  intersect,
];
