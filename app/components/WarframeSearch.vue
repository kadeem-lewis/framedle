<script setup lang="ts">
import Fuse from "fuse.js";
import type { Warframe } from "#shared/schemas/warframe";

const props = defineProps<{
  items: Warframe[];
}>();

//TODO: I need to find out how to override the type of the items accepted by the UInputMenu

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

const fuse = computed(
  () =>
    new Fuse(items.value, {
      keys: ["name"],
      threshold: 0.4,
    }),
);

const filteredItems = computed(() => {
  if (!query.value) {
    return items.value.slice(0, 6);
  }
  return fuse.value
    .search(query.value)
    .map((result) => ({ ...result.item }))
    .slice(0, 6);
});

watch(query, (newQuery) => {
  const match = items.value.find(
    (item) => item.name.toLowerCase() === newQuery.toLowerCase(),
  );
  if (match) {
    selectedWarframe.value = match;
  }
});

const addGuess = () => {
  if (!mode.value) throw createError("Mode is not set");
  if (!selectedWarframe.value) return;

  attempts.value[mode.value] -= 1;
  guessedItems.value[mode.value].push(selectedWarframe.value);

  selectedWarframe.value = undefined;
};
</script>
<template>
  <form class="flex gap-2" @submit.prevent="addGuess">
    <!-- @vue-expect-error I'm not sure why setting a label key is restricting v-model to only a string -->
    <UInputMenu
      v-model="selectedWarframe"
      v-model:search-term="query"
      name="warframe-search"
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
          <p class="font-semibold uppercase">
            {{
              //@ts-ignore
              item.name
            }}
          </p>
          <NuxtImg
            format="webp"
            :src="//@ts-ignore
            `https://cdn.warframestat.us/img/${item.imageName}`"
            :alt="
              //@ts-ignore
              item.name
            "
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
