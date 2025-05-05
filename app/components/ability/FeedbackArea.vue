<script setup lang="ts">
const { guessedItems, itemToGuess } = storeToRefs(useGameStore());
const mode = useGameMode();
</script>
<template>
  <div
    v-if="mode === 'ability' || mode === 'abilityUnlimited'"
    class="flex flex-col gap-4 capitalize"
  >
    <UiFeedbackTile
      v-for="warframe of [...guessedItems[mode]].reverse()"
      :key="warframe.name"
      :variant="checkGuess(itemToGuess[mode]!.belongsTo, warframe.name)"
      field-label="Warframe"
      :field-value="warframe.name"
      tooltip-disabled
    >
      <div class="flex w-full items-center justify-between gap-1 px-2">
        <p class="font-semibold uppercase">
          {{ warframe.name }}
        </p>
        <NuxtImg
          format="webp"
          :src="`https://cdn.warframestat.us/img/${warframe.imageName}`"
          :alt="warframe.name"
          placeholder
          height="64"
          class="h-16"
        />
      </div>
    </UiFeedbackTile>
  </div>
</template>
