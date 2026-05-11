import type { Assignment } from "../../types.js";

import { s4Ch11LinearSearch } from "./s4/01-linear-search.js";
import { s4Ch11BinarySearch } from "./s4/02-binary-search.js";
import { s4Ch11SortByLength } from "./s4/03-sort-by-length.js";
import { s4Ch11BubbleSort } from "./s4/04-bubble-sort.js";
import { s4Ch11Factorial } from "./s4/05-factorial.js";
import { s4Ch11Fibonacci } from "./s4/06-fibonacci.js";
import { s4Ch11SumNestedCapstone } from "./s4/07-sum-nested-capstone.js";

export const ch11Algorithms: Assignment[] = [
  s4Ch11LinearSearch,
  s4Ch11BinarySearch,
  s4Ch11SortByLength,
  s4Ch11BubbleSort,
  s4Ch11Factorial,
  s4Ch11Fibonacci,
  s4Ch11SumNestedCapstone,
];
