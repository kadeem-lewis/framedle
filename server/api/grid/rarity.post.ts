import { z } from "zod";

const raritySchema = z.object({
  date: z.iso.date(),
  gridSubmissions: z.record(z.string().regex(/^\d-\d$/), z.string()),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    raritySchema.safeParse(body),
  );

  if (!body.success) {
    console.log("body", body.error);
    throw createError({
      statusCode: 400,
      message: "Invalid query parameters",
    });
  }
  const { date, gridSubmissions } = body.data;

  const redis = await useRedis();

  const results = await Promise.all(
    Object.entries(gridSubmissions).map(async ([coord, warframeName]) => {
      const key = `daily:rarity:${date}:${coord}`;

      const [totalStr, countStr] = await redis.hmGet(key, [
        "total",
        warframeName,
      ]);

      const total = Number(totalStr ?? "0");
      const count = Number(countStr ?? "0");

      const rarity = total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0;

      return {
        coord,
        rarity,
      };
    }),
  );

  const rarities = Object.fromEntries(
    results.map(({ coord, rarity }) => [coord, rarity]),
  );

  const BASE_RARITY_SCORE = 900;

  const uniquenessScore = Object.values(rarities).reduce(
    (score, cellRarity) => score - (100 - cellRarity),
    BASE_RARITY_SCORE,
  );

  const roundedUniquenessScore = Number(uniquenessScore.toFixed(2));

  const bestScoreRaw = await redis.hGet(
    `daily:stats:${date}`,
    "most_unique:grid",
  );

  const bestScore = bestScoreRaw ? Number(bestScoreRaw) : Infinity;

  if (roundedUniquenessScore < bestScore) {
    await redis.hSet(
      `daily:stats:${date}`,
      "most_unique:grid",
      roundedUniquenessScore.toString(),
    );
  }

  //! Most unique score will lag behind by one refresh and it will only count scores for users who revisit the grid game.This might not always be the most unique but calculating that would require massive structural change
  return { results: rarities };
});
