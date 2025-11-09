export function useMigration() {
  function migrateGameStats() {
    const { stats } = storeToRefs(useStatsStore());
    const storedStats = localStorage.getItem("stats");
    if (!storedStats) return { success: false, message: "No old stats found" };
    try {
      const parsedStats = JSON.parse(storedStats).stats;
      console.log("Migrating stats:", parsedStats);

      stats.value.classic.maxStreak = Math.max(
        stats.value.classic.maxStreak,
        Number(parsedStats.classic?.maxStreak) || 0,
      );
      stats.value.classic.plays += parsedStats.classic?.plays || 0;
      stats.value.classic.wins += parsedStats.classic?.wins || 0;

      stats.value.ability.maxStreak = Math.max(
        stats.value.ability.maxStreak,
        Number(parsedStats.ability?.maxStreak) || 0,
      );
      stats.value.ability.plays += Number(parsedStats.ability?.plays) || 0;
      stats.value.ability.wins += Number(parsedStats.ability?.wins) || 0;
      for (let i = 0; i < 6; i++) {
        stats.value.classic.guesses[i] +=
          parsedStats.classic?.guesses?.[i] || 0;
        stats.value.ability.guesses[i] +=
          parsedStats.ability?.guesses?.[i] || 0;
      }
      console.log("Migration complete. New stats:", stats.value);
      localStorage.removeItem("stats");
      return { success: true, message: "Stats migrated successfully!" };
    } catch (error) {
      console.error("Failed to migrate game stats:", error);
      localStorage.removeItem("stats");
      return {
        success: false,
        message: "An error occurred during migration",
      };
    }
  }

  const shouldShowMigrationBanner = computed(() => {
    return !!localStorage.getItem("stats");
  });

  return {
    migrateGameStats,
    shouldShowMigrationBanner,
  };
}
