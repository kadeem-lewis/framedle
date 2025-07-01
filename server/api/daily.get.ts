import { z } from "zod";

const dateQuerySchema = z.object({
  date: z.string().date(),
});

const dayQuerySchema = z.object({
  day: z.coerce.number().positive().int(),
});

const querySchema = z.union([dateQuerySchema, dayQuerySchema]);

type Query = z.infer<typeof querySchema>;

export default defineEventHandler<{ query: Query }>(async (event) => {
  const result = await getValidatedQuery(event, (body) =>
    querySchema.safeParse(body),
  );

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Either 'date' or 'day' parameter is required",
    });
  }

  const query = result.data;

  try {
    const comparison =
      "date" in query
        ? eq(tables.daily.date, query.date)
        : eq(tables.daily.day, query.day);

    const result = await useDrizzle()
      .select()
      .from(tables.daily)
      .where(comparison)
      .limit(1);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Entry not found for this date",
      });
    }
    return {
      status: 200,
      daily: result[0],
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Internal server error",
      data: error,
    });
  }
});
