<template>
  <form class="flex gap-4" @submit.prevent="addGuess">
    <UInputMenu
      v-model="selectedWarframe"
      :search="search"
      :options="filteredItems"
      placeholder="SEARCH..."
      by="name"
      required
      option-attribute="name"
      :search-attributes="['name']"
      :ui="{
        rounded: 'rounded-none',
      }"
      :ui-menu="{
        rounded: 'rounded-none',
        background: 'bg-white/75 dark:bg-neutral-800/75 backdrop-blur',
        option: {
          rounded: 'rounded-none',
          active: 'bg-neutral-100/75 dark:bg-neutral-900/75',
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
</template>

<script setup lang="ts">
import Fuse from "fuse.js";
import type { Warframe } from "#shared/schemas/warframe";

const props = defineProps<{
  items: Warframe[];
}>();

const { attempts, guessedItems } = storeToRefs(useGameStore());

const mode = useGameMode();

const filteredItems = computed(() => {
  return props.items.filter(
    (item) =>
      !guessedItems.value[mode.value!].some(
        (guessedItem) => guessedItem.name === item.name,
      ),
  );
});

const selectedWarframe = ref<Warframe>();

const fuse = new Fuse(filteredItems.value, {
  keys: ["name"],
  threshold: 0.4,
});

function search(query: string) {
  if (query === "") {
    return filteredItems.value.slice(0, 6);
  } else {
    return fuse
      .search(query)
      .map((result) => ({ ...result.item }))
      .slice(0, 6);
  }
}

watch(filteredItems, (newItems) => {
  fuse.setCollection(newItems);
});

const addGuess = () => {
  if (!selectedWarframe.value) throw createError("No warframe selected");
  if (!mode.value) throw createError("Mode is not set");

  attempts.value[mode.value] -= 1;
  guessedItems.value[mode.value].push(selectedWarframe.value);

  selectedWarframe.value = undefined;
};
</script>
