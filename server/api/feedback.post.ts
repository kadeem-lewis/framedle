import { feedbackSchema } from "#shared/schemas/feedback";
import { Client } from "@notionhq/client";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    feedbackSchema.safeParse(body),
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid feedback data",
    });
  }

  const { email, message, messageType, token } = body.data;

  await verifyTurnstileToken(token);

  const runtimeConfig = useRuntimeConfig();

  const notion = new Client({ auth: runtimeConfig.notion.key });

  try {
    await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: runtimeConfig.notion.databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: `${messageType} from ${email || "Anonymous"}`,
              },
            },
          ],
        },
        Email: {
          email: email || null,
        },
        "Feedback Type": {
          select: {
            name: messageType,
          },
        },
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Message",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: message,
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Notes",
                },
              },
            ],
          },
        },
      ],
    });

    return {
      statusCode: 200,
      success: true,
      message: "Feedback received successfully",
    };
  } catch (error) {
    console.error("Error creating Notion page:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to process feedback",
    });
  }
});
