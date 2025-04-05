import type { Warframe } from "#shared/schemas/warframe";
import { warframeSchema } from "#shared/schemas/warframe";
import { progenitors } from "../../constants/progenitors";
import { promises as fs } from "fs";

export default defineTask({
  meta: {
    name: "generate:warframes",
    description: "Generate the warframe data used in app",
  },
  async run() {
    const warframes: (Warframe | null)[] = [];
    const data = await $fetch<Omit<Warframe, "progenitor">[]>(
      "https://api.warframestat.us/warframes?remove=patchlogs,components,introduced",
    );
    data.forEach((item) => {
      Object.assign(item, { progenitor: progenitors[item.name!] });
      if (item.name === "Temple") {
        item.sex = "Non-binary"; // Temple's sex is missing from the API for some reason
        item.releaseDate = "2025-03-19"; // The release date is also missing
      }
      const result = warframeSchema.safeParse(item);
      if (result.success) {
        if (result.data.sex.includes("(Pluriform)"))
          result.data.sex = "Non-binary";
        warframes.push(result.data);
      } else {
        warframes.push(null);
      }
    });
    const filteredWarframes = warframes.filter((warframe) => warframe !== null);
    const tsContent = `// Auto-generated warframes data
    import type { Warframe } from "#shared/schemas/warframe";
    export const warframes: Warframe[] = ${JSON.stringify(filteredWarframes, null, 2)};
    `;

    await fs.writeFile("./shared/data/warframes.ts", tsContent);
    return {
      result: "Success",
    };
  },
});
