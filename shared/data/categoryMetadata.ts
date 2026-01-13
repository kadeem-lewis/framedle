export const categoryMetadata = {
  health: (value: number) => ({
    category: "Base Health",
    value,
    description: `Warframes with ${value} health at rank 0`,
    cssClass: "",
  }),
  shield: (value: number) => ({
    category: "Base Shields",
    value,
    description: `Warframes with ${value} shields at rank 0`,
    cssClass: "",
  }),
  armor: (value: number) => ({
    category: "Armor",
    value,
    description: `Warframes with ${value} armor`,
  }),
  energy: (value: number) => ({
    category: "Base Energy",
    value,
    description: `Warframes with ${value} energy at rank 0`,
  }),
  sprint: (value: number) => ({
    category: "Sprint Speed",
    value,
    description: `Warframes with ${value} sprint speed`,
  }),
  progenitor: (value: string) => ({
    category: "Progenitor",
    value,
    description: `Warframes with ${value} progenitor element`,
    imgSrc: `/elements/${value.toLowerCase()}.png`,
  }),
  aura: (value: string) => ({
    category: "Aura",
    value,
    description: `Warframes with ${value} aura polarity`,
    imgSrc: `/polarities/${value.toLowerCase()}.png`,
  }),
  playstyle: (value: string) => ({
    category: "Playstyle",
    value,
    description: `Warframes with ${value} playstyle`,
    imgSrc: `/playstyles/${value.toLowerCase()}.png`,
  }),
  releaseDate: (value: string) => ({
    category: "Release Year",
    value,
    description: `Warframes released in ${value}`,
  }),
  sex: (value: string) => ({
    category: "Sex",
    value,
    description: `Warframes that are ${value}`,
  }),
  isPrime: (value: boolean) => ({
    category: "Variant",
    value: value ? "Prime" : "Original",
    description: value
      ? "Prime Warframes"
      : "Original Warframes ( Standard/Non-Prime )",
  }),
  conclave: (value: boolean) => ({
    category: "Conclave",
    value: value ? "Allowed" : "Disabled",
    description: value
      ? "Warframes that can be used in Conclave"
      : "Warframes that cannot be used in Conclave",
    extra: [
      "Lunaro and Faceoff are not considered Conclave modes for this category.",
    ],
  }),
  vaulted: (value: boolean) => ({
    // I don't want to count non vaulted since it changes too often
    //TODO: Label needs to be updated
    category: "Vaulted",
    value: value ? "Vaulted" : "Non-Vaulted",
    description: value
      ? "Warframes that are vaulted"
      : "Warframes that are not vaulted",
  }),
  exalted: (value: boolean) => ({
    // non exalted is just too broad
    //TODO: Label needs to be updated
    category: "Exalted Weapon",
    value: value ? "Has Exalted Weapon" : "No Exalted Weapon",
    description: value
      ? "Warframes that have exalted weapons"
      : "Warframes that do not have exalted weapons",
    extra: ["Pseudo-Exalted weapons count towards this category"],
  }),
  leverian: (value: boolean) => ({
    //TODO: Label needs to be updated
    category: "Leverian",
    value: value,
    description: "Warframes that have a Leverian Entry",
  }),
  protoframe: (value: boolean) => ({
    //TODO: Label needs to be updated
    category: "Protoframe",
    value: value,
    description: "Warframes with a Protoframe that possess their traits",
  }),
  questframe: (value: boolean) => ({
    //TODO: Label needs to be updated
    category: "Acquisition",
    value: value,
    description: "Warframes not obtainable until completing a specific quest.",
    extra: ["Based on Warframe Unlock Quests on the Wiki"],
  }),
  circuit: (value: boolean) => ({
    //TODO: Label needs to be updated
    category: "The Circuit",
    value: value,
    description: "Warframes that can obtained through the Circuit",
  }),
};

export type CategoryName = keyof typeof categoryMetadata;
