import { useStorage } from "@vueuse/core";
import type { GameMode } from "@/composables/useGameMode";

export const GameStatus = {
  ACTIVE: "active",
  WON: "won",
  LOST: "lost",
  WON_PREVIOUS: "won:previous",
} as const;

export type GameStatusType = (typeof GameStatus)[keyof typeof GameStatus];

export default function useGameState() {
  const { itemToGuess, guessedItems, attempts } = storeToRefs(useGameStore());

  const mode = useGameMode();

  const gameState = useStorage<Record<GameMode, GameStatusType>>("gameState", {
    classic: GameStatus.ACTIVE,
    classicUnlimited: GameStatus.ACTIVE,
    ability: GameStatus.ACTIVE,
    abilityUnlimited: GameStatus.ACTIVE,
  });

  let won = false;
  function updateGameState() {
    // This logic is all types of wrong but it's a start.
    const gameMode = mode.value;
    if (!gameMode) throw createError("Mode is not set");

    const currentGuessedItems = guessedItems.value[gameMode];
    const currentAttempts = attempts.value[gameMode];

    if (gameMode === "classic" || gameMode === "classicUnlimited") {
      won = currentGuessedItems.some(
        (guessedItem) => guessedItem.name === itemToGuess.value[gameMode]?.name,
      );
    }
    if (gameMode === "ability" || gameMode === "abilityUnlimited") {
      won = currentGuessedItems.some(
        (guessedItem) =>
          guessedItem.name === itemToGuess.value[gameMode]?.belongsTo,
      );
    }
    if (won) {
      //! When navigating between modes, it is constantly resetting games between won and won:previous.
      if (
        gameState.value[gameMode] !== GameStatus.WON &&
        gameState.value[gameMode] !== GameStatus.WON_PREVIOUS
      ) {
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
    () => [mode.value, attempts.value],
    () => {
      updateGameState();
      console.log(gameState.value);
    },
    { immediate: true, deep: true },
  );

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

  function resetGameState(mode: MaybeRef<keyof typeof gameState.value>) {
    const gameMode = toValue(mode);
    gameState.value[gameMode] = GameStatus.ACTIVE;
  }

  return { hasWon, isGameOver, resetGameState };
}
