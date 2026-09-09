export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { stats, progress } = body;

  if (!stats || !progress) {
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }

  try {
    const redis = await useRedis();
    const migrationId = generateCode(6);
    const migrationKey = `migration:${migrationId}`;

    await redis.setEx(
      migrationKey,
      60 * 60 * 24,
      JSON.stringify({ stats, progress }),
    );

    return { migrationId };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error saving migration data",
      data: error,
    });
  }
});
