export function useGameOverDialog() {
  const { openDialog } = useDialog();
  const dailiesStore = useDailiesStore();
  const { gameState } = storeToRefs(useGameStateStore());

  const gridData = computed(() => dailiesStore.currentDailyGridData);

  watch(
    gridData,
    async (newData) => {
      if (!newData) return;

      if (gameState.value.grid && gameState.value.grid !== GameStatus.ACTIVE) {
        const hasSeen = newData.hasSeenPopup === true;

        if (!hasSeen) {
          openDialog(dialogOptions.SUMMARY);

          try {
            await db.progress.where({ day: newData.day, mode: "grid" }).modify({
              hasSeenPopup: true,
            } as Partial<GridProgressData>);
          } catch (e) {
            console.error("Failed to update popup state", e);
          }
        }
      }
    },
    { immediate: true },
  );
}
