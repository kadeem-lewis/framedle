<template>
  <div v-if="mode && (mode === 'ability' || mode === 'abilityUnlimited')">
    <div class="flex items-center justify-center p-4">
      <div class="relative">
        <div class="absolute inset-0 grid grid-cols-2 grid-rows-3">
          <div
            v-for="(_, index) of new Array(defaultAttempts)"
            :key="index"
            class="col-span-1 h-full border bg-red-500"
            :class="{
              hidden:
                index <= defaultAttempts - attempts[mode] || isGameOver[mode],
            }"
          />
        </div>
        <NuxtImg
          v-if="mode === 'ability'"
          format="webp"
          :src="`https://cdn.warframestat.us/img/${itemToGuess.ability?.imageName}`"
          alt="Ability Image"
          placeholder
          class="h-60"
        />
        <NuxtImg
          v-if="mode === 'abilityUnlimited'"
          format="webp"
          :src="`https://cdn.warframestat.us/img/${itemToGuess.abilityUnlimited?.imageName}`"
          alt="Ability Image"
          placeholder
          class="h-60"
        />
      </div>
    </div>
    <p v-if="isGameOver[mode]">
      {{ itemToGuess[mode]?.name }}
    </p>
    <p v-if="isGameOver[mode]">
      {{ itemToGuess[mode]?.description.split(".")[0] }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { itemToGuess, mode, attempts, isGameOver } = storeToRefs(useGameStore());
const { defaultAttempts } = useGameStore();
</script>
