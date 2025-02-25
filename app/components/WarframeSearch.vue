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
        rounded: 'rounded-none',
      }"
      :ui-menu="{
        rounded: 'rounded-none',
        background: 'bg-white/75 dark:bg-gray-800/75 backdrop-blur',
        option: {
          rounded: 'rounded-none',
          active: 'bg-gray-100/75 dark:bg-gray-900/75',
        },
      }"
      class="grow"
    >
      <template #trailing>
        <span class="sr-only">options dropdown</span>
        <UIcon name="i-mdi-triangle-down" class="size-3" />
      </template>
      <template #option="{ option }">
        <div class="flex w-full items-center justify-between gap-2">
          <NuxtImg
            format="webp"
            :src="`https://cdn.warframestat.us/img/${option.imageName}`"
            :alt="option.name"
            placeholder
            height="64"
            class="h-16"
          />
          <p class="font-semibold uppercase">{{ option.name }}</p>
        </div>
      </template>
    </UInputMenu>
    <UButton
      aria-label="submit-answer"
      type="type"
      variant="outline"
      class="font-semibold uppercase"
      >Submit</UButton
    >
  </form>
  <p v-if="isError" class="text-red-500">Warframe Already guessed</p>
</template>

<script setup lang="ts">
import Fuse from "fuse.js";
import type { Warframe } from "#shared/schemas/warframe";

const props = defineProps<{
  items: Warframe[];
}>();

const { itemToGuess, attempts, guessedItems } = storeToRefs(useGameStore());

const mode = useGameMode();

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

//TODO: This function also has a lot of repitition and can be refactored
const checkGuess = () => {
  if (!selectedWarframe.value) throw createError("No warframe selected");
  if (!mode.value) throw createError("Mode is not set");

  isError.value = false;

  if (mode.value === "abilityUnlimited" || mode.value === "ability") {
    if (
      guessedItems.value[mode.value].some(
        (guessedItem) => guessedItem.name === selectedWarframe.value?.name,
      )
    ) {
      isError.value = true;
      return;
    }
    if (
      selectedWarframe.value.name === itemToGuess.value[mode.value]?.belongsTo
    ) {
      attempts.value[mode.value] -= 1;
      guessedItems.value[mode.value].push(selectedWarframe.value);
    } else {
      attempts.value[mode.value] -= 1;
      guessedItems.value[mode.value].push(selectedWarframe.value);
    }
  }

  if (mode.value === "classicUnlimited" || mode.value === "classic") {
    if (
      guessedItems.value[mode.value].some(
        (guessedItem) => guessedItem.name === selectedWarframe.value?.name,
      )
    ) {
      isError.value = true;
      return;
    }
    if (selectedWarframe.value.name === itemToGuess.value[mode.value]?.name) {
      attempts.value[mode.value] -= 1;

      guessedItems.value[mode.value].push(selectedWarframe.value);
    } else {
      attempts.value[mode.value] -= 1;
      guessedItems.value[mode.value].push(selectedWarframe.value);
    }
  }

  selectedWarframe.value = undefined;
};
</script>
