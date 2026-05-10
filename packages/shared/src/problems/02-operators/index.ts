import type { Assignment } from "../../types.js";

import { signOf } from "./sign-of.js";
import { defaultPort } from "./default-port.js";
import { deepName } from "./deep-name.js";
import { guardMessage } from "./guard-message.js";

export const operators: Assignment[] = [
  signOf,
  defaultPort,
  deepName,
  guardMessage,
];
