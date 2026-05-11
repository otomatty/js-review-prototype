import type { Assignment } from "../../types.js";

import { s3Ch08GetName } from "./s3/01-get-name.js";
import { s3Ch08WithProperty } from "./s3/02-with-property.js";
import { s3Ch08CountProperties } from "./s3/03-count-properties.js";
import { s3Ch08SumValues } from "./s3/04-sum-values.js";
import { s3Ch08MergeObjects } from "./s3/05-merge-objects.js";
import { s3Ch08HasProperty } from "./s3/06-has-property.js";
import { s3Ch08PickFields } from "./s3/07-pick-fields.js";
import { s3Ch08GroupByCapstone } from "./s3/08-group-by-capstone.js";
import { s4Ch08SumByField } from "./s4/01-sum-by-field.js";
import { s4Ch08FindMaxBy } from "./s4/02-find-max-by.js";
import { s4Ch08AverageByField } from "./s4/03-average-by-field.js";
import { s4Ch08FindLowStock } from "./s4/04-find-low-stock.js";
import { s4Ch08SummarizeByCategoryCapstone } from "./s4/05-summarize-by-category-capstone.js";

export const ch08Objects: Assignment[] = [
  s3Ch08GetName,
  s3Ch08WithProperty,
  s3Ch08CountProperties,
  s3Ch08SumValues,
  s3Ch08MergeObjects,
  s3Ch08HasProperty,
  s3Ch08PickFields,
  s3Ch08GroupByCapstone,
  s4Ch08SumByField,
  s4Ch08FindMaxBy,
  s4Ch08AverageByField,
  s4Ch08FindLowStock,
  s4Ch08SummarizeByCategoryCapstone,
];
