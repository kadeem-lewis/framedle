import { format, startOfTomorrow } from "date-fns";
import { desc } from "drizzle-orm";

export default defineEventHandler(async () => {
  const { warframes } = await $fetch("/api/warframes");

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
    console.error(error);
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
      status: 200,
      ok: true,
    };
  } catch (error) {
    console.error(error);
  }
});
