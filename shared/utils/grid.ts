import type { CategoryName } from "#shared/data/categoryMetadata";

export function getKeyValueFromId(id: string): {
  key: CategoryName;
  value: string;
} {
  const [key, value] = id.split(":");
  //TODO: This needs to somehow be advanced enough to convert string values back to their original types
  return { key, value } as { key: CategoryName; value: string };
}
