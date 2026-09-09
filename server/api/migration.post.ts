import { z } from "zod";

const migrationSchema = z.object({
  stats: z.object({
    classic: z.record(z.string(), z.unknown()),
    ability: z.record(z.string(), z.unknown()),
    grid: z.record(z.string(), z.unknown()),
  }),
  progress: z
    .array(
      z.looseObject({
        mode: z.enum(["classic", "ability", "grid"]),
        date: z.iso.date(),
        day: z.number().int().positive(),
      }),
    )
    .max(10000),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    migrationSchema.safeParse(body),
  );
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid migration data",
    });
  }
  const { stats, progress } = body.data;

  try {
    const redis = await useRedis();
    const migrationId = generateCode(6);
    const migrationKey = `migration:${migrationId}`;

    await redis.setEx(
      migrationKey,
      60 * 60 * 24,
      JSON.stringify({ stats, progress }),
    );

    return { migrationId };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error saving migration data",
      data: error,
    });
  }
});
