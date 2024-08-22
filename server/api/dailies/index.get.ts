export default defineEventHandler<{ query: { date: string } }>(
  async (event) => {
    const { date } = getQuery(event);

    if (!date) {
      return { status: 400, body: { error: "Invalid date" } };
    }
    try {
      const result = await useDrizzle()
        .select()
        .from(tables.daily)
        .where(eq(tables.daily.date, date))
        .limit(1);

      if (result.length === 0) {
        return { status: 404, body: { error: "Not found" } };
      }
      return {
        status: 200,
        daily: result[0],
      };
    } catch (error) {
      console.error(error);
      return { status: 500, body: { error: "Internal server error" } };
    }
  },
);
