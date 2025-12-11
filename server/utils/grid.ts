import { warframes } from "#shared/data/warframes";
import { categoryConfig } from "../data/categoriesConfig";
import { manualCategories } from "../data/manualCategories";

type CategoryKey = Omit<
  keyof (typeof warframes)[keyof typeof warframes],
  "abilities" | "name" | "imageName"
> &
  string;

type Category = {
  description: string;
  type: string;
  key: CategoryKey;
  label: string;
  id: string;
  warframes: Set<string>;
  lastUsed: string | null;
};

export function createCategoryId(
  fieldName: CategoryKey,
  value: string,
): string {
  return `${fieldName}:${value}`;
}

export function createPairKey(idA: string, idB: string): string {
  return [idA, idB].sort().join("|");
}

export async function generateCategories() {
  const allWarframes = Object.values(warframes);

  const existingCategories = await useDrizzle()
    .select()
    .from(tables.categories)
    .catch((error) => {
      console.error("Error fetching existing categories:", error);
      return null;
    });

  const existingMap = new Map(existingCategories?.map((cat) => [cat.id, cat]));

  const tempCategoryMap = new Map<string, Category>();

  for (const warframe of allWarframes) {
    for (const config of categoryConfig) {
      const rawValue = warframe[config.key as keyof typeof warframe];
      if (rawValue === null || rawValue === undefined) continue;

      if (config.key === "vaulted" && rawValue === false) continue;

      let valuesToProcess: (string | boolean | number)[] = [];

      if (config.key === "exalted") {
        valuesToProcess = [
          Array.isArray(rawValue) && rawValue.length > 0 ? true : false,
        ];
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

          // Type-safe description generation
          let description = "";
          let label = "";
          if (config.type === "string") {
            description = config.template(value as string);
            label = config.label(value as string);
          } else if (config.type === "boolean") {
            description = config.template(value as boolean);
            label = config.label(value as boolean);
          } else if (config.type === "numeric_top_2") {
            description = config.template(value as number);
            label = config.label(value as number);
          } else if (config.type === "array") {
            description = config.template(value as unknown as string[]);
            label = config.label(value as unknown as string[]);
          }

          // Initialize with existing DB warframes if available (Merging logic)
          const initialWarframes = existing
            ? new Set(existing.warframes)
            : new Set<string>();

          tempCategoryMap.set(id, {
            id: id,
            key: config.key,
            label,
            type: config.type,
            description,
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

    const filteredGroup = processedGroup.filter(
      (category) => category.warframes.size >= 4,
    );

    finalAutomatedCategories.push(...filteredGroup);
  }

  const combinedCategories = [...finalAutomatedCategories, ...manualCategories];

  const valuesToInsert = combinedCategories.map((cat) => ({
    id: cat.id,
    key: cat.key,
    type: cat.type,
    label: cat.label,
    description: cat.description,
    warframes: Array.isArray(cat.warframes)
      ? cat.warframes
      : Array.from(cat.warframes),
    lastUsed: cat.lastUsed || null,
  }));

  await useDrizzle()
    .insert(tables.categories)
    .values(valuesToInsert)
    .onConflictDoUpdate({
      target: tables.categories.id,
      set: {
        warframes: sql.raw(`excluded.warframes`),
        label: sql.raw(`excluded.label`),
        description: sql.raw(`excluded.description`),
        type: sql.raw(`excluded.type`),
        key: sql.raw(`excluded.key`),
      },
    });
}
