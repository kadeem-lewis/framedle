type CategoryConfigEntry =
  | {
      key: string;
      type: "string";
      label: (val: string) => string;
      template: (val: string) => string;
    }
  | {
      key: string;
      type: "boolean";
      label: (val: boolean) => string;
      template: (val: boolean) => string;
    }
  | {
      key: string;
      type: "array";
      label: (val: string[]) => string;
      template: (val: string[]) => string;
    }
  | {
      key: string;
      type: "numeric_top_2";
      label: (val: number) => string;
      template: (val: number) => string;
    };

export const categoryConfig: CategoryConfigEntry[] = [
  {
    key: "sex",
    label: (val: string) => `${val} Warframes`,
    type: "string",
    template: (val: string) => `Warframes that are ${val}`,
  },
  {
    key: "releaseDate",
    label: (val: string) => `Released in ${val}`,
    type: "string",
    template: (val: string) => `Warframes released in ${val}`,
  },
  {
    key: "progenitor",
    label: (val: string) => `${val} Progenitor Element`,
    type: "string",
    template: (val: string) => `Warframes with ${val} progenitor element`,
  },
  {
    key: "isPrime",
    type: "boolean",
    label: (val: boolean) => (val ? "Prime Warframes" : "Original Warframes"),
    template: (val: boolean) =>
      val ? "Prime Warframes" : "Original Warframes ( Standard/Non-Prime )",
  },
  {
    key: "aura", // could cause problems here
    type: "string",
    label: (val: string) => {
      if (val === "None") return "No Aura Polarity";
      if (val === "Aura") return "Universal Aura Polarity";
      return `${val} Aura Polarity`;
    },
    template: (val: string) => {
      if (val === "None") return "Warframes with no aura polarity";
      if (val === "Aura") return "Warframes with a universal aura polarity";
      return `Warframes with ${val} aura polarity`;
    },
  },
  {
    key: "playstyle",
    label: (val: string) => `${val} Playstyle`,
    type: "string",
    template: (val: string) => `Warframes suited for ${val} playstyle`,
  },
  {
    key: "conclave",
    label: (val: boolean) =>
      val ? "Conclave Warframes" : "Non-Conclave Warframes",
    type: "boolean",
    template: (val: boolean) =>
      val ? "Conclave enabled Warframes" : "Non-Conclave Warframes",
  },
  {
    key: "vaulted",
    label: (val: boolean) =>
      val ? "Vaulted Warframes" : "Non-Vaulted Warframes",
    type: "boolean",
    template: (val: boolean) =>
      val ? "Vaulted Warframes" : "Non-Vaulted Warframes",
  },
  {
    key: "exalted",
    label: (val: string[]) =>
      val.length > 0
        ? "Has Exalted Weapon"
        : "Warframes without Exalted Weapons",
    type: "array",
    template: (val: string[]) =>
      val.length > 0
        ? `Warframes with exalted weapons`
        : "Warframes without exalted weapons",
  },
  {
    key: "health",
    label: (val: number) => `Base Health: ${val}`,
    type: "numeric_top_2",
    template: (val: number) => `Warframes with ${val} base health`,
  },
  {
    key: "shield",
    type: "numeric_top_2",
    label: (val: number) => `Base Shield: ${val}`,
    template: (val: number) => `Warframes with ${val} base shield`,
  },
  {
    key: "armor",
    type: "numeric_top_2",
    label: (val: number) => `Base Armor: ${val}`,
    template: (val: number) => `Warframes with ${val} base armor`,
  },
  {
    key: "energy",
    type: "numeric_top_2",
    label: (val: number) => `Base Energy: ${val}`,
    template: (val: number) => `Warframes with ${val} base energy`,
  },
  {
    key: "sprint",
    type: "numeric_top_2",
    label: (val: number) => `Sprint Speed: ${val}`,
    template: (val: number) => `Warframes with ${val} sprint speed`,
  },
];
