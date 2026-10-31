<script setup lang="ts">
useSeoMeta({
  title: "Framedle - Daily Warframe Puzzles",
  ogTitle: "Framedle - Daily Warframe Puzzles",
  description:
    "Use your Warframe knowledge to figure out the mystery Warframe in as few guesses as possible! A new puzzle is available each day.",
  ogDescription:
    "Use your Warframe knowledge to figure out the mystery Warframe in as few guesses as possible! A new puzzle is available each day.",
  titleTemplate: null,
});

defineOgImage("Framedle");

const { cards } = useModeCards();
</script>
<template>
  <div class="flex flex-col gap-4">
    <h1
      class="p-1 text-center font-roboto text-lg font-semibold uppercase md:text-xl"
    >
      Test your Warframe Knowledge
    </h1>
    <ul class="flex flex-col gap-4">
      <li v-for="card of cards" :key="card.label">
        <NuxtLink :to="card.route">
          <UiAppModeCard :card="card" :show-stats="true" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
