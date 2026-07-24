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
  <div class="flex items-center justify-center gap-1 text-toned">
    <p class="flex items-center justify-center text-sm">
      <span
        v-if="pending && !stats"
        class="h-5 w-4 animate-pulse bg-accented"
      />
      <span v-else class="text-primary">
        {{ currentData?.gamesWon }}
      </span>
      &nbsp;tenno already won
    </p>
    <span class="px-0.5 font-semibold">|</span>
    <p class="flex items-center justify-center text-sm">
      <span
        v-if="pending && !stats"
        class="h-5 w-4 animate-pulse bg-accented"
      />
      <span v-else class="text-primary">
        {{ currentData?.averageAttempts ?? "—" }}
      </span>
      &nbsp;average attempts
    </p>
  </div>
</template>
