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
    const data = await fetchWarframeData();
    const warframes = buildWarframeData(data);
    const abilities = await buildAbilityData(warframes);

    const updatedWarframes = updateWarframeDataFromAbilities(
      warframes,
      abilities,
    );

    await writeDataToFile(updatedWarframes, abilities);

    const payload = {
      warframeNames: Object.keys(updatedWarframes),
      abilityNames: Object.keys(abilities),
    };

    //! I can't run the queue yet because I am still connected to the production db and that would push unwanted changes

    return {
      result: "Success",
      builtWarframeData: Object.fromEntries(updatedWarframes.entries()),
    };
  },
});
