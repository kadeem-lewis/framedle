import { asc, desc, lte } from "drizzle-orm";

export default defineEventHandler<{
  query: { order: "desc" | "asc"; date: string };
}>(async (event) => {
  const { order = "asc", date } = getQuery(event);

  const orderByClause =
    order === "desc" ? desc(tables.daily.date) : asc(tables.daily.date);

  try {
    const result = await useDrizzle()
      .select()
      .from(tables.daily)
      .orderBy(orderByClause)
      .where(lte(tables.daily.date, date));

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
