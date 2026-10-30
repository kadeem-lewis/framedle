<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Grid Daily",
  ogTitle: "Grid Daily",
  description:
    "Fill the 3x3 grid with warframes that match the column and row clues. A new puzzle is available every day!",
  ogDescription:
    "Fill the 3x3 grid with warframes that match the column and row clues. A new puzzle is available every day!",
});

const { daily } = storeToRefs(useGridGameStore());
const {
  currentDailyGridIsLoading,
  currentDailyGridError,
  currentDailyGridUnavailable,
  isLoadingDailies,
} = storeToRefs(useDailiesStore());

const isDailyLoading = computed(
  () => currentDailyGridIsLoading.value || isLoadingDailies.value,
);

const isDailyUnavailable = computed(
  () =>
    (currentDailyGridUnavailable.value || currentDailyGridError.value) &&
    !isDailyLoading.value,
);

const { validateStreak } = useStatsStore();

onBeforeMount(() => {
  validateStreak("grid");
});
</script>
<template>
  <ModeUnavailable v-if="isDailyUnavailable" />
  <UiAppSpinner v-else-if="isDailyLoading" />
  <GridGameShell v-else :game-state="daily" :is-loading="isDailyLoading" />
</template>
