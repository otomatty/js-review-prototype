import type { Assignment } from "../../types.js";

import { s3Ch09DoubleAll } from "./s3/01-double-all.js";
import { s3Ch09OnlyPositive } from "./s3/02-only-positive.js";
import { s3Ch09SumWithReduce } from "./s3/03-sum-with-reduce.js";
import { s3Ch09NamesOf } from "./s3/04-names-of.js";
import { s3Ch09Adults } from "./s3/05-adults.js";
import { s3Ch09CountTrue } from "./s3/06-count-true.js";
import { s3Ch09FindByName } from "./s3/07-find-by-name.js";
import { s3Ch09PipelineCapstone } from "./s3/08-pipeline-capstone.js";

export const ch09HigherOrder: Assignment[] = [
  s3Ch09DoubleAll,
  s3Ch09OnlyPositive,
  s3Ch09SumWithReduce,
  s3Ch09NamesOf,
  s3Ch09Adults,
  s3Ch09CountTrue,
  s3Ch09FindByName,
  s3Ch09PipelineCapstone,
];
