import { format } from "date-fns";
import { processQueue } from "~~/server/utils/queue";

export default defineTask({
  meta: {
    name: "generate:queue",
    description: "Generate the warframe data used in app",
  },
  async run() {
    try {
      const updatedWarframeQueue = await processQueue(
        "warframe",
        warframeNames,
      );

      const updatedAbilityQueue = await processQueue("ability", abilityNames);

      await useDrizzle()
        .insert(tables.queue)
        .values([
          {
            name: "warframe",
            data: updatedWarframeQueue,
          },
          {
            name: "ability",
            data: updatedAbilityQueue,
          },
        ])
        .onConflictDoUpdate({
          target: tables.queue.name,
          set: {
            data: sql.raw(`excluded.data`),
            updatedAt: format(new Date(), "yyyy-MM-dd"),
          },
        });

      console.log("✅ Queue generation complete.");
      return { result: "Success" };
    } catch (error) {
      console.error("❌ Error generating queues:", error);
      return { result: "Error", error };
    }
  },
});
