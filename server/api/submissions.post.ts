import { submissionsPostSchema } from "#shared/schemas/submissions";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    submissionsPostSchema.safeParse(body),
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }

  const { date, mode, won, guessCount, gridStats } = body.data;

  const redis = await useRedis();
  const dailyStatsKey = `daily:stats:${date}`;

  const multi = redis.multi();

  multi.hIncrBy(dailyStatsKey, `games_played:${mode}`, 1);

  if ((mode === "classic" || mode === "ability") && guessCount) {
    if (won) {
      multi.hIncrBy(dailyStatsKey, `games_won:${mode}`, 1);
      multi.hIncrBy(dailyStatsKey, `total_attempts:${mode}`, guessCount);
    }
  }

  await multi.exec();

  if (mode === "grid" && gridStats) {
    const { uniquenessScore, solvedSlots } = gridStats;
    const field = `most_unique:grid`;
    const currentUniqueStr = await redis.hGet(dailyStatsKey, field);
    const currentUnique = currentUniqueStr
      ? parseInt(currentUniqueStr)
      : Infinity;

    const gridMulti = redis.multi();
    if (uniquenessScore < currentUnique) {
      gridMulti.hSet(dailyStatsKey, field, uniquenessScore);
    }
    const score = solvedSlots.length;
    gridMulti.hIncrBy(dailyStatsKey, `grid_score_${score}`, 1);

    for (const coord of solvedSlots) {
      gridMulti.hIncrBy(dailyStatsKey, `grid_cell_${coord}_solved`, 1);
    }
    await gridMulti.exec();
  }

  return {
    status: 200,
    message: "Submission recorded successfully",
  };
});
