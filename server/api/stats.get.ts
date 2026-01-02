import { z } from "zod";

const statsSchema = z.object({
  date: z.iso.date(),
});

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event, (query) =>
    statsSchema.safeParse(query),
  );

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid query parameters",
    });
  }
  const { date } = result.data;
  const redis = useRedis();

  const stats = await redis.hgetall(`daily:stats:${date}`);

  const classicGamesWon = parseInt(stats["games_won:classic"], 10) || null;
  const classicAverageAttempts = stats["total_attempts:classic"]
    ? Math.round(
        (parseInt(stats["total_attempts:classic"], 10) || 0) /
          (parseInt(stats["games_won:classic"], 10) || 1),
      )
    : null;

  const abilityGamesWon = parseInt(stats["games_won:ability"], 10) || null;
  const abilityAverageAttempts = stats["total_attempts:ability"]
    ? Math.round(
        (parseInt(stats["total_attempts:ability"], 10) || 0) /
          (parseInt(stats["games_won:ability"], 10) || 1),
      )
    : null;

  const gridGamesPlayed = parseInt(stats["games_played:grid"], 10) || null;

  console.log("Stats fetched:", {
    classicGamesWon,
    classicAverageAttempts,
    abilityGamesWon,
    abilityAverageAttempts,
    gridGamesPlayed,
  });

  return {
    classic: {
      gamesWon: classicGamesWon,
      averageAttempts: classicAverageAttempts,
    },
    ability: {
      gamesWon: abilityGamesWon,
      averageAttempts: abilityAverageAttempts,
    },
    grid: {
      gamesPlayed: gridGamesPlayed,
    },
  };
});
