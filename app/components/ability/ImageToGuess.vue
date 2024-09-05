<template>
  <div v-if="mode && (mode === 'ability' || mode === 'abilityUnlimited')">
    <div class="flex items-center justify-center p-4">
      <NuxtImg
        v-if="mode === 'ability'"
        format="webp"
        :src="`https://cdn.warframestat.us/img/${itemToGuess.ability?.imageName}`"
        alt="Ability Image"
        placeholder
        :class="[
          'h-32',
          {
            'blur-sm': attempts[mode] === 6 && !isGameOver[mode],
            invert: attempts[mode] >= 5 && !isGameOver[mode],
            'rotate-45': attempts[mode] >= 4 && !isGameOver[mode],
          },
        ]"
      />
      <NuxtImg
        v-if="mode === 'abilityUnlimited'"
        format="webp"
        :src="`https://cdn.warframestat.us/img/${itemToGuess.abilityUnlimited?.imageName}`"
        alt="Ability Image"
        placeholder
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
      {{ maskedDescription }}.
    </p>
    <p v-if="attempts[mode] <= 2 || isGameOver[mode]">
      {{ itemToGuess[mode]?.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { itemToGuess, mode, attempts, isGameOver } = storeToRefs(useGameStore());

const maskedDescription = computed(() => {
  if (
    mode.value &&
    (mode.value === "ability" || mode.value === "abilityUnlimited")
  ) {
    if (
      itemToGuess.value[mode.value]?.description.includes(
        itemToGuess.value[mode.value]!.belongsTo,
      )
    ) {
      const regex = new RegExp(
        `\\b${itemToGuess.value[mode.value]?.belongsTo}\\b`,
        "g",
      );
      return itemToGuess.value[mode.value]?.description
        .replace(regex, "*".repeat(6))
        .split(".")[0];
    }
    return itemToGuess.value[mode.value]?.description.split(".")[0];
  }
  return "";
});
</script>
