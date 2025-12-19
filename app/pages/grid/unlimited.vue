<script setup lang="ts">
definePageMeta({
  layout: "game",
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
