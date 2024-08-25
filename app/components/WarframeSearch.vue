<template>
  <form class="flex gap-4" @submit.prevent="checkGuess">
    <UInputMenu
      v-model="selectedWarframe"
      :search="search"
      :options="props.items"
      placeholder="SEARCH..."
      by="name"
      option-attribute="name"
      :search-attributes="['name']"
      :ui="{
        rounded: false,
      }"
      class="grow"
    >
      <template #option="{ option }">
        <div class="flex w-full items-center justify-between gap-2">
          <p class="font-semibold uppercase">{{ option.name }}</p>
          <NuxtImg
            :src="`https://cdn.warframestat.us/img/${option.imageName}`"
            :alt="option.name"
            placeholder
            class="h-16"
          />
        </div>
      </template>
    </UInputMenu>
    <UButton
      type="type"
      :ui="{
        rounded: false,
      }"
      variant="outline"
      class="font-semibold uppercase"
      >Submit</UButton
    >
  </form>
  <p v-if="isError" class="text-red-500">Warframe Already guessed</p>
</template>

<script setup lang="ts">
import Fuse from "fuse.js";
import type { Warframe } from "~~/schemas/warframe";

const props = defineProps<{
  items: Warframe[];
}>();

const { itemToGuess, mode, isGameOver, attempts, guessedItems } =
  storeToRefs(useGameStore());

const selectedWarframe = ref<Warframe>();
const isError = ref(false);

const fuse = new Fuse(props.items, {
  keys: ["name"],
  threshold: 0.4,
});

function search(query: string) {
  if (query === "") {
    return props.items.slice(0, 6);
  } else {
    return fuse
      .search(query)
      .map((result) => ({ ...result.item }))
      .slice(0, 6);
  }
}

const checkGuess = () => {
  if (!selectedWarframe.value) return;
  if (!mode.value) return;

  if (mode.value === "abilityUnlimited" || mode.value === "ability") {
    if (
      selectedWarframe.value.name === itemToGuess.value[mode.value]?.belongsTo
    ) {
      guessedItems.value[mode.value].push(selectedWarframe.value);
      isGameOver.value[mode.value] = true;
    } else {
      attempts.value[mode.value] -= 1;
      guessedItems.value[mode.value].push(selectedWarframe.value);
    }
  }

  if (mode.value === "classicUnlimited" || mode.value === "classic") {
    if (selectedWarframe.value.name === itemToGuess.value[mode.value]?.name) {
      guessedItems.value[mode.value].push(selectedWarframe.value);
      isGameOver.value[mode.value] = true;
    } else {
      attempts.value[mode.value] -= 1;
      guessedItems.value[mode.value].push(selectedWarframe.value);
    }
  }

  selectedWarframe.value = undefined;
};
</script>
