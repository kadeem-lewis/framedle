<script setup lang="ts">
const { mode } = useGameMode();

const { getAdjacentArchiveDays } = useArchiveStore();
const { currentDailyClassicData } = storeToRefs(useDailiesStore());

const adjacentDays = computedAsync(async () => {
  if (!currentDailyClassicData.value) {
    return { previous: null, next: null };
  }
  return await getAdjacentArchiveDays(currentDailyClassicData.value.day);
});

const { proxy } = useScriptUmamiAnalytics();
</script>
<template>
  <div class="flex items-center justify-center gap-2">
    <UButton
      v-if="adjacentDays?.previous"
      :to="`/${mode}/${adjacentDays?.previous}`"
      variant="outline"
      icon="i-heroicons-arrow-left"
      @click="proxy.track('Visited Previous Day', { mode })"
      >Previous Day</UButton
    >
    <UButton
      icon="i-heroicons-calendar-solid"
      variant="outline"
      :to="{
        name: 'archive',
        query: { mode },
      }"
      >Past Days</UButton
    >
    <UButton
      v-if="adjacentDays?.next"
      :to="`/${mode}/${adjacentDays?.next}`"
      variant="outline"
      trailing
      icon="i-heroicons-arrow-right"
      @click="proxy.track('Visited Next Day', { mode })"
      >Next Day</UButton
    >
  </div>
</template>
