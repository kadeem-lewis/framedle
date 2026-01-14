export const GameStatus = {
  ACTIVE: "active",
  WON: "won",
  LOST: "lost",
  WON_PREVIOUS: "won:previous",
  LOST_PREVIOUS: "lost:previous",
} as const;

export type GameStatusType = (typeof GameStatus)[keyof typeof GameStatus];

export const useGameStateStore = defineStore(
  "gameState",
  () => {
    const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());
    const { currentGame } = storeToRefs(useGridGameStore());

    const { mode } = useGameMode();

    const gameState = ref<Record<GameMode, GameStatusType>>({
      classic: GameStatus.ACTIVE,
      classicUnlimited: GameStatus.ACTIVE,
      ability: GameStatus.ACTIVE,
      abilityUnlimited: GameStatus.ACTIVE,
      grid: GameStatus.ACTIVE,
      gridUnlimited: GameStatus.ACTIVE,
    });

    function updateStatus(mode: GameMode, won: boolean, lost: boolean) {
      const current = gameState.value[mode];

      if (won) {
        if (current === GameStatus.ACTIVE)
          gameState.value[mode] = GameStatus.WON;
        else if (current === GameStatus.WON)
          gameState.value[mode] = GameStatus.WON_PREVIOUS;
      } else if (lost) {
        if (current === GameStatus.ACTIVE)
          gameState.value[mode] = GameStatus.LOST;
        else if (current === GameStatus.LOST)
          gameState.value[mode] = GameStatus.LOST_PREVIOUS;
      } else {
        if (current !== GameStatus.ACTIVE) {
          gameState.value[mode] = GameStatus.ACTIVE;
        }
      }
    }

    function updateGridState(mode: GameMode) {
      if (!currentGame.value.config) return;

      const totalCells =
        currentGame.value.config.rows.length *
        currentGame.value.config.columns.length;

      const correctCells = Object.values(currentGame.value.grid).filter(
        (cell) => cell,
      );

      const isWin = totalCells > 0 && correctCells.length === totalCells;
      const isLoss = currentGame.value.attempts <= 0 && !isWin;

      updateStatus(mode, isWin, isLoss);
    }

    function updateGameState(
      gameMode: LegacyMode,
      currentAttempts: number,
      currentGuessedItems: WarframeName[],
    ) {
      if (!itemToGuess.value[gameMode]) return;

      let won = false;
      if (gameMode === "classic" || gameMode === "classicUnlimited") {
        won = currentGuessedItems.some(
          (guessedItem) => guessedItem === itemToGuess.value[gameMode],
        );
      }
      if (gameMode === "ability" || gameMode === "abilityUnlimited") {
        won = currentGuessedItems.some(
          (guessedItem) =>
            guessedItem === itemToGuess.value[gameMode]?.belongsTo,
        );
      }

      const isLoss = currentAttempts === 0 && !won;

      updateStatus(gameMode, won, isLoss);
    }

    const { isLegacyMode } = useGameMode();

    watchEffect(() => {
      const gameMode = mode.value;
      if (!gameMode) return;
      if (isLegacyMode(gameMode)) {
        updateGameState(
          gameMode,
          attempts.value[gameMode],
          guessedItems.value[gameMode],
        );
      } else {
        updateGridState(gameMode);
      }
    });

    const hasWon = computed(() => {
      const gameMode = mode.value;
      if (!gameMode) return;
      return (
        gameState.value[gameMode] === GameStatus.WON ||
        gameState.value[gameMode] === GameStatus.WON_PREVIOUS
      );
    });

    const isGameOver = computed(() => {
      const gameMode = mode.value;
      if (!gameMode) return;
      const currentState = gameState.value[gameMode];
      return currentState !== GameStatus.ACTIVE;
    });

    const currentGameState = computed(() => {
      const gameMode = mode.value;
      if (!gameMode) return GameStatus.ACTIVE;
      return gameState.value[gameMode];
    });

    function resetGameState(mode: MaybeRef<keyof typeof gameState.value>) {
      const gameMode = toValue(mode);
      gameState.value[gameMode] = GameStatus.ACTIVE;
    }

    return {
      gameState,
      hasWon,
      isGameOver,
      currentGameState,
      resetGameState,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["gameState"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStateStore, import.meta.hot));
}
