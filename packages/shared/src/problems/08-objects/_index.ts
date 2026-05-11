import type { Assignment } from "../../types.js";

import { s3Ch08GetName } from "./s3/01-get-name.js";
import { s3Ch08WithProperty } from "./s3/02-with-property.js";
import { s3Ch08CountProperties } from "./s3/03-count-properties.js";
import { s3Ch08SumValues } from "./s3/04-sum-values.js";
import { s3Ch08MergeObjects } from "./s3/05-merge-objects.js";
import { s3Ch08HasProperty } from "./s3/06-has-property.js";
import { s3Ch08PickFields } from "./s3/07-pick-fields.js";
import { s3Ch08GroupByCapstone } from "./s3/08-group-by-capstone.js";

export const ch08Objects: Assignment[] = [
  s3Ch08GetName,
  s3Ch08WithProperty,
  s3Ch08CountProperties,
  s3Ch08SumValues,
  s3Ch08MergeObjects,
  s3Ch08HasProperty,
  s3Ch08PickFields,
  s3Ch08GroupByCapstone,
];
