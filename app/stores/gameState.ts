import type { GameMode } from "@/composables/useGameMode";

export const GameStatus = {
  ACTIVE: "active",
  WON: "won",
  LOST: "lost",
  WON_PREVIOUS: "won:previous",
} as const;

export type GameStatusType = (typeof GameStatus)[keyof typeof GameStatus];

export const useGameStateStore = defineStore(
  "gameState",
  () => {
    const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());

    const mode = useGameMode();

    const gameState = ref<Record<GameMode, GameStatusType>>({
      classic: GameStatus.ACTIVE,
      classicUnlimited: GameStatus.ACTIVE,
      ability: GameStatus.ACTIVE,
      abilityUnlimited: GameStatus.ACTIVE,
    });

    function updateGameState() {
      const gameMode = mode.value;
      if (!gameMode) return;

      const currentGuessedItems = guessedItems.value[gameMode];
      const currentAttempts = attempts.value[gameMode];

      let won = false;

      if (gameMode === "classic" || gameMode === "classicUnlimited") {
        won = currentGuessedItems.some(
          (guessedItem) =>
            guessedItem.name === itemToGuess.value[gameMode]?.name,
        );
      }
      if (gameMode === "ability" || gameMode === "abilityUnlimited") {
        won = currentGuessedItems.some(
          (guessedItem) =>
            guessedItem.name === itemToGuess.value[gameMode]?.belongsTo,
        );
      }
      if (won) {
        if (gameState.value[gameMode] === GameStatus.ACTIVE) {
          gameState.value[gameMode] = GameStatus.WON;
        } else if (gameState.value[gameMode] === GameStatus.WON) {
          gameState.value[gameMode] = GameStatus.WON_PREVIOUS;
        }
        return;
      }

      if (currentAttempts === 0) {
        gameState.value[gameMode] = GameStatus.LOST;
        return;
      }

      gameState.value[gameMode] = GameStatus.ACTIVE;
    }

    watch(
      () => [mode, attempts, guessedItems],
      () => {
        updateGameState();
      },
      { immediate: true, deep: true },
    );

    const hasWon = computed(() => {
      const gameMode = mode.value;
      if (!gameMode) return false;
      return (
        gameState.value[gameMode] === GameStatus.WON ||
        gameState.value[gameMode] === GameStatus.WON_PREVIOUS
      );
    });

    const isGameOver = computed(() => {
      const gameMode = mode.value;
      if (!gameMode) return false;
      const currentState = gameState.value[gameMode];
      return (
        currentState === GameStatus.LOST ||
        currentState === GameStatus.WON ||
        currentState === GameStatus.WON_PREVIOUS
      );
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
