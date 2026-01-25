import { warframeNames } from "#shared/utils/warframe";
import * as cheerio from "cheerio";

export default defineTask({
  meta: {
    name: "generate:manual-categories",
    description: "Generate categories from scraped wiki data",
  },
  async run() {
    const baseURL = "https://wiki.warframe.com/w";

    const categories: Record<string, unknown>[] = [];

    const [buffsResponse, skinsResponse, arcaneHelmetResponse] =
      await Promise.all([
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
      ]);

    const $ = cheerio.load(buffsResponse);
    /*================================================
      Extract Warframes that restore energy
    ====================================================*/
    const $energyRow = $("a[title='Energy Restoration']").closest("tr");
    const $energyCell = $energyRow.children("td").last();

    const $exclusionMarker = $energyCell
      .children("dl")
      .filter((_, el) => $(el).text().includes("Indirectly"));

    const $validLists =
      $exclusionMarker.length > 0
        ? $exclusionMarker.prevAll("ul")
        : $energyCell.children("ul");

    const $values = $validLists.children("li").children("span").children("a");

    const validWarframeNames = $values
      .filter((_, el) => {
        const name = $(el).text().trim();
        return warframeNames.some(
          (wf) => wf.toLowerCase() === name.toLowerCase(),
        );
      })
      .map((_, el) => $(el).text().trim())
      .toArray();

    const validWarframesAndVariants = new Set<string>();

    warframeNames.forEach((wf) => {
      const warframeLine = wf.split(" ")[0].toLowerCase();
      if (
        validWarframeNames.some(
          (wfName) => wfName.toLowerCase() === warframeLine,
        )
      ) {
        validWarframesAndVariants.add(wf);
      }
    });

    categories.push({
      id: "energyRestore:true",
      key: "energyRestore",
      type: "boolean",
      lastUsed: null,
      warframes: Array.from(validWarframesAndVariants),
    });

    /*================================================
      Extract Warframes that restore health
    ====================================================*/
    const $healthRow = $("a[title='Healing']").closest("tr");
    const $healthCell = $healthRow.children("td").last();

    const $healthExclusionMarker = $healthCell
      .children("dl")
      .filter((_, el) => $(el).text().includes("Indirectly"));

    const $healthValidLists =
      $healthExclusionMarker.length > 0
        ? $healthExclusionMarker.prevAll("ul")
        : $healthCell.children("ul");

    const $healthValues = $healthValidLists
      .children("li")
      .children("span")
      .children("a");

    const healthRestoringWarframeNames = $healthValues
      .filter((_, el) => {
        const name = $(el).text().trim();
        return warframeNames.some(
          (wf) => wf.toLowerCase() === name.toLowerCase(),
        );
      })
      .map((_, el) => $(el).text().trim())
      .toArray();

    const healthRestoringWarframesAndVariants = new Set<string>();

    warframeNames.forEach((wf) => {
      const warframeLine = wf.split(" ")[0].toLowerCase();
      if (
        healthRestoringWarframeNames.some(
          (wfName) => wfName.toLowerCase() === warframeLine,
        )
      ) {
        healthRestoringWarframesAndVariants.add(wf);
      }
    });

    categories.push({
      id: "healthRestore:true",
      key: "healthRestore",
      type: "boolean",
      lastUsed: null,
      warframes: Array.from(healthRestoringWarframesAndVariants),
    });

    /*================================================
      Shield Restoring Warframes
    ====================================================*/
    const $shieldRow = $("td:contains('Shield Restoration')").closest("tr");
    const $shieldCell = $shieldRow.children("td").last();

    const $shieldExclusionMarker = $shieldCell
      .children("dl")
      .filter((_, el) => $(el).text().includes("Indirectly"));

    const $shieldValidLists =
      $shieldExclusionMarker.length > 0
        ? $shieldExclusionMarker.prevAll("ul")
        : $shieldCell.children("ul");

    const $shieldValues = $shieldValidLists
      .children("li")
      .children("span")
      .children("a");

    const shieldRestoringWarframeNames = $shieldValues
      .filter((_, el) => {
        const name = $(el).text().trim();
        return warframeNames.some(
          (wf) => wf.toLowerCase() === name.toLowerCase(),
        );
      })
      .map((_, el) => $(el).text().trim())
      .toArray();

    const shieldRestoringWarframesAndVariants = new Set<string>();

    warframeNames.forEach((wf) => {
      const warframeLine = wf.split(" ")[0].toLowerCase();
      if (
        shieldRestoringWarframeNames.some(
          (wfName) => wfName.toLowerCase() === warframeLine,
        )
      ) {
        shieldRestoringWarframesAndVariants.add(wf);
      }
    });

    categories.push({
      id: "shieldRestore:true",
      key: "shieldRestore",
      type: "boolean",
      lastUsed: null,
      warframes: Array.from(shieldRestoringWarframesAndVariants),
    });

    /*================================================
      Loot Rerolling Warframes
    ====================================================*/
    const $lootCell = $("a[title='Drop Table']").closest("td");

    console.log($lootCell.html());

    const $lootValues = $lootCell
      .children("ul")
      .children("li")
      .children("span")
      .children("a");

    console.log($lootValues.length);

    const lootRerollingWarframeNames = $lootValues
      .filter((_, el) => {
        const name = $(el).text().trim();
        return warframeNames.some(
          (wf) => wf.toLowerCase() === name.toLowerCase(),
        );
      })
      .map((_, el) => $(el).text().trim())
      .toArray();

    const lootRerollingWarframesAndVariants = new Set<string>();

    warframeNames.forEach((wf) => {
      const warframeLine = wf.split(" ")[0].toLowerCase();
      if (
        lootRerollingWarframeNames.some(
          (wfName) => wfName.toLowerCase() === warframeLine,
        )
      ) {
        lootRerollingWarframesAndVariants.add(wf);
      }
    });

    categories.push({
      id: "lootReroll:true",
      key: "lootReroll",
      type: "boolean",
      lastUsed: null,
      warframes: Array.from(lootRerollingWarframesAndVariants),
    });

    /*================================================
      Deluxe Skins
    ====================================================*/
    const $$ = cheerio.load(skinsResponse);

    const $deluxeSkinsCell = $$("a[title='Warframe']")
      .closest("tr")
      .children("td");

    const $deluxeSkinValues = $deluxeSkinsCell.children("span").children("a");

    const deluxeSkinWarframeNames = $deluxeSkinValues
      .filter((_, el) => {
        const name = $$(el).text().trim();
        return warframeNames.some(
          (wf) => wf.toLowerCase() === name.toLowerCase(),
        );
      })
      .map((_, el) => $$(el).text().trim())
      .toArray();

    const deluxeSkinWarframesAndVariants = new Set<string>();

    warframeNames.forEach((wf) => {
      const warframeLine = wf.split(" ")[0].toLowerCase();
      if (
        deluxeSkinWarframeNames.some(
          (wfName) => wfName.toLowerCase() === warframeLine,
        )
      ) {
        deluxeSkinWarframesAndVariants.add(wf);
      }
    });

    categories.push({
      id: "deluxeSkin:true",
      key: "deluxeSkin",
      type: "boolean",
      lastUsed: null,
      warframes: Array.from(deluxeSkinWarframesAndVariants),
    });

    /*================================================
      Hierloom Skin Warframes
    ====================================================*/

    const $heirloomSkinsCell = $$("a[title='Heirloom Skins']")
      .closest("tr")
      .children("td");

    const $heirloomSkinValues = $heirloomSkinsCell
      .children("span")
      .children("a");

    const heirloomSkinWarframeNames = $heirloomSkinValues
      .filter((_, el) => {
        const name = $$(el).text().trim();
        return warframeNames.some(
          (wf) => wf.toLowerCase() === name.toLowerCase(),
        );
      })
      .map((_, el) => $$(el).text().trim())
      .toArray();

    const heirloomSkinWarframesAndVariants = new Set<string>();

    warframeNames.forEach((wf) => {
      const warframeLine = wf.split(" ")[0].toLowerCase();
      if (
        heirloomSkinWarframeNames.some(
          (wfName) => wfName.toLowerCase() === warframeLine,
        )
      ) {
        heirloomSkinWarframesAndVariants.add(wf);
      }
    });

    categories.push({
      id: "heirloomSkin:true",
      key: "heirloomSkin",
      type: "boolean",
      lastUsed: null,
      warframes: Array.from(heirloomSkinWarframesAndVariants),
    });

    /*================================================
      Arcane Helmet Warframes
    ====================================================*/
    const $$$ = cheerio.load(arcaneHelmetResponse);

    const $arcaneHelmetValues = $$$("tbody")
      .children("tr")
      .children("td")
      .children("span")
      .children("a");

    const arcaneHelmetWarframeNames = $arcaneHelmetValues
      .filter((_, el) => {
        const name = $$$(el).text().trim();
        return warframeNames.some(
          (wf) => wf.toLowerCase() === name.toLowerCase(),
        );
      })
      .map((_, el) => $$$(el).text().trim())
      .toArray();

    const arcaneHelmetWarframesAndVariants = new Set<string>();

    warframeNames.forEach((wf) => {
      const warframeLine = wf.split(" ")[0].toLowerCase();
      if (
        arcaneHelmetWarframeNames.some(
          (wfName) => wfName.toLowerCase() === warframeLine,
        )
      ) {
        arcaneHelmetWarframesAndVariants.add(wf);
      }
    });

    categories.push({
      id: "arcaneHelmet:true",
      key: "arcaneHelmet",
      type: "boolean",
      lastUsed: null,
      warframes: Array.from(arcaneHelmetWarframesAndVariants),
    });

    console.log(categories);

    return {
      result: "success",
      data: categories,
    };
  },
});
