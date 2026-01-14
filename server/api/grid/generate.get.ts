import { generateGridPuzzle } from "~~/server/utils/grid";

export default defineEventHandler(async () => {
  try {
    const grid = await generateGridPuzzle({ isUnlimited: true });

    return {
      status: 200,
      grid,
    };
  } catch (error) {
    console.error("Error generating grid puzzle:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate grid puzzle",
    });
  }
});
