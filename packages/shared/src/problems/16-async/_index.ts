import type { Assignment } from "../../types.js";

import { s4Ch16MakePromise } from "./s4/01-make-promise.js";
import { s4Ch16AwaitBasic } from "./s4/02-await-basic.js";
import { s4Ch16AwaitSequence } from "./s4/03-await-sequence.js";
import { s4Ch16PromiseAll } from "./s4/04-promise-all.js";
import { s4Ch16TryCatchAsync } from "./s4/05-try-catch-async.js";
import { s4Ch16SplitResultsCapstone } from "./s4/06-split-results-capstone.js";

export const ch16Async: Assignment[] = [
  s4Ch16MakePromise,
  s4Ch16AwaitBasic,
  s4Ch16AwaitSequence,
  s4Ch16PromiseAll,
  s4Ch16TryCatchAsync,
  s4Ch16SplitResultsCapstone,
];
