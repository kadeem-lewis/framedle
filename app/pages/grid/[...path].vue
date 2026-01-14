<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Grid Daily",
  description:
    "Play the daily grid mode of Framedle, where you can guess warframes on a grid with limited attempts.",
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
