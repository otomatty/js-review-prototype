import type { Assignment } from "../../types.js";

import { returnHello } from "./return-hello.js";
import { favoriteNumber } from "./favorite-number.js";
import { echo } from "./echo.js";
import { addTwo } from "./add-two.js";
import { double } from "./double.js";

export const firstFunction: Assignment[] = [
  returnHello,
  favoriteNumber,
  echo,
  addTwo,
  double,
];
