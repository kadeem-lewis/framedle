<template>
  <div class="flex flex-col gap-4">
    <p class="font-roboto text-xl font-bold uppercase">Archive</p>
    <div class="font-roboto flex gap-2">
      <UButton
        variant="outline"
        class="border-neutral-800 uppercase"
        :class="{
          'border-b-2 hover:border-(--ui-primary)': selectedMode === 'classic',
        }"
        @click="selectedMode = 'classic'"
      >
        Classic
      </UButton>
      <UButton
        variant="outline"
        class="border-neutral-800 uppercase"
        :class="{
          'border-b-2 hover:border-(--ui-primary)': selectedMode === 'ability',
        }"
        @click="selectedMode = 'ability'"
      >
        Ability
      </UButton>
    </div>
    <div class="flex items-center justify-end gap-4">
      <USelect
        v-model="order"
        aria-label="order-filter"
        :items="['OLDEST', 'NEWEST']"
        :ui="{
          rounded: 'rounded-none',
        }"
        class="uppercase"
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
          rounded: 'rounded-none',
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
          :key="daily.id"
          class="contents cursor-pointer odd:bg-neutral-700"
          @click="
            navigateTo({
              path: `/${selectedMode}`,
              query: { date: daily.date },
            })
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

<script setup lang="ts">
import { format, subDays } from "date-fns";
import Fuse from "fuse.js";

useSeoMeta({
  title: "Archive",
});

type UpdatedDaily = Daily & {
  readableDate: string;
};

const route = useRoute();
const router = useRouter();

const order = ref<"OLDEST" | "NEWEST">("NEWEST");
const selectedMode = ref(route.query.mode || "classic");

const { data } = await useFetch("/api/dailies", {
  key: "archive",
  query: {
    order,
    date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
  },
});

watch(
  () => selectedMode.value,
  () => {
    router.replace({
      query: {
        mode: selectedMode.value,
      },
    });
  },
  { immediate: true },
);

const filteredDailies = ref<UpdatedDaily[]>(data.value.dailies);
const searchQuery = ref("");

const fuse = new Fuse(data.value.dailies as UpdatedDaily[], {
  keys: ["readableDate", "day"],
  threshold: 0.4,
});

watch(data, (newData) => {
  filteredDailies.value = newData.dailies;
  fuse.setCollection(newData.dailies);
});

watch(searchQuery, (newQuery) => {
  if (newQuery === "") {
    filteredDailies.value = data.value.dailies;
  } else {
    filteredDailies.value = fuse
      .search(newQuery)
      .map((result) => ({ ...result.item }));
  }
});
</script>
