import type { Assignment } from "../../types.js";

import { makeRecord } from "./make-record.js";
import { countChars } from "./countChars.js";
import { mapValues } from "./map-values.js";
import { deepSet } from "./deep-set.js";

export const objectsBasics: Assignment[] = [
  makeRecord,
  countChars,
  mapValues,
  deepSet,
];
