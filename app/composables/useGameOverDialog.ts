export function useGameOverDialog() {
  const { openDialog } = useDialog();
  const { currentDailyGridData } = storeToRefs(useDailiesStore());
  const { gameState } = storeToRefs(useGameStateStore());
  const { mode } = useGameMode();

  watch(
    currentDailyGridData,
    async (newData) => {
      if (!newData) return;
      if (newData.hasSeenPopup) return;

      if (
        mode.value === "grid" &&
        gameState.value &&
        gameState.value !== GameStatus.ACTIVE &&
        gameState.value !== GameStatus.PENDING
      ) {
        openDialog(dialogOptions.SUMMARY);

        try {
          await db.progress.where({ day: newData.day, mode: "grid" }).modify({
            hasSeenPopup: true,
          } as Partial<GridProgressData>);
        } catch (e) {
          console.error("Failed to update popup state", e);
        }
      }
    },
    { immediate: true },
  );
}
