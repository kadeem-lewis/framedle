<script setup lang="ts">
const { guessedItems, itemToGuess } = storeToRefs(useGameStore());
const { mode } = useGameMode();
const { checkGuess } = useGuess();
</script>
<template>
  <div
    v-if="mode === 'ability' || mode === 'abilityUnlimited'"
    class="flex flex-col gap-4 capitalize"
  >
    <UiFeedbackTile
      v-for="warframe of [...guessedItems[mode]].reverse()"
      :key="warframe"
      :variant="checkGuess(getAbility(itemToGuess[mode]!).belongsTo, warframe)"
      field-label="Warframe"
      :field-value="warframe"
      tooltip-disabled
    >
      <div class="flex w-full items-center justify-between gap-1 px-2">
        <p class="font-semibold uppercase">
          {{ warframe }}
        </p>
        <NuxtImg
          provider="imagekit"
          :src="getWarframe(warframe).image"
          :alt="warframe"
          placeholder
          height="76"
          width="76"
        />
      </div>
    </UiFeedbackTile>
  </div>
</template>
