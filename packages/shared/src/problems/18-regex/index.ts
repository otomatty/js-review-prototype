import type { Assignment } from "../../types.js";

import { extractPhones } from "./extract-phones.js";
import { parseUrlHostPath } from "./parse-url-host-path.js";
import { maskEmails } from "./mask-emails.js";
import { normalizeText } from "./normalize-text.js";

export const regex: Assignment[] = [
  extractPhones,
  parseUrlHostPath,
  maskEmails,
  normalizeText,
];
