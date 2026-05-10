import type { Assignment } from "../../types.js";

import { s1Ch02Add } from "./s1/01-add.js";
import { s1Ch02Subtract } from "./s1/02-subtract.js";
import { s1Ch02Multiply } from "./s1/03-multiply.js";
import { s1Ch02Divide } from "./s1/04-divide.js";
import { s1Ch02Modulo } from "./s1/05-modulo.js";
import { s1Ch02Exponent } from "./s1/06-exponent.js";
import { s1Ch02Precedence } from "./s1/07-precedence.js";
import { s1Ch02MathFloor } from "./s1/08-math-floor.js";
import { s1Ch02MathRound } from "./s1/09-math-round.js";
import { s1Ch02MathAbs } from "./s1/10-math-abs.js";
import { s1Ch02MathMax } from "./s1/11-math-max.js";
import { s1Ch02CompoundAssign } from "./s1/12-compound-assign.js";
import { s1Ch02BmiCapstone } from "./s1/13-bmi-capstone.js";

export const ch02Numbers: Assignment[] = [
  s1Ch02Add,
  s1Ch02Subtract,
  s1Ch02Multiply,
  s1Ch02Divide,
  s1Ch02Modulo,
  s1Ch02Exponent,
  s1Ch02Precedence,
  s1Ch02MathFloor,
  s1Ch02MathRound,
  s1Ch02MathAbs,
  s1Ch02MathMax,
  s1Ch02CompoundAssign,
  s1Ch02BmiCapstone,
];
