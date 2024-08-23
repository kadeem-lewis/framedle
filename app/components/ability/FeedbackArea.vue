<template>
  <div
    v-if="mode && (mode === 'ability' || mode === 'abilityUnlimited')"
    class="flex flex-col gap-2 capitalize"
  >
    <UiTile
      v-for="warframe of guessedItems[mode]"
      :key="warframe.name"
      :is-correct="warframe.name === itemToGuess[mode]?.belongsTo"
    >
      <div class="flex w-full items-center justify-between gap-1 px-2">
        <p class="font-semibold uppercase">
          {{ warframe.name }}
        </p>
        <NuxtImg
          :src="`https://cdn.warframestat.us/img/${warframe.imageName}`"
          :alt="warframe.name"
          class="h-16"
        />
      </div>
    </UiTile>
  </div>
</template>

<script setup lang="ts">
const { guessedItems, itemToGuess, mode } = storeToRefs(useGameStore());
</script>
