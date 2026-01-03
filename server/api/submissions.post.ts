import z from "zod";

const submissionsPostSchema = z.object({
  date: z.iso.date(),
  mode: z.enum(["classic", "ability", "grid"]),
  won: z.boolean(),
  guessCount: z.number().int().nonnegative(),
  gridStats: z
    .object({
      mostUnique: z.number().int().nonnegative(),
      solvedSlots: z.array(z.string().regex(/^\d-\d$/)),
    })
    .optional(),
});

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

  if (mode === "classic" || mode === "ability") {
    if (won) {
      multi.hIncrBy(dailyStatsKey, `games_won:${mode}`, 1);
      multi.hIncrBy(dailyStatsKey, `total_attempts:${mode}`, guessCount);
    }
  }

  await multi.exec();

  if (mode === "grid" && gridStats) {
    const { mostUnique, solvedSlots } = gridStats;
    const field = `most_unique:grid`;
    const currentUniqueStr = await redis.hGet(dailyStatsKey, field);
    const currentUnique = currentUniqueStr
      ? parseInt(currentUniqueStr)
      : Infinity;

    const gridMulti = redis.multi();
    if (mostUnique < currentUnique) {
      gridMulti.hSet(dailyStatsKey, field, mostUnique);
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
