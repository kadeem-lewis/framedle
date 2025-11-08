<script setup lang="ts">
import Fuse from "fuse.js";

useSeoMeta({
  title: "Archive",
});

const { proxy } = useScriptUmamiAnalytics();

const router = useRouter();
const route = useRoute("archive");

const { pastDays, selectedArchiveMode, order } = storeToRefs(useArchiveStore());
const { getRandomPastDay } = useArchiveStore();
selectedArchiveMode.value =
  (route.query.mode as "classic" | "ability") || "classic";

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

const randomPastDay = computed(() => getRandomPastDay());
</script>
<template>
  <div class="flex flex-col gap-4">
    <p class="font-roboto text-xl font-bold uppercase">Archive</p>
    <div class="font-roboto flex gap-2">
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
    <ArchiveGameStats />
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
      <div v-if="filteredDailies" class="grid grid-cols-12 gap-2">
        <p class="col-span-5 col-start-3 font-semibold">Name</p>
        <p class="col-span-5 font-semibold">Date</p>
      </div>
      <div
        class="grid h-full max-h-96 grid-cols-12 items-center gap-2 overflow-y-auto"
      >
        <div
          v-for="daily of filteredDailies"
          :key="daily.day"
          class="contents cursor-pointer odd:bg-neutral-700"
          @click="
            proxy.track('started archive game', { date: daily.date });
            navigateTo(`/${selectedArchiveMode}/${daily.day}`);
          "
        >
          <UIcon
            v-if="daily.state === GameStatus.ACTIVE"
            name="i-mdi-play-circle"
            class="text-partial col-span-2 size-6"
          />
          <UIcon
            v-else
            name="i-mdi-check-circle"
            class="col-span-2 size-6"
            :class="{
              'text-success': daily.state,
            }"
          />
          <p class="col-span-5">Framedle #{{ daily.day }}</p>
          <p class="col-span-5">{{ daily.readableDate }}</p>
          <USeparator class="col-span-12" />
        </div>
      </div>
    </div>
    <UBadge
      v-if="!randomPastDay"
      variant="outline"
      size="lg"
      class="flex w-full items-center justify-center rounded-none text-base uppercase"
    >
      All days completed!
    </UBadge>
    <UButton
      v-else
      :to="`/${selectedArchiveMode}/${randomPastDay}`"
      variant="outline"
      icon="i-mdi-dice"
      class="flex items-center justify-center uppercase"
      >Random</UButton
    >
  </div>
</template>
