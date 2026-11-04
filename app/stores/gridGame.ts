export type GridCell = {
  rowId: string;
  colId: string;
  value: WarframeName | null;
  invalidGuesses: WarframeName[];
  rarity?: number;
  isExtra?: boolean;
  // a grid is only correct or empty, if its empty then its automatically incorrect
};

export type GridGameState = {
  grid: { [key: string]: GridCell };
  config: {
    rows: [string, string, string];
    columns: [string, string, string];
  } | null;
  attempts: number;
  isOvertime?: boolean;
};

export const useGridGameStore = defineStore(
  "grid-game",
  () => {
    const unlimited = ref<GridGameState>({
      grid: {},
      attempts: MAX_GRID_ATTEMPTS,
      config: null,
    });

    function createPlaceholderGrid() {
      return {
        grid: {} as Record<string, GridCell>,
        attempts: MAX_GRID_ATTEMPTS,
        config: null,
        isOvertime: false,
      };
    }

    const { currentDailyGridData } = storeToRefs(useDailiesStore());

    const daily = computed(() => {
      const data = currentDailyGridData.value;

      if (!data) return createPlaceholderGrid();

      return {
        grid: data?.gridState,
        attempts: data?.attempts,
        config: data?.puzzle,
        isOvertime: data?.isOvertime,
      };
    });

    const { gameVariant } = useGameMode();

    const currentGame = computed(() => {
      return gameVariant.value === "daily" ? daily.value : unlimited.value;
    });

    const usedGuesses = computed(() => {
      const answers = Object.values(currentGame.value.grid);
      if (answers.length === 0) return [];
      return answers.map((cell) => cell.value) as WarframeName[];
    });

    function registerGuess(
      rowIndex: number,
      colIndex: number,
      guess: WarframeName,
      isCorrect: boolean,
    ) {
      const key = `${rowIndex}-${colIndex}`;

      if (!unlimited.value.grid[key]) {
        unlimited.value.grid[key] = {
          rowId: unlimited.value.config!.rows[rowIndex]!,
          colId: unlimited.value.config!.columns[colIndex]!,
          value: null,
          invalidGuesses: [],
        };
      }

      const cell = unlimited.value.grid[key];

      if (isCorrect) {
        cell.value = guess;
      } else {
        cell.invalidGuesses.push(guess);
      }
      unlimited.value.attempts = Math.max(0, unlimited.value.attempts - 1);
    }

    const isLoading = ref(false);

    type UnlimitedGridGameOptions = {
      forceReset?: boolean;
    };

    async function initializeUnlimitedGridGame(
      options: UnlimitedGridGameOptions = {},
    ) {
      const { forceReset = false } = options;
      if (!forceReset && unlimited.value.config) return;

      isLoading.value = true;
      try {
        const response = await $fetch("/api/grid/generate");
        if (response.status === 200) {
          unlimited.value = {
            grid: {},
            config: {
              rows: response.grid.rows,
              columns: response.grid.columns,
            },
            attempts: MAX_GRID_ATTEMPTS,
          };
        }
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    }

    function resetGridGame() {
      initializeUnlimitedGridGame({ forceReset: true });
    }

    const rarityScore = computed(() => {
      return calculateGridRarity(currentGame.value.grid);
    });

    const gameScore = computed(() => {
      return calculateGridScore(currentGame.value.grid);
    });

    return {
      unlimited,
      usedGuesses,
      daily,
      isLoading,
      currentGame,
      rarityScore,
      gameScore,
      MAX_GRID_ATTEMPTS,
      registerGuess,
      initializeUnlimitedGridGame,
      resetGridGame,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["unlimited"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGridGameStore, import.meta.hot));
}
