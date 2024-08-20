import Items from "warframe-items";
import { progenitors } from "../constants/progenitors";
import type { Warframe } from "~~/types/warframe";

export default defineEventHandler(() => {
  const warframes = new Items({ category: ["Warframes"] })
    .filter((item) => item.category === "Warframes")
    .map((item) => ({
      ...item,
      progenitor: progenitors[item.name!],
    })) as Warframe[];
  return {
    warframes,
  };
});
