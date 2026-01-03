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
  },
  {
    label: "Least Popular",
  },
]);
</script>
<template>
  <section class="flex flex-col items-center gap-4">
    <h2 class="text-xl font-semibold uppercase">Puzzle Stats</h2>
    <div class="flex flex-col gap-4">
      <UCard class="w-full">
        <div class="flex w-full items-center justify-around gap-4">
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Games</span>
            <span>{{ data?.grid.gamesPlayed }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Average Score</span>
            <span>{{ data?.grid.averageScore }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Most Unique</span>
            <span>{{ data?.grid.mostUnique }}</span>
          </div>
        </div>
      </UCard>
      <div v-if="isGameOver">
        <UTabs :items="items" :content="false" />
      </div>
      <div v-else>Complete game to see stats.</div>
    </div>
  </section>
</template>
