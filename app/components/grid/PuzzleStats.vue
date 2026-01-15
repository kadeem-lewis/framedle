<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const { isGameOver } = storeToRefs(useGameStateStore());
const { stats } = storeToRefs(useGlobalStatsStore());

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
  if (!stats.value) return [];
  const content: TabCell[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null),
  );

  const guessStats = stats.value.grid.guessStats;

  for (const [key, value] of Object.entries(guessStats)) {
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
  if (!stats.value) return [];
  const content: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill("0%"),
  );

  const map = stats.value.grid.solvedHeatmap;
  const totalGames = stats.value.grid.gamesPlayed;

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
  <section class="mt-2 flex flex-col items-center gap-4">
    <div class="flex flex-col items-center justify-center gap-1">
      <h2 class="text-xl font-semibold uppercase">Puzzle Stats</h2>
      <p class="text-muted text-center text-sm">
        See how other Tenno have performed on this puzzle
      </p>
    </div>
    <div class="flex flex-col gap-4">
      <UCard class="w-full">
        <div
          class="flex w-full items-center justify-around gap-1.5 text-center"
        >
          <div class="flex flex-col items-center justify-center gap-y-1.5">
            <span class="font-semibold uppercase">Games</span>
            <span>{{ stats?.grid.gamesPlayed ?? 0 }}</span>
          </div>
          <GridStatPopover
            label="Average Score"
            :value="stats?.grid.averageScore"
          >
            <ScoresDistributionChart
              v-if="stats"
              :scores="stats.grid.scoreDistribution"
            />
          </GridStatPopover>
          <div class="flex flex-col items-center justify-center gap-y-1.5">
            <span class="font-semibold uppercase">Most Unique</span>
            <span>{{ stats?.grid.mostUnique ?? "—" }}</span>
          </div>
        </div>
      </UCard>
      <div v-if="isGameOver" class="flex flex-col gap-2">
        <UTabs
          v-model="active"
          :items="items"
          :content="false"
          class="rounded-none"
          :ui="{
            list: 'rounded-none',
            indicator: 'rounded-none',
          }"
        />
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
          <h3 class="text-center font-semibold uppercase">Accuracy</h3>
          <div class="grid grid-cols-3">
            <template v-for="(row, i) in accuracyMap" :key="i">
              <div
                v-for="(cell, j) in row"
                :key="j"
                class="dark:bg-elevated bg-default border-accented flex min-h-28 items-center justify-center border-dashed p-1 text-center text-lg font-semibold"
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
      <div
        v-else
        class="border-muted bg-default/70 flex h-44 flex-col items-center justify-center gap-2 border border-dashed"
      >
        <UIcon
          name="i-heroicons-lock-closed-solid"
          class="text-muted size-28"
        />
        <p class="text-lg font-semibold uppercase">
          Complete game to see global stats
        </p>
      </div>
    </div>
  </section>
</template>
