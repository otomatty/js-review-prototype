import type { Assignment } from "../../types.js";

import { makeCounter } from "./make-counter.js";
import { memoize } from "./memoize.js";
import { makeVault } from "./make-vault.js";

export const scopeClosure: Assignment[] = [
  makeCounter,
  memoize,
  makeVault,
];
