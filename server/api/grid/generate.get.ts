import {
  generateGridPuzzle,
  getCategoryData,
  hydrateCategoryIds,
} from "~~/server/utils/grid";

export default defineEventHandler(async () => {
  try {
    const grid = await generateGridPuzzle({ isUnlimited: true });
    const categoryIds = Object.values(grid).flat();

    const result = await hydrateCategoryIds(categoryIds);

    const hydratedGrid = {
      rows: grid.rowIds.map((id) => getCategoryData(result, id)),
      columns: grid.colIds.map((id) => getCategoryData(result, id)),
    };
    return {
      status: 200,
      grid: hydratedGrid,
    };
  } catch (error) {
    console.error("Error generating grid puzzle:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate grid puzzle",
    });
  }
});
