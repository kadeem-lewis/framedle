import z from "zod";
import { eq, and } from "drizzle-orm";
import type { GridStatsData } from "#shared/schemas/db";

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

  // Sort IDs to match the composite primary key order in DB
  const [idA, idB] = [rowCategoryId, columnCategoryId].sort();
  const db = useDrizzle();

  try {
    // 1. Validate if the guess is legally correct for this category pair
    const result = await db
      .select()
      .from(tables.categoryPairs)
      .where(
        and(
          eq(tables.categoryPairs.categoryA, idA),
          eq(tables.categoryPairs.categoryB, idB),
        ),
      )
      .limit(1);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Category pair not found",
      });
    }

    const categoryPair = result[0];
    const match = categoryPair.validWarframes.find(
      (warframe) =>
        warframe.name.toLowerCase() === guessedWarframe.toLowerCase(),
    );

    if (match) {
      let rarityScore = 0;

      // Only calculate Daily Rarity for Daily Mode
      if (!isUnlimited && puzzleDate) {
        const redis = await useRedis();
        const rarityKey = `daily:rarity:${puzzleDate}:${rowIndex}-${colIndex}`;
        const normalizedGuess = match.name;

        // A. Increment & Fetch Live Stats (Redis)
        const multi = redis.multi();
        multi.hIncrBy(rarityKey, "total", 1);
        multi.hIncrBy(rarityKey, normalizedGuess, 1);
        const [redisTotalStr, redisSpecificStr] = await multi.exec();

        // These values *include* the increment we just made
        const redisTotal = Number(redisTotalStr);
        const redisSpecific = Number(redisSpecificStr);

        // B. Fetch Archived Stats (Postgres)
        let dbTotal = 0;
        let dbSpecific = 0;

        const dbStatResult = await db
          .select()
          .from(tables.stats)
          .where(
            and(
              eq(tables.stats.date, puzzleDate),
              eq(tables.stats.mode, "grid"),
            ),
          )
          .limit(1);

        if (dbStatResult.length > 0) {
          const gridData = dbStatResult[0].data as GridStatsData;
          const cellRarity = gridData.rarity?.[`${rowIndex}-${colIndex}`];

          if (cellRarity) {
            // Sum all values in the object to get the cell total
            dbTotal = Object.values(cellRarity).reduce(
              (sum, val) => sum + val,
              0,
            );
            dbSpecific = cellRarity[normalizedGuess] || 0;
          }
        }

        // C. Combine & Calculate
        const finalTotal = redisTotal + dbTotal;
        const finalSpecific = redisSpecific + dbSpecific;

        if (finalTotal > 0) {
          rarityScore = (finalSpecific / finalTotal) * 100;
        }
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
