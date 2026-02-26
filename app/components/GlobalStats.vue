<script setup lang="ts">
const { mode, isLegacyDailyMode } = useGameMode();
const { stats, pending } = storeToRefs(useGlobalStatsStore());

const currentData = computed(() => {
  if (!mode.value || !stats.value) return;
  if (!isLegacyDailyMode(mode.value)) return;
  return stats.value[mode.value];
});
</script>
<template>
  <div class="text-toned flex items-center justify-center gap-1">
    <p class="flex items-center justify-center text-sm">
      <span
        v-if="pending && !stats"
        class="bg-accented h-5 w-4 animate-pulse"
      />
      <span v-else class="text-primary font-medium">
        {{ currentData?.gamesWon }}
      </span>
      &nbsp;tenno already won
    </p>
    <span class="px-0.5 font-bold">|</span>
    <p class="flex items-center justify-center text-sm">
      <span
        v-if="pending && !stats"
        class="bg-accented h-5 w-4 animate-pulse"
      />
      <span v-else class="text-primary font-medium">
        {{ currentData?.averageAttempts ?? "—" }}
      </span>
      &nbsp;average attempts
    </p>
  </div>
</template>
