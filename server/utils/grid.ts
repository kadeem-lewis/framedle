import { warframes } from "#shared/data/warframes";
import { categoryConfig } from "../config/categories";
import { promises as fs } from "fs";

export function createCategoryId(fieldName: string, value: string): string {
  return `${fieldName}:${value}`;
}

export function createPairKey(idA: string, idB: string): string {
  return [idA, idB].sort().join("|");
}

const allWarframes = Object.values(warframes);

const tempCategoryMap = new Map();

export async function generateCategories() {
  for (const warframe of allWarframes) {
    for (const config of categoryConfig) {
      // 1. Get the value from the warframe
      const rawValue = warframe[config.key];
      if (rawValue === null || rawValue === undefined) continue;

      // 1. Normalize the values to loop over
      let valuesToProcess: unknown[] = [];

      if (config.key === "exalted") {
        valuesToProcess = [rawValue.length > 0 ? true : false];
      } else if (Array.isArray(rawValue)) {
        valuesToProcess = rawValue;
      } else if (config.key === "releaseDate") {
        valuesToProcess = [parseReleaseDate(rawValue)];
      } else {
        valuesToProcess = [rawValue];
      }

      for (const value of valuesToProcess) {
        const id = createCategoryId(config.key, String(value));

        if (!tempCategoryMap.has(id)) {
          tempCategoryMap.set(id, {
            id: id,
            description: config.template(value),
            type: config.type,
            key: config.key,
            frames: new Set(),
          });
        }

        tempCategoryMap.get(id).frames.add(warframe.name);
      }
    }
  }

  await fs.writeFile(
    "./shared/data/warframeCategories.json",
    JSON.stringify(Object.fromEntries(tempCategoryMap)),
  );
}
