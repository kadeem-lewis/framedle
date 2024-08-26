export default defineEventHandler(async () => {
  try {
    const result = await useDrizzle().select().from(tables.daily);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "No entries found",
      });
    }
    return {
      status: 200,
      dailies: result,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
