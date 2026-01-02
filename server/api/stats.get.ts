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

  function getAverage(attempts: string | undefined, wins: string | undefined) {
    if (!attempts || !wins) return null;
    const attemptsNum = parseInt(attempts, 10);
    const winsNum = parseInt(wins, 10);
    return Math.round(attemptsNum / winsNum);
  }

  const classicGamesWon = parseInt(stats["games_won:classic"], 10) || null;
  const classicAverageAttempts = stats["total_attempts:classic"]
    ? getAverage(stats["total_attempts:classic"], stats["games_won:classic"])
    : null;

  const abilityGamesWon = parseInt(stats["games_won:ability"], 10) || null;
  const abilityAverageAttempts = stats["total_attempts:ability"]
    ? getAverage(stats["total_attempts:ability"], stats["games_won:ability"])
    : null;
  const gridGamesPlayed = parseInt(stats["games_played:grid"], 10) || null;

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
