export type CategoryMetadata = {
  header: string;
  value: string | number;
  description: string;
  imgSrc?: string;
  cssClass?: string;
  extra?: string[];
};

export const categoryMetadata = {
  health: (value: number) => ({
    header: "Base Health",
    value,
    description: `Warframes with ${value} health at rank 0`,
    cssClass: "text-error font-bold",
  }),
  shield: (value: number) => ({
    header: "Base Shields",
    value,
    description: `Warframes with ${value} shields at rank 0`,
    cssClass: "text-secondary font-bold",
  }),
  armor: (value: number) => ({
    header: "Armor",
    value,
    description: `Warframes with ${value} armor`,
  }),
  energy: (value: number) => ({
    header: "Base Energy",
    value,
    description: `Warframes with ${value} energy at rank 0`,
  }),
  sprint: (value: number) => ({
    header: "Sprint Speed",
    value,
    description: `Warframes with a sprint speed of ${value}`,
  }),
  progenitor: (value: string) => ({
    header: "Progenitor",
    value,
    description: `Warframes with ${value} progenitor element`,
    imgSrc: `/elements/${value}.png`,
  }),
  aura: (value: string) => ({
    header: "Aura",
    value,
    description: `Warframes with ${value} aura polarity`,
    imgSrc: value === "None" ? undefined : `/polarities/${value}.svg`,
  }),
  playstyle: (value: string) => ({
    header: "Playstyle",
    value,
    description: `Warframes with ${value} playstyle`,
    imgSrc: `/playstyles/${value.replace(/\s+/g, "")}.png`,
  }),
  releaseDate: (value: string) => ({
    header: "Release Year",
    value,
    description: `Warframes released in ${value}`,
  }),
  sex: (value: string) => ({
    header: "Sex",
    value,
    description: `Warframes that are ${value}`,
  }),
  isPrime: (value: string) => ({
    header: "Variant",
    value: value === "true" ? "Prime" : "Original",
    description:
      value === "true"
        ? "Prime Warframes"
        : "Original Warframes ( Standard/Non-Prime )",
  }),
  conclave: (value: string) => ({
    header: "Conclave",
    value: value === "true" ? "Allowed" : "Disabled",
    description:
      value === "true"
        ? "Warframes that can be used in Conclave"
        : "Warframes that cannot be used in Conclave",
    extra: [
      "Lunaro and Faceoff are not considered Conclave modes for this category.",
    ],
  }),
  vaulted: (_: unknown) => ({
    header: "Status",
    value: "Vaulted",
    description: "Warframes that have entered the Prime Vault",
  }),
  exalted: (_: unknown) => ({
    header: "Exalted",
    value: "Has Exalted Weapon",
    description: "Warframes that have exalted weapons",
    extra: ["Pseudo-Exalted weapons count towards this category"],
  }),
  leverian: (_: unknown) => ({
    header: "Leverian",
    value: "Has Entry",
    description: "Warframes that have a Leverian Entry",
  }),
  protoframe: (_: unknown) => ({
    header: "Protoframe",
    value: "Has Protoframe",
    description: "Warframes with a Protoframe that possess their traits",
  }),
  questframe: (_: unknown) => ({
    header: "Acquisition",
    value: "Quest Locked",
    description: "Warframes not obtainable until completing a specific quest.",
    extra: ["Based on Warframe Unlock Quests on the Wiki"],
  }),
  circuit: (_: unknown) => ({
    header: "Acquisition",
    value: "The Circuit",
    description: "Warframes that can obtained through the Circuit",
  }),
};

export type CategoryName = keyof typeof categoryMetadata;

// Not fully sure how these work but they allow me to access the keys of categoryMetadata without TS errors

type CategoryValueMap = {
  [K in CategoryName]: Parameters<(typeof categoryMetadata)[K]>[0];
};

export function getCategoryDisplay<K extends CategoryName>(
  key: K,
  value: CategoryValueMap[K],
) {
  const metadataFn = categoryMetadata[key];

  if (!metadataFn) return null;

  return (metadataFn as (val: CategoryValueMap[K]) => CategoryMetadata)(value);
}
