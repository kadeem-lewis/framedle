<template>
  <form class="flex gap-4" @submit.prevent="checkGuess">
    <UInputMenu
      v-model="selectedWarframe!"
      :search="search"
      :options="warframes"
      placeholder="Select a Warframe"
      by="name"
      option-attribute="name"
      :search-attributes="['name']"
      class="grow"
    >
      <template #option="{ option }">
        <div class="flex w-full items-center justify-between gap-2">
          <p class="font-semibold uppercase">{{ option.name }}</p>
          <NuxtImg
            :src="`https://cdn.warframestat.us/img/${option.imageName}`"
            :alt="option.name"
            class="h-16"
          />
        </div>
      </template>
    </UInputMenu>
    <UButton type="type">Submit</UButton>
  </form>
</template>

<script setup lang="ts">
import Fuse from "fuse.js";
import type { Warframe } from "~~/schemas/warframe";
const { warframes, warframeToGuess, mode, isGameOver, attempts, guessedItems } =
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

  if (selectedWarframe.value.name === warframeToGuess.value[mode.value].name) {
    guessedItems.value[mode.value].push(selectedWarframe.value);
    isGameOver.value[mode.value] = true;
  } else {
    attempts.value[mode.value] -= 1;
    if (!guessedItems.value[mode.value].includes(selectedWarframe.value))
      guessedItems.value[mode.value].push(selectedWarframe.value);
  }
  selectedWarframe.value = null;
};
</script>
