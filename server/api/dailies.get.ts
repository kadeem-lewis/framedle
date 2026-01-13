import { gt, lte } from "drizzle-orm";
import { z } from "zod";
import type { Daily, GridPuzzle } from "#shared/schemas/db";

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

    // Hydrate grid puzzles with category data

    const gridResults = result.filter((entry) => entry.mode === "grid");

    const categoryIds = [
      ...new Set(
        gridResults.flatMap((entry) => Object.values(entry.puzzle)).flat(),
      ),
    ];

    const categoryMap = await hydrateCategoryIds(categoryIds);

    type GridDaily = Daily & {
      mode: "grid";
      puzzle: GridPuzzle;
    };

    const isGridDaily = (entry: (typeof result)[number]): entry is GridDaily =>
      entry.mode === "grid" &&
      "rowIds" in entry.puzzle &&
      "colIds" in entry.puzzle;

    const hydratedDailies = result.map((entry) => {
      if (!isGridDaily(entry)) return entry;

      return {
        ...entry,
        puzzle: {
          rows: entry.puzzle.rowIds.map((id) =>
            getCategoryData(categoryMap, id),
          ),
          cols: entry.puzzle.colIds.map((id) =>
            getCategoryData(categoryMap, id),
          ),
        },
      };
    });

    return {
      status: 200,
      dailies: hydratedDailies,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Internal server error",
      data: error,
    });
  }
});
