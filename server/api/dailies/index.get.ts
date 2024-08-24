import { z } from "zod";

const dateSchema = z.object({
  date: z.string().date(),
});

export default defineEventHandler<{ query: { date: string } }>(
  async (event) => {
    const result = await getValidatedQuery(event, (body) =>
      dateSchema.safeParse(body),
    );

    if (!result.success) {
      throw createError({
        statusCode: 400,
        message: "Invalid date",
      });
    }

    const { date } = result.data;
    try {
      const result = await useDrizzle()
        .select()
        .from(tables.daily)
        .where(eq(tables.daily.date, date))
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
      console.error(error);
      throw createError({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  },
);
