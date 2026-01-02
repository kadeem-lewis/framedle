import z from "zod";

const submissionsPostSchema = z.object({
  date: z.iso.date(),
  mode: z.enum(["classic", "ability", "grid"]),
  won: z.boolean(),
  guessCount: z.number().int().positive(),
  gridStats: z
    .object({
      mostUnique: z.number().int().positive(),
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

  const redis = useRedis();
  const dailyStatsKey = `daily:stats:${date}`;

  const pipeline = redis.pipeline();

  pipeline.hincrby(dailyStatsKey, `games_played:${mode}`, 1);

  if (mode === "classic" || mode === "ability") {
    if (won) {
      pipeline.hincrby(dailyStatsKey, `games_won:${mode}`, 1);
      pipeline.hincrby(dailyStatsKey, `total_attempts:${mode}`, guessCount);
    }
  }

  if (mode === "grid" && gridStats) {
    // I need a way to find the current value of most unique and only update it if the new value is lower
    pipeline.hset(dailyStatsKey, `most_unique:grid`, gridStats.mostUnique);
  }

  await pipeline.exec();

  return {
    daily: null,
  };
});
