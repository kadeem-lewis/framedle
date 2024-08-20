<template>
  <form class="flex gap-4" @submit="checkGuess">
    <UInputMenu
      v-model="selectedWarframe!"
      :search="search"
      :options="warframes"
      placeholder="Select a Warframe"
      by="name"
      option-attribute="name"
      :search-attributes="['name']"
      class="grow"
    />
    <UButton>Submit</UButton>
  </form>
</template>

<script setup lang="ts">
import Fuse from "fuse.js";
import type { Warframe } from "~~/types/warframe";
const { warframes, warframeToGuess, mode, isGameOver, guesses, guessedItems } =
  storeToRefs(useGameStore());

const selectedWarframe = ref<Warframe | null>(null);

const fuse = new Fuse(warframes.value, {
  keys: ["name"],
  threshold: 0.4,
});

function search(query: string) {
  if (query === "") {
    return warframes.value;
  } else {
    return fuse.search(query).map((result) => ({ ...result.item }));
  }
}

const checkGuess = () => {
  if (!selectedWarframe.value) return;
  if (!mode.value) return;

  if (selectedWarframe.value.name === warframeToGuess.value[mode.value]) {
    isGameOver.value[mode.value] = true;
    warframeToGuess.value =
      warframes.value[Math.floor(Math.random() * warframes.value.length)];
  } else {
    guesses.value[mode.value] -= 1;
    guessedItems.value[mode.value].push(selectedWarframe.value);
  }
  selectedWarframe.value = null;
};
</script>
