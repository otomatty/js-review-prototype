import type { Assignment } from "../../types.js";

import { sum } from "./sum.js";
import { adults } from "./adults.js";
import { pluckNames } from "./pluck-names.js";
import { groupBy } from "./group-by.js";
import { validatePasswords } from "./validate-passwords.js";

export const arraysIteration: Assignment[] = [
  sum,
  adults,
  pluckNames,
  groupBy,
  validatePasswords,
];
