import type { Assignment } from "../../types.js";

import { arrowDouble } from "./arrow-double.js";
import { applyTwice } from "./apply-twice.js";
import { composePipe } from "./compose-pipe.js";
import { delayedGreeter } from "./delayed-greeter.js";

export const functionsArrowThis: Assignment[] = [
  arrowDouble,
  applyTwice,
  composePipe,
  delayedGreeter,
];
