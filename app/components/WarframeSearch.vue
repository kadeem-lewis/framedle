<script setup lang="ts">
import Fuse from "fuse.js";

const props = defineProps<{
  items: WarframeName[];
}>();

const { attempts, guessedItems, selectedDaily } = storeToRefs(useGameStore());

const mode = useGameMode();

const items = computed(() => {
  return props.items.filter(
    (item) =>
      !guessedItems.value[mode.value!].some(
        (guessedItem) => guessedItem === item,
      ),
  );
});

const selectedWarframe = ref<WarframeName>();
const query = ref("");

const fuse = computed(
  () =>
    new Fuse(items.value, {
      threshold: 0.4,
    }),
);

const filteredItems = computed(() => {
  if (!query.value) {
    return items.value.slice(0, 6);
  }
  return fuse.value
    .search(query.value)
    .map((result) => result.item)
    .slice(0, 6);
});

watch(query, (newQuery) => {
  const match = items.value.find(
    (item) => item.toLowerCase() === newQuery.toLowerCase(),
  );
  if (match) {
    selectedWarframe.value = match;
  }
});

const { gameState } = storeToRefs(useGameStateStore());

const addGuess = async () => {
  if (!mode.value) throw createError("Mode is not set");
  if (!selectedWarframe.value) return;
  if (!selectedDaily.value) return;

  attempts.value[mode.value] -= 1;
  guessedItems.value[mode.value].push(selectedWarframe.value);

  if (mode.value === "classic" || mode.value === "ability") {
    await db.dailies
      .where({
        mode: mode.value,
        day: selectedDaily.value.day,
      })
      .modify({
        guessedItems: [...guessedItems.value[mode.value]],
        attempts: attempts.value[mode.value],
        state: gameState.value[mode.value],
      });
  }
  selectedWarframe.value = undefined;
};
</script>
<template>
  <form class="flex gap-2" @submit.prevent="addGuess">
    <UInputMenu
      v-model="selectedWarframe"
      v-model:search-term="query"
      name="warframe-search"
      :reset-search-term-on-blur="false"
      :items="filteredItems"
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
            {{ getWarframe(item as WarframeName).name }}
          </p>
          <NuxtImg
            format="webp"
            :src="`https://cdn.warframestat.us/img/${getWarframe(item as WarframeName).imageName}`"
            :alt="getWarframe(item as WarframeName).name"
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
