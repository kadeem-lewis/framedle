<script setup lang="ts">
const mode = useGameMode();

const { getAdjacentArchiveDays } = useArchiveStore();
const { currentDailyClassicData } = storeToRefs(useDailiesStore());

const adjacentDays = computedAsync(async () => {
  if (!currentDailyClassicData.value) {
    return { previous: null, next: null };
  }
  return await getAdjacentArchiveDays(currentDailyClassicData.value.day);
});
</script>
<template>
  <div class="flex items-center justify-center gap-2">
    <UButton
      v-if="adjacentDays?.previous"
      :to="`${adjacentDays?.previous}`"
      variant="outline"
      icon="i-heroicons-arrow-left"
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
      :to="`${adjacentDays?.next}`"
      variant="outline"
      trailing
      icon="i-heroicons-arrow-right"
      >Next Day</UButton
    >
  </div>
</template>
