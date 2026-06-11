import {
  fetchWarframeData,
  buildWarframeData,
  buildAbilityData,
  updateWarframeDataFromAbilities,
  writeDataToFile,
} from "~~/server/utils/dataBuilder";

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

      await writeDataToFile(updatedWarframes, abilities);

      const payload = {
        warframeNames: [...updatedWarframes.keys()],
        abilityNames: [...abilities.keys()],
      };

      await runTask("generate:queue", {
        payload,
      });

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
