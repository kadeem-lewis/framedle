import { format, startOfTomorrow } from "date-fns";
import { warframes } from "#shared/data/warframes";
import { desc } from "drizzle-orm";

export default defineTask({
  meta: {
    name: "add-daily",
    description: "Add a new daily entry",
  },
  async run() {
    const classic = warframes[Math.floor(Math.random() * warframes.length)];

    const abilities = warframes
      .filter(
        (warframe) => !warframe.isPrime && warframe.name !== "Excalibur Umbra",
      )
      .map((warframe) =>
        warframe.abilities.map((ability) => ({
          ...ability,
          warframe: warframe.name,
        })),
      )
      .flat();

    const ability = abilities[Math.floor(Math.random() * abilities.length)];

    let lastDaily: Daily | null = null;

    try {
      const result = await useDrizzle()
        .select()
        .from(tables.daily)
        .orderBy(desc(tables.daily.day))
        .limit(1);

      lastDaily = result[0];
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Failed to fetch last daily entry",
        data: error,
      });
    }

    try {
      const newDaily = await useDrizzle()
        .insert(tables.daily)
        .values({
          classicId: classic.name,
          abilityId: ability.name,
          date: format(startOfTomorrow(), "yyyy-MM-dd"),
          day: lastDaily?.day ? lastDaily.day + 1 : 1,
        });

      console.log("New daily entry added:", newDaily);

      return {
        result: "Success",
      };
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Failed to add new daily entry",
        data: error,
      });
    }
  },
});
