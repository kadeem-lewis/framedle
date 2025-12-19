export type CategoryItem = {
  label: string;
  id: string;
  description: string;
};

export type GridCell = {
  rowId: string;
  colId: string;
  value: string;
  status: "correct" | "incorrect" | "empty";
  //  rarity probably
};

export const useGridGameStore = defineStore(
  "grid-game",
  () => {
    const MAX_GRID_ATTEMPTS = 10;

    const unlimited = ref<{
      grid: { [key: string]: GridCell };
      config: { rows: CategoryItem[]; cols: CategoryItem[] } | null;
      attempts: number;
    }>({
      grid: {},
      attempts: MAX_GRID_ATTEMPTS,
      config: null,
    });

    const daily = ref<{
      grid: { [key: string]: GridCell };
      config: { rows: CategoryItem[]; cols: CategoryItem[] } | null;
      attempts: number;
    }>({
      grid: {},
      attempts: MAX_GRID_ATTEMPTS,
      config: null,
    });

    const { gameVariant } = useGameMode();

    const usedGuesses = computed(() => {
      const answers =
        gameVariant.value === "daily"
          ? Object.values(daily.value.grid)
          : Object.values(unlimited.value.grid);
      if (answers.length === 0) return [];
      return answers.map((cell) => cell.value) as WarframeName[];
    });

    function registerGuess(
      rowIndex: number,
      colIndex: number,
      guess: string,
      isCorrect: boolean,
      mode: "daily" | "unlimited",
    ) {
      const key = `${rowIndex}-${colIndex}`;

      const game = mode === "daily" ? daily.value : unlimited.value;

      if (!game.config) return;

      game.grid[key] = {
        rowId: game.config.rows[rowIndex]!.id || "",
        colId: game.config.cols[colIndex]!.id || "",
        value: guess,
        status: isCorrect ? "correct" : "incorrect",
      };
      game.attempts = Math.max(0, game.attempts - 1);
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
        console.log("response", response);
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

    return {
      unlimited,
      usedGuesses,
      daily,
      isLoading,
      registerGuess,
      initializeUnlimitedGridGame,
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
