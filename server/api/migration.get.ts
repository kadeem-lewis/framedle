import { z } from "zod";

const migrationQuerySchema = z.object({
  code: z.string().length(6),
});

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event, (body) =>
    migrationQuerySchema.safeParse(body),
  );
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid query parameters",
    });
  }

  const { code } = result.data;
  try {
    const redis = await useRedis();
    const migrationKey = `migration:${code}`;
    const migrationData = await redis.get(migrationKey);

    if (!migrationData) {
      throw createError({
        statusCode: 404,
        message: "Migration data not found",
      });
    }

    return JSON.parse(migrationData);
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error retrieving migration data",
      data: error,
    });
  }
});
