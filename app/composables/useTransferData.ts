import {
  addDays,
  format,
  max as dateMax,
  compareDesc,
  subDays,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";

export function useTransferData() {
  const statsStore = useStatsStore();
  const { stats } = storeToRefs(statsStore);
  const { createDefaultGuessStats, createDefaultGridStats } = statsStore;
  const { DEFAULT_ATTEMPTS } = useGameStore();
  const dataTransfer = useLocalStorage<{
    code: string | null;
    exportedAt: string | null;
  }>("dataTransfer", {
    code: null,
    exportedAt: null,
  });

  const { isFinished } = useTimeUntil(() =>
    addDays(dataTransfer.value.exportedAt!, 1),
  );

  async function exportData() {
    try {
      const userProgress = await db.progress.toArray();
      const userStats = stats.value;
      const response = await $fetch("/api/migration", {
        method: "POST",
        body: {
          stats: userStats,
          progress: userProgress,
        },
      });
      dataTransfer.value = {
        code: response.migrationId,
        exportedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  }

  const isImporting = ref(false);
  const importSucceeded = ref(false);
  const importError = ref<unknown>(null);

  async function importData(code: string) {
    isImporting.value = true;
    importSucceeded.value = false;
    importError.value = null;
    try {
      const response = await $fetch("/api/migration", {
        query: { code },
      });
      const { stats: importedStats, progress } = response;
      await db.progress.bulkPut(progress);

      if (!stats.value) {
        localStorage.setItem(
          "stats.v2",
          JSON.stringify({ stats: importedStats }),
        );
      } else {
        stats.value = await recomputeStats(stats.value, importedStats);
      }
      importSucceeded.value = true;
      return { ok: true };
    } catch (error) {
      console.error("Error importing data:", error);
      importError.value = error;
      return { ok: false, error: "Failed to import data" };
    } finally {
      isImporting.value = false;
    }
  }

  async function recomputeStats(
    localStats: typeof stats.value,
    importedStats: typeof stats.value,
  ) {
    const [abilityProgress, classicProgress, gridProgress] = await Promise.all([
      db.progress.where({ mode: "ability" }).toArray(),
      db.progress.where({ mode: "classic" }).toArray(),
      db.progress.where({ mode: "grid" }).toArray() as Promise<
        GridProgressData[]
      >,
    ]);

    return {
      classic: recomputeLegacyStats(
        classicProgress,
        localStats.classic,
        importedStats.classic,
      ),
      ability: recomputeLegacyStats(
        abilityProgress,
        localStats.ability,
        importedStats.ability,
      ),
      grid: recomputeGridStats(
        gridProgress,
        localStats.grid,
        importedStats.grid,
      ),
    };
  }

  function recomputeLegacyStats(
    gameProgress: ProgressData[],
    localStats: LegacyModeStats,
    importedStats: LegacyModeStats,
  ) {
    const stats = createDefaultGuessStats();
    stats.plays = gameProgress.filter(
      (progress) =>
        progress.state !== GameStatus.ACTIVE &&
        progress.countsTowardDailyStats !== false,
    ).length;
    stats.wins = gameProgress.filter(
      (progress) => progress.state === GameStatus.WON,
    ).length;
    gameProgress.forEach((progress) => {
      if (progress.state === GameStatus.WON) {
        const attemptsUsed = DEFAULT_ATTEMPTS - progress.attempts;
        const guessIndex = attemptsUsed - 1;
        stats.guesses[guessIndex] = (stats.guesses[guessIndex] || 0) + 1;
      }
    });
    stats.lastPlayedDate = getLastPlayedDate(localStats, importedStats);
    const lastCorrectDates = [
      localStats.lastCorrectDate,
      (importedStats as LegacyModeStats).lastCorrectDate,
    ].filter((date) => date !== null);
    stats.lastCorrectDate =
      lastCorrectDates.length > 0
        ? format(dateMax(lastCorrectDates), "yyyy-MM-dd")
        : null;

    const wonDates = gameProgress
      .filter((item) => item.state === GameStatus.WON)
      .map((item) => item.date);
    stats.streak = calculateStreak(wonDates);
    stats.maxStreak = Math.max(
      stats.streak,
      importedStats.maxStreak,
      localStats.maxStreak,
    );
    return stats;
  }

  function recomputeGridStats(
    gameProgress: GridProgressData[],
    localStats: GridModeStats,
    importedStats: GridModeStats,
  ) {
    const stats = createDefaultGridStats();

    const gridScores = gameProgress
      .filter(
        (progress) =>
          progress.state !== GameStatus.ACTIVE &&
          progress.countsTowardDailyStats !== false,
      )
      .map((progress) => calculateGridScore(progress.gridState));
    stats.plays = gridScores.length;
    stats.averageScore =
      gridScores.length > 0
        ? gridScores.reduce((total, score) => total + score, 0) /
          gridScores.length
        : null;

    stats.scoreDistribution = gridScores.reduce(
      (acc, score) => {
        acc[score] = (acc[score] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    stats.lastPlayedDate = getLastPlayedDate(localStats, importedStats);

    const gridStreakDates = gameProgress
      .filter((item) => calculateGridScore(item.gridState) > 0)
      .map((item) => item.date);
    stats.streak = calculateStreak(gridStreakDates);
    stats.maxStreak = Math.max(
      stats.streak,
      importedStats.maxStreak,
      localStats.maxStreak,
    );

    return stats;
  }

  function getLastPlayedDate(
    localStats: LegacyModeStats | GridModeStats,
    importedStats: LegacyModeStats | GridModeStats,
  ) {
    const lastPlayedDates = [
      localStats.lastPlayedDate,
      importedStats.lastPlayedDate,
    ].filter((date): date is string => date !== null);
    if (lastPlayedDates.length > 0) {
      return format(dateMax(lastPlayedDates), "yyyy-MM-dd");
    }
    return null;
  }

  function calculateStreak(dates: string[]) {
    if (dates.length === 0) return 0;

    const completedDates = [...dates].sort(compareDesc);

    const latestDate = parseISO(completedDates[0]!);
    const yesterday = subDays(startOfDay(new Date()), 1);

    if (!isSameDay(latestDate, yesterday) && !isSameDay(latestDate, new Date()))
      return 0;

    let streak = 1;
    let expectedPreviousDate = latestDate;

    for (let index = 1; index < completedDates.length; index++) {
      expectedPreviousDate = subDays(expectedPreviousDate, 1);

      if (
        completedDates[index] !== format(expectedPreviousDate, "yyyy-MM-dd")
      ) {
        break;
      }

      streak++;
    }

    return streak;
  }

  watch(
    isFinished,
    (newIsFinished) => {
      if (newIsFinished) {
        dataTransfer.value = {
          code: null,
          exportedAt: null,
        };
      }
    },
    { immediate: true },
  );

  return {
    dataTransfer,
    isImporting,
    importSucceeded,
    importError,
    exportData,
    importData,
  };
}
