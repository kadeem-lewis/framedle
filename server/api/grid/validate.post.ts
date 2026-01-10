import z from "zod";

const validateGridGuessSchema = z.object({
  rowCategoryId: z.string(),
  columnCategoryId: z.string(),
  rowIndex: z.number().int().nonnegative().max(2),
  colIndex: z.number().int().nonnegative().max(2),
  guessedWarframe: z.string(),
  puzzleDate: z.string().optional(),
  isUnlimited: z.boolean().default(false),
});

export default defineEventHandler<
  Promise<
    | {
        status: number;
        correct: true;
        rarity: number;
        message: string;
      }
    | {
        status: number;
        correct: false;
        message: string;
      }
  >
>(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    validateGridGuessSchema.safeParse(body),
  );
  console.log("validateGridGuess body", body);
  if (!body.success) {
    console.log("Invalid body:", body.error);
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }

  const {
    rowCategoryId,
    columnCategoryId,
    rowIndex,
    colIndex,
    guessedWarframe,
    puzzleDate,
    isUnlimited,
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
      let rarityScore = 0;
      if (!isUnlimited) {
        const redis = await useRedis();
        const rarityKey = `daily:rarity:${puzzleDate}:${rowIndex}-${colIndex}`;
        const normalizedGuess = match.name;

        const multi = redis.multi();

        multi.hIncrBy(rarityKey, "total", 1);
        multi.hIncrBy(rarityKey, normalizedGuess, 1);

        const results = await multi.exec();
        const totalGuesses = Number(results[0]);
        const specificCount = Number(results[1]);

        if (totalGuesses > 0) {
          rarityScore = (specificCount / totalGuesses) * 100;
        }

        console.log(totalGuesses, specificCount);
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
  }
});
