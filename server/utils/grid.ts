import type { warframes } from "#shared/data/warframes";
import { inArray, isNull } from "drizzle-orm";
import type { Category as DBCategory } from "#shared/schemas/db";

export type CategoryKey = Omit<
  keyof (typeof warframes)[keyof typeof warframes],
  "abilities" | "name" | "imageName"
> &
  string;

export type Category = {
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

// It ensures we don't duplicate pairs (A+B is the same as B+A)
export function getSortedPairIds(idA: string, idB: string) {
  return idA < idB ? { a: idA, b: idB } : { a: idB, b: idA };
}

const CATEGORY_COOLDOWN_DAYS = 3 as const;
const RETRY_ATTEMPTS = 50 as const;

export type GridPuzzleOptions = {
  isUnlimited?: boolean;
};

export async function generateGridPuzzle(options: GridPuzzleOptions = {}) {
  const { isUnlimited = false } = options;
  console.log(
    `Generating 3x3 Grid (Mode: ${isUnlimited ? "Unlimited" : "Daily"})...`,
  );

  // 1. Fetch Candidates
  // Unlimited Mode: Fetch ALL categories.
  // Daily Mode: Fetch only categories not used recently.
  let validCategories;

  const db = useDrizzle();

  if (isUnlimited) {
    validCategories = await db.select().from(tables.categories);
  } else {
    validCategories = await db
      .select()
      .from(tables.categories)
      .where(
        or(
          isNull(tables.categories.lastUsed),
          sql`age(now(), ${tables.categories.lastUsed}) > interval '${sql.raw(CATEGORY_COOLDOWN_DAYS + " days")}'`,
        ),
      );
  }

  if (validCategories.length < 6)
    throw createError("Not enough valid categories!");

  // 2. Fetch Relationship Graph
  // Optimization: In a real app, you might cache this in memory (Redis/Global variable)
  // because it doesn't change often.
  const allPairs = await db.select().from(tables.categoryPairs);

  const adjacencyMap = new Map<string, Set<string>>();
  for (const pair of allPairs) {
    if (!adjacencyMap.has(pair.categoryA))
      adjacencyMap.set(pair.categoryA, new Set());
    if (!adjacencyMap.has(pair.categoryB))
      adjacencyMap.set(pair.categoryB, new Set());
    adjacencyMap.get(pair.categoryA)?.add(pair.categoryB);
    adjacencyMap.get(pair.categoryB)?.add(pair.categoryA);
  }

  function connectsToAll(rowId: string, colIds: string[]) {
    const connections = adjacencyMap.get(rowId);
    if (!connections) return false;
    return colIds.every((colId) => connections.has(colId));
  }

  // 3. Generation Loop
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const shuffledCats = shuffle(validCategories);
      const row1 = shuffledCats[0];

      // Find 3 valid columns
      const validColCandidates = shuffledCats.filter(
        (c) =>
          c.id !== row1.id &&
          c.key !== row1.key &&
          adjacencyMap.get(row1.id)?.has(c.id),
      );

      if (validColCandidates.length < 3) continue;

      const columns: DBCategory[] = [];
      const usedColKeys = new Set<string>();

      for (const candidate of validColCandidates) {
        if (!usedColKeys.has(candidate.key)) {
          columns.push(candidate);
          usedColKeys.add(candidate.key);
        }
        if (columns.length === 3) break;
      }

      if (columns.length < 3) continue;
      const colIds = columns.map((c) => c.id);

      // Find Row 2
      const row2Candidates = shuffledCats.filter(
        (c) =>
          c.id !== row1.id &&
          !colIds.includes(c.id) &&
          c.key !== row1.key &&
          !usedColKeys.has(c.key) &&
          connectsToAll(c.id, colIds),
      );

      if (row2Candidates.length === 0) continue;
      const row2 = row2Candidates[0];

      // Find Row 3
      const row3Candidates = shuffledCats.filter(
        (c) =>
          c.id !== row1.id &&
          c.id !== row2.id &&
          !colIds.includes(c.id) &&
          c.key !== row1.key &&
          c.key !== row2.key &&
          connectsToAll(c.id, colIds),
      );

      if (row3Candidates.length === 0) continue;
      const row3 = row3Candidates[0];

      const grid = {
        rowIds: [row1.id, row2.id, row3.id] as [string, string, string],
        colIds: [columns[0].id, columns[1].id, columns[2].id] as [
          string,
          string,
          string,
        ],
      };

      if (!isUnlimited) {
        const usedIds = [...grid.rowIds, ...grid.colIds];
        await db
          .update(tables.categories)
          .set({ lastUsed: sql`NOW()` })
          .where(inArray(tables.categories.id, usedIds));
      }

      return grid;
    } catch (e) {
      console.error("Grid generation attempt failed:", e);
    }
  }

  throw new Error("Failed to generate grid.");
}

export async function hydrateCategoryIds(catIds: string[]) {
  const { categories } = tables;

  try {
    const result = await useDrizzle()
      .select({
        id: categories.id,
        description: categories.description,
        label: categories.label,
      })
      .from(categories)
      .where(inArray(categories.id, catIds));

    const categoryMap = new Map<
      string,
      { label: string; description: string; id: string }
    >(result.map((cat) => [cat.id, cat]));
    return categoryMap;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw createError({
      statusCode: 500,
      message: typeof error === "string" ? error : (error as Error).message,
    });
  }
}

export function getCategoryData(
  map: Map<string, { label: string; description: string; id: string }>,
  id: string,
) {
  const cat = map.get(id);
  if (!cat) throw createError(`Category ${id} not found`);
  return cat;
}
