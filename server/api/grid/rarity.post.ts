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

  const checkPromises = Object.entries(gridSubmissions).map(
    async ([coord, warframeName]) => {
      const key = `daily:rarity:${date}:${coord}`;

      const response = await redis.hmGet(key, ["total", warframeName]);
      const [totalStr, countStr] = response as unknown as [
        string | null,
        string | null,
      ];

      return {
        coord,
        total: parseInt(totalStr ?? "0", 10),
        count: parseInt(countStr ?? "0", 10),
      };
    },
  );

  const results = await Promise.all(checkPromises);

  const rarity: Record<string, number> = {};

  for (const { coord, total, count } of results) {
    if (total === 0) {
      rarity[coord] = 0;
    } else {
      rarity[coord] = Number(((count / total) * 100).toFixed(2));
    }
  }

  return { results: rarity };
});
