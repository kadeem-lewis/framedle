export type Result = "correct" | "incorrect" | "partial" | "higher" | "lower";

export function useGuess() {
  const { unlimited } = storeToRefs(useGameStore());
  const {
    currentDailyClassicData,
    currentDailyAbilityData,
    currentDailyGridData,
  } = storeToRefs(useDailiesStore());
  const { isUnlimited, mode, isLegacyMode, isUnlimitedMode } = useGameMode();
  const { updateLegacyState, updateGridState } = useGameStateStore();

  async function makeGuess(
    selectedWarframe: MaybeRef<WarframeName>,
    mode: MaybeRef<GameMode>,
  ) {
    const currentMode = toValue(mode);
    const warframe = toValue(selectedWarframe);
    if (isUnlimitedMode(currentMode) && isLegacyMode(currentMode)) {
      unlimited.value[currentMode].attempts -= 1;
      unlimited.value[currentMode].guessedItems.push(warframe);
    } else if (currentMode === "classic" && currentDailyClassicData.value) {
      const nextAttempts = currentDailyClassicData.value.attempts - 1;
      const nextGuesses = [
        ...currentDailyClassicData.value.guessedItems,
        warframe,
      ]; // I feel like this isn't gonna work because Im spreading
      const nextState = updateLegacyState(
        "classic",
        nextAttempts,
        currentDailyClassicData.value.itemToGuess,
        nextGuesses,
      );

      const entry: ClassicProgressData = {
        mode: currentMode,
        date: currentDailyClassicData.value.date,
        day: currentDailyClassicData.value.day,
        guessedItems: nextGuesses,
        attempts: nextAttempts,
        state: nextState,
      };
      await db.progress.put(entry).catch((e) => {
        console.error("Failed to add new guess", e);
      });
    } else if (currentMode === "ability" && currentDailyAbilityData.value) {
      const nextAttempts = currentDailyAbilityData.value.attempts - 1;
      const nextGuesses = [
        ...currentDailyAbilityData.value.guessedItems,
        warframe,
      ];
      const nextState = updateLegacyState(
        "ability",
        nextAttempts,
        currentDailyAbilityData.value.itemToGuess,
        nextGuesses,
      );

      const entry: AbilityProgressData = {
        mode: currentMode,
        date: currentDailyAbilityData.value.date,
        day: currentDailyAbilityData.value.day,
        guessedItems: nextGuesses,
        attempts: nextAttempts,
        state: nextState,
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

      if (dailyData.isOvertime) {
        cell.isExtra = true;
      }

      nextGridState[key] = cell;

      const { puzzle, readableDate, ...rest } = toRaw(dailyData);

      const entry: GridProgressData = {
        ...rest,
        gridState: nextGridState,
        attempts: Math.max(0, dailyData.attempts - 1),
        state: updateGridState(),
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
