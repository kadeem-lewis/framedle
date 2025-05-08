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
  energy: z.number(),
  sprint: z.number(),
  aura: z.enum(["Madurai", "Vazarin", "Naramon", "Zenurik", "None", "Aura"]),
  releaseDate: z.string(),
  imageName: z.string(),
  abilities: z.array(abilitySchema),
  sex: z.enum(["Male", "Female", "Non-binary (Pluriform)", "Non-binary"]),
  variant: z.enum(["Standard", "Prime", "Umbra"]),
  progenitor: z.enum(progenitorElements),
  isPrime: z.boolean(),
  conclave: z.boolean(),
  playstyle: z.string(),
  exalted: z.array(z.string()).optional(),
});

// gonna need to add exalted, sprint speed, aura polarity, playstyle, energy, conclave

export type Warframe = z.infer<typeof warframeSchema>;

// playstyle: z
// .enum(["Damage", "Crowd Control", "Support", "Stealth", "Survival"])
// .array(),
