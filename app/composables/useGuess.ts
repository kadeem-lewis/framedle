export type Result = "correct" | "incorrect" | "partial" | "higher" | "lower";

export function useGuess() {
  const { attempts, guessedItems } = storeToRefs(useGameStore());
  const { currentDay, currentDailyClassicData } =
    storeToRefs(useDailiesStore());
  const { gameState } = storeToRefs(useGameStateStore());

  async function makeGuess(
    selectedWarframe: MaybeRef<WarframeName>,
    mode: MaybeRef<GameMode>,
  ) {
    const currentMode = toValue(mode);
    const warframe = toValue(selectedWarframe);
    if (
      currentMode === "classicUnlimited" ||
      currentMode === "abilityUnlimited"
    ) {
      attempts.value[currentMode] -= 1;
      guessedItems.value[currentMode].push(warframe);
    } else if (currentMode === "classic" || currentMode === "ability") {
      await db.dailies
        .where({
          mode: currentMode,
          day: currentDay.value || currentDailyClassicData.value?.day, //TODO: Please fix
        })
        .modify({
          guessedItems: [...guessedItems.value[currentMode], warframe],
          attempts: attempts.value[currentMode] - 1,
          state: gameState.value[currentMode],
        })
        .catch((e) => {
          console.log({
            mode: currentMode,
            day: currentDay.value,
            guessedItems: [...guessedItems.value[currentMode], warframe],
            attempts: attempts.value[currentMode] - 1,
            state: gameState.value[currentMode],
          });

          console.error("Failed to add new guess", e);
        });
    }
  }

  function checkGuess(
    correctValue: string | number | string[],
    guessedValue: string | number | string[],
  ): Result {
    if (Array.isArray(correctValue) && Array.isArray(guessedValue)) {
      if (
        correctValue.every((val) => guessedValue.includes(val)) &&
        correctValue.length === guessedValue.length
      ) {
        return "correct";
      }
      if (correctValue.some((val) => guessedValue.includes(val))) {
        return "partial";
      }
      return "incorrect";
    }

    if (typeof correctValue === "string" || typeof guessedValue === "string") {
      return correctValue === guessedValue ? "correct" : "incorrect";
    }

    if (correctValue > guessedValue) {
      return "higher";
    }
    if (correctValue < guessedValue) {
      return "lower";
    }
    return "correct";
  }

  return {
    makeGuess,
    checkGuess,
  };
}
