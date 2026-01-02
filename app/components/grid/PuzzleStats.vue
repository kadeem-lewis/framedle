<script setup lang="ts">
import { format } from "date-fns";

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
</script>
<template>
  <section class="flex flex-col items-center gap-4">
    <h2 class="text-xl font-semibold uppercase">Puzzle Stats</h2>
    <div v-if="isGameOver">
      <UCard class="w-full">
        <div class="flex justify-around">
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Games</span>
            <span>{{ data?.grid.gamesPlayed }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Average Score</span>
            <span>{{ data?.grid.averageScore }}</span>
          </div>
        </div>
      </UCard>
    </div>
    <div v-else>Complete game to see stats.</div>
  </section>
</template>
