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

export const getWarframe = (warframe: WarframeName) => {
  return warframes[warframe];
};

export const getAbility = (ability: AbilityName) => {
  return abilities[ability];
};

export const getRandomWarframe = (): WarframeName => {
  return warframeNames[Math.floor(Math.random() * warframeNames.length)]!;
};

export const getRandomAbility = (): AbilityName => {
  return abilityNames[Math.floor(Math.random() * abilityNames.length)]!;
};

//? Maybe I only need the strict typing for ability names but the actual ability data can be typed as AbilityShape
