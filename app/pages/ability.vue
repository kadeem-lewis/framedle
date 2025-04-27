<script setup lang="ts">
definePageMeta({
  layout: "game",
});

useSeoMeta({
  title: "Ability",
});

defineOgImageComponent("Framedle");

const { t } = useI18n();

const { itemToGuess, vanillaWarframes } = storeToRefs(useGameStore());
const { abilityInit } = useGameStore();
const mode = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());
const { resetStreak } = useStatsStore();

await callOnce("ability-setup", abilityInit, {
  mode: "navigation",
});

// If I get the correct guess it should still be added to guessed items but then I need to update the game over condition

onBeforeMount(() => {
  resetStreak("ability");
});
</script>
<template>
  <div v-if="mode" class="flex flex-col gap-4">
    <div v-if="itemToGuess[mode]" class="space-y-4">
      <RemainingGuesses />
      <UCard class="divide-y-0">
        <template #header>
          <p
            class="text-primary-600 font-roboto text-xl font-bold uppercase dark:text-(--ui-primary)"
          >
            {{ t("ability.title") }}
          </p>
          <p class="font-semibold uppercase">Each try reveals a tile</p>
        </template>
        <AbilityImageToGuess />
        <template #footer>
          <WarframeSearch v-if="!isGameOver" :items="vanillaWarframes" />
        </template>
      </UCard>

      <AbilityFeedbackArea v-if="!isGameOver" />
      <GameOver v-if="isGameOver" />
    </div>
    <ModeUnavailable v-else />
  </div>
</template>
