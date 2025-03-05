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
    const gameMode = mode.value as keyof typeof itemToGuess.value;
    if (!gameMode) throw createError("Mode is not set");
    if (gameMode === "ability" || gameMode === "abilityUnlimited") {
      return (
        attempts.value[gameMode] >= 0 &&
        guessedItems.value[gameMode].some(
          (guessedItem) =>
            guessedItem.name === itemToGuess.value[gameMode]?.belongsTo,
        )
      );
    }
    if (gameMode === "classic" || gameMode === "classicUnlimited") {
      return (
        attempts.value[gameMode] >= 0 &&
        guessedItems.value[gameMode].some(
          (guessedItem) =>
            guessedItem.name === itemToGuess.value[gameMode]?.name,
        )
      );
    }
    return false;
  });

  return { hasWon, isGameOver };
}
