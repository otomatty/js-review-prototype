import type { Assignment } from "../../types.js";

import { s1Ch12LogIntermediate } from "./s1/01-log-intermediate.js";
import { s1Ch12StringVsNumber } from "./s1/02-string-vs-number.js";
import { s1Ch12TypoMethod } from "./s1/03-typo-method.js";
import { s1Ch12PrecedenceBug } from "./s1/04-precedence-bug.js";
import { s1Ch12TypoVariable } from "./s1/05-typo-variable.js";
import { s1Ch12TemplateCurly } from "./s1/06-template-curly.js";
import { s1Ch12ArrayOffByOne } from "./s1/07-array-off-by-one.js";

export const ch12Debug: Assignment[] = [
  s1Ch12LogIntermediate,
  s1Ch12StringVsNumber,
  s1Ch12TypoMethod,
  s1Ch12PrecedenceBug,
  s1Ch12TypoVariable,
  s1Ch12TemplateCurly,
  s1Ch12ArrayOffByOne,
];
