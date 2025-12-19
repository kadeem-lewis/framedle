import { gt, lte } from "drizzle-orm";
import { z } from "zod";

const dailiesQuerySchema = z.object({
  since: z.iso.date().optional(),
  until: z.iso.date(),
});

export default defineEventHandler<{
  query: z.infer<typeof dailiesQuerySchema>;
}>(async (event) => {
  const result = await getValidatedQuery(event, (body) =>
    dailiesQuerySchema.safeParse(body),
  );

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid query parameters",
    });
  }

  const { since, until } = result.data;

  const filterConditions = [lte(tables.daily.date, until)];

  if (since) {
    filterConditions.push(gt(tables.daily.date, since));
  }

  try {
    const result = await useDrizzle()
      .select()
      .from(tables.daily)
      .where(and(...filterConditions));

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
    throw createError({
      statusCode: 500,
      message: "Internal server error",
      data: error,
    });
  }
});
