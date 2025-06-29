import { warframes } from "#shared/data/warframes";
import type { Ability as OriginalAbility } from "#shared/schemas/warframe";

export type WarframeName = keyof typeof warframes;

export type Warframe = (typeof warframes)[WarframeName];

export type Ability = OriginalAbility & { belongsTo: WarframeName };

export const warframeNames = Object.keys(warframes) as WarframeName[];

export const vanillaWarframes = warframeNames.filter(
  (name) => warframes[name].variant === "Standard",
);

export const abilities = Object.values(warframes).flatMap((warframe) =>
  warframe.abilities.map((ability) => ({
    ...ability,
    belongsTo: warframe.name,
  })),
);

export const getWarframe = (warframe: WarframeName) => {
  return warframes[warframe];
};
