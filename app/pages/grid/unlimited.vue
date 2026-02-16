<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Grid Unlimited",
  ogTitle: "Grid Unlimited",
  description:
    "Fill the 3x3 grid with warframes that match the column and row clues. Play as many times as you like!",
  ogDescription:
    "Fill the 3x3 grid with warframes that match the column and row clues. Play as many times as you like!",
});

const { initializeUnlimitedGridGame } = useGridGameStore();
const { unlimited, isLoading } = storeToRefs(useGridGameStore());

await callOnce("grid-setup", async () => {
  await initializeUnlimitedGridGame();
});
</script>
<template>
  <UiAppSpinner v-if="isLoading || !unlimited.config" />
  <GridGameShell v-else :game-state="unlimited" />
</template>
