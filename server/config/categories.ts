type CategoryConfigEntry =
  | { key: string; type: "string"; template: (val: string) => string }
  | { key: string; type: "boolean"; template: (val: boolean) => string }
  | { key: string; type: "array"; template: (val: string[]) => string }
  | { key: string; type: "numeric_top_2"; template: (val: number) => string };

export const categoryConfig: CategoryConfigEntry[] = [
  {
    key: "sex",
    type: "string",
    template: (val: string) => `Warframes that are ${val}`,
  },
  {
    key: "releaseDate",
    type: "string",
    template: (val: string) => `Warframes released in ${val}`,
  },
  {
    key: "progenitor",
    type: "string",
    template: (val: string) => `Warframes with ${val} progenitor element`,
  },
  {
    key: "isPrime",
    type: "boolean",
    template: (val: boolean) =>
      val ? "Prime Warframes" : "Non-Prime Warframes",
  },
  {
    key: "aura", // could cause problems here
    type: "string",
    template: (val: string) => `Warframes with ${val} aura polarity`,
  },
  {
    key: "playstyle", // could also cause problems here
    type: "string",
    template: (val: string) => `Warframes suited for ${val} playstyle`,
  },
  {
    key: "conclave",
    type: "boolean",
    template: (val: boolean) =>
      val ? "Conclave enabled Warframes" : "Non-Conclave Warframes",
  },
  {
    key: "vaulted",
    type: "boolean",
    template: (val: boolean) =>
      val ? "Vaulted Warframes" : "Non-Vaulted Warframes",
  },
  {
    key: "exalted",
    type: "array",
    template: (val: string[]) =>
      val.length > 0
        ? `Warframes with exalted weapons`
        : "Warframes without exalted weapons",
  },
  {
    key: "health",
    type: "numeric_top_2",
    template: (val: number) => `Warframes with ${val} base health`,
  },
  {
    key: "shield",
    type: "numeric_top_2",
    template: (val: number) => `Warframes with ${val} base shield`,
  },
  {
    key: "armor",
    type: "numeric_top_2",
    template: (val: number) => `Warframes with ${val} base armor`,
  },
  {
    key: "energy",
    type: "numeric_top_2",
    template: (val: number) => `Warframes with ${val} base energy`,
  },
  {
    key: "sprint",
    type: "numeric_top_2",
    template: (val: number) => `Warframes with ${val} sprint speed`,
  },
];
// I want to eventually add protoframe, leverian and quest frames
