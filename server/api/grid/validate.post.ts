import z from "zod";

const validateGridGuessSchema = z.object({
  rowCategoryId: z.string(),
  columnCategoryId: z.string(),
  guessedWarframe: z.string(),
  puzzleDate: z.string().optional(),
  isUnlimited: z.boolean().default(false),
  isCurrentDaily: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    validateGridGuessSchema.safeParse(body),
  );
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }

  const {
    rowCategoryId,
    columnCategoryId,
    guessedWarframe,
    isUnlimited,
    isCurrentDaily,
  } = body.data;

  const [idA, idB] = [rowCategoryId, columnCategoryId].sort();

  try {
    const result = await useDrizzle()
      .select()
      .from(tables.categoryPairs)
      .where(
        and(
          eq(tables.categoryPairs.categoryA, idA),
          eq(tables.categoryPairs.categoryB, idB),
        ),
      )
      .limit(1);

    if (result.length === 0)
      throw createError({
        statusCode: 404,
        message: "Category pair not found",
      });

    const categoryPair = result[0];

    const match = categoryPair.validWarframes.find(
      (warframe) =>
        warframe.name.toLowerCase() === guessedWarframe.toLowerCase(),
    );
    if (match) {
      const total = categoryPair.totalGuesses || 1;
      const rarityScore = Math.round((match.guessCount / total) * 100);
      if (!isUnlimited && isCurrentDaily) {
        // Redis call to update guess count for the guessed warframe
      }
      return {
        status: 200,
        correct: true,
        rarity: rarityScore,
        message: "Correct guess!",
      };
    }
    return {
      status: 200,
      correct: false,
      message: "Incorrect guess.",
    };
  } catch (error) {
    console.error("Error validating grid guess:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to validate grid guess",
    });
  } finally {
    await useDrizzle().$client.end();
  }
});
