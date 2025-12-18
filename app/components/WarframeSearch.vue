<script setup lang="ts">
import Fuse from "fuse.js";

const { items: originalItems, excludedItems = [] } = defineProps<{
  items: WarframeName[];
  excludedItems?: WarframeName[];
}>();

const MAX_VISIBLE_ITEMS = 6 as const;

const { mode } = useGameMode();

const items = computed(() => {
  return originalItems.filter((item) => !excludedItems.includes(item));
});

const selectedWarframe = ref<WarframeName>();
const query = ref("");

const fuse = computed(
  () =>
    new Fuse(items.value, {
      threshold: 0.4,
    }),
);

const fullSearchResults = computed(() => {
  if (!query.value) {
    return [];
  }
  return fuse.value.search(query.value).map((result) => result.item);
});

const filteredItems = computed(() =>
  fullSearchResults.value.slice(0, MAX_VISIBLE_ITEMS),
);

const isOpen = ref(false);

watch(query, (newQuery) => {
  if (
    selectedWarframe.value &&
    selectedWarframe.value.toLowerCase() === newQuery.toLowerCase()
  ) {
    isOpen.value = false;
    return;
  }

  isOpen.value = newQuery.length > 0 && fullSearchResults.value.length > 0;

  if (isOpen.value) {
    const exactMatch = items.value.find(
      (item) => item.toLowerCase() === newQuery.toLowerCase(),
    );
    if (exactMatch) {
      selectedWarframe.value = exactMatch;
    }
  }
});

const { makeGuess } = useGuess();

const handleSubmit = async () => {
  if (!mode.value) throw createError("Mode is not set");
  if (!selectedWarframe.value) return;

  await makeGuess(selectedWarframe.value, mode.value);
  selectedWarframe.value = undefined;
};
</script>
<template>
  <form class="flex gap-2" @submit.prevent="handleSubmit">
    <UInputMenu
      v-model="selectedWarframe"
      v-model:search-term="query"
      v-model:open="isOpen"
      name="warframe-search"
      :reset-search-term-on-blur="false"
      :items="filteredItems"
      trailing-icon=""
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
      <template #content-bottom>
        <div
          v-if="query && items.length > MAX_VISIBLE_ITEMS"
          class="border-t border-gray-200 p-2 text-center text-xs"
        >
          Showing {{ filteredItems.length }} of
          {{ fullSearchResults.length }} results for "{{ query }}"
        </div>
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
