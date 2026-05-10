import type { Assignment } from "../../types.js";

import { clamp } from "./clamp.js";
import { isPositiveInteger } from "./is-positive-integer.js";
import { roundToDecimals } from "./round-to-decimals.js";
import { daysBetween } from "./days-between.js";

export const numbersMathDate: Assignment[] = [
  clamp,
  isPositiveInteger,
  roundToDecimals,
  daysBetween,
];
