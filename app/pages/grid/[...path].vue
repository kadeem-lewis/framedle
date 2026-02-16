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

const { validateStreak } = useStatsStore();

onBeforeMount(() => {
  validateStreak("grid");
});
</script>
<template>
  <UiAppSpinner v-if="!daily.config" />
  <GridGameShell v-else :game-state="daily" />
</template>
