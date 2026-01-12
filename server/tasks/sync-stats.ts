import type {
  GridStatsData,
  ClassicStatsData,
  GridPuzzle,
} from "#shared/schemas/db";

export default defineTask({
  meta: {
    name: "sync:stats",
    description: "Sync Redis stats to the database",
  },
  async run() {
    const redis = await useRedis();
    const db = useDrizzle();

    console.log("Starting atomic stats sync...");

    // 1. Scan for all daily stat keys
    const keys = await redis.keys("daily:stats:*");
    const activeKeys = keys.filter((k) => !k.endsWith(":temp"));

    for (const key of activeKeys) {
      const tempKey = `${key}:temp`;
      const dateStr = key.replace("daily:stats:", "");

      // ATOMIC RENAME
      try {
        if (!(await redis.exists(key))) continue;
        await redis.rename(key, tempKey);
      } catch (e) {
        console.log(`Skipping locked key ${key}`, e);
        continue;
      }

      const stats = await redis.hGetAll(tempKey);
      if (!Object.keys(stats).length) {
        await redis.del(tempKey);
        continue;
      }

      const getInt = (k: string) => parseInt(stats[k] || "0", 10);

      // --- SYNC CLASSIC & ABILITY ---
      for (const mode of ["classic", "ability"] as const) {
        // ... (Previous logic for classic/ability remains the same)
        const played = getInt(`games_played:${mode}`);
        if (played === 0) continue;

        const won = getInt(`games_won:${mode}`);
        const attempts = getInt(`total_attempts:${mode}`);

        const existing = await db
          .select()
          .from(tables.stats)
          .where(
            and(eq(tables.stats.date, dateStr), eq(tables.stats.mode, mode)),
          )
          .limit(1);

        const dbData = (existing[0]?.data as ClassicStatsData) || {
          gamesWon: 0,
          totalAttempts: 0,
        };
        const dbPlayed = existing[0]?.gamesPlayed || 0;

        await db
          .insert(tables.stats)
          .values({
            date: dateStr,
            mode,
            gamesPlayed: dbPlayed + played,
            data: {
              gamesWon: dbData.gamesWon + won,
              totalAttempts: dbData.totalAttempts + attempts,
            },
          })
          .onConflictDoUpdate({
            target: [tables.stats.date, tables.stats.mode],
            set: {
              gamesPlayed: sql`excluded.games_played`,
              data: sql`excluded.data`,
            },
          });
      }

      // --- SYNC GRID ---
      const gridPlayed = getInt("games_played:grid");
      // We proceed even if played is 0 IF there is rarity data (edge case),
      // but usually played > 0 if rarity exists.
      if (gridPlayed > 0) {
        // 1. Parse Redis Data for Daily Stats
        // ... (Previous logic for scores/heatmap)
        const scoreDist: Record<string, number> = {};
        let redisScoreSum = 0;
        for (let i = 0; i <= 9; i++) {
          const c = getInt(`grid_score_${i}`);
          scoreDist[i] = c;
          redisScoreSum += i * c;
        }

        const heatmap: Record<string, number> = {};
        const rarityData: Record<string, Record<string, number>> = {};

        // 2. Fetch and Collate Rarity Data
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const coord = `${r}-${c}`;
            heatmap[coord] = getInt(`grid_cell_${coord}_solved`);

            const rKey = `daily:rarity:${dateStr}:${coord}`;
            const rData = await redis.hGetAll(rKey);

            if (Object.keys(rData).length) {
              rarityData[coord] = {};
              Object.entries(rData).forEach(([k, v]) => {
                if (k !== "total") rarityData[coord][k] = parseInt(v);
              });
              // Clean up rarity key
              await redis.del(rKey);
            }
          }
        }

        // 3. Update Daily Stats (Postgres)
        // ... (Previous logic for merging daily stats)
        if (gridPlayed > 0) {
          const existing = await db
            .select()
            .from(tables.stats)
            .where(
              and(
                eq(tables.stats.date, dateStr),
                eq(tables.stats.mode, "grid"),
              ),
            )
            .limit(1);

          const dbStats = (existing[0]?.data as GridStatsData) || {
            mostUniqueScore: null,
            totalScoreSum: 0,
            scoreDistribution: {},
            solvedHeatmap: {},
            rarity: {},
          };
          const dbPlayed = existing[0]?.gamesPlayed || 0;

          // Merge distributions...
          const mergedDist = { ...dbStats.scoreDistribution };
          Object.entries(scoreDist).forEach(
            ([k, v]) => (mergedDist[k] = (mergedDist[k] || 0) + v),
          );

          const mergedHeatmap = { ...dbStats.solvedHeatmap };
          Object.entries(heatmap).forEach(
            ([k, v]) => (mergedHeatmap[k] = (mergedHeatmap[k] || 0) + v),
          );

          const mergedRarity = dbStats.rarity
            ? structuredClone(dbStats.rarity)
            : {};
          Object.entries(rarityData).forEach(([coord, guesses]) => {
            if (!mergedRarity[coord]) mergedRarity[coord] = {};
            Object.entries(guesses).forEach(([char, count]) => {
              mergedRarity[coord][char] =
                (mergedRarity[coord][char] || 0) + count;
            });
          });

          // Merge Unique Score
          const redisUnique = stats["most_unique:grid"]
            ? parseFloat(stats["most_unique:grid"])
            : null;
          let finalUnique = dbStats.mostUniqueScore;
          if (redisUnique !== null) {
            if (
              finalUnique === null ||
              finalUnique === undefined ||
              redisUnique < finalUnique
            ) {
              finalUnique = redisUnique;
            }
          }

          await db
            .insert(tables.stats)
            .values({
              date: dateStr,
              mode: "grid",
              gamesPlayed: dbPlayed + gridPlayed,
              data: {
                mostUniqueScore: finalUnique,
                totalScoreSum: (dbStats.totalScoreSum || 0) + redisScoreSum,
                scoreDistribution: mergedDist,
                solvedHeatmap: mergedHeatmap,
                rarity: mergedRarity,
              },
            })
            .onConflictDoUpdate({
              target: [tables.stats.date, tables.stats.mode],
              set: {
                gamesPlayed: sql`excluded.games_played`,
                data: sql`excluded.data`,
              },
            });
        }

        // =========================================================
        // 4. NEW: GLOBAL CATEGORY PAIRS SYNC
        // =========================================================

        // Fetch the puzzle definition to map Coordinates -> Categories
        const puzzleRecord = await db
          .select()
          .from(tables.daily)
          .where(
            and(eq(tables.daily.date, dateStr), eq(tables.daily.mode, "grid")),
          )
          .limit(1);

        if (puzzleRecord.length > 0) {
          const puzzle = puzzleRecord[0].puzzle as GridPuzzle;
          const { rowIds, colIds } = puzzle;

          // Iterate through the rarity data we just pulled from Redis
          for (const [coord, guesses] of Object.entries(rarityData)) {
            const [rStr, cStr] = coord.split("-");
            const r = parseInt(rStr);
            const c = parseInt(cStr);

            const catA = rowIds[r];
            const catB = colIds[c];

            // Sort to match DB primary key storage
            const [idA, idB] = [catA, catB].sort();

            // Fetch the Category Pair
            const pairResult = await db
              .select()
              .from(tables.categoryPairs)
              .where(
                and(
                  eq(tables.categoryPairs.categoryA, idA),
                  eq(tables.categoryPairs.categoryB, idB),
                ),
              )
              .limit(1);

            if (pairResult.length > 0) {
              const pair = pairResult[0];
              let newTotal = pair.totalGuesses;
              // Create a copy of the validWarframes array
              const validWarframes = [...pair.validWarframes];

              // Apply updates
              Object.entries(guesses).forEach(([wfName, count]) => {
                newTotal += count;

                const idx = validWarframes.findIndex(
                  (w) => w.name.toLowerCase() === wfName.toLowerCase(),
                );

                if (idx !== -1) {
                  validWarframes[idx] = {
                    ...validWarframes[idx],
                    guessCount: validWarframes[idx].guessCount + count,
                  };
                }
              });

              // Update the Category Pair record
              await db
                .update(tables.categoryPairs)
                .set({
                  totalGuesses: newTotal,
                  validWarframes: validWarframes,
                  lastUsed: dateStr, // Update last used date
                })
                .where(
                  and(
                    eq(tables.categoryPairs.categoryA, idA),
                    eq(tables.categoryPairs.categoryB, idB),
                  ),
                );
            }
          }
        }
      }

      // 5. Delete the temp key
      await redis.del(tempKey);
    }
    return {
      result: "success",
    };
  },
});
