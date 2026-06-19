import { z } from "zod";

export const abilitySchema = z.object({
  name: z.string(),
  imageName: z.string().endsWith(".png"),
  belongsTo: z.string(),
});

export type AbilityShape = z.infer<typeof abilitySchema>;

export const builtAbilitySchema = abilitySchema.extend({
  weapon: z.union([z.string(), z.array(z.string())]).optional(),
});

export type BuiltAbilityShape = z.infer<typeof builtAbilitySchema>;

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
  health: z.number(),
  shield: z.number(),
  armor: z.number(),
  energy: z.number(),
  sprint: z.number(),
  aura: z.union([z.array(z.enum(polarities)), z.enum(polarities)]),
  releaseDate: z.string(),
  imageName: z.string(),
  abilities: z.array(z.string()).length(4),
  sex: z.enum(sexes),
  variant: z.enum(variant),
  progenitor: z.enum(progenitorElements),
  isPrime: z.boolean(),
  conclave: z.boolean(),
  vaulted: z.union([z.boolean(), z.string()]).optional(),
  playstyle: z.array(z.enum(playstyles)),
  exalted: z.boolean().optional(),
});

export type WarframeShape = z.infer<typeof warframeSchema>;
