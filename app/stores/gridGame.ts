export type CategoryItem = {
  label: string;
  id: string;
  description: string;
};

export type GridCell = {
  rowId: string;
  colId: string;
  value: WarframeName | null;
  invalidGuesses: WarframeName[];
  status: "correct" | "incorrect" | "empty";
  rarity?: number;
  // a grid is only correct or empty, if its empty then its automatically incorrect
};

export type GridGameState = {
  grid: { [key: string]: GridCell };
  config: { rows: CategoryItem[]; cols: CategoryItem[] } | null;
  attempts: number;
};

export const useGridGameStore = defineStore(
  "grid-game",
  () => {
    const MAX_GRID_ATTEMPTS = 10;

    const unlimited = ref<GridGameState>({
      grid: {},
      attempts: MAX_GRID_ATTEMPTS,
      config: null,
    });

    const daily = shallowRef<GridGameState>({
      grid: {},
      attempts: MAX_GRID_ATTEMPTS,
      config: null,
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
          rowId: unlimited.value.config!.rows[rowIndex]!.id,
          colId: unlimited.value.config!.cols[colIndex]!.id,
          value: null,
          invalidGuesses: [],
          status: isCorrect ? "correct" : "incorrect",
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

    function syncGridData(gridData: FullGridData) {
      daily.value = {
        grid: gridData.gridState,
        attempts: gridData.attempts,
        config: gridData.puzzle,
      };
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
              cols: response.grid.columns,
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
      const BASE_RARITY_SCORE = 900;
      const usedRarityScores = Object.values(daily.value.grid)
        .filter((cell) => cell.rarity)
        .reduce((acc, cell) => acc + (100 - (cell.rarity || 0)), 0);
      return formatFloat(BASE_RARITY_SCORE - usedRarityScores);
    });

    const gameScore = computed(() => {
      return Object.values(currentGame.value.grid).filter((cell) => cell.value)
        .length;
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
      syncGridData,
      initializeUnlimitedGridGame,
      resetGridGame,
    };
  },
  {
    persist: {
      pick: ["unlimited"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGridGameStore, import.meta.hot));
}
