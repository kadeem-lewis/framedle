import type { Warframe as OriginalWarframe } from "warframe-items";

export type Warframe = OriginalWarframe & {
  progenitor: string;
  category: "Warframes";
};
