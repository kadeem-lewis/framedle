export const GameStatus = {
  ACTIVE: "active",
  WON: "won",
  LOST: "lost",
  PENDING: "pending",
} as const;

export type GameStatusType = (typeof GameStatus)[keyof typeof GameStatus];

export const useGameStateStore = defineStore("gameState", () => {
  const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());
  const { currentGame } = storeToRefs(useGridGameStore());

  const { mode } = useGameMode();

  const gameState = computed(() => {
    const gameMode = mode.value;
    if (!gameMode) return GameStatus.PENDING;

    if (isLegacyMode(gameMode)) {
      if (!itemToGuess.value[gameMode]) return GameStatus.PENDING;
      return updateLegacyState(
        gameMode,
        attempts.value[gameMode],
        itemToGuess.value[gameMode],
        guessedItems.value[gameMode],
      );
    }

    return updateGridState();
  });

  function updateGridState() {
    if (!currentGame.value.config) return GameStatus.PENDING;

    const totalCells =
      currentGame.value.config.rows.length *
      currentGame.value.config.columns.length;

    const correctCells = Object.values(currentGame.value.grid).filter(
      (cell) => cell.value && !cell.isExtra,
    );

    const isWin = totalCells > 0 && correctCells.length === totalCells;
    if (isWin) return GameStatus.WON;
    const isLoss =
      (currentGame.value.attempts <= 0 ||
        currentGame.value.attempts === Infinity) &&
      !isWin;

    if (isLoss) return GameStatus.LOST;
    return GameStatus.ACTIVE;
  }

  function updateLegacyState(
    gameMode: LegacyMode,
    currentAttempts: number,
    correctAnswer: WarframeName | AbilityName,
    currentGuessedItems: WarframeName[],
  ) {
    let won = false;
    if (gameMode === "classic" || gameMode === "classicUnlimited") {
      won = currentGuessedItems.some(
        (guessedItem) => guessedItem === correctAnswer,
      );
    }
    if (gameMode === "ability" || gameMode === "abilityUnlimited") {
      won = currentGuessedItems.some(
        (guessedItem) => guessedItem === getAbility(correctAnswer).belongsTo,
      );
    }

    if (won) return GameStatus.WON;

    return currentAttempts <= 0 ? GameStatus.LOST : GameStatus.ACTIVE;
  }

  const { isLegacyMode } = useGameMode();

  const hasWon = computed(() => gameState.value === GameStatus.WON);

  const isGameOver = computed(
    () =>
      gameState.value !== GameStatus.ACTIVE &&
      gameState.value !== GameStatus.PENDING,
  );

  return {
    gameState,
    hasWon,
    isGameOver,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStateStore, import.meta.hot));
}
