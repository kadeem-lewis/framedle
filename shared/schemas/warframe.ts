import { z } from "zod";

export const abilitySchema = z.object({
  uniqueName: z.string(),
  name: z.string(),
  description: z.string(),
  imageName: z.string(),
});

const progenitorElements = [
  "Impact",
  "Toxin",
  "Electricity",
  "Radiation",
  "Magnetic",
  "Heat",
  "Cold",
] as const;

export type Ability = z.infer<typeof abilitySchema>;

export const warframeSchema = z.object({
  name: z.string(),
  category: z.literal("Warframes"),
  type: z.literal("Warframe"),
  health: z.number(),
  shield: z.number(),
  armor: z.number(),
  releaseDate: z.string(),
  imageName: z.string(),
  abilities: z.array(abilitySchema),
  sex: z.enum(["Male", "Female", "Non-binary (Pluriform)", "Non-binary"]),
  variant: z.enum(["Standard", "Prime", "Umbra"]),
  progenitor: z.enum(progenitorElements),
  isPrime: z.boolean(),
});

export type Warframe = z.infer<typeof warframeSchema>;
