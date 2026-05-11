import type { Assignment } from "../../types.js";

import { s3Ch14ContainsDigit } from "./s3/01-contains-digit.js";
import { s3Ch14ExtractNumbers } from "./s3/02-extract-numbers.js";
import { s3Ch14IsEmailShape } from "./s3/03-is-email-shape.js";
import { s3Ch14MaskNumbers } from "./s3/04-mask-numbers.js";

export const ch14Regex: Assignment[] = [
  s3Ch14ContainsDigit,
  s3Ch14ExtractNumbers,
  s3Ch14IsEmailShape,
  s3Ch14MaskNumbers,
];
