import { getSortedPairIds } from "~~/server/utils/grid";
import type { ValidWarframeData } from "#shared/schemas/db";

export default defineTask({
  meta: {
    name: "generate:pairs",
    description: "Generate category pairs for warframe grid",
  },
  async run() {
    console.log("Starting category pair generation...");
    const db = useDrizzle();

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
        const intersection = catB.warframes.filter((warframe) =>
          warframesA.has(warframe),
        );

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

        const existingStats = new Map<string, number>();
        if (existingPair?.validWarframes) {
          (existingPair.validWarframes as ValidWarframeData[]).forEach(
            (warframe) => {
              existingStats.set(warframe.name, warframe.guessCount || 0);
            },
          );

          // Preserve total guesses count base (or recalculate from sum)
          // Recalculating is safer to ensure consistency
        }

        const validWarframesData = intersection.map((warframeName) => {
          const guessCount = existingStats.get(warframeName) || 0;
          totalGuesses += guessCount;
          return {
            name: warframeName,
            guessCount: guessCount,
          };
        });

        pairsToInsert.push({
          categoryA: idA,
          categoryB: idB,
          validWarframes: validWarframesData,
          totalGuesses: totalGuesses,
          lastUsed: existingPair?.lastUsed || null,
        });
      }
    }

    console.log(`Generated ${pairsToInsert.length} valid pairs.`);
    console.log("Pairs", pairsToInsert);

    if (pairsToInsert.length > 0) {
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
          },
        });
    }

    console.log("Category pairs updated successfully.");
    return { result: "Success" };
  },
});
