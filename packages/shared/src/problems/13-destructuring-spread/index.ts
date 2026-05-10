import type { Assignment } from "../../types.js";

import { userSummary } from "./user-summary.js";
import { swap } from "./swap.js";
import { omitKey } from "./omit-key.js";
import { withDefaults } from "./with-defaults.js";

export const destructuringSpread: Assignment[] = [
  userSummary,
  swap,
  omitKey,
  withDefaults,
];
