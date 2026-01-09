<script setup lang="ts">
import { format } from "date-fns";

const { activeDays } = storeToRefs(useDailiesStore());
const { mode, isDailyMode, isLegacyDailyMode } = useGameMode();

const statsQuery = computed(() => {
  if (!mode.value || !isDailyMode(mode.value))
    throw createError("Mode is undefined");

  const date = activeDays.value[mode.value] ?? format(new Date(), "yyyy-MM-dd");
  return {
    date,
  };
});

const { data, pending, execute } = useFetch("/api/stats", {
  query: statsQuery,
  key: `puzzle-stats-${statsQuery.value.date}`,
  lazy: true,
});

const currentData = computed(() => {
  if (!mode.value || !data.value) return;
  if (!isLegacyDailyMode(mode.value)) return;
  return data.value[mode.value];
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
</script>
<template>
  <div class="text-toned flex items-center justify-center gap-1">
    <small class="flex items-center justify-center text-sm">
      <div v-if="pending && !data" class="bg-accented h-5 w-4 animate-pulse" />
      <span v-else class="text-primary font-medium">
        {{ currentData?.gamesWon ?? 0 }}
      </span>
      &nbsp;tenno already won
    </small>
    <span class="px-0.5 font-bold">|</span>
    <small class="flex items-center justify-center text-sm">
      <span v-if="pending && !data" class="bg-accented h-5 w-4 animate-pulse" />
      <span v-else class="text-primary font-medium">
        {{ currentData?.averageAttempts ?? 0 }}
      </span>
      &nbsp;average attempts
    </small>
  </div>
</template>
