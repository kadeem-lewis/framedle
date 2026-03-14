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
  message: z
    .string()
    .nonempty("You have to say something")
    .max(2000, {
      error: "Message is too long. Keep it under 2000 characters.",
    }),
  messageType: z.enum(messageTypes, {
    error: "Please select a valid message type",
  }),
  token: z.string().nonempty(),
});

export type Feedback = z.infer<typeof feedbackSchema>;
