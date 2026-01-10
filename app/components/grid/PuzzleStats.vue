<script setup lang="ts">
import { format } from "date-fns";
import type { TabsItem } from "@nuxt/ui";

const { isGameOver } = storeToRefs(useGameStateStore());
const { activeDays } = storeToRefs(useDailiesStore());
const { mode, isDailyMode } = useGameMode();

const statsQuery = computed(() => {
  if (!mode.value || !isDailyMode(mode.value))
    throw createError("Mode is undefined");

  const date = activeDays.value[mode.value] ?? format(new Date(), "yyyy-MM-dd");
  return {
    date,
  };
});

const { data } = useFetch("/api/stats", {
  query: statsQuery.value,
  key: `puzzle-stats-${statsQuery.value.date}`,
  lazy: true,
});

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

const active = ref(items.value[0]?.value);

const tabContent = computed(() => {
  if (!data.value) return [];
  const content = Array.from({ length: 3 }, () => Array(3).fill(null));
  for (const [key, value] of Object.entries(data.value?.grid.guessStats)) {
    const [row, col] = key.split("-").map(Number);
    const statEntry = value[active.value];
    content[row][col] = statEntry?.name ?? null;
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
            <div
              v-for="(cell, j) in row"
              :key="j"
              class="bg-elevated border-accented min-h-28 border-dashed p-1 text-center"
            >
              {{ cell }}
            </div>
          </template>
        </div>
      </div>
      <div v-else>Complete game to see stats.</div>
    </div>
  </section>
</template>
