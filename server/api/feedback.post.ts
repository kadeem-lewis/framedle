import { feedbackSchema } from "#shared/schemas/feedback";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    feedbackSchema.safeParse(body),
  );

  if (!body.success) {
    return createError({
      statusCode: 400,
      message: "Invalid feedback data",
    });
  }

  console.log("Received feedback:", body.data);

  const { email, message, messageType, token } = body.data;

  await verifyTurnstileToken(token);

  // send to whatever feedback processing system

  return {
    statusCode: 200,
    message: "Feedback received successfully",
  };
});
