import { format, startOfTomorrow } from "date-fns";
import { max } from "drizzle-orm";

export default defineTask({
  meta: {
    name: "add-daily",
    description: "Add a new daily entry",
  },
  async run() {
    try {
      const classicPuzzle = await getNextFromQueue("warframe");

      const abilityPuzzle = await getNextFromQueue("ability");

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

      const date = format(startOfTomorrow(), "yyyy-MM-dd");
      const readableDate = format(startOfTomorrow(), "PPP");

      const puzzlesToCreate: { mode: "classic" | "ability"; answer: string }[] =
        [
          { mode: "classic", answer: classicPuzzle },
          { mode: "ability", answer: abilityPuzzle },
        ];

      const valuesToInsert = puzzlesToCreate.map(({ mode, answer }) => {
        // Get the last day for this specific mode, defaulting to 0 if it's a new mode
        const lastDay = lastDayMap.get(mode) ?? 0;
        return {
          date,
          readableDate,
          day: lastDay + 1,
          mode: mode,
          puzzle: { answer },
        };
      });

      await useDrizzle().insert(tables.daily).values(valuesToInsert);

      console.log(`✅ New daily entries added for ${readableDate}:`);

      return {
        result: "Success",
      };
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Failed to add new daily entries",
        data: error,
      });
    }
  },
});
