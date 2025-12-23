import { format, startOfTomorrow } from "date-fns";
import { max } from "drizzle-orm";

export default defineTask({
  meta: {
    name: "add-daily",
    description: "Add a new daily entry",
  },
  async run() {
    try {
      const date = format(startOfTomorrow(), "yyyy-MM-dd");
      const readableDate = format(startOfTomorrow(), "PPP");

      const existingEntry = await useDrizzle()
        .select()
        .from(tables.daily)
        .where(eq(tables.daily.date, date))
        .limit(1);

      if (existingEntry.length > 0) {
        console.log(
          `ℹ️ Daily entry for ${readableDate} already exists. Skipping addition.`,
        );
        return {
          result: "Skipped - Already Exists",
        };
      }

      const classicPuzzle = await getNextFromQueue("warframe");

      const abilityPuzzle = await getNextFromQueue("ability");

      const gridPuzzle = await generateGridPuzzle();

      const lastDayResults = await useDrizzle()
        .select({
          mode: tables.daily.mode,
          lastDay: max(tables.daily.day),
        })
        .from(tables.daily)
        .groupBy(tables.daily.mode);

      const lastDayMap = new Map<string, number>();
      for (const result of lastDayResults) {
        if (result.mode && result.lastDay !== null) {
          lastDayMap.set(result.mode, result.lastDay);
        }
      }

      const valuesToInsert = [
        {
          date,
          readableDate,
          day: (lastDayMap.get("classic") ?? 0) + 1,
          mode: "classic" as const,
          puzzle: { answer: classicPuzzle },
        },
        {
          date,
          readableDate,
          day: (lastDayMap.get("ability") ?? 0) + 1,
          mode: "ability" as const,
          puzzle: { answer: abilityPuzzle },
        },
        {
          date,
          readableDate,
          day: (lastDayMap.get("grid") ?? 0) + 1,
          mode: "grid" as const,
          puzzle: gridPuzzle,
        },
      ];

      await useDrizzle().insert(tables.daily).values(valuesToInsert);

      console.log(`✅ New daily entries added for ${readableDate}:`);

      return {
        result: "Success",
      };
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Failed to add new daily entries :(",
        data: typeof error === "string" ? error : (error as Error).message,
      });
    }
  },
});
