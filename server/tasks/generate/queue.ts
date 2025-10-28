import { promises as fs } from "fs";
import { processQueue } from "~~/server/utils/queue";

export default defineTask({
  meta: {
    name: "generate:queue",
    description: "Generate the warframe data used in app",
  },
  async run({ payload }) {
    try {
      const currentWarframeNames =
        (payload?.warframeNames as WarframeName[]) || warframeNames;
      const updatedWarframeQueue = await processQueue(
        "warframe",
        currentWarframeNames,
      );

      const currentAbilityNames =
        (payload?.abilityNames as string[]) || abilityNames;
      const updatedAbilityQueue = await processQueue(
        "ability",
        currentAbilityNames,
      );

      await Promise.all([
        fs.writeFile(
          "./server/data/warframe-queue.json",
          JSON.stringify(updatedWarframeQueue, null, 2),
        ),
        fs.writeFile(
          "./server/data/ability-queue.json",
          JSON.stringify(updatedAbilityQueue, null, 2),
        ),
      ]);

      console.log("✅ Queue generation complete.");
      return { result: "Success" };
    } catch (error) {
      console.error("❌ Error generating queues:", error);
      return { result: "Error", error };
    }
  },
});
