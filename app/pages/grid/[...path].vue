<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const { daily } = storeToRefs(useGridGameStore());
</script>
<template>
  <UiAppSpinner v-if="!daily.config" />
  <GridGameShell v-else :game-state="daily" />
</template>
