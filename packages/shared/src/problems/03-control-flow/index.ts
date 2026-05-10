import type { Assignment } from "../../types.js";

import { describeType } from "./describe-type.js";
import { earlyReturnDiscount } from "./early-return-discount.js";
import { weekdayJp } from "./weekday-jp.js";
import { isBlank } from "./is-blank.js";
import { bmiCategory } from "./bmi-category.js";

export const controlFlow: Assignment[] = [
  describeType,
  earlyReturnDiscount,
  weekdayJp,
  isBlank,
  bmiCategory,
];
