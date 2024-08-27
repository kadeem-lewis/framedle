<template>
  <div>
    <p>Archive</p>
    <div class="flex gap-2">
      <UButton @click="selectedMode = 'classic'"> Classic </UButton>
      <UButton @click="selectedMode = 'ability'"> Ability </UButton>
    </div>
    <div class="flex gap-2">
      <UButton @click="order = 'asc'"> Oldest </UButton>
      <UButton @click="order = 'desc'"> Newest </UButton>
    </div>
    <div v-if="dailies" class="grid grid-cols-2 gap-4">
      <p class="font-semibold">Name</p>
      <p class="font-semibold">Date</p>
      <div
        v-for="daily in dailies"
        :key="daily.id"
        class="contents cursor-pointer"
        @click="
          navigateTo({ path: `/${selectedMode}`, query: { date: daily.date } })
        "
      >
        <p>Framedle #{{ daily.day }}</p>
        <p>{{ daily.date }}</p>
        <UDivider class="col-span-2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, subDays } from "date-fns";

const route = useRoute();
const router = useRouter();

const order = ref<"asc" | "desc">("desc");
const selectedMode = ref(route.query.mode || "classic");

const { data } = await useFetch("/api/dailies", {
  key: "archive",
  query: {
    order,
    date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
  },
});

const dailies = ref(data.value.dailies);

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

// In pokedexle, archive worked by getting the first date and then limiting a calendar to only dates after that date. Then whenever someone clicked on a date, it would just refetch the data with that date. Here I am fetching every date already so that approach would be very redundant.

// I don't need to store this in the store, I can set use fetch and have it react to different things like the filters and fetch again

// when a user clicks on a game, then it will redirect them back to the page for whatever game mode they were on and add the date to the url as a query param. The game page will watch(?) this query param and first check to see if dailies exists and read from that, otherwise it will just make a fetch request with that date
</script>
