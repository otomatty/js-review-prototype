import type { Assignment } from "../../types.js";

import { promiseDoubleOrReject } from "./promise-double-or-reject.js";
import { promiseChainDouble } from "./promise-chain-double.js";
import { safeFetchWithFallback } from "./safe-fetch-with-fallback.js";
import { partitionPromises } from "./partition-promises.js";

export const asyncTopic: Assignment[] = [
  promiseDoubleOrReject,
  promiseChainDouble,
  safeFetchWithFallback,
  partitionPromises,
];
