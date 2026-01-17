export function useGameSync() {
  const {
    currentDailyClassicData,
    currentDailyAbilityData,
    currentDailyGridData,
  } = storeToRefs(useDailiesStore());
  const { setClassicGameData, setAbilityGameData } = useGameStore();
  const { syncGridData } = useGridGameStore();

  watch(
    currentDailyClassicData,
    (newData) => {
      if (newData) {
        setClassicGameData(newData);
      }
    },
    { immediate: true },
  );

  watch(
    currentDailyAbilityData,
    (newData) => {
      if (newData) {
        setAbilityGameData(newData);
      }
    },
    { immediate: true },
  );

  watch(
    currentDailyGridData,
    (newData) => {
      if (newData) {
        syncGridData(newData);
      }
    },
    { immediate: true },
  );
}
