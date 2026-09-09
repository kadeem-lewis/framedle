export function calculateGridScore(grid: Record<string, GridCell>) {
  return Object.values(grid).filter((cell) => cell.value && !cell.isExtra)
    .length;
}

export function calculateGridRarity(grid: Record<string, GridCell>) {
  const BASE_RARITY_SCORE = 900;
  const usedRarityScores = Object.values(grid)
    .filter((cell) => cell.rarity && !cell.isExtra)
    .reduce((acc, cell) => acc + (100 - cell.rarity!), 0);
  return formatFloat(BASE_RARITY_SCORE - usedRarityScores);
}
