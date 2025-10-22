<script setup lang="ts">
import Fuse from "fuse.js";

useSeoMeta({
  title: "Archive",
});

const { proxy } = useScriptUmamiAnalytics();

const router = useRouter();

const { pastDays, selectedArchiveMode } = storeToRefs(useDailiesStore());

const order = ref<"OLDEST" | "NEWEST">("NEWEST");

watch(
  () => selectedArchiveMode.value,
  () => {
    router.replace({
      query: {
        mode: selectedArchiveMode.value,
      },
    });
  },
  { immediate: true },
);

const searchQuery = ref("");

const fuse = computed(
  () =>
    new Fuse(pastDays.value ?? [], {
      keys: ["readableDate", "day"],
      threshold: 0.4,
    }),
);

const filteredDailies = computed(() => {
  const days = pastDays.value;

  if (!days || days.length === 0) {
    return [];
  }

  if (searchQuery.value === "") {
    return days;
  }

  return fuse.value.search(searchQuery.value).map((result) => result.item);
});
</script>
<template>
  <div class="flex flex-col gap-4">
    <p class="font-roboto text-xl font-bold uppercase">Archive</p>
    <ArchiveGameStats />
    <div class="font-roboto flex gap-2">
      <!-- These aren't styled when highlighted -->
      <UButton
        variant="outline"
        class="hover:border-primary uppercase ring-neutral-800"
        :class="{
          'dark:border-primary border-b-2 border-neutral-800':
            selectedArchiveMode === 'classic',
        }"
        @click="selectedArchiveMode = 'classic'"
      >
        Classic
      </UButton>
      <UButton
        variant="outline"
        class="hover:border-primary uppercase ring-neutral-800"
        :class="{
          'dark:border-primary border-b-2 border-neutral-800':
            selectedArchiveMode === 'ability',
        }"
        @click="selectedArchiveMode = 'ability'"
      >
        Ability
      </UButton>
    </div>
    <div class="flex items-center justify-end gap-4">
      <USelect
        v-model="order"
        aria-label="order-filter"
        :items="['OLDEST', 'NEWEST']"
        class="rounded-none uppercase"
      >
        <template #trailing>
          <UIcon name="i-mdi-triangle-down" class="size-3" />
        </template>
      </USelect>
      <UInput
        v-model="searchQuery"
        icon="i-mdi-magnify"
        :trailing="true"
        :ui="{
          base: 'rounded-none',
        }"
        placeholder="SEARCH..."
      />
    </div>
    <div
      class="flex flex-col gap-4 border border-neutral-200 bg-white/75 p-2 dark:border-neutral-800 dark:bg-neutral-900/75"
    >
      <div v-if="filteredDailies" class="grid grid-cols-2 gap-4">
        <p class="font-semibold">Name</p>
        <p class="font-semibold">Date</p>
      </div>
      <div class="grid h-full max-h-96 grid-cols-2 gap-4 overflow-y-auto">
        <div
          v-for="daily of filteredDailies"
          :key="daily.day"
          class="contents cursor-pointer odd:bg-neutral-700"
          @click="
            proxy.track('started archive game', { date: daily.date });
            navigateTo(`/${selectedArchiveMode}/${daily.day}`);
          "
        >
          <p>Framedle #{{ daily.day }}</p>
          <p>{{ daily.readableDate }}</p>
          <USeparator class="col-span-2" />
        </div>
      </div>
    </div>
  </div>
</template>
