export function useGameOverDialog() {
  const { openDialog } = useDialog();
  const dailiesStore = useDailiesStore();
  const { isGameOver } = storeToRefs(useGameStateStore());

  const gridData = computed(() => dailiesStore.currentDailyGridData);

  watch(
    gridData,
    async (newData) => {
      if (!newData) return;

      if (isGameOver.value) {
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
