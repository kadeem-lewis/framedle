import { format, parseISO } from "date-fns";
import { asc, desc, lte } from "drizzle-orm";

export default defineEventHandler<{
  query: { order: "OLDEST" | "NEWEST"; date: string };
}>(async (event) => {
  const { order = "NEWEST", date } = getQuery(event);

  const orderByClause =
    order === "NEWEST" ? desc(tables.daily.date) : asc(tables.daily.date);

  try {
    const result = await useDrizzle()
      .select()
      .from(tables.daily)
      .where(lte(tables.daily.date, date))
      .orderBy(orderByClause);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "No entries found",
      });
    }
    return {
      status: 200,
      dailies: result.map((daily) => ({
        ...daily,
        readableDate: format(parseISO(daily.date), "PPP"),
      })),
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
