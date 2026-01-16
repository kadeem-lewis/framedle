import z from "zod";
import type { ValidWarframeData } from "#shared/schemas/db";

const validateGridGuessSchema = z.object({
  rowCategoryId: z.string(),
  columnCategoryId: z.string(),
  rowIndex: z.number().int().nonnegative().max(2),
  colIndex: z.number().int().nonnegative().max(2),
  guessedWarframe: z.string(),
  puzzleDate: z.iso.date().optional(),
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
  if (!body.success) {
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

  const WARFRAME_DATA_VERSION = "v1";

  const [idA, idB] = [rowCategoryId, columnCategoryId].sort();

  try {
    const redis = await useRedis();

    const pairKey = `validWarframes:${WARFRAME_DATA_VERSION}:${idA}:${idB}`;

    let validWarframes: ValidWarframeData[];

    const cached = await redis.json.get(pairKey);
    if (cached) {
      validWarframes = cached as ValidWarframeData[];
      console.log("Fetched valid warframes from cache");
    } else {
      const result = await useDrizzle()
        .select({
          validWarframes: tables.categoryPairs.validWarframes,
        })
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

      validWarframes = result[0].validWarframes;
      await redis
        .multi()
        .json.set(pairKey, "$", validWarframes)
        .expire(pairKey, 60 * 60) // 1 hour
        .exec();
    }

    const match = validWarframes.find(
      (warframe) =>
        warframe.name.toLowerCase() === guessedWarframe.toLowerCase(),
    );

    if (!match) {
      return {
        status: 200,
        correct: false,
        message: "Incorrect guess.",
      };
    }

    let rarityScore = 0;

    if (!isUnlimited) {
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
    }
    return {
      status: 200,
      correct: true,
      rarity: rarityScore,
      message: "Correct guess!",
    };
  } catch (error) {
    console.error("Error validating grid guess:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to validate grid guess",
    });
  }
});
