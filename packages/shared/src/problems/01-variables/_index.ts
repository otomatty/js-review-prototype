import type { Assignment } from "../../types.js";

import { s1Ch01ConstString } from "./s1/01-const-string.js";
import { s1Ch01ConstNumber } from "./s1/02-const-number.js";
import { s1Ch01LetReassign } from "./s1/03-let-reassign.js";
import { s1Ch01LetVsConst } from "./s1/04-let-vs-const.js";
import { s1Ch01NamingCamelCase } from "./s1/05-naming-camelcase.js";
import { s1Ch01PrintVariable } from "./s1/06-print-variable.js";
import { s1Ch01MultipleVars } from "./s1/07-multiple-vars.js";
import { s1Ch01StoreCalcResult } from "./s1/08-store-calc-result.js";
import { s1Ch01ConcatViaVars } from "./s1/09-concat-via-vars.js";
import { s1Ch01CopyValue } from "./s1/10-copy-value.js";
import { s1Ch01TemplateLiteralBasic } from "./s1/11-template-literal-basic.js";
import { s1Ch01ConstArray } from "./s1/12-const-array.js";

export const ch01Variables: Assignment[] = [
  s1Ch01ConstString,
  s1Ch01ConstNumber,
  s1Ch01LetReassign,
  s1Ch01LetVsConst,
  s1Ch01NamingCamelCase,
  s1Ch01PrintVariable,
  s1Ch01MultipleVars,
  s1Ch01StoreCalcResult,
  s1Ch01ConcatViaVars,
  s1Ch01CopyValue,
  s1Ch01TemplateLiteralBasic,
  s1Ch01ConstArray,
];
