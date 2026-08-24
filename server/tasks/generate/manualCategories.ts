import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { promises as fs } from "fs";
import type { Element } from "domhandler";

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
      signatureWeaponResponse,
      maneuversResponse,
      accoladeGlyphsResponse,
      starChartAcquisitionResponse,
    ] = await Promise.all([
      $fetch<string>("/Buff_%26_Debuff/Buffs#Healing_", {
        baseURL,
      }),
      $fetch<string>("/Deluxe_Skins", {
        baseURL,
      }),
      $fetch<string>("/Arcane_Helmet", {
        baseURL,
      }),
      $fetch<string>("/Leverian", {
        baseURL,
      }),
      $fetch<string>("/The_Circuit", {
        baseURL,
      }),
      $fetch<string>("/Protoframe", {
        baseURL,
      }),
      $fetch<string>("/Quest", {
        baseURL,
      }),
      $fetch<string>("/Signature_Weapon", {
        baseURL,
      }),
      $fetch<string>("/Maneuvers", {
        baseURL,
      }),
      $fetch<string>("/Accolade_Glyphs", {
        baseURL,
      }),
      $fetch<string>("/Star_Chart", {
        baseURL,
      }),
    ]);

    const $buffs = cheerio.load(buffsResponse);
    const $skins = cheerio.load(skinsResponse);
    const $helmets = cheerio.load(arcaneHelmetResponse);
    const $leverian = cheerio.load(leverianResponse);
    const $circuit = cheerio.load(circuitResponse);
    const $protoframe = cheerio.load(protoframeResponse);
    const $questframe = cheerio.load(questframeResponse);
    const $signatureWeapon = cheerio.load(signatureWeaponResponse);
    const $maneuvers = cheerio.load(maneuversResponse);
    const $accoladeGlyphs = cheerio.load(accoladeGlyphsResponse);
    const $starChartAcquisition = cheerio.load(starChartAcquisitionResponse);

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
        id: "invisibility:true",
        key: "invisibility",
        mode: "expand",
        $: $buffs,
        getPath: ($: CheerioAPI) =>
          $("td:contains('Invisibility')")
            .closest("tr")
            .children("td")
            .last()
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
            .find("li span:first-of-type > a > span"),
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
      {
        id: "signatureWeapon:true",
        key: "signatureWeapon",
        mode: "strict",
        $: $signatureWeapon,
        getPath: ($: CheerioAPI) =>
          $("h2#List_of_Signature_Weapons")
            .parent()
            .next("table")
            .find("tr td:first-child span > a"),
      },
      {
        id: "uniqueRolling:true",
        key: "uniqueRolling",
        mode: "expand",
        $: $maneuvers,
        getPath: ($: CheerioAPI) =>
          $("h4#Rolling")
            .parent()
            .nextAll("ul")
            .first()
            .find("li span > a > span"),
      },
      {
        id: "accoladeGlyph:true",
        key: "accoladeGlyph",
        mode: "expand",
        $: $accoladeGlyphs,
        getPath: ($: CheerioAPI) => $(".checklist").find("li span > a > span"),
      },
      {
        id: "acquisition:starChart",
        key: "acquisition",
        mode: "strict",
        $: $starChartAcquisition,
        getPath: ($: CheerioAPI) =>
          $("h2[id='Planets/Celestial_Bodies_List']")
            .parent()
            .nextAll("table")
            .first()
            .find("tr td span > a"),
        transform: (el: Element, $: CheerioAPI) => {
          const $el = $(el);

          const raw = $el.attr("title") || $el.text();

          return raw
            .replace(/\s+(Components|Component).*$/i, "")
            .replace(/[\s\u00A0\n\t]+/g, " ")
            .trim();
        },
      },
    ];

    for (const config of configs) {
      const $values = config.getPath(config.$);
      if (config.id === "acquisition:starChart")
        console.log($values.toString());

      const scrapedWarframeNames = $values
        .map((_, el) => {
          // Use custom transform logic if specified on config
          if (config.transform) {
            return config.transform(el, config.$);
          }

          // Default text extraction behavior
          return config
            .$(el)
            .text()
            .replace(/[\s\u00A0\n\t]+/g, " ")
            .trim();
        })
        .toArray();

      let finalWarframes = filterStrict(scrapedWarframeNames);

      if (config.mode === "expand") {
        finalWarframes = resolveVariants(scrapedWarframeNames);
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
    };
  },
});
