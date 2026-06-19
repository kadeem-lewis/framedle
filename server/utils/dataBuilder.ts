import { promises as fs } from "fs";
import { warframeSchema, builtAbilitySchema } from "#shared/schemas/warframe";
import type {
  polarities,
  WarframeShape,
  BuiltAbilityShape,
} from "#shared/schemas/warframe";

type WarframeWikiVersionData = {
  Aliases: string[];
  Name: string;
  Date: string;
  [key: string]: unknown;
}[];

type WarframeWikiData = {
  Warframes: {
    [key: string]: {
      name: string;
      abilities: string[];
      armor: number;
      conclave: boolean;
      health: number;
      sprint: number;
      shield: number;
      sex: string;
      auraPolarity: (typeof polarities)[keyof typeof polarities];
      introduced: string;
      vaulted?: boolean;
      playstyle: string[];
      progenitor: string;
      energy: number;
      image: string;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
};

export async function fetchWarframeData() {
  const [wikiWarframeData, wikiVersionData] = await Promise.all([
    $fetch<string>(
      "https://wiki.warframe.com/w/Module:Warframes/data?action=raw",
    ),
    $fetch<string>(
      "https://wiki.warframe.com/w/Module:Version/data?action=raw",
    ),
  ]);

  return {
    wikiWarframeData: parse(wikiWarframeData) as WarframeWikiData,
    wikiVersionData: parse(wikiVersionData) as WarframeWikiVersionData,
  };
}

export function buildWarframeData(
  data: Awaited<ReturnType<typeof fetchWarframeData>>,
) {
  const { wikiWarframeData, wikiVersionData } = data;

  const initialWarframes = wikiWarframeData.Warframes;

  const warframes = new Map<string, WarframeShape>();

  for (const [key, value] of Object.entries(initialWarframes)) {
    if (value._IgnoreEntry) continue;

    const formattedData = pascalCaseToCamelCase(value);

    let finalData: Record<string, unknown> = {
      ...formattedData,
      imageName: formattedData.image,
      aura: formattedData.auraPolarity,
    };

    const releaseDate = wikiVersionData.find(
      (version) =>
        version.Aliases.includes(formattedData.introduced) ||
        version.Name === formattedData.introduced,
    )?.Date;

    finalData["releaseDate"] = releaseDate ?? null;

    if (formattedData.name.toLowerCase().includes("prime")) {
      finalData = {
        ...finalData,
        variant: "Prime",
        isPrime: true,
      };
    } else if (formattedData.name.includes("Umbra")) {
      finalData = {
        ...finalData,
        variant: "Umbra",
        isPrime: false,
      };
    } else {
      finalData = {
        ...finalData,
        variant: "Standard",
        isPrime: false,
      };
    }

    const result = warframeSchema.safeParse(finalData);
    if (result.success) {
      warframes.set(key, result.data);
    } else {
      console.error("Error parsing warframe", key, result.error);
    }
  }

  return warframes;
}

type WikiAbilityData = {
  Ability: {
    [key: string]: {
      Name: string;
      Icon: string;
      Powersuit: string;
      Weapon?: string;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
};

export async function buildAbilityData(
  warframes: ReturnType<typeof buildWarframeData>,
) {
  const validAbilities = [
    ...new Set(warframes.values().flatMap((warframe) => warframe.abilities)),
  ];

  const finalAbilities = new Map<string, BuiltAbilityShape>();

  const data = await $fetch<string>(
    "https://wiki.warframe.com/w/Module:Ability/data?action=raw",
  );

  const parsedData = parse(data) as WikiAbilityData;

  const abilities = parsedData.Ability;

  validAbilities.forEach((abilityName) => {
    const abilityData = abilities[abilityName];
    if (!abilityData) {
      console.warn(`Ability data not found for ${abilityName}`);
      return;
    }

    const result = builtAbilitySchema.safeParse({
      name: abilityData.Name,
      imageName: abilityData.Icon,
      belongsTo: abilityData.Powersuit,
      weapon: abilityData.Weapon,
    });
    if (result.success) {
      if (result.data.name === "Celestial Clash") return; //! Both Sirius and Orion have this as their 4th ability and I don't know if my game's logic is equipped to handle that
      finalAbilities.set(abilityName, result.data);
    } else {
      console.error("Error parsing ability", abilityName, result.error);
    }
  });

  return finalAbilities;
}

export function updateWarframeDataFromAbilities(
  warframes: ReturnType<typeof buildWarframeData>,
  abilities: Awaited<ReturnType<typeof buildAbilityData>>,
) {
  const updatedWarframes: Map<string, WarframeShape> = new Map();

  for (const [key, warframe] of warframes.entries()) {
    const hasExaltedAbility =
      warframe.abilities.some((abilityName) => {
        const ability = abilities.get(abilityName);
        return ability?.weapon;
      }) || ["Titania", "Titania Prime"].includes(warframe.name); // Not sure the reasoning but currently the wiki comments out the field I use to prove titania has an exalted ability so I'm hardcoding this for now

    updatedWarframes.set(key, {
      ...warframe,
      exalted: hasExaltedAbility || undefined,
    });
  }

  return updatedWarframes;
}

export async function writeDataToFile(
  warframes: ReturnType<typeof buildWarframeData>,
  abilities: Awaited<ReturnType<typeof buildAbilityData>>,
) {
  const tsContent = `// Auto-generated warframes data
    export const warframes = ${JSON.stringify(Object.fromEntries(warframes.entries()), null, 2)} as const;`;

  await fs.writeFile("./shared/data/warframes.ts", tsContent);

  const publicAbilities = Object.fromEntries(
    [...abilities.entries()].map(([key, ability]) => {
      const { weapon, ...rest } = ability;
      return [key, rest];
    }),
  );

  const abilityContent = `// Auto-generated abilities data
    export const abilities = ${JSON.stringify(publicAbilities, null, 2)} as const;`;

  await fs.writeFile("./shared/data/abilities.ts", abilityContent);
}
