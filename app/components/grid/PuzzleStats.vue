<script setup lang="ts">
import { format } from "date-fns";
import type { TabsItem } from "@nuxt/ui";

const { isGameOver } = storeToRefs(useGameStateStore());
const { currentDailyDate } = storeToRefs(useDailiesStore());
const { mode, isDailyMode } = useGameMode();

const statsQuery = computed(() => {
  if (!mode.value || !isDailyMode(mode.value))
    throw createError("Mode is undefined");

  const date =
    currentDailyDate.value[mode.value] ?? format(new Date(), "yyyy-MM-dd");
  return {
    date,
  };
});

// This data is stale by the time it is shown, its fetched on load and then the display is conditional on game over but the data isn't refetched
const { data, execute } = useFetch("/api/stats", {
  query: statsQuery.value,
  key: `puzzle-stats-${statsQuery.value.date}`,
  lazy: true,
});

watch(isGameOver, (newIsGameOver) => {
  if (newIsGameOver) {
    execute();
  }
});

const visibility = useDocumentVisibility();

watch(visibility, (newVisibility, previousVisibility) => {
  if (newVisibility === "visible" && previousVisibility === "hidden") {
    execute();
  }
});

useIntervalFn(async () => {
  execute();
}, 1000 * 60);

const items = ref<TabsItem[]>([
  {
    label: "Most Popular",
    value: "mostPopular",
  },
  {
    label: "Least Popular",
    value: "leastPopular",
  },
]);

type GuessTab = "mostPopular" | "leastPopular";

const active = ref<GuessTab>("mostPopular");

type TabCell = {
  warframeName: WarframeName | string;
  rarity: number;
} | null;

const GRID_SIZE = 3;

const tabContent = computed<TabCell[][]>(() => {
  if (!data.value) return [];
  const content: TabCell[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null),
  );

  const stats = data.value.grid.guessStats;

  for (const [key, value] of Object.entries(stats)) {
    const [rowStr, colStr] = key.split("-");
    const row = Number(rowStr);
    const col = Number(colStr);

    if (row < 0 || col < 0 || row >= content.length || col >= GRID_SIZE)
      continue;

    const statEntry = value[active.value];

    if (!statEntry || !statEntry.name || !value.total) continue;
    content[row]![col] = {
      warframeName: statEntry.name,
      rarity: Number(formatFloat((statEntry.count / value.total) * 100)),
    };
  }
  return content;
});

const accuracyMap = computed(() => {
  if (!data.value) return [];
  const content: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill("0%"),
  );

  const map = data.value.grid.solvedHeatmap;
  const totalGames = data.value.grid.gamesPlayed;

  for (const [key, value] of Object.entries(map)) {
    const [rowStr, colStr] = key.split("-");
    const row = Number(rowStr);
    const col = Number(colStr);

    if (row < 0 || col < 0 || row >= content.length || col >= GRID_SIZE)
      continue;

    if (!value) continue;
    content[row]![col] =
      totalGames > 0 ? `${formatFloat((value / totalGames) * 100)}%` : "0%";
  }
  return content;
});
</script>
<template>
  <section class="flex flex-col items-center gap-4">
    <h2 class="text-xl font-semibold uppercase">Puzzle Stats</h2>
    <div v-if="data" class="flex flex-col gap-4">
      <UCard class="w-full">
        <div class="flex w-full items-center justify-around gap-2 text-center">
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Games</span>
            <span>{{ data?.grid.gamesPlayed }}</span>
          </div>
          <GridStatPopover
            label="Average Score"
            :value="data.grid.averageScore"
          >
            <ScoresDistributionChart :scores="data.grid.scoreDistribution" />
          </GridStatPopover>
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Most Unique</span>
            <span>{{ data?.grid.mostUnique }}</span>
          </div>
        </div>
      </UCard>
      <div v-if="isGameOver" class="flex flex-col gap-2">
        <UTabs v-model="active" :items="items" :content="false" />
        <div class="grid grid-cols-3">
          <template v-for="(row, i) in tabContent" :key="i">
            <GridCell
              v-for="(cell, j) in row"
              :key="j"
              :warframe-name="cell?.warframeName || ''"
              is-revealed
              :rarity="cell?.rarity"
              :class="{
                'border-r': j < GRID_SIZE - 1,
                'border-b': i < GRID_SIZE - 1,
              }"
            >
              {{ cell }}
            </GridCell>
          </template>
        </div>
        <div class="space-y-2">
          <h3 class="font-semibold uppercase">Accuracy</h3>
          <div class="grid grid-cols-3">
            <template v-for="(row, i) in accuracyMap" :key="i">
              <div
                v-for="(cell, j) in row"
                :key="j"
                class="bg-elevated border-accented flex min-h-28 items-center justify-center border-dashed p-1 text-center text-lg font-semibold"
                :class="{
                  'border-r': j < GRID_SIZE - 1,
                  'border-b': i < GRID_SIZE - 1,
                }"
              >
                {{ cell }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-else>Complete game to see stats.</div>
    </div>
  </section>
</template>
