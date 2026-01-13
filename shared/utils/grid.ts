import type { CategoryName } from "#shared/data/categoryMetadata";

export function getKeyValueFromId(id: string): {
  key: CategoryName;
  value: string;
} {
  const [key, value] = id.split(":");
  return { key, value } as { key: CategoryName; value: string };
}
