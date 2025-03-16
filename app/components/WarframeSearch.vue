<template>
  <form class="flex gap-2" @submit.prevent="addGuess">
    <!-- @vue-expect-error I'm not sure why setting a label key is restricting v-model to only a string -->
    <UInputMenu
      v-model="selectedWarframe"
      v-model:search-term="query"
      :reset-search-term-on-blur="false"
      :items="filteredItems"
      label-key="name"
      placeholder="SEARCH..."
      size="lg"
      required
      ignore-filter
      :ui="{
        base: 'rounded-none',
        content:
          'rounded-none bg-white/75 dark:bg-neutral-800/75 backdrop-blur',
      }"
      class="grow rounded-none"
    >
      <template #trailing>
        <span class="sr-only">options dropdown</span>
        <UIcon name="i-mdi-triangle-down" class="size-3" />
      </template>
      <template #item="{ item }">
        <div class="flex w-full items-center justify-between gap-2">
          <p class="font-semibold uppercase">{{ item.name }}</p>
          <NuxtImg
            format="webp"
            :src="`https://cdn.warframestat.us/img/${item.imageName}`"
            :alt="item.name"
            placeholder
            height="64"
            class="h-16"
          />
        </div>
      </template>
      <template #empty>
        <p class="font-semibold uppercase">No Warframes Found</p>
      </template>
    </UInputMenu>
    <UButton
      aria-label="submit-answer"
      type="submit"
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

const items = computed(() => {
  return props.items.filter(
    (item) =>
      !guessedItems.value[mode.value!].some(
        (guessedItem) => guessedItem.name === item.name,
      ),
  );
});

const selectedWarframe = ref<Warframe>();
const query = ref("");

watchEffect(() => {
  console.log("Selected Warframe", selectedWarframe.value);
});

const fuse = new Fuse(items.value, {
  keys: ["name"],
  threshold: 0.4,
});

const filteredItems = computed(() => {
  if (!query.value) {
    return items.value.slice(0, 6);
  }
  return fuse
    .search(query.value)
    .map((result) => ({ ...result.item }))
    .slice(0, 6);
});

watch(items, (newItems) => {
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
