import { generateCategories } from "~~/server/utils/grid";

export default defineTask({
  meta: {
    name: "generate:categories",
    description: "Generate category list for warframe grid",
  },
  async run() {
    await generateCategories();
    return { result: "Success" };
  },
});
