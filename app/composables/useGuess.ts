export type Result = "correct" | "incorrect" | "partial" | "higher" | "lower";

export function useGuess() {
  const { attempts, guessedItems } = storeToRefs(useGameStore());
  const { currentDay, currentDailyClassicData, currentDailyAbilityData } =
    storeToRefs(useDailiesStore());
  const { gameState } = storeToRefs(useGameStateStore());
  const { isUnlimited, gameVariant } = useGameMode();

  async function makeGuess(
    selectedWarframe: MaybeRef<WarframeName>,
    mode: MaybeRef<GameMode>,
  ) {
    //!!! Extremely temporary fix
    const currentMode = toValue(mode);
    const warframe = toValue(selectedWarframe);
    if (
      currentMode === "abilityUnlimited" ||
      currentMode === "classicUnlimited"
    ) {
      attempts.value[currentMode] -= 1;
      guessedItems.value[currentMode].push(warframe);
    } else if (currentMode === "classic") {
      await db.progress
        .put({
          mode: currentMode,
          date: currentDailyClassicData.value!.date,
          day: currentDay.value || currentDailyClassicData.value?.day, //TODO: Please fix
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
    } else if (currentMode === "ability") {
      await db.progress
        .put({
          day: currentDay.value || currentDailyAbilityData.value?.day,
          date: currentDailyAbilityData.value!.date,
          mode: currentMode,
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

  const { registerGuess } = useGridGameStore();

  async function submitGridGuess(
    row: CategoryItem,
    col: CategoryItem,
    rowIndex: number,
    colIndex: number,
    guess: WarframeName,
  ) {
    try {
      const response = await $fetch("/api/grid/validate", {
        method: "POST",
        body: {
          rowCategoryId: row.id,
          columnCategoryId: col.id,
          guessedWarframe: guess,
          isUnlimited: isUnlimited.value,
        },
      });

      console.log("submitGridGuess response", response);

      if (response.correct) {
        // This is expecting the row and column ids so I will need to emit from warframe search and then pass in those values in the handler
        registerGuess(
          rowIndex,
          colIndex,
          guess,
          response.correct,
          gameVariant.value!,
        );
      }
    } catch (error) {
      console.error("Error submitting grid guess:", error);
    }
  }

  return {
    makeGuess,
    checkGuess,
    submitGridGuess,
  };
}
