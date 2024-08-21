import Items from "warframe-items";
import { progenitors } from "../constants/progenitors";
import { warframeSchema } from "~~/schemas/warframe";
import type { Warframe } from "~~/schemas/warframe";

export default defineEventHandler(() => {
  const warframes: (Warframe | null)[] = [];
  const data = new Items({ category: ["Warframes"] });
  data.forEach((item) => {
    Object.assign(item, { progenitor: progenitors[item.name!] });
    const result = warframeSchema.safeParse(item);
    if (result.success) {
      warframes.push(result.data);
    } else {
      warframes.push(null);
    }
  });
  const filteredWarframes = warframes.filter((warframe) => warframe !== null);
  console.log(filteredWarframes);

  return {
    warframes: filteredWarframes,
  };
});
