<script setup lang="ts">
const { mode, isLegacyDailyMode } = useGameMode();

const { getAdjacentArchiveDays } = useArchiveStore();
const {
  currentDailyClassicData,
  currentDailyAbilityData,
  classicActiveDay,
  abilityActiveDay,
} = storeToRefs(useDailiesStore());

const currentDayNumber = computed(() => {
  if (!mode.value) return null;

  if (mode.value === "classic") {
    return classicActiveDay.value ?? currentDailyClassicData.value?.day;
  }
  if (mode.value === "ability") {
    return abilityActiveDay.value ?? currentDailyAbilityData.value?.day;
  }

  return null;
});

const adjacentDays = computedAsync(
  async () => {
    if (
      !mode.value ||
      !currentDayNumber.value ||
      !isLegacyDailyMode(mode.value)
    ) {
      return { previous: null, next: null };
    }

    return await getAdjacentArchiveDays(currentDayNumber.value, mode.value);
  },
  { previous: null, next: null },
);

const { proxy } = useScriptUmamiAnalytics();
</script>
<template>
  <div class="flex items-center justify-center gap-2">
    <UButton
      :to="`/${mode}/${adjacentDays?.previous}`"
      :disabled="!adjacentDays.previous"
      variant="outline"
      color="neutral"
      icon="i-heroicons-arrow-left"
      @click="proxy.track('Visited Previous Day', { mode })"
      >Previous Day</UButton
    >
    <UButton
      icon="i-heroicons-calendar-solid"
      variant="outline"
      color="neutral"
      :to="{
        name: 'archive',
        query: { mode },
      }"
      >Past Days</UButton
    >
    <UButton
      :to="`/${mode}/${adjacentDays?.next}`"
      :disabled="!adjacentDays.next"
      variant="outline"
      color="neutral"
      trailing
      icon="i-heroicons-arrow-right"
      @click="proxy.track('Visited Next Day', { mode })"
      >Next Day</UButton
    >
  </div>
</template>
