<script setup lang="ts">
const mode = useGameMode();
// Maybe I get a set of all the unique days from indexeddb and then use the selectedDay from pinia to see if next or previous exists

// What if this is the user's first game? Their browser wouldn't have loaded any days into indexeddb yet

const nextDay = computed(() => {
  // I need to find to tell if the next day exists and if it does return the day
  return true;
});

const previousDay = computed(() => {
  // I need to find to tell if the previous day exists and if it does return the day
  return true;
});
</script>
<template>
  <div class="flex items-center justify-center gap-2">
    <UButton v-if="previousDay" variant="outline" icon="i-heroicons-arrow-left"
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
      v-if="nextDay"
      variant="outline"
      trailing
      icon="i-heroicons-arrow-right"
      >Next Day</UButton
    >
  </div>
</template>
