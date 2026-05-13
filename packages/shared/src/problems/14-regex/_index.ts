import type { Assignment } from "../../types.js";

import { s3Ch14ContainsDigit } from "./s3/01-contains-digit.js";
import { s3Ch14ExtractNumbers } from "./s3/02-extract-numbers.js";
import { s3Ch14IsEmailShape } from "./s3/03-is-email-shape.js";
import { s3Ch14MaskNumbers } from "./s3/04-mask-numbers.js";
import { s4Ch14ParseDate } from "./s4/01-parse-date.js";
import { s4Ch14IsPostalCode } from "./s4/02-is-postal-code.js";
import { s4Ch14SnakeToCamel } from "./s4/03-snake-to-camel.js";
import { s4Ch14ExtractHashtags } from "./s4/04-extract-hashtags.js";
import { s4Ch14ParseQueryStringCapstone } from "./s4/05-parse-query-string-capstone.js";
import { s5Ch14TokenizeExpression } from "./s5/01-tokenize-expression.js";
import { s5Ch14ParseLogLines } from "./s5/02-parse-log-lines.js";
import { s5Ch14ParseFrontmatterCapstone } from "./s5/03-parse-frontmatter-capstone.js";

export const ch14Regex: Assignment[] = [
  s3Ch14ContainsDigit,
  s3Ch14ExtractNumbers,
  s3Ch14IsEmailShape,
  s3Ch14MaskNumbers,
  s4Ch14ParseDate,
  s4Ch14IsPostalCode,
  s4Ch14SnakeToCamel,
  s4Ch14ExtractHashtags,
  s4Ch14ParseQueryStringCapstone,
  s5Ch14TokenizeExpression,
  s5Ch14ParseLogLines,
  s5Ch14ParseFrontmatterCapstone,
];
