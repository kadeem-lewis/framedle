import { warframes } from "#shared/data/warframes";

import { abilities } from "#shared/data/abilities";

export type WarframeName = keyof typeof warframes;

export type Warframe = (typeof warframes)[WarframeName];

export const warframeNames = Object.keys(warframes) as WarframeName[];

export const vanillaWarframes = warframeNames.filter(
  (name) => warframes[name].variant === "Standard",
);

export type AbilityName = keyof typeof abilities;

export type Ability = (typeof abilities)[keyof typeof abilities];

export const abilityNames = Object.keys(
  abilities,
) as (keyof typeof abilities)[];

const lowercaseAbilitiesMap = Object.entries(abilities).reduce(
  (acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  },
  {} as Record<string, Ability>,
);

export const getWarframe = (warframe: WarframeName) => {
  return warframes[warframe];
};

export const getAbility = (ability: string): Ability => {
  const normalized = ability.toLowerCase(); // ! The older version of the data handled capitalization differently so I need to normalize the input to ensure old and new values work
  const resolved = lowercaseAbilitiesMap[normalized];

  if (!resolved) {
    throw createError(`Unknown ability: ${ability}`);
  }

  return resolved;
};

export const getRandomWarframe = (): WarframeName => {
  return warframeNames[Math.floor(Math.random() * warframeNames.length)]!;
};

export const getRandomAbility = (): AbilityName => {
  return abilityNames[Math.floor(Math.random() * abilityNames.length)]!;
};

//? Maybe I only need the strict typing for ability names but the actual ability data can be typed as AbilityShape
