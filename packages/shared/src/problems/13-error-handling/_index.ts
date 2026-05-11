import type { Assignment } from "../../types.js";

import { s3Ch13SafeParseJson } from "./s3/01-safe-parse-json.js";
import { s3Ch13DivideOrZero } from "./s3/02-divide-or-zero.js";
import { s3Ch13ValidateAge } from "./s3/03-validate-age.js";
import { s3Ch13AttemptResult } from "./s3/04-attempt-result.js";
import { s4Ch13ValidationError } from "./s4/01-validation-error.js";
import { s4Ch13ClassifyError } from "./s4/02-classify-error.js";
import { s4Ch13RetryWithFallback } from "./s4/03-retry-with-fallback.js";
import { s4Ch13CleanupWithFinally } from "./s4/04-cleanup-with-finally.js";
import { s4Ch13SafeRunnerCapstone } from "./s4/05-safe-runner-capstone.js";

export const ch13ErrorHandling: Assignment[] = [
  s3Ch13SafeParseJson,
  s3Ch13DivideOrZero,
  s3Ch13ValidateAge,
  s3Ch13AttemptResult,
  s4Ch13ValidationError,
  s4Ch13ClassifyError,
  s4Ch13RetryWithFallback,
  s4Ch13CleanupWithFinally,
  s4Ch13SafeRunnerCapstone,
];
