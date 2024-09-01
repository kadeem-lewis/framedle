<template>
  <div class="space-y-4">
    <p class="text-xl font-bold uppercase">Archive</p>
    <div class="flex gap-2">
      <UButton
        :ui="{
          rounded: false,
        }"
        variant="outline"
        class="uppercase"
        @click="selectedMode = 'classic'"
      >
        Classic
      </UButton>
      <UButton
        :ui="{
          rounded: false,
        }"
        variant="outline"
        class="uppercase"
        @click="selectedMode = 'ability'"
      >
        Ability
      </UButton>
    </div>
    <div class="flex items-center justify-end gap-4">
      <USelect
        v-model="order"
        :options="['OLDEST', 'NEWEST']"
        :ui="{
          rounded: false,
        }"
        class="uppercase"
      >
        <template #trailing>
          <UIcon name="mdi:triangle-down" class="size-3" />
        </template>
      </USelect>
      <UInput
        v-model="searchQuery"
        icon="mdi:magnify"
        :trailing="true"
        :ui="{
          rounded: false,
        }"
        placeholder="SEARCH..."
      />
    </div>
    <div v-if="filteredDailies" class="grid grid-cols-2 gap-4">
      <p class="font-semibold">Name</p>
      <p class="font-semibold">Date</p>
      <div
        v-for="daily of filteredDailies"
        :key="daily.id"
        class="contents cursor-pointer odd:bg-gray-700"
        @click="
          navigateTo({ path: `/${selectedMode}`, query: { date: daily.date } })
        "
      >
        <p>Framedle #{{ daily.day }}</p>
        <p>{{ daily.readableDate }}</p>
        <UDivider class="col-span-2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, subDays } from "date-fns";
import Fuse from "fuse.js";

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

// In pokedexle, archive worked by getting the first date and then limiting a calendar to only dates after that date. Then whenever someone clicked on a date, it would just refetch the data with that date. Here I am fetching every date already so that approach would be very redundant.

// when a user clicks on a game, then it will redirect them back to the page for whatever game mode they were on and add the date to the url as a query param. The game page will watch(?) this query param and first check to see if dailies exists and read from that, otherwise it will just make a fetch request with that date
</script>
