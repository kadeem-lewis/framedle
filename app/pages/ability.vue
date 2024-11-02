<template>
  <div v-if="mode" class="flex flex-col gap-4">
    <ModeSwitch />
    <ModeUnavailable v-if="!itemToGuess[mode]" />
    <div v-else class="space-y-4">
      <RemainingGuesses />

      <UCard
        :ui="{
          divide: 'divide-y-0',
        }"
      >
        <template #header>
          <p
            class="text-primary-600 dark:text-primary text-xl font-bold uppercase"
          >
            {{ t("ability.title") }}
          </p>
        </template>
        <AbilityImageToGuess />
        <template #footer>
          <WarframeSearch v-if="!isGameOver[mode]" :items="vanillaWarframes" />
        </template>
      </UCard>

      <AbilityFeedbackArea v-if="!isGameOver[mode]" />
      <GameOver v-if="isGameOver[mode]" />
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { isYesterday, isToday } from "date-fns";

definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Ability",
});

defineOgImageComponent("Framedle");

const { t } = useI18n();

const { itemToGuess, vanillaWarframes, stats } = storeToRefs(useGameStore());
const { abilityInit } = useGameStore();
const mode = useGameMode();
const { isGameOver } = useGameState();

await callOnce("ability-setup", abilityInit);

// If I get the correct guess it should still be added to guessed items but then I need to update the game over condition

onBeforeMount(() => {
  const lastPlayedDate = stats.value.ability.lastPlayedDate;
  if (
    lastPlayedDate &&
    !isToday(lastPlayedDate) &&
    !isYesterday(lastPlayedDate)
  ) {
    stats.value.ability.streak = 0;
  }
});
</script>
