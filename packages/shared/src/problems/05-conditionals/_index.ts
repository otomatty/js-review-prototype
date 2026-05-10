import type { Assignment } from "../../types.js";

import { s2Ch05IfPositive } from "./s2/01-if-positive.js";
import { s2Ch05IfElseEvenOdd } from "./s2/02-if-else-even-odd.js";
import { s2Ch05ElseIfGrade } from "./s2/03-else-if-grade.js";
import { s2Ch05AndOperator } from "./s2/04-and-operator.js";
import { s2Ch05OrOperator } from "./s2/05-or-operator.js";
import { s2Ch05NotOperator } from "./s2/06-not-operator.js";
import { s2Ch05TernaryBasic } from "./s2/07-ternary-basic.js";
import { s2Ch05StrictEqual } from "./s2/08-strict-equal.js";
import { s2Ch05NotEqual } from "./s2/09-not-equal.js";
import { s2Ch05TruthyFalsy } from "./s2/10-truthy-falsy.js";
import { s2Ch05SwitchDay } from "./s2/11-switch-day.js";
import { s2Ch05TernaryChain } from "./s2/12-ternary-chain.js";
import { s2Ch05RangeCheck } from "./s2/13-range-check.js";
import { s2Ch05DefaultFallback } from "./s2/14-default-fallback.js";
import { s2Ch05SwitchDefault } from "./s2/15-switch-default.js";

export const ch05Conditionals: Assignment[] = [
  s2Ch05IfPositive,
  s2Ch05IfElseEvenOdd,
  s2Ch05ElseIfGrade,
  s2Ch05AndOperator,
  s2Ch05OrOperator,
  s2Ch05NotOperator,
  s2Ch05TernaryBasic,
  s2Ch05StrictEqual,
  s2Ch05NotEqual,
  s2Ch05TruthyFalsy,
  s2Ch05SwitchDay,
  s2Ch05TernaryChain,
  s2Ch05RangeCheck,
  s2Ch05DefaultFallback,
  s2Ch05SwitchDefault,
];
