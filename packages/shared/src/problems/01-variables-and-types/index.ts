import type { Assignment } from "../../types.js";

import { sumTwo } from "./sum-two.js";
import { circleArea } from "./circle-area.js";
import { celsiusToFahrenheit } from "./celsius-to-fahrenheit.js";
import { typeNameOf } from "./type-name-of.js";
import { isTypeofNullObject } from "./is-typeof-null-object.js";
import { stringToNumber } from "./string-to-number.js";
import { hexToDecimal } from "./hex-to-decimal.js";
import { templateGreeting } from "./template-greeting.js";

export const variablesAndTypes: Assignment[] = [
  sumTwo,
  circleArea,
  celsiusToFahrenheit,
  typeNameOf,
  isTypeofNullObject,
  stringToNumber,
  hexToDecimal,
  templateGreeting,
];
