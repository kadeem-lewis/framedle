import type { Warframe } from "#shared/schemas/warframe";
import { warframeSchema } from "#shared/schemas/warframe";
import { promises as fs } from "fs";
import { transformKeys, capitalize } from "~~/server/utils/transform";

type WarframeWikiData = {
  Warframes: Record<string, Record<string, unknown>>;
  [key: string]: unknown;
};

const polarityMap = {
  V: "Madurai",
  D: "Vazarin",
  Bar: "Naramon",
  Scratch: "Zenurik",
};

export default defineTask({
  meta: {
    name: "generate:warframes",
    description: "Generate the warframe data used in app",
  },
  async run() {
    const warframes: (Warframe | null)[] = [];

    const [wikiData, apiData] = await Promise.all([
      $fetch<WarframeWikiData>(
        "https://wiki.warframe.com/w/Module:Warframes/data?action=raw",
      ),
      $fetch<Omit<Warframe, "progenitor">[]>(
        "https://api.warframestat.us/warframes?remove=patchlogs,components,introduced",
      ),
    ]);

    const parsedWikiData = parse(wikiData);

    apiData.forEach((item) => {
      if (item.type !== "Warframe" || item.productCategory !== "Suits") return; // filter out non-warframes

      let wikiItem;
      if (item.name in parsedWikiData.Warframes) {
        wikiItem = transformKeys(parsedWikiData.Warframes[item.name]);
        item = {
          ...wikiItem,
          ...item,
        };
      }

      // numerous warframes from the api are missing the aura polarity
      if (!("aura" in item)) {
        // I don't like that I made the key lowercase completely
        item.aura = ["None", "Aura", ...Object.values(polarityMap)].includes(
          item.aurapolarity,
        )
          ? item.aurapolarity
          : polarityMap[item.aurapolarity] || "None";
      }
      item.aura = capitalize(item.aura);
      if (item.name === "Temple") {
        item.sex = "Non-binary"; // Temple's sex is missing from the API for some reason
        item.releaseDate = "2025-03-19"; // The release date is also missing
      }
      if (item.name === "Voruna") {
        item.sex = "Female";
        item.releaseDate = "2022-11-30";
      }
      if (item.name === "Dante") {
        item.sex = "Male";
        item.releaseDate = "2024-03-27";
      }
      if (item.name === "Dagath") {
        item.sex = "Female";
        item.releaseDate = "2023-10-18";
      }
      if (item.name === "Harrow Prime") {
        item.sex = "Male";
        item.releaseDate = "2021-12-15";
      }
      if (item.name === "Hildryn Prime") {
        item.sex = "Female";
        item.releaseDate = "2023-03-15";
      }
      if (item.name === "Qorvex") {
        item.sex = "Male";
        item.releaseDate = "2023-12-13";
      }

      if (item.isPrime) {
        item.variant = "Prime";
      } else if (item.name.includes("Umbra")) {
        item.variant = "Umbra";
      } else {
        item.variant = "Standard";
      }
      const result = warframeSchema.safeParse(item);
      if (result.success) {
        if (result.data.sex.includes("(Pluriform)"))
          result.data.sex = "Non-binary";
        warframes.push(result.data);
      } else {
        console.error("Error parsing warframe", item.name, result.error);
        warframes.push(null);
      }
    });
    const filteredWarframes = warframes.filter((warframe) => warframe !== null);
    const warframeObject = Object.fromEntries(
      filteredWarframes.map((warframe) => [warframe.name, warframe]),
    );
    const tsContent = `// Auto-generated warframes data
    export const warframes = ${JSON.stringify(warframeObject, null, 2)} as const;`;

    await fs.writeFile("./shared/data/warframes2.ts", tsContent);
    return {
      result: "Success",
    };
  },
});
