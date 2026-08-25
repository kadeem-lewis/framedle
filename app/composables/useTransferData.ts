export function useTransferData() {
  const { stats } = storeToRefs(useStatsStore());
  const dataTransfer = useLocalStorage<{
    code: string | null;
    exportedAt: string | null;
  }>("dataTransfer", {
    code: null,
    exportedAt: null,
  });
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

  async function importData() {
    //send id to server
    // get progress and stats data from server
    // use put(?) to save data to dexie
    // compare stats data to local storage and update relevant stats most likely based on date
  }
  return {
    dataTransfer,
    exportData,
    importData,
  };
}
