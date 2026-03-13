import { z } from "zod";

export const messageTypes = [
  "Bug Report",
  "Feature Request",
  "Missing Data",
  "General",
  "Question",
] as const;

export const feedbackSchema = z.looseObject({
  email: z.email().optional(),
  message: z.string().nonempty("You have to say something"),
  messageType: z.enum(messageTypes),
  token: z.string().nonempty(),
});

export type Feedback = z.infer<typeof feedbackSchema>;
