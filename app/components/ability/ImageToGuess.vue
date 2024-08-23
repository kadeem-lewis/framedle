<template>
  <div v-if="mode" class="flex items-center justify-center p-4">
    <NuxtImg
      :src="`https://cdn.warframestat.us/img/${itemToGuess[mode]?.imageName}`"
      alt="Warframe to guess"
      :class="[
        'h-32',
        {
          'blur-sm': attempts[mode] === 6,
          invert: attempts[mode] >= 5,
          'rotate-45': attempts[mode] >= 4,
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
const { itemToGuess, mode, attempts } = storeToRefs(useGameStore());
</script>
