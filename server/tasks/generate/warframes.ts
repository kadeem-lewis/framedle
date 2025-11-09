import type { Warframe } from "#shared/schemas/warframe";
import { warframeSchema } from "#shared/schemas/warframe";
import { promises as fs } from "fs";
import { capitalize, pascalCaseToCamelCase } from "~~/server/utils/transform";
import type { Warframe as ConstWarframe } from "#shared/utils/warframe";

const polarityMap = {
  V: "Madurai",
  D: "Vazarin",
  Bar: "Naramon",
  Scratch: "Zenurik",
} as const;

type WarframeWikiData = {
  Warframes: {
    [key: string]: {
      auraPolarity: (typeof polarityMap)[keyof typeof polarityMap];
      introduced: string;
      playstyle: string | string[];
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
  aura: string | string[];
  releaseDate: string | null;
  isPrime: boolean;
};

export default defineTask({
  meta: {
    name: "generate:warframes",
    description: "Generate the warframe data used in app",
  },
  async run() {
    const warframes: (Warframe | null)[] = [];

    try {
      const [apiData, wikiWarframeData, wikiVersionData] = await Promise.all([
        $fetch<WarframeApiData[]>(
          "https://api.warframestat.us/warframes?remove=patchlogs,components,introduced",
        ),
        $fetch<string>(
          "https://wiki.warframe.com/w/Module:Warframes/data?action=raw",
          {
            parseResponse: (text) => text,
          },
        ),
        $fetch<string>(
          "https://wiki.warframe.com/w/Module:Version/data?action=raw",
          {
            parseResponse: (text) => text,
          },
        ),
      ]);

      const parsedWikiData = parse(wikiWarframeData) as WarframeWikiData;
      const parsedVersionData = parse(
        wikiVersionData,
      ) as WarframeWikiVersionData;

      apiData.forEach((item) => {
        if (item.type !== "Warframe" || item.productCategory !== "Suits")
          return; // filter out non-warframes

        const wikiItem = pascalCaseToCamelCase(
          parsedWikiData.Warframes[item.name],
        );
        const mergedItem = {
          ...wikiItem,
          ...item,
        };

        if (typeof mergedItem.playstyle === "string") {
          mergedItem.playstyle = mergedItem.playstyle
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }

        // At least one warframe has multiple auras
        if (Array.isArray(wikiItem.auraPolarity)) {
          mergedItem.aura = wikiItem.auraPolarity.map((polarity) =>
            ["None", "Aura", ...Object.values(polarityMap)].includes(polarity)
              ? polarity
              : polarityMap[polarity as keyof typeof polarityMap] || "None",
          );
          mergedItem.aura = mergedItem.aura.map((a) => capitalize(a));
        } else if (!Object.hasOwn(mergedItem, "aura")) {
          // numerous warframes from the api are missing the aura polarity
          mergedItem.aura = [
            "None",
            "Aura",
            ...Object.values(polarityMap),
          ].includes(mergedItem.auraPolarity)
            ? mergedItem.auraPolarity
            : polarityMap[
                mergedItem.auraPolarity as keyof typeof polarityMap
              ] || "None";
        }
        if (typeof mergedItem.aura === "string") {
          mergedItem.aura = capitalize(mergedItem.aura);
        }

        if (
          !Object.hasOwn(mergedItem, "releaseDate") &&
          mergedItem.introduced
        ) {
          mergedItem.releaseDate =
            parsedVersionData.find((version) =>
              version.Aliases.includes(mergedItem.introduced),
            )?.Date ?? null;
        }

        let variant;
        if (mergedItem.isPrime) {
          variant = "Prime";
        } else if (mergedItem.name.includes("Umbra")) {
          variant = "Umbra";
        } else {
          variant = "Standard";
        }
        Object.assign(mergedItem, {
          variant,
        });
        const result = warframeSchema.safeParse(mergedItem);
        if (result.success) {
          if (result.data.sex.includes("(Pluriform)"))
            result.data.sex = "Non-binary";
          warframes.push(result.data);
        } else {
          console.error("Error parsing warframe", item.name, result.error);
          warframes.push(null);
        }
      });
      const filteredWarframes = warframes.filter(
        (warframe) => warframe !== null,
      );
      const warframeObject = Object.fromEntries(
        filteredWarframes.map((warframe) => [warframe.name, warframe]),
      );
      const tsContent = `// Auto-generated warframes data
      export const warframes = ${JSON.stringify(warframeObject, null, 2)} as const;`;

      await fs.writeFile("./shared/data/warframes.ts", tsContent);

      const warframeNames = filteredWarframes.map((wf) => wf.name);
      const vanillaWarframes = filteredWarframes.filter(
        (wf) => wf.variant === "Standard",
      ) as unknown as ConstWarframe[];
      const abilityNames = generateAbilityNames(vanillaWarframes);
      runTask("generate:queue", {
        payload: {
          warframeNames,
          abilityNames,
        },
      }); // regenerate the queues after warframes are updated
      return {
        result: "Success",
      };
    } catch (error) {
      console.error("Error processing data:", error);
      return {
        result: "Error",
        error: error,
      };
    }
  },
});
