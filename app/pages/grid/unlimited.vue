<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Grid Unlimited",
  description:
    "Play the unlimited grid mode of Framedle, where you can guess warframes on a grid with no restrictions.",
});

const { initializeUnlimitedGridGame } = useGridGameStore();
const { unlimited, isLoading } = storeToRefs(useGridGameStore());

await callOnce("grid-setup", async () => {
  await initializeUnlimitedGridGame();
});
</script>
<template>
  <UiAppSpinner v-if="isLoading || !unlimited.config" />
  <GridGameShell
    v-else
    :rows="unlimited.config.rows"
    :columns="unlimited.config.cols"
    :attempts="unlimited.attempts"
    :user-grid-guesses="unlimited.grid"
  />
</template>
