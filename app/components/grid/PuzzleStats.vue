<script setup lang="ts">
const { isGameOver } = storeToRefs(useGameStateStore());
</script>
<template>
  <section class="flex flex-col items-center gap-4">
    <h2 class="text-xl font-semibold uppercase">Puzzle Stats</h2>
    <div v-if="isGameOver">
      <UCard class="w-full">
        <div class="flex justify-around">
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Games</span>
            <span>{{ 0 }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="font-semibold uppercase">Average Guesses</span>
            <span>{{ 0.0 }}</span>
          </div>
        </div>
      </UCard>
    </div>
    <div v-else>Complete game to see stats.</div>
  </section>
</template>
