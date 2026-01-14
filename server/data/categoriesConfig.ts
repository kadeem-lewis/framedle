import type { CategoryName } from "#shared/data/categoryMetadata";

export const categoryConfig: { key: CategoryName; type: string }[] = [
  {
    key: "sex",
    type: "string",
  },
  {
    key: "releaseDate",
    type: "string",
  },
  {
    key: "progenitor",
    type: "string",
  },
  {
    key: "isPrime",
    type: "boolean",
  },
  {
    key: "aura",
    type: "string",
  },
  {
    key: "playstyle",
    type: "string",
  },
  {
    key: "conclave",
    type: "boolean",
  },
  {
    key: "vaulted",
    type: "boolean",
  },
  {
    key: "exalted",
    type: "array",
  },
  {
    key: "health",
    type: "numeric_top_2",
  },
  {
    key: "shield",
    type: "numeric_top_2",
  },
  {
    key: "armor",
    type: "numeric_top_2",
  },
  {
    key: "energy",
    type: "numeric_top_2",
  },
  {
    key: "sprint",
    type: "numeric_top_2",
  },
];
