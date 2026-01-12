import { z } from "zod";
import { eq } from "drizzle-orm";
import type { ClassicStatsData, GridStatsData } from "#shared/schemas/db";

const statsSchema = z.object({
  date: z.iso.date(),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (body) =>
    statsSchema.safeParse(body),
  );
  if (!query.success)
    throw createError({ statusCode: 400, message: "Invalid date" });

  const { date } = query.data;
  const redis = await useRedis();
  const db = useDrizzle();

  // --- 1. Fetch from Redis (Live / Unsynced data) ---
  const redisStats = await redis.hGetAll(`daily:stats:${date}`);
  const getRedisInt = (k: string) => parseInt(redisStats[k] || "0", 10);

  // --- 2. Fetch from DB (Archived data) ---
  const dbRecords = await db
    .select()
    .from(tables.stats)
    .where(eq(tables.stats.date, date));

  const getDbRecord = (mode: string) => dbRecords.find((r) => r.mode === mode);

  // --- 3. Helper: Merge Classic/Ability ---
  const mergeStandardMode = (mode: "classic" | "ability") => {
    const dbRow = getDbRecord(mode);
    const dbData = (dbRow?.data as ClassicStatsData) || {
      gamesWon: 0,
      totalAttempts: 0,
    };

    // Redis Values
    const rWon = getRedisInt(`games_won:${mode}`);
    const rAttempts = getRedisInt(`total_attempts:${mode}`);

    // Merged Values
    // Note: totalPlayed is not needed for the response in these modes, so we don't calculate it.
    const totalWon = dbData.gamesWon + rWon;
    const totalAttempts = dbData.totalAttempts + rAttempts;

    return {
      gamesWon: totalWon,
      averageAttempts: totalWon > 0 ? Math.round(totalAttempts / totalWon) : 0,
    };
  };

  // --- 4. Helper: Merge Grid ---
  const mergeGridMode = async () => {
    const dbRow = getDbRecord("grid");
    const dbData = (dbRow?.data as GridStatsData) || {
      totalScoreSum: 0,
      scoreDistribution: {},
      solvedHeatmap: {},
      rarity: {},
    };

    const rPlayed = getRedisInt("games_played:grid");
    // We use totalPlayed here for the average score calculation
    const totalPlayed = (dbRow?.gamesPlayed || 0) + rPlayed;

    // Merge Distribution
    const finalDist: Record<string, number> = { ...dbData.scoreDistribution };
    let redisScoreSum = 0;
    for (let i = 0; i <= 9; i++) {
      const count = getRedisInt(`grid_score_${i}`);
      if (count > 0) {
        finalDist[i] = (finalDist[i] || 0) + count;
        redisScoreSum += i * count;
      }
    }

    // Merge Average
    const combinedScoreSum = (dbData.totalScoreSum || 0) + redisScoreSum;
    const averageScore =
      totalPlayed > 0 ? Number((combinedScoreSum / totalPlayed).toFixed(2)) : 0;

    // Merge Heatmap
    const finalHeatmap: Record<string, number> = { ...dbData.solvedHeatmap };
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const coord = `${r}-${c}`;
        const count = getRedisInt(`grid_cell_${coord}_solved`);
        if (count > 0) finalHeatmap[coord] = (finalHeatmap[coord] || 0) + count;
      }
    }

    // Process Rarity
    // Correctly typed as Record<string, GuessStatEntry> to avoid 'any'
    const finalGuessStats: Record<string, GuessStatEntry> = {};

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const coord = `${r}-${c}`;

        // 1. Get DB Rarity for this cell
        const dbRarity = dbData.rarity?.[coord] || {};

        // 2. Get Redis Rarity for this cell
        const rKey = `daily:rarity:${date}:${coord}`;
        const rData = await redis.hGetAll(rKey);

        // 3. Merge
        const combinedCounts: Record<string, number> = { ...dbRarity };
        let cellTotal = 0;

        // Add DB totals
        Object.values(dbRarity).forEach((v) => (cellTotal += v));

        // Add Redis totals
        Object.entries(rData).forEach(([name, countStr]) => {
          if (name !== "total") {
            const val = parseInt(countStr);
            combinedCounts[name] = (combinedCounts[name] || 0) + val;
            cellTotal += val;
          }
        });

        // 4. Sort for Most/Least Popular
        const sorted = Object.entries(combinedCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        finalGuessStats[coord] = {
          total: cellTotal,
          mostPopular: sorted[0] || null,
          leastPopular: sorted.length > 0 ? sorted[sorted.length - 1] : null,
        };
      }
    }

    // Merge Unique Score
    const rUnique = redisStats["most_unique:grid"]
      ? parseFloat(redisStats["most_unique:grid"])
      : null;
    let finalUnique = dbData.mostUniqueScore;

    // Logic: If redis has a score, and it's lower (better) than DB, or DB is null, take Redis.
    if (rUnique !== null) {
      if (
        finalUnique === null ||
        finalUnique === undefined ||
        rUnique < finalUnique
      ) {
        finalUnique = rUnique;
      }
    }

    return {
      gamesPlayed: totalPlayed,
      mostUnique: finalUnique,
      averageScore,
      scoreDistribution: finalDist,
      solvedHeatmap: finalHeatmap,
      guessStats: finalGuessStats,
    };
  };

  return {
    classic: mergeStandardMode("classic"),
    ability: mergeStandardMode("ability"),
    grid: await mergeGridMode(),
  };
});
