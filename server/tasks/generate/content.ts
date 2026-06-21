import {
  fetchWarframeData,
  buildWarframeData,
  buildAbilityData,
  updateWarframeDataFromAbilities,
  writeDataToFile,
} from "~~/server/utils/dataBuilder";
import { syncImagesToR2 } from "~~/server/utils/imageUpload";

export default defineTask({
  meta: {
    name: "generate:content",
    description: "Generate the warframe and ability data used in app",
  },
  async run() {
    try {
      const data = await fetchWarframeData();
      const warframes = buildWarframeData(data);
      const abilities = await buildAbilityData(warframes);

      const updatedWarframes = updateWarframeDataFromAbilities(
        warframes,
        abilities,
      );

      const {
        warframes: syncedWarframes,
        abilities: syncedAbilities,
        stats,
      } = await syncImagesToR2(updatedWarframes, abilities);

      console.log("Image sync stats:", stats);

      await writeDataToFile(syncedWarframes, syncedAbilities);

      return {
        result: "Success",
      };
    } catch (error) {
      console.error("Error generating content:", error);
      return {
        result: "Error",
        error,
      };
    }
  },
});
