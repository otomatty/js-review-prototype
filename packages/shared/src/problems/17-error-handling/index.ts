import type { Assignment } from "../../types.js";

import { safeDivide } from "./safe-divide.js";
import { tryParseJson } from "./try-parse-json.js";
import { validateAge } from "./validate-age.js";

export const errorHandling: Assignment[] = [
  safeDivide,
  tryParseJson,
  validateAge,
];
