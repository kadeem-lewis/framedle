import { z } from "zod";

export const submissionsPostSchema = z.object({
  date: z.iso.date(),
  mode: z.enum(["classic", "ability", "grid"]),
  won: z.boolean(),
  guessCount: z.number().int().nonnegative().optional(),
  gridStats: z
    .object({
      uniquenessScore: z.number().nonnegative(),
      solvedSlots: z.array(z.string().regex(/^\d-\d$/)),
    })
    .optional(),
});

export type SubmissionsBody = z.infer<typeof submissionsPostSchema>;
