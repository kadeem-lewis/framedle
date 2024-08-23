<template>
  <div v-if="mode && (mode === 'ability' || mode === 'abilityUnlimited')">
    <div class="flex items-center justify-center p-4">
      <NuxtImg
        :src="`https://cdn.warframestat.us/img/${itemToGuess[mode]?.imageName}`"
        alt="Warframe to guess"
        :class="[
          'h-32',
          {
            'blur-sm': attempts[mode] === 6 && !isGameOver[mode],
            invert: attempts[mode] >= 5 && !isGameOver[mode],
            'rotate-45': attempts[mode] >= 4 && !isGameOver[mode],
          },
        ]"
      />
    </div>
    <p v-if="attempts[mode] <= 3 || isGameOver[mode]">
      {{ itemToGuess[mode]?.description.split(".")[0] }}.
    </p>
    <p v-if="attempts[mode] <= 2 || isGameOver[mode]">
      {{ itemToGuess[mode]?.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { itemToGuess, mode, attempts, isGameOver } = storeToRefs(useGameStore());
</script>
