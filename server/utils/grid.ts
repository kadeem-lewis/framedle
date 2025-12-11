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

// Add this helper if it's not already imported or defined
// It ensures we don't duplicate pairs (A+B is the same as B+A)
function getSortedPairIds(idA: string, idB: string) {
  return idA < idB ? { a: idA, b: idB } : { a: idB, b: idA };
}

export async function generateCategoryPairs() {
  console.log("Starting category pair generation...");
  const db = useDrizzle();

  // 1. Fetch all categories
  const allCategories = await db.select().from(tables.categories);

  // 2. Fetch existing pairs to preserve 'guesses' and 'lastUsed' history
  const existingPairs = await db
    .select()
    .from(tables.categoryPairs)
    .catch(() => []);

  // Create a quick lookup map for existing pairs
  // Key format: "idA|idB"
  const existingPairsMap = new Map<string, (typeof existingPairs)[0]>();
  for (const pair of existingPairs) {
    existingPairsMap.set(`${pair.categoryA}|${pair.categoryB}`, pair);
  }

  const pairsToInsert = [];

  // 3. Loop through categories to find combinations
  for (let i = 0; i < allCategories.length; i++) {
    for (let j = i + 1; j < allCategories.length; j++) {
      const catA = allCategories[i];
      const catB = allCategories[j];

      // --- CONSTRAINT CHECKS ---

      // Rule: Categories with the same key cannot be a pair...
      if (catA.key === catB.key) {
        // ...UNLESS the key is 'playstyle'
        if (catA.key !== "playstyle") {
          continue;
        }
      }

      // --- INTERSECTION LOGIC ---

      // Convert Array to Set for O(1) lookups
      const warframesA = new Set(catA.warframes);
      const intersection = catB.warframes.filter((w) => warframesA.has(w));

      // Rule: Filter out pairs with less than 2 valid answers
      if (intersection.length < 2) {
        continue;
      }

      // --- PREPARE DATA ---

      const { a: idA, b: idB } = getSortedPairIds(catA.id, catB.id);
      const pairKey = `${idA}|${idB}`;
      const existingPair = existingPairsMap.get(pairKey);

      // Merge Logic:
      // We need to map the new intersection list to the object structure { name, guesses }
      // If we already have data for a specific warframe in this pair, keep the guesses.
      // If it's a new warframe (recently released/updated), guesses start at 0.

      let totalGuesses = 0;

      // Create a lookup for existing stats for this specific pair
      const existingStats = new Map<string, number>();
      if (existingPair?.validWarframes) {
        // Assuming validWarframes is stored as JSONB array of objects
        (existingPair.validWarframes as any[]).forEach((w) => {
          existingStats.set(w.name, w.guessCount || 0);
        });

        // Preserve total guesses count base (or recalculate from sum)
        // Recalculating is safer to ensure consistency
      }

      const validWarframesData = intersection.map((wfName) => {
        const guessCount = existingStats.get(wfName) || 0;
        totalGuesses += guessCount;
        return {
          name: wfName,
          guessCount: guessCount,
        };
      });

      pairsToInsert.push({
        categoryA: idA,
        categoryB: idB,
        validWarframes: validWarframesData,
        totalGuesses: totalGuesses,
        lastUsed: existingPair?.lastUsed || null, // Preserve history
      });
    }
  }

  console.log(`Generated ${pairsToInsert.length} valid pairs.`);
  console.log("Pairs", pairsToInsert);

  //4. Batch Insert / Upsert
  if (pairsToInsert.length > 0) {
    // We process in chunks if the array is massive, but Drizzle handles reasonable sizes well.
    await db
      .insert(tables.categoryPairs)
      .values(pairsToInsert)
      .onConflictDoUpdate({
        target: [
          tables.categoryPairs.categoryA,
          tables.categoryPairs.categoryB,
        ],
        set: {
          validWarframes: sql.raw(`excluded."validWarframes"`),
          totalGuesses: sql.raw(`excluded."totalGuesses"`),
          // We DO NOT update 'lastUsed' here to preserve rotation logic
        },
      });
  }

  console.log("Category pairs updated successfully.");
}
