import type { Assignment } from "../../types.js";

import { s1Ch12LogIntermediate } from "./s1/01-log-intermediate.js";
import { s1Ch12StringVsNumber } from "./s1/02-string-vs-number.js";
import { s1Ch12TypoMethod } from "./s1/03-typo-method.js";
import { s1Ch12PrecedenceBug } from "./s1/04-precedence-bug.js";
import { s1Ch12TypoVariable } from "./s1/05-typo-variable.js";
import { s1Ch12TemplateCurly } from "./s1/06-template-curly.js";
import { s1Ch12ArrayOffByOne } from "./s1/07-array-off-by-one.js";
import { s2Ch12OffByOneFor } from "./s2/01-off-by-one-for.js";
import { s2Ch12ConditionFlipped } from "./s2/02-condition-flipped.js";
import { s2Ch12MissingReturn } from "./s2/03-missing-return.js";
import { s2Ch12UndefinedTrace } from "./s2/04-undefined-trace.js";
import { s2Ch12LooseEqBug } from "./s2/05-loose-eq-bug.js";
import { s2Ch12InfiniteLoopFix } from "./s2/06-infinite-loop-fix.js";
import { s2Ch12ElseIfOrder } from "./s2/07-else-if-order.js";
import { s2Ch12MutationBug } from "./s2/08-mutation-bug.js";
import { s3Ch12FixSumRange } from "./s3/01-fix-sum-range.js";
import { s3Ch12FixIsEmpty } from "./s3/02-fix-is-empty.js";
import { s3Ch12FixCapitalize } from "./s3/03-fix-capitalize.js";
import { s3Ch12FixAverage } from "./s3/04-fix-average.js";

export const ch12Debug: Assignment[] = [
  s1Ch12LogIntermediate,
  s1Ch12StringVsNumber,
  s1Ch12TypoMethod,
  s1Ch12PrecedenceBug,
  s1Ch12TypoVariable,
  s1Ch12TemplateCurly,
  s1Ch12ArrayOffByOne,
  s2Ch12OffByOneFor,
  s2Ch12ConditionFlipped,
  s2Ch12MissingReturn,
  s2Ch12UndefinedTrace,
  s2Ch12LooseEqBug,
  s2Ch12InfiniteLoopFix,
  s2Ch12ElseIfOrder,
  s2Ch12MutationBug,
  s3Ch12FixSumRange,
  s3Ch12FixIsEmpty,
  s3Ch12FixCapitalize,
  s3Ch12FixAverage,
];
