import type { GameMode } from "@/composables/useGameMode";

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

    const mode = useGameMode();

    const gameState = ref<Record<GameMode, GameStatusType>>({
      classic: GameStatus.ACTIVE,
      classicUnlimited: GameStatus.ACTIVE,
      ability: GameStatus.ACTIVE,
      abilityUnlimited: GameStatus.ACTIVE,
    });

    function updateGameState(
      gameMode: GameMode,
      currentAttempts: number,
      currentGuessedItems: WarframeName[],
    ) {
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

      if (won) {
        if (gameState.value[gameMode] === GameStatus.ACTIVE) {
          gameState.value[gameMode] = GameStatus.WON;
        } else if (gameState.value[gameMode] === GameStatus.WON) {
          gameState.value[gameMode] = GameStatus.WON_PREVIOUS;
        }
        return;
      }

      if (currentAttempts === 0) {
        if (gameState.value[gameMode] === GameStatus.ACTIVE) {
          gameState.value[gameMode] = GameStatus.LOST;
        } else if (gameState.value[gameMode] === GameStatus.LOST) {
          gameState.value[gameMode] = GameStatus.LOST_PREVIOUS;
        }
        return;
      }

      gameState.value[gameMode] = GameStatus.ACTIVE;
    }

    watchEffect(() => {
      const gameMode = mode.value;
      if (!gameMode) return;
      updateGameState(
        gameMode,
        attempts.value[gameMode],
        guessedItems.value[gameMode],
      );
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
