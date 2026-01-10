export type GuessStatEntry = {
  total: number;
  mostPopular: { name: string; count: number } | null;
  leastPopular: { name: string; count: number } | null;
};

type GridStats = {
  gamesPlayed: number;
  mostUnique: number | null;
  averageScore: number | null;
  scoreDistribution: Record<string, number>;
  solvedHeatmap: Record<string, number>;
  guessStats: Record<string, GuessStatEntry>;
};

type LegacyStats = {
  gamesWon: number;
  averageAttempts: number | null;
};

export type StatsResponse = {
  grid: GridStats;
  classic: LegacyStats;
  ability: LegacyStats;
};
