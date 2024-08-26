<template>
  <div>
    <p>Archive</p>
    <div v-if="dailies" class="grid grid-cols-2 gap-2">
      <div v-for="daily in dailies" :key="daily.id" class="ring-1">
        <p>{{ daily.date }}</p>
        <p>#{{ daily.day }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Not sure if this would work right since it game mode would need their own archive page
const { getDailies } = useGameStore();
const { dailies } = storeToRefs(useGameStore());

// I don't need to store this in the store, I can set use fetch and have it react to different things like the filters and fetch again

// when a user clicks on a game, then it will redirect them back to the page for whatever game mode they were on and add the date to the url as a query param. The game page will watch(?) this query param and first check to see if dailies exists and read from that, otherwise it will just make a fetch request with that date
callOnce(getDailies);

//I could also just have buttons for the different game modes and just have the default be based on the from route
</script>
