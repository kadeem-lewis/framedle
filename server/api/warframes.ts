import { progenitors } from "../constants/progenitors";
import { warframeSchema } from "#shared/schemas/warframe";
import type { Warframe } from "#shared/schemas/warframe";

export default defineCachedEventHandler(
  async () => {
    const warframes: (Warframe | null)[] = [];
    const data = await $fetch<Omit<Warframe, "progenitor">[]>(
      "https://api.warframestat.us/warframes?remove=patchlogs",
    );
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

    return {
      warframes: filteredWarframes,
    };
  },
  {
    maxAge: 60 * 60 * 24, // 24 hours
  },
);
