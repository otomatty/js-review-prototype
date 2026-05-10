import type { Assignment } from "../../types.js";

import { varLeaks } from "./var-leaks.js";
import { maxOf } from "./max-of.js";
import { digitCount } from "./digit-count.js";
import { firstNegativeIndex } from "./first-negative-index.js";
import { findPairsSummingTo } from "./find-pairs-summing-to.js";

export const loops: Assignment[] = [
  varLeaks,
  maxOf,
  digitCount,
  firstNegativeIndex,
  findPairsSummingTo,
];
