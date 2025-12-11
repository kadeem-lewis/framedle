export const categoryConfig = [
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
] as const;
// I want to eventually add protoframe, vaulted and maybe leverian
