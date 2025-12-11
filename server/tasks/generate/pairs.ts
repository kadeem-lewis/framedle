import { generateCategoryPairs } from "~~/server/utils/grid";

export default defineTask({
  meta: {
    name: "generate:pairs",
    description: "Generate category pairs for warframe grid",
  },
  async run() {
    await generateCategoryPairs();
    return { result: "Success" };
  },
});
