<template>
  <div v-if="mode && (mode === 'ability' || mode === 'abilityUnlimited')">
    <div class="flex items-center justify-center p-4">
      <div class="relative">
        <div class="absolute inset-0 z-10 grid grid-cols-3 grid-rows-2">
          <div
            v-for="(_, index) of new Array(defaultAttempts)"
            :key="index"
            class="col-span-1 flex h-full items-center justify-center border bg-red-500 dark:bg-red-600"
            :class="{
              hidden:
                index <= defaultAttempts - attempts[mode] || isGameOver[mode],
            }"
          >
            <UIcon name="i-mdi-help" class="text-4xl" />
          </div>
        </div>
        <NuxtImg
          v-if="mode === 'ability'"
          format="webp"
          :src="`https://cdn.warframestat.us/img/${itemToGuess.ability?.imageName}`"
          alt="Ability Image"
          placeholder
          preload
          height="240"
          width="240"
          class="h-60 invert dark:invert-0"
        />
        <NuxtImg
          v-if="mode === 'abilityUnlimited'"
          format="webp"
          :src="`https://cdn.warframestat.us/img/${itemToGuess.abilityUnlimited?.imageName}`"
          alt="Ability Image"
          placeholder
          preload
          height="240"
          width="240"
          class="h-60 invert dark:invert-0"
        />
      </div>
    </div>
    <p v-if="isGameOver[mode]" class="text-lg font-bold uppercase">
      {{ itemToGuess[mode]?.name }}
    </p>
    <p v-if="isGameOver[mode]">
      {{ cleanedDescription }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { itemToGuess, attempts } = storeToRefs(useGameStore());
const { defaultAttempts } = useGameStore();
const mode = useGameMode();
const { isGameOver } = useGameState();

const cleanedDescription = computed(() => {
  if (mode.value === "ability" || mode.value === "abilityUnlimited") {
    return itemToGuess.value[mode.value]?.description.replace(/<[^>]*>?/gm, "");
  }
  return "";
});
</script>
