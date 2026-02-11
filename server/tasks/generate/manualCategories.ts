import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { promises as fs } from "fs";

export default defineTask({
  meta: {
    name: "generate:manual-categories",
    description: "Generate categories from scraped wiki data",
  },
  async run() {
    const baseURL = "https://wiki.warframe.com/w";

    const categories: Record<string, unknown>[] = [];

    const [
      buffsResponse,
      skinsResponse,
      arcaneHelmetResponse,
      leverianResponse,
      circuitResponse,
      protoframeResponse,
      questframeResponse,
    ] = await Promise.all([
      $fetch<string>("/Buff_%26_Debuff/Buffs#Healing_", {
        baseURL,
        parseResponse: (text) => text,
      }),
      $fetch<string>("/Deluxe_Skins", {
        baseURL,
        parseResponse: (text) => text,
      }),
      $fetch<string>("/Arcane_Helmet", {
        baseURL,
        parseResponse: (text) => text,
      }),
      $fetch<string>("/Leverian", {
        baseURL,
        parseResponse: (text) => text,
      }),
      $fetch<string>("/The_Circuit", {
        baseURL,
        parseResponse: (text) => text,
      }),
      $fetch<string>("/Protoframe", {
        baseURL,
        parseResponse: (text) => text,
      }),
      $fetch<string>("/Quest", {
        baseURL,
        parseResponse: (text) => text,
      }),
    ]);

    const $buffs = cheerio.load(buffsResponse);
    const $skins = cheerio.load(skinsResponse);
    const $helmets = cheerio.load(arcaneHelmetResponse);
    const $leverian = cheerio.load(leverianResponse);
    const $circuit = cheerio.load(circuitResponse);
    const $protoframe = cheerio.load(protoframeResponse);
    const $questframe = cheerio.load(questframeResponse);

    const configs = [
      {
        id: "energyRestore:true",
        key: "energyRestore",
        mode: "expand",
        $: $buffs,
        getPath: ($: CheerioAPI) => {
          const $energyCell = $("a[title='Energy Restoration']")
            .closest("tr")
            .children("td")
            .last();
          const $exclusionMarker = $energyCell
            .children("dl")
            .filter((_, el) => $buffs(el).text().includes("Indirectly"));

          const $validLists =
            $exclusionMarker.length > 0
              ? $exclusionMarker.prevAll("ul")
              : $energyCell.children("ul");

          return $validLists.children("li").children("span").children("a");
        },
      },
      {
        id: "healthRestore:true",
        key: "healthRestore",
        mode: "expand",
        $: $buffs,
        getPath: ($: CheerioAPI) => {
          const $healthCell = $("a[title='Healing']")
            .closest("tr")
            .children("td")
            .last();
          const $exclusionMarker = $healthCell
            .children("dl")
            .filter((_, el) => $buffs(el).text().includes("Indirectly"));

          const $validLists =
            $exclusionMarker.length > 0
              ? $exclusionMarker.prevAll("ul")
              : $healthCell.children("ul");

          return $validLists.children("li").children("span").children("a");
        },
      },
      {
        id: "shieldRestore:true",
        key: "shieldRestore",
        mode: "expand",
        $: $buffs,
        getPath: ($: CheerioAPI) =>
          $("td:contains('Shield Restoration')")
            .closest("tr")
            .children("td")
            .last()
            .children("ul")
            .children("li")
            .children("span")
            .children("a"),
      },
      {
        id: "lootReroll:true",
        key: "lootReroll",
        mode: "expand",
        $: $buffs,
        getPath: ($: CheerioAPI) =>
          $("a[title='Drop Table']")
            .closest("td")
            .children("ul")
            .children("li")
            .children("span")
            .children("a"),
      },
      {
        id: "deluxeSkin:true",
        key: "deluxeSkin",
        mode: "expand",
        $: $skins,
        getPath: ($: CheerioAPI) =>
          $("a[title='Warframe']")
            .closest("tr")
            .children("td")
            .children("span")
            .children("a"),
      },
      {
        id: "heirloomSkin:true",
        key: "heirloomSkin",
        mode: "expand",
        $: $skins,
        getPath: ($: CheerioAPI) =>
          $("a[title='Heirloom Skins']")
            .closest("tr")
            .children("td")
            .children("span")
            .children("a"),
      },
      {
        id: "arcaneHelmet:true",
        key: "arcaneHelmet",
        mode: "expand",
        $: $helmets,
        getPath: ($: CheerioAPI) =>
          $("tbody")
            .children("tr")
            .children("td")
            .children("span")
            .children("a"),
      },
      {
        id: "leverian:true",
        key: "leverian",
        mode: "strict",
        $: $leverian,
        getPath: ($: CheerioAPI) =>
          $("h2#Leverian_Galleries")
            .parent()
            .nextAll("div.mw-heading3")
            .children("h3")
            .children("a"),
      },
      {
        id: "circuit:true",
        key: "circuit",
        mode: "strict",
        $: $circuit,
        getPath: ($: CheerioAPI) =>
          $("caption:contains('Normal Circuit Warframe Rotation')")
            .next("tbody")
            .children("tr")
            .children("td")
            .children("span")
            .children("a"),
      },
      {
        id: "protoframe:true",
        key: "protoframe",
        mode: "strict",
        $: $protoframe,
        getPath: ($: CheerioAPI) =>
          $("h2#Known_Protoframes")
            .parent()
            .nextAll("ul")
            .children("li")
            .children("span")
            .children("a"),
      },
      {
        id: "questframe:true",
        key: "questframe",
        mode: "strict",
        $: $questframe,
        getPath: ($: CheerioAPI) =>
          $("td:contains('Warframe Unlock Quests')")
            .parent()
            .children("td")
            .children("span")
            .children("a"),
      },
    ];

    for (const config of configs) {
      const $values = config.getPath(config.$);

      const scrapedWarframeNames = $values
        .map((_, el) =>
          config
            .$(el)
            .text()
            .replace(/[\s\u00A0\n\t]+/g, " ")
            .trim(),
        )
        .toArray();

      let finalWarframes = [];

      if (config.mode === "expand") {
        finalWarframes = resolveVariants(scrapedWarframeNames);
      } else {
        finalWarframes = filterStrict(scrapedWarframeNames);
      }

      categories.push({
        id: config.id,
        key: config.key,
        lastUsed: null,
        warframes: finalWarframes,
      });
    }
    console.log(`Generated ${categories.length} categories.`);

    const categoriesContent = `// Auto-generated manual grid categories
    export const manualCategories = ${JSON.stringify(categories, null, 2)} as const;`;
    await fs.writeFile("./server/data/manualCategories.ts", categoriesContent);

    return {
      result: "success",
      data: categories,
    };
  },
});
