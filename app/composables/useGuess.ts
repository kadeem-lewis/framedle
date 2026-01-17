export type Result = "correct" | "incorrect" | "partial" | "higher" | "lower";

export function useGuess() {
  const { attempts, guessedItems } = storeToRefs(useGameStore());
  const {
    currentDailyClassicData,
    currentDailyAbilityData,
    currentDailyGridData,
  } = storeToRefs(useDailiesStore());
  const { gameState } = storeToRefs(useGameStateStore());
  const { isUnlimited, mode } = useGameMode();

  async function makeGuess(
    selectedWarframe: MaybeRef<WarframeName>,
    mode: MaybeRef<GameMode>,
  ) {
    const currentMode = toValue(mode);
    const warframe = toValue(selectedWarframe);
    if (
      currentMode === "abilityUnlimited" ||
      currentMode === "classicUnlimited"
    ) {
      attempts.value[currentMode] -= 1;
      guessedItems.value[currentMode].push(warframe);
    } else if (currentMode === "classic" && currentDailyClassicData.value) {
      const entry: ClassicProgressData = {
        mode: currentMode,
        date: currentDailyClassicData.value.date,
        day: currentDailyClassicData.value.day,
        guessedItems: [...guessedItems.value[currentMode], warframe],
        attempts: attempts.value[currentMode] - 1,
        state: gameState.value[currentMode],
      };
      await db.progress.put(entry).catch((e) => {
        console.error("Failed to add new guess", e);
      });
    } else if (currentMode === "ability" && currentDailyAbilityData.value) {
      const entry: AbilityProgressData = {
        mode: currentMode,
        date: currentDailyAbilityData.value.date,
        day: currentDailyAbilityData.value.day,
        guessedItems: [...guessedItems.value[currentMode], warframe],
        attempts: attempts.value[currentMode] - 1,
        state: gameState.value[currentMode],
        selectedMinigameAbility:
          currentDailyAbilityData.value.selectedMinigameAbility,
      };
      await db.progress.put(entry).catch((e) => {
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
    row: MaybeRef<string>,
    column: MaybeRef<string>,
    rowIndex: MaybeRef<number>,
    colIndex: MaybeRef<number>,
    guess: WarframeName,
  ) {
    const response = await $fetch("/api/grid/validate", {
      method: "POST",
      body: {
        rowIndex: toValue(rowIndex),
        colIndex: toValue(colIndex),
        rowCategoryId: toValue(row),
        columnCategoryId: toValue(column),
        guessedWarframe: guess,
        isUnlimited: isUnlimited.value,
        puzzleDate: currentDailyGridData.value?.date,
      },
    });

    if (mode.value === "grid" && currentDailyGridData.value) {
      const dailyData = currentDailyGridData.value;

      const nextGridState = structuredClone(toRaw(dailyData.gridState));
      const key = `${toValue(rowIndex)}-${toValue(colIndex)}`;

      let cell = nextGridState[key] ? { ...nextGridState[key] } : undefined;

      if (!cell) {
        cell = {
          rowId: toValue(row),
          colId: toValue(column),
          value: null,
          invalidGuesses: [],
        };
      }

      if (response.correct) {
        cell.value = guess;
        cell.rarity = response.rarity;
      } else {
        cell.invalidGuesses.push(guess);
      }

      nextGridState[key] = cell;

      const entry: GridProgressData = {
        mode: "grid",
        date: dailyData.date,
        day: dailyData.day,
        gridState: nextGridState,
        attempts: Math.max(0, dailyData.attempts - 1),
        state: gameState.value["grid"],
      };

      await db.progress.put(entry).catch((e) => {
        console.error("Failed to update grid guess", e);
      });
    } else {
      //! Register guess should ideally be handling both unlimited and daily states but I can't call grid data in the grid store because of circular dependencies
      registerGuess(
        toValue(rowIndex),
        toValue(colIndex),
        guess,
        response.correct,
      );
    }
    if (response.correct) {
      return true;
    }
    return false;
  }

  return {
    makeGuess,
    checkGuess,
    submitGridGuess,
  };
}
