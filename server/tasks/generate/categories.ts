import {
  progenitorElements,
  polarities,
  variant,
  playstyles,
} from "#shared/schemas/warframe";
import { warframes } from "#shared/data/warframes";
import { generateCategories } from "~~/server/utils/grid";

type Category = {
  warframes: Set<string>;
  lastUsed: string;
};

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
