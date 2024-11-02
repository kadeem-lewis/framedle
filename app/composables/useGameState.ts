export default function useGameState() {
  const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());

  const mode = useGameMode();

  const isGameOver = computed(() => ({
    classic:
      attempts.value.classic === 0 ||
      guessedItems.value.classic.some(
        (guessedItem) => guessedItem.name === itemToGuess.value.classic?.name,
      ),
    classicUnlimited:
      attempts.value.classicUnlimited === 0 ||
      guessedItems.value.classicUnlimited.some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value.classicUnlimited?.name,
      ),
    ability:
      attempts.value.ability === 0 ||
      guessedItems.value.ability.some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value.ability?.belongsTo,
      ),
    abilityUnlimited:
      attempts.value.abilityUnlimited === 0 ||
      guessedItems.value.abilityUnlimited.some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value.abilityUnlimited?.belongsTo,
      ),
  }));

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

  return { hasWon, isGameOver };
}
