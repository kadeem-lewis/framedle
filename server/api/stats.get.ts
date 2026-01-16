import { z } from "zod";
import type { StatsResponse, GuessStatEntry } from "#shared/types/stats";

const statsSchema = z.object({
  date: z.iso.date(),
  showAnswers: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export default defineEventHandler<Promise<StatsResponse>>(async (event) => {
  const result = await getValidatedQuery(event, (query) =>
    statsSchema.safeParse(query),
  );

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid query parameters",
    });
  }
  const { date, showAnswers } = result.data;

  const redis = await useRedis();

  const stats = await redis.hGetAll(`daily:stats:${date}`);

  function getAverage(attempts: string | undefined, wins: string | undefined) {
    if (!attempts || !wins) return null;
    const attemptsNum = parseInt(attempts, 10);
    const winsNum = parseInt(wins, 10);
    return Math.round(attemptsNum / winsNum);
  }

  function getInt(key: string) {
    return parseInt((stats[key] as string) || "0", 10);
  }

  const rarityPromises = [];
  const rarityKeys: string[] = [];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      rarityKeys.push(`${r}-${c}`);
      rarityPromises.push(redis.hGetAll(`daily:rarity:${date}:${r}-${c}`));
    }
  }

  const rarityResults = await Promise.all(rarityPromises);

  const guessStats: Record<string, GuessStatEntry> = {};

  rarityResults.forEach((cellData, index) => {
    const coord = rarityKeys[index];

    const totalRaw = cellData["total"];
    const total = totalRaw ? parseInt(totalRaw, 10) : 0;

    let mostPopular: GuessStatEntry["mostPopular"] = null;
    let leastPopular: GuessStatEntry["leastPopular"] = null;
    if (showAnswers === true) {
      console.log("This isn't running right?");
      const guesses = Object.entries(cellData)
        .filter(([key]) => key !== "total")
        .map(([name, countStr]) => ({
          name,
          count: parseInt(countStr, 10),
        }));

      guesses.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)); // Sort by highest count, then alphabetically

      mostPopular = guesses.length > 0 ? guesses[0] : null;
      leastPopular = guesses.length > 0 ? guesses[guesses.length - 1] : null;
    }

    guessStats[coord] = {
      total,
      mostPopular,
      leastPopular,
    };
  });

  // 4. Calculate Grid Score Distribution & Average
  const gridDistribution: Record<string, number> = {};
  let totalScoreProduct = 0;
  let totalGamesForAvg = 0;

  for (let i = 0; i <= 9; i++) {
    const count = getInt(`grid_score_${i}`);
    gridDistribution[i.toString()] = count;

    // Accumulate for average: (Score Value * How many people got it)
    totalScoreProduct += i * count;
    totalGamesForAvg += count;
  }

  const gridAverageScore =
    totalGamesForAvg > 0
      ? Number((totalScoreProduct / totalGamesForAvg).toFixed(2))
      : null;

  // 5. Grid Heatmap
  const gridHeatmap: Record<string, number> = {};
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const coord = `${r}-${c}`;
      gridHeatmap[coord] = getInt(`grid_cell_${coord}_solved`);
    }
  }

  const classicGamesWon = parseInt(stats["games_won:classic"], 10) || 0;
  const classicAverageAttempts = stats["total_attempts:classic"]
    ? getAverage(stats["total_attempts:classic"], stats["games_won:classic"])
    : null;

  const abilityGamesWon = parseInt(stats["games_won:ability"], 10) || 0;
  const abilityAverageAttempts = stats["total_attempts:ability"]
    ? getAverage(stats["total_attempts:ability"], stats["games_won:ability"])
    : null;
  const gridGamesPlayed = parseInt(stats["games_played:grid"], 10) || 0;

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
      mostUnique: getInt("most_unique:grid") || null,
      averageScore: gridAverageScore,
      scoreDistribution: gridDistribution,
      solvedHeatmap: gridHeatmap,
      guessStats,
    },
  };
});
