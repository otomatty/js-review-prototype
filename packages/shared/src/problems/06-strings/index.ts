import type { Assignment } from "../../types.js";

import { normalizeName } from "./normalize-name.js";
import { csvTitlecase } from "./csv-titlecase.js";
import { isPalindrome } from "./is-palindrome.js";
import { formatYyyyMmDd } from "./format-yyyy-mm-dd.js";

export const strings: Assignment[] = [
  normalizeName,
  csvTitlecase,
  isPalindrome,
  formatYyyyMmDd,
];
