import { categoryConfig } from "~~/server/data/categoriesConfig";
import type { Category, CategoryKey } from "~~/server/utils/grid";
import { warframes } from "#shared/data/warframes";
import { manualCategories } from "~~/server/data/manualCategories";

export default defineTask({
  meta: {
    name: "generate:categories",
    description: "Generate category list for warframe grid",
  },
  async run() {
    const allWarframes = Object.values(warframes);

    const existingCategories = await useDrizzle()
      .select()
      .from(tables.categories)
      .catch((error) => {
        console.error("Error fetching existing categories:", error);
        return null;
      });

    const existingMap = new Map(
      existingCategories?.map((cat) => [cat.id, cat]),
    );

    const tempCategoryMap = new Map<string, Category>();

    for (const warframe of allWarframes) {
      for (const config of categoryConfig) {
        const rawValue = warframe[config.key as keyof typeof warframe];
        if (rawValue === null || rawValue === undefined) continue;

        if (config.key === "vaulted" && rawValue === false) continue; // Skip non-vaulted frames

        let valuesToProcess: (string | boolean | number)[] = [];

        if (config.key === "exalted") {
          valuesToProcess = [true]; // Only warframes with Exalteds have the exalted field
        } else if (Array.isArray(rawValue)) {
          valuesToProcess = rawValue;
        } else if (config.key === "releaseDate") {
          valuesToProcess = [parseReleaseDate(String(rawValue))];
        } else {
          valuesToProcess = [rawValue as string | boolean | number];
        }

        for (const value of valuesToProcess) {
          const id = createCategoryId(config.key, String(value));

          if (!tempCategoryMap.has(id)) {
            const existing = existingMap.get(id);

            const initialWarframes = existing
              ? new Set(existing.warframes) // existing.warframes is the list of valid warframes from DB
              : new Set<string>();

            tempCategoryMap.set(id, {
              id: id,
              key: config.key,
              type: config.type,
              warframes: initialWarframes,
              lastUsed: existing?.lastUsed ?? null, // Preserve lastUsed
            });
          }

          tempCategoryMap.get(id)?.warframes.add(warframe.name);
        }
      }
    }
    const allGeneratedCategories = Array.from(tempCategoryMap.values());

    const groupedCategories = allGeneratedCategories.reduce(
      (acc, category) => {
        const key = category.key;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(category);
        return acc;
      },
      {} as Record<CategoryKey, Category[]>,
    );

    const finalAutomatedCategories: Category[] = [];

    for (const key in groupedCategories) {
      const categories = groupedCategories[key];
      const type = categories[0].type; // All categories in a group have the same type

      let processedGroup = [];

      if (type === "numeric_top_2") {
        processedGroup = categories
          .sort((a, b) => b.warframes.size - a.warframes.size) // Sort by most popular
          .slice(0, 2); // Get just the top 2
      } else {
        // This is for 'string' types or any other default
        processedGroup = categories;
      }

      const MINIMUM_CATEGORY_SIZE = 4;

      const filteredGroup = processedGroup.filter(
        (category) => category.warframes.size >= MINIMUM_CATEGORY_SIZE,
      );

      finalAutomatedCategories.push(...filteredGroup);
    }

    const combinedCategories = [
      ...finalAutomatedCategories,
      ...manualCategories,
    ];

    const valuesToInsert = combinedCategories.map((cat) => ({
      id: cat.id,
      key: cat.key,
      warframes: Array.isArray(cat.warframes)
        ? cat.warframes
        : Array.from(cat.warframes),
      lastUsed: cat.lastUsed || null,
    }));

    try {
      await useDrizzle()
        .insert(tables.categories)
        .values(valuesToInsert)
        .onConflictDoUpdate({
          target: tables.categories.id,
          set: {
            warframes: sql.raw(`excluded.warframes`),
            key: sql.raw(`excluded.key`),
          },
        });
      return { result: "Success" };
    } catch (error) {
      console.error("Error inserting/updating categories:", error);
      return { result: "Failure", error };
    }
  },
});
