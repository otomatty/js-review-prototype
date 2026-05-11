import type { Assignment } from "../../types.js";

import { s3Ch13SafeParseJson } from "./s3/01-safe-parse-json.js";
import { s3Ch13DivideOrZero } from "./s3/02-divide-or-zero.js";
import { s3Ch13ValidateAge } from "./s3/03-validate-age.js";
import { s3Ch13AttemptResult } from "./s3/04-attempt-result.js";

export const ch13ErrorHandling: Assignment[] = [
  s3Ch13SafeParseJson,
  s3Ch13DivideOrZero,
  s3Ch13ValidateAge,
  s3Ch13AttemptResult,
];
