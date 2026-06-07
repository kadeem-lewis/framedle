import { z } from "zod";

export const abilitySchema = z.object({
  uniqueName: z.string(),
  name: z.string(),
  description: z.string(),
  imageName: z.string(),
});

export type Ability = z.infer<typeof abilitySchema>;

export const progenitorElements = [
  "Impact",
  "Toxin",
  "Electricity",
  "Radiation",
  "Magnetic",
  "Heat",
  "Cold",
] as const;

export const polarities = [
  "Madurai",
  "Vazarin",
  "Naramon",
  "Zenurik",
  "None",
  "Aura",
] as const;

export const playstyles = [
  "Damage",
  "Crowd Control",
  "Support",
  "Stealth",
  "Survival",
] as const;

export const variant = ["Standard", "Prime", "Umbra"] as const;

export const sexes = ["Male", "Female", "Non-binary"] as const;

export const warframeSchema = z.object({
  name: z.string(),
  category: z.literal("Warframes"),
  type: z.literal("Warframe"),
  health: z.number(),
  shield: z.number(),
  armor: z.number(),
  energy: z.number(),
  sprint: z.number(),
  aura: z.union([z.array(z.enum(polarities)), z.enum(polarities)]),
  releaseDate: z.string(),
  imageName: z.string(),
  abilities: z.array(abilitySchema),
  sex: z.enum(sexes),
  variant: z.enum(variant),
  progenitor: z.enum(progenitorElements),
  isPrime: z.boolean(),
  conclave: z.boolean(),
  vaulted: z.union([z.boolean(), z.string()]).optional(),
  playstyle: z.array(z.enum(playstyles)),
  exalted: z.array(z.string()).optional(),
});

export type WarframeShape = z.infer<typeof warframeSchema>;
