import type { Warframe } from "#shared/schemas/warframe";
import { warframeSchema } from "#shared/schemas/warframe";
import { promises as fs } from "fs";
import { transformKeys, capitalize } from "~~/server/utils/transform";

type WarframeWikiData = {
  Warframes: {
    [key: string]: {
      aurapolarity: string;
      introduced: string;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
};

type WarframeWikiVersionData = {
  Aliases: string[];
  Date: string;
  [key: string]: unknown;
}[];

type WarframeApiData = {
  name: string;
  type: string;
  productCategory: string;
  aura: string;
  releaseDate: string | null;
  isPrime: boolean;
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

    const [wikiWarframeData, apiData, wikiVersionData] = await Promise.all([
      $fetch<string>(
        "https://wiki.warframe.com/w/Module:Warframes/data?action=raw",
        {
          parseResponse: (text) => text,
        },
      ),
      $fetch<WarframeApiData[]>(
        "https://api.warframestat.us/warframes?remove=patchlogs,components,introduced",
      ),

      $fetch<string>(
        "https://wiki.warframe.com/w/Module:Version/data?action=raw",
        {
          parseResponse: (text) => text,
        },
      ),
    ]);

    const parsedWikiData = parse(wikiWarframeData) as WarframeWikiData;
    const parsedVersionData = parse(wikiVersionData) as WarframeWikiVersionData;

    apiData.forEach((item) => {
      if (item.type !== "Warframe" || item.productCategory !== "Suits") return; // filter out non-warframes

      const wikiItem = transformKeys(parsedWikiData.Warframes[item.name]);
      item = {
        ...wikiItem,
        ...item,
      } as WarframeApiData & WarframeWikiData["Warframes"][string];

      // numerous warframes from the api are missing the aura polarity
      if (!Object.hasOwn(item, "aura")) {
        // I don't like that I made the key lowercase completely
        item.aura = ["None", "Aura", ...Object.values(polarityMap)].includes(
          item.aurapolarity,
        )
          ? item.aurapolarity
          : polarityMap[item.aurapolarity] || "None";
      }
      item.aura = capitalize(item.aura);

      if (!Object.hasOwn(item, "releaseDate")) {
        item.releaseDate =
          parsedVersionData.find((version) =>
            version.Aliases.includes(item.introduced),
          )?.Date ?? null;
      }

      let variant;
      if (item.isPrime) {
        variant = "Prime";
      } else if (item.name.includes("Umbra")) {
        variant = "Umbra";
      } else {
        variant = "Standard";
      }
      Object.assign(item, {
        variant,
      });
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
