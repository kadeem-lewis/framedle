export default function useGameState() {
  const { mode, itemToGuess, guessedItems, attempts } =
    storeToRefs(useGameStore());
  const hasWon = computed(() => {
    if (!mode.value) return;
    if (mode.value === "ability" || mode.value === "abilityUnlimited") {
      return (
        attempts.value[mode.value] >= 0 &&
        guessedItems.value[mode.value].some(
          (guessedItem) =>
            guessedItem.name === itemToGuess.value[mode.value]?.belongsTo,
        )
      );
    }
    if (mode.value === "classic" || mode.value === "classicUnlimited") {
      return (
        attempts.value[mode.value] >= 0 &&
        guessedItems.value[mode.value].some(
          (guessedItem) =>
            guessedItem.name === itemToGuess.value[mode.value]?.name,
        )
      );
    }
    return false;
  });

  return { hasWon };
}
